async function createTaskFromTemplate(templateId, leadId, assignedToId) {
    const template = await query(
        'SELECT * FROM task_templates WHERE id = $1',
        [templateId]
    );

    if (!template.rows[0]) {
        throw new Error('Template not found');
    }

    const taskData = {
        ...template.rows[0],
        leadId,
        assignedToId,
        status: 'PENDING',
        created_at: new Date()
    };

    return await createTask(taskData);
}