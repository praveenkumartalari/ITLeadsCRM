const express = require('express');
const { listusers } = require('../controllers/user.controller');
const { authenticate, authorize } = require('../controllers/auth.controller');

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                       roleName:
 *                         type: string
 *                       isAdmin:
 *                         type: boolean
 *       403:
 *         description: Access forbidden
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, authorize(['admin']), listusers);

module.exports = router;