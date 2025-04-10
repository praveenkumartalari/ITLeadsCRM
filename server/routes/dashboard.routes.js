const express = require('express');
const { getStats } = require('../controllers/dashboard.controller');

const router = express.Router();

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard stats retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Request successful" }
 *                 data: { type: object }
 *       500:
 *         description: Server error
 */
router.get('/stats', getStats);

module.exports = router;