const express = require('express');
const { listusers } = require('../controllers/user.controller');
const { authorize } = require('../controllers/auth.controller');

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
 *         description: List of users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get('/', authorize(['admin']), listusers);

module.exports = router;