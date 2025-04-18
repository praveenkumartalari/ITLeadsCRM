const express = require('express');
const { authenticate } = require('../controllers/auth.controller');
const { 
    listAllTasks, 
    listLeadTasks, 
    createTask, 
    updateTask, 
    deleteTask, 
    searchTasks, 
    getTaskAnalytics,
    getTaskDashboard,    // Make sure these are imported
    getTaskHistory      // Make sure these are imported
} = require('../controllers/task.controller');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer }
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data: 
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 */
router.get('/', authenticate, listAllTasks);

/**
 * @swagger
 * /api/tasks/dashboard:
 *   get:
 *     summary: Get task dashboard statistics
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     summary:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         completed:
 *                           type: integer
 *                         inProgress:
 *                           type: integer
 *                         pending:
 *                           type: integer
 *                         overdue:
 *                           type: integer
 *                     byUser:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                           taskCount:
 *                             type: integer
 *                           completionRate:
 *                             type: number
 *                           avgCompletionTime:
 *                             type: number
 */
router.get('/dashboard', authenticate, getTaskDashboard);





/**
 * @swagger
 * /api/tasks/search:
 *   get:
 *     summary: Search tasks with filters
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED, REOPENED]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, URGENT]
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [CALL, MEETING, EMAIL, FOLLOW_UP, OTHER]
 *       - in: query
 *         name: assignedToId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: List of filtered tasks
 */
router.get('/search', authenticate, searchTasks);

/**
 * @swagger
 * /api/tasks/{leadId}:
 *   get:
 *     summary: Get all tasks for a specific lead
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of lead tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer }
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data: 
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 */
router.get('/:leadId', authenticate, listLeadTasks);

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - dueDate
 *         - type
 *         - leadId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *           minLength: 3
 *         description:
 *           type: string
 *         dueDate:
 *           type: string
 *           format: date-time
 *         priority:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, URGENT]
 *         type:
 *           type: string
 *           enum: [CALL, MEETING, EMAIL, FOLLOW_UP, OTHER]
 *         status:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED]
 *         leadId:
 *           type: string
 *           format: uuid
 *         assignedToId:
 *           type: string
 *           format: uuid
 *         createdById:
 *           type: string
 *           format: uuid
 *         sourceInteractionId:
 *           type: string
 *           format: uuid
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 201 }
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 */
router.post('/', authenticate, createTask);

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED]
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, URGENT]
 *     responses:
 *       200:
 *         description: Task updated successfully
 */
router.put('/:taskId', authenticate, updateTask);

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Task deleted successfully
 */
router.delete('/:taskId', authenticate, deleteTask);


/**
 * @swagger
 * /api/tasks/{taskId}/analytics:
 *   get:
 *     summary: Get analytics for a specific task
 *     tags: [Tasks]
 */
router.get('/:taskId/analytics', authenticate, getTaskAnalytics);

/**
 * @swagger
 * /api/tasks/{taskId}/history:
 *   get:
 *     summary: Get task status history
 *     tags: [Tasks]
 */
router.get('/:taskId/history', authenticate, getTaskHistory);

module.exports = router;