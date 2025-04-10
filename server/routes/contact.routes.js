const express = require('express');
const { listContactsByclient, createcontact, updatecontact, deletecontact } = require('../controllers/contact.controller');
const { authenticate } = require('../controllers/auth.controller');

const router = express.Router();

/**
 * @swagger
 * /api/clients/{clientId}/contacts:
 *   get:
 *     summary: List contacts for a client
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of contacts
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/clients/:clientId/contacts', authenticate, listContactsByclient);

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientId: { type: integer }
 *               name: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               position: { type: string }
 *               isPrimary: { type: boolean }
 *     responses:
 *       201:
 *         description: Contact created
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', authenticate, createcontact);

/**
 * @swagger
 * /api/contacts/{id}:
 *   put:
 *     summary: Update a contact
 *     tags: [Contacts]
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
 *               clientId: { type: integer }
 *               name: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               position: { type: string }
 *               isPrimary: { type: boolean }
 *     responses:
 *       200:
 *         description: Contact updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact not found
 *       422:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticate, updatecontact);

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Contact deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticate, deletecontact);

module.exports = router;