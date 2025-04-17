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
 *     security:
 *       - bearerAuth: []
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
 *                 data: 
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string, format: uuid }
 *                       name: { type: string }
 *                       email: { type: string }
 *                       phone: { type: string }
 *                       company: { type: string }
 *                       industry: { type: string }
 *                       source: { type: string }
 *                       status: { type: string }
 *                       created_by_id: { type: string, format: uuid }
 *                       created_at: { type: string, format: date-time }
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', authenticate, listLeads);

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
 *         schema: { type: string, format: uuid }
 *         description: Lead ID
 *     responses:
 *       200:
 *         description: Lead details
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
 *                     id: { type: string, format: uuid }
 *                     name: { type: string }
 *                     email: { type: string }
 *                     phone: { type: string }
 *                     company: { type: string }
 *                     industry: { type: string }
 *                     source: { type: string }
 *                     status: { type: string }
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lead not found
 */
router.get('/:id', authenticate, listLead);

/**
 * @swagger
 * /api/leads:
 *   post:
 *     summary: Create a new lead
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name: { type: string, minLength: 2 }
 *               email: { type: string, format: email }
 *               phone: { type: string, pattern: '^\+?[\d\s-]{10,}$' }
 *               company: { type: string }
 *               industry: { type: string }
 *               source: { type: string, enum: [Web, Referral, LinkedIn, Email, Cold Call, Event, Other] }
 *               status: { type: string, enum: [New, Contacted, Qualified, Proposal, Negotiation, Won, Lost] }
 *               assignedToId: { type: string, format: uuid }
 *               notes: { type: string }
 *               budget: { type: number, minimum: 0 }
 *               score: { type: number, minimum: 0 }
 *               expectedCloseDate: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Lead created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, createlead);

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
 *         schema: { type: string, format: uuid }
 *         description: Lead ID (UUID)
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, minLength: 2 }
 *               email: { type: string, format: email }
 *               phone: { type: string, pattern: '^\+?[\d\s-]{10,}$' }
 *               company: { type: string }
 *               industry: { type: string }
 *               source: { type: string, enum: [Web, Referral, LinkedIn, Email, Cold Call, Event, Other] }
 *               status: { type: string, enum: [New, Contacted, Qualified, Proposal, Negotiation, Won, Lost] }
 *               assignedToId: { type: string, format: uuid }
 *               notes: { type: string }
 *               budget: { type: number, minimum: 0 }
 *               expectedCloseDate: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Lead updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lead not found
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
 *         schema: { type: string, format: uuid }
 *         description: Lead ID (UUID)
 *     responses:
 *       200:
 *         description: Lead deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Lead not found
 */
router.delete('/:id', authenticate, authorize(['admin', 'manager']), deletelead);

module.exports = router;