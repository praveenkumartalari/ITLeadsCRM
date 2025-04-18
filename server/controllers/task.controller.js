const { 
    getAllTasks, 
    getTasksByLead, 
    createTask: createTaskModel, 
    updateTask: updateTaskModel, 
    deleteTask: deleteTaskModel, 
    getTaskById, 
    getTaskAnalytics: getTaskAnalyticsModel,
    searchTasks: searchTasksModel,
    getTaskHistoryModel  // Add this import
} = require('../models/task.model');
const { createActivity } = require('../models/activity.model');
const { taskSchema, updateTaskSchema } = require('../schema/schema');

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
            updatedById: req.user.id
        };

        // Get current task first
        const currentTask = await getTaskById(taskId);
        
        if (!currentTask) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'Task not found'
            });
        }

        // Validate status transition if status is being updated
        if (taskData.status && !isValidStatusTransition(currentTask.status, taskData.status)) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Invalid status transition',
                error: { 
                    code: 'INVALID_STATUS_TRANSITION', 
                    details: `Cannot transition from ${currentTask.status} to ${taskData.status}` 
                }
            });
        }

        const updatedTask = await updateTaskModel(taskId, taskData);

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Task updated successfully',
            data: updatedTask
        });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal Server Error',
            error: { code: 'SERVER_ERROR', details: error.message }
        });
    }
}

// Helper function to validate status transitions
function isValidStatusTransition(currentStatus, newStatus) {
    // If the status isn't changing, allow it
    if (currentStatus === newStatus) {
        return true;
    }

    const validTransitions = {
        'PENDING': ['IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
        'IN_PROGRESS': ['COMPLETED', 'CANCELLED'],
        'COMPLETED': ['REOPENED'],
        'CANCELLED': ['REOPENED'],
        'REOPENED': ['IN_PROGRESS', 'COMPLETED', 'CANCELLED']
    };

    return validTransitions[currentStatus]?.includes(newStatus);
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

async function getTaskAnalytics(req, res) {
    try {
        const analytics = await getTaskAnalyticsModel();
        
        // Calculate additional metrics
        const totalTasks = analytics.reduce((sum, user) => sum + parseInt(user.task_count), 0);
        const overallCompletionRate = analytics.reduce((sum, user) => 
            sum + (parseInt(user.completed_tasks || 0) * 100) / totalTasks, 0).toFixed(2);

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Task analytics retrieved successfully',
            data: {
                userAnalytics: analytics,
                summary: {
                    totalTasks,
                    overallCompletionRate,
                    totalOverdue: analytics.reduce((sum, user) => sum + parseInt(user.overdue_tasks || 0), 0),
                    avgCompletionTimeHours: (analytics.reduce((sum, user) => 
                        sum + parseFloat(user.avg_completion_time_hours || 0), 0) / analytics.length).toFixed(2)
                }
            }
        });
    } catch (error) {
        console.error('Error fetching task analytics:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal Server Error',
            error: { code: 'SERVER_ERROR', details: 'Error fetching task analytics' }
        });
    }
}

// Rename the controller function to avoid conflict
async function searchTasksHandler(req, res) {
    try {
        const filters = {
            status: req.query.status,
            priority: req.query.priority,
            type: req.query.type,
            assignedToId: req.query.assignedToId,
            dateFrom: req.query.dateFrom,
            dateTo: req.query.dateTo,
            searchQuery: req.query.search,
            leadId: req.query.leadId,
            sortBy: req.query.sortBy || 'due_date',
            sortOrder: req.query.sortOrder?.toUpperCase() || 'ASC',
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10
        };

        const result = await searchTasksModel(filters); // Use renamed import

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Tasks retrieved successfully',
            data: result.tasks,
            pagination: result.pagination
        });
    } catch (error) {
        console.error('Error searching tasks:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal Server Error',
            error: { code: 'SERVER_ERROR', details: 'Error searching tasks' }
        });
    }
}

// Add these new functions to task.controller.js

async function getTaskDashboard(req, res) {
    try {
        const analytics = await getTaskAnalyticsModel();
        
        const dashboard = {
            summary: {
                total: analytics.reduce((sum, user) => sum + parseInt(user.task_count), 0),
                completed: analytics.reduce((sum, user) => sum + parseInt(user.completed_tasks || 0), 0),
                inProgress: analytics.reduce((sum, user) => sum + parseInt(user.in_progress_tasks || 0), 0),
                pending: analytics.reduce((sum, user) => sum + parseInt(user.pending_tasks || 0), 0),
                overdue: analytics.reduce((sum, user) => sum + parseInt(user.overdue_tasks || 0), 0)
            },
            byUser: analytics.map(user => ({
                username: user.assigned_to,
                taskCount: parseInt(user.task_count),
                completionRate: parseFloat(user.completion_rate),
                avgCompletionTime: parseFloat(user.avg_completion_time_hours || 0)
            }))
        };

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Dashboard data retrieved successfully',
            data: dashboard
        });
    } catch (error) {
        console.error('Error fetching dashboard:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal Server Error',
            error: { code: 'SERVER_ERROR', details: 'Error fetching dashboard data' }
        });
    }
}

async function getTaskHistory(req, res) {
    try {
        const taskId = req.params.taskId;
        const history = await getTaskHistoryModel(taskId);

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Task history retrieved successfully',
            data: history
        });
    } catch (error) {
        console.error('Error fetching task history:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal Server Error',
            error: { code: 'SERVER_ERROR', details: 'Error fetching task history' }
        });
    }
}

// Update module.exports to include new functions
module.exports = {
    listAllTasks,
    listLeadTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskAnalytics,
    searchTasks: searchTasksHandler,
    getTaskById,
    getTaskDashboard,  // Add this
    getTaskHistory     // Add this
};

// Remove these from exports as they haven't been implemented yet:
// addTaskComment,
// getTaskComments,
// getTaskHistory,
// addTaskDependency,
// addSubtask,
// createTaskFromTemplate