const express = require('express');
const { authenticate } = require('../controllers/auth.controller');
const { getLeadScore ,updateLeadScore} = require('../controllers/scoring.controller');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Lead Scoring
 *   description: Lead scoring management
 */

/**
 * @swagger
 * /api/leads/{leadId}/score:
 *   get:
 *     summary: Get lead score
 *     tags: [Lead Scoring]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Lead score retrieved successfully
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
 *                     score: { type: integer }
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lead not found
 */
router.get('/:leadId/score', authenticate, getLeadScore);

/**
 * @swagger
 * /api/leads/{leadId}/score:
 *   put:
 *     summary: Update lead score
 *     tags: [Lead Scoring]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [score]
 *             properties:
 *               score:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 */
router.put('/:leadId/score', authenticate, updateLeadScore);

module.exports = router;