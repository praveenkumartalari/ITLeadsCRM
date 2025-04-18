async function addTaskComment(comment) {
    const result = await query(`
        INSERT INTO task_comments (
            task_id,
            user_id,
            comment,
            created_at
        ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        RETURNING *,
        (SELECT username FROM users WHERE id = user_id) as username
    `, [comment.taskId, comment.userId, comment.comment]);
    
    return result.rows[0];
}

async function getTaskComments(taskId) {
    const result = await query(`
        SELECT 
            tc.*,
            u.username,
            u.avatar_url
        FROM task_comments tc
        JOIN users u ON u.id = tc.user_id
        WHERE tc.task_id = $1
        ORDER BY tc.created_at DESC
    `, [taskId]);
    
    return result.rows;
}

async function getTaskHistory(taskId) {
    const result = await query(`
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