const db = require('../config/db');

async function createTask(task) {
    const result = await db.query(`
        INSERT INTO tasks (
            title,
            description,
            due_date,
            priority,
            status,
            type,
            lead_id,
            assigned_to_id,
            created_by_id,
            created_at,
            source_interaction_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, $10)
        RETURNING *
    `, [
        task.title,
        task.description,
        task.dueDate,
        task.priority,
        task.status || 'PENDING',
        task.type,
        task.leadId,
        task.assignedToId,
        task.createdById,
        task.sourceInteractionId
    ]);
    return result.rows[0];
}

async function getAllTasks() {
    const result = await db.query(`
        SELECT 
            t.*,
            u1.username as assigned_to_name,
            u2.username as created_by_name
        FROM tasks t
        LEFT JOIN users u1 ON u1.id = t.assigned_to_id
        LEFT JOIN users u2 ON u2.id = t.created_by_id
        ORDER BY t.due_date ASC
    `);
    return result.rows;
}

async function getTasksByLead(leadId) {
    const result = await db.query(`
        SELECT 
            t.*,
            u1.username as assigned_to_name,
            u2.username as created_by_name,
            i.title as interaction_title,
            i.type as interaction_type
        FROM tasks t
        LEFT JOIN users u1 ON u1.id = t.assigned_to_id
        LEFT JOIN users u2 ON u2.id = t.created_by_id
        LEFT JOIN lead_interactions i ON i.id = t.source_interaction_id
        WHERE t.lead_id = $1
        ORDER BY t.due_date ASC
    `, [leadId]);
    return result.rows;
}

// Add updateTask function
async function updateTask(taskId, taskData) {
    // Get current task to check if status is changing
    const currentTask = await getTaskById(taskId);
    
    // Convert camelCase to snake_case for database columns
    const mappedData = {
        title: taskData.title,
        description: taskData.description,
        due_date: taskData.dueDate,
        priority: taskData.priority,
        status: taskData.status,
        assigned_to_id: taskData.assignedToId,
        updated_by_id: taskData.updatedById,
        updated_at: new Date()
    };

    // If status is changing, add status change tracking
    if (taskData.status && currentTask.status !== taskData.status) {
        mappedData.status_changed_at = new Date();
        mappedData.status_changed_by_id = taskData.updatedById;

        // Handle specific status timestamps
        if (taskData.status === 'COMPLETED') {
            mappedData.completed_at = new Date();
            mappedData.cancelled_at = null;
            mappedData.reopened_at = null;
        } else if (taskData.status === 'CANCELLED') {
            mappedData.cancelled_at = new Date();
            mappedData.completed_at = null;
            mappedData.reopened_at = null;
        } else if (taskData.status === 'REOPENED') {
            mappedData.reopened_at = new Date();
            mappedData.completed_at = null;
            mappedData.cancelled_at = null;
        }
    }

    // Remove undefined values
    Object.keys(mappedData).forEach(key => 
        mappedData[key] === undefined && delete mappedData[key]
    );

    const fields = Object.keys(mappedData).map((key, i) => `${key} = $${i + 2}`).join(', ');
    const values = Object.values(mappedData);

    const result = await db.query(
        `UPDATE tasks 
         SET ${fields}
         WHERE id = $1 
         RETURNING *`,
        [taskId, ...values]
    );
    
    return result.rows[0];
}

async function getTaskById(taskId) {
    const result = await db.query(
        `SELECT t.*,
            u1.username as assigned_to_name,
            u2.username as created_by_name
         FROM tasks t
         LEFT JOIN users u1 ON u1.id = t.assigned_to_id
         LEFT JOIN users u2 ON u2.id = t.created_by_id
         WHERE t.id = $1`,
        [taskId]
    );
    return result.rows[0];
}

async function getTaskAnalytics() {
    const result = await db.query(`
        SELECT 
            COUNT(*) as total_tasks,
            COUNT(CASE WHEN t.status = 'COMPLETED' THEN 1 END) as completed_tasks,
            COUNT(CASE WHEN t.status = 'IN_PROGRESS' THEN 1 END) as in_progress_tasks,
            COUNT(CASE WHEN t.status = 'PENDING' THEN 1 END) as pending_tasks,
            COUNT(CASE 
                WHEN t.due_date < CURRENT_DATE AND t.status NOT IN ('COMPLETED', 'CANCELLED') 
                THEN 1 
            END) as overdue_tasks,
            AVG(CASE 
                WHEN t.status = 'COMPLETED' AND t.completed_at IS NOT NULL 
                THEN EXTRACT(EPOCH FROM (t.completed_at - t.created_at))/3600 
            END) as avg_completion_time_hours,
            u.username as assigned_to,
            COUNT(*) as task_count,
            ROUND(AVG(CASE WHEN t.status = 'COMPLETED' THEN 1 ELSE 0 END) * 100, 2) as completion_rate
        FROM tasks t
        LEFT JOIN users u ON u.id = t.assigned_to_id
        GROUP BY u.username;
    `);
    return result.rows;
}

