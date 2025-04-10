const express = require('express');
const {
    getclient,
    createclient,
    updateclient,
    deleteclient,
    listclients,
  } = require('../controllers/client.controller');
const { authenticate, authorize } = require('../controllers/auth.controller');

const router = express.Router();

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: List all clients
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of clients
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', authenticate, listclients);

/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     summary: Get a client by ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Client details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authenticate, getclient);

/**
 * @swagger
 * /api/clients:
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName: { type: string }
 *               industry: { type: string }
 *               location: { type: string }
 *               contactEmail: { type: string }
 *               phone: { type: string }
 *               website: { type: string }
 *               notes: { type: string }
 *               leadId: { type: integer }
 *     responses:
 *       201:
 *         description: Client created
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', authenticate, createclient);

/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     summary: Update a client
 *     tags: [Clients]
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
 *               companyName: { type: string }
 *               industry: { type: string }
 *               location: { type: string }
 *               contactEmail: { type: string }
 *               phone: { type: string }
 *               website: { type: string }
 *               notes: { type: string }
 *               leadId: { type: integer }
 *     responses:
 *       200:
 *         description: Client updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Client not found
 *       422:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticate, updateclient);

/**
 * @swagger
 * /api/clients/{id}:
 *   delete:
 *     summary: Delete a client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Client deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticate, authorize(['admin', 'manager']), deleteclient);

module.exports = router;    