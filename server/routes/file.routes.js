const express = require('express');
const { listfilesByRelated, createfile, deletefile } = require('../controllers/file.controller');
const { authenticate } = require('../controllers/auth.controller');

const router = express.Router();

/**
 * @swagger
 * /api/files/{relatedTo}/{relatedId}:
 *   get:
 *     summary: List files by related entity
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: relatedTo
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: relatedId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of files
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/:relatedTo/:relatedId', authenticate, listfilesByRelated);

/**
 * @swagger
 * /api/files:
 *   post:
 *     summary: Create a new file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileName: { type: string }
 *               fileUrl: { type: string }
 *               fileType: { type: string }
 *               relatedTo: { type: string }
 *               relatedId: { type: integer }
 *               uploadedById: { type: integer }
 *     responses:
 *       201:
 *         description: File created
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', authenticate, createfile);

/**
 * @swagger
 * /api/files/{id}:
 *   delete:
 *     summary: Delete a file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: File deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: File not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticate, deletefile);

module.exports = router;