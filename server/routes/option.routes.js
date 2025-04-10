const express = require('express');
const { getLeadStatuses, getLeadSources } = require('../controllers/option.controller');

const router = express.Router();

/**
 * @swagger
 * /api/options/lead-statuses:
 *   get:
 *     summary: Get lead status options
 *     tags: [Options]
 *     responses:
 *       200:
 *         description: Lead status options
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Request successful" }
 *                 data: { type: array, items: { type: string } }
 */
router.get('/lead-statuses', getLeadStatuses);

/**
 * @swagger
 * /api/options/lead-sources:
 *   get:
 *     summary: Get lead source options
 *     tags: [Options]
 *     responses:
 *       200:
 *         description: Lead source options
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Request successful" }
 *                 data: { type: array, items: { type: string } }
 */
router.get('/lead-sources', getLeadSources);

module.exports = router;