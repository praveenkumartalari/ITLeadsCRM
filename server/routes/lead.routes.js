const express = require('express');
const {
  listLeads,
  listLead,
  createlead,
  updatelead,
  deletelead,
} = require('../controllers/lead.controller');
const { authenticate, authorize } = require('../controllers/auth.controller');

const router = express.Router();

/**
 * @swagger
 * /api/leads:
 *   get:
 *     summary: List all leads
 *     tags: [Leads]
 *     responses:
 *       200:
 *         description: List of leads
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Request successful" }
 *                 data: { type: array, items: { type: object } }
 *       500:
 *         description: Server error
 */
router.get('/', listLeads);

/**
 * @swagger
 * /api/leads/{id}:
 *   get:
 *     summary: Get a lead by ID
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Lead ID
 *     responses:
 *       200:
 *         description: Lead details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authenticate, listLead);

/**
 * @swagger
 * /api/leads:
 *   post:
 *     summary: Create a new lead
 *     tags: [Leads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               company: { type: string }
 *               industry: { type: string }
 *               source: { type: string }
 *               status: { type: string }
 *               assignedToId: { type: integer }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Lead created
 *       422:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', createlead);

/**
 * @swagger
 * /api/leads/{id}:
 *   put:
 *     summary: Update a lead
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               company: { type: string }
 *               industry: { type: string }
 *               source: { type: string }
 *               status: { type: string }
 *               assignedToId: { type: integer }
 *               notes: { type: string }
 *     responses:
 *       200:
 *         description: Lead updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lead not found
 *       422:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticate, updatelead);

/**
 * @swagger
 * /api/leads/{id}:
 *   delete:
 *     summary: Delete a lead
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Lead deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticate, authorize(['admin', 'manager']), deletelead);

module.exports = router;