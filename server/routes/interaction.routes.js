const express = require('express');
const { authenticate } = require('../controllers/auth.controller');
const { addInteraction, getInteractionHistory, getLeadMetrics } = require('../controllers/interaction.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Interactions
 *   description: Lead interaction management
 */

/**
 * @swagger
 * /api/interactions/{leadId}:
 *   post:
 *     summary: Add a new interaction for a lead
 *     tags: [Interactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema: { type: string, format: uuid }
 *         description: Lead ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, title, interactionDate]
 *             properties:
 *               type: 
 *                 type: string
 *                 enum: [CALL, MEETING, EMAIL, NOTE, OTHER]
 *               title: 
 *                 type: string
 *                 minLength: 2
 *               description: 
 *                 type: string
 *               interactionDate: 
 *                 type: string
 *                 format: date-time
 *               nextFollowUp: 
 *                 type: string
 *                 format: date-time
 *               durationMinutes: 
 *                 type: integer
 *                 minimum: 0
 *               outcome: 
 *                 type: string
 *               metadata: 
 *                 type: object
 *     responses:
 *       201:
 *         description: Interaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 201 }
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string, format: uuid }
 *                     leadId: { type: string, format: uuid }
 *                     type: { type: string }
 *                     title: { type: string }
 *                     description: { type: string }
 *                     interactionDate: { type: string, format: date-time }
 *                     newScore: { type: integer }
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lead not found
 */
router.post('/:leadId', authenticate, addInteraction);

/**
 * @swagger
 * /api/interactions/{leadId}:
 *   get:
 *     summary: Get interaction history for a lead
 *     tags: [Interactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema: { type: string, format: uuid }
 *         description: Lead ID
 *     responses:
 *       200:
 *         description: List of interactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string, format: uuid }
 *                       leadId: { type: string, format: uuid }
 *                       type: { type: string }
 *                       title: { type: string }
 *                       description: { type: string }
 *                       interactionDate: { type: string, format: date-time }
 *                       nextFollowUp: { type: string, format: date-time }
 *                       durationMinutes: { type: integer }
 *                       outcome: { type: string }
 *                       metadata: { type: object }
 *                       created_by_name: { type: string }
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lead not found
 */
router.get('/:leadId', authenticate, getInteractionHistory);

/**
 * @swagger
 * /api/interactions/{leadId}/analytics:
 *   get:
 *     summary: Get lead interaction analytics
 *     tags: [Interactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema: { type: string, format: uuid }
 *         description: Lead ID
 *     responses:
 *       200:
 *         description: Lead analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     interactionStats:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type: { type: string }
 *                           count: { type: integer }
 *                           avgDuration: { type: number }
 *                           lastInteraction: { type: string, format: date-time }
 *                     responseTimes:
 *                       type: object
 *                       properties:
 *                         avgResponseTimeHours: { type: number }
 *                     taskMetrics:
 *                       type: object
 *                       properties:
 *                         totalTasks: { type: integer }
 *                         completedTasks: { type: integer }
 *                         avgCompletionTimeHours: { type: number }
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lead not found
 */
router.get('/:leadId/analytics', authenticate, getLeadMetrics);

module.exports = router;