const { getAllTasks, getTasksByLead, createTask: createTaskModel, updateTask: updateTaskModel, deleteTask: deleteTaskModel } = require('../models/task.model');

async function listAllTasks(req, res) {
    try {
        const tasks = await getAllTasks();
        res.status(200).json({
            status: 200,
            success: true,
            message: 'Tasks retrieved successfully',
            data: tasks
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal Server Error',
            error: { code: 'SERVER_ERROR', details: 'Error fetching tasks' }
        });
    }
}

async function listLeadTasks(req, res) {
    try {
        const tasks = await getTasksByLead(req.params.leadId);
        res.status(200).json({
            status: 200,
            success: true,
            message: 'Lead tasks retrieved successfully',
            data: tasks
        });
    } catch (error) {
        console.error('Error fetching lead tasks:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal Server Error',
            error: { code: 'SERVER_ERROR', details: 'Error fetching lead tasks' }
        });
    }
}

async function createTask(req, res) {
    try {
        const taskData = {
            ...req.body,
            createdById: req.user.id,
            status: 'PENDING'
        };

        const task = await createTaskModel(taskData);
        
        res.status(201).json({
            status: 201,
            success: true,
            message: 'Task created successfully',
            data: task
        });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal Server Error',
            error: { code: 'SERVER_ERROR', details: 'Error creating task' }
        });
    }
}

async function updateTask(req, res) {
    try {
        const taskId = req.params.taskId;
        const taskData = {
            ...req.body,
            updatedById: req.user.id,
            updatedAt: new Date()
        };

        const task = await updateTaskModel(taskId, taskData);
        
        if (!task) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'Task not found'
            });
        }

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Task updated successfully',
            data: task
        });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal Server Error',
            error: { code: 'SERVER_ERROR', details: 'Error updating task' }
        });
    }
}

async function deleteTask(req, res) {
    try {
        const taskId = req.params.taskId;
        await deleteTaskModel(taskId);
        
        res.status(200).json({
            status: 200,
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal Server Error',
            error: { code: 'SERVER_ERROR', details: 'Error deleting task' }
        });
    }
}

module.exports = {
    listAllTasks,
    listLeadTasks,
    createTask,
    updateTask,
    deleteTask
};