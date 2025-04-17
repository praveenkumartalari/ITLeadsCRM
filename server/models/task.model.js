const { query } = require('../config/db');

async function createTask(task) {
    const result = await query(`
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
    const result = await query(`
        SELECT 
            t.id,
            t.title,
            t.description,
            t.due_date,
            t.priority,
            t.status,
            t.type,
            t.lead_id,
            t.assigned_to_id,
            t.created_by_id,
            u1.username as assigned_to_name,
            u2.username as created_by_name,
            COALESCE(i.title, '') as interaction_title,
            COALESCE(i.type, '') as interaction_type
        FROM tasks t
        LEFT JOIN users u1 ON u1.id = t.assigned_to_id
        LEFT JOIN users u2 ON u2.id = t.created_by_id
        LEFT JOIN lead_interactions i ON i.id = t.source_interaction_id
        ORDER BY t.due_date ASC
    `);
    return result.rows;
}

async function getTasksByLead(leadId) {
    const result = await query(`
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

module.exports = { createTask, getAllTasks, getTasksByLead };