async function searchTasks({
    status,
    priority,
    type,
    assignedToId,
    dateFrom,
    dateTo,
    searchQuery,
    leadId,
    sortBy = 'due_date',
    sortOrder = 'ASC',
    page = 1,
    limit = 10
}) {
    const conditions = [];
    const values = [];
    let valueIndex = 1;

    if (status) {
        conditions.push(`t.status = $${valueIndex}`);
        values.push(status);
        valueIndex++;
    }

    if (priority) {
        conditions.push(`t.priority = $${valueIndex}`);
        values.push(priority);
        valueIndex++;
    }

    if (type) {
        conditions.push(`t.type = $${valueIndex}`);
        values.push(type);
        valueIndex++;
    }

    if (assignedToId) {
        conditions.push(`t.assigned_to_id = $${valueIndex}`);
        values.push(assignedToId);
        valueIndex++;
    }

    if (dateFrom) {
        conditions.push(`t.due_date >= $${valueIndex}`);
        values.push(dateFrom);
        valueIndex++;
    }

    if (dateTo) {
        conditions.push(`t.due_date <= $${valueIndex}`);
        values.push(dateTo);
        valueIndex++;
    }

    if (searchQuery) {
        conditions.push(`(
            t.title ILIKE $${valueIndex} OR 
            t.description ILIKE $${valueIndex} OR
            u1.username ILIKE $${valueIndex} OR
            l.name ILIKE $${valueIndex}
        )`);
        values.push(`%${searchQuery}%`);
        valueIndex++;
    }

    if (leadId) {
        conditions.push(`t.lead_id = $${valueIndex}`);
        values.push(leadId);
        valueIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (page - 1) * limit;

    const queryText = `
        SELECT 
            t.*,
            u1.username as assigned_to_name,
            u2.username as created_by_name,
            l.name as lead_name,
            l.company as lead_company,
            COUNT(*) OVER() as total_count
        FROM tasks t
        LEFT JOIN users u1 ON u1.id = t.assigned_to_id
        LEFT JOIN users u2 ON u2.id = t.created_by_id
        LEFT JOIN leads l ON l.id = t.lead_id
        ${whereClause}
        ORDER BY t.${sortBy} ${sortOrder}
        LIMIT $${valueIndex} OFFSET $${valueIndex + 1}
    `;

    values.push(limit, offset);

    const result = await db.query(queryText, values);
    
    return {
        tasks: result.rows,
        pagination: {
            total: parseInt(result.rows[0]?.total_count || 0),
            page,
            limit,
            totalPages: Math.ceil((result.rows[0]?.total_count || 0) / limit)
        }
    };
}

async function addTaskDependency(taskId, dependsOnTaskId) {
    await db.query(
        'INSERT INTO task_dependencies (task_id, depends_on_task_id) VALUES ($1, $2)',
        [taskId, dependsOnTaskId]
    );
}

async function addSubtask(parentTaskId, subtaskData) {
    const result = await db.query(`
        INSERT INTO tasks (
            title,
            description,
            due_date,
            priority,
            status,
            type,
            lead_id,
            assigned_to_id,
            created_by_id,
            parent_task_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
    `, [
        subtaskData.title,
        subtaskData.description,
        subtaskData.dueDate,
        subtaskData.priority,
        'PENDING',
        subtaskData.type,
        subtaskData.leadId,
        subtaskData.assignedToId,
        subtaskData.createdById,
        parentTaskId
    ]);
    
    return result.rows[0];
}

async function getTaskHistoryModel(taskId) {
    const result = await db.query(`
        SELECT 
            th.*,
            u.username as changed_by_name
        FROM task_history th
        JOIN users u ON u.id = th.changed_by_id
        WHERE th.task_id = $1
        ORDER BY th.changed_at DESC
    `, [taskId]);
    
    return result.rows;
}

module.exports = {
    createTask,
    getAllTasks,
    getTasksByLead,
    updateTask,
    getTaskById,
    getTaskAnalytics,
    searchTasks,
    addTaskDependency,
    addSubtask,
    getTaskHistoryModel
};