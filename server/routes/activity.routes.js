const express = require('express');
const {
  listactivities,
  listactivitiesByUser,
  listUpcomingactivities,
  createactivity,
  updateactivity,
  deleteactivity,
} = require('../controllers/activity.controller');
const { authenticate } = require('../controllers/auth.controller');

const router = express.Router();

/**
 * @swagger
 * /api/activities:
 *   get:
 *     summary: List all activities
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of activities
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', authenticate, listactivities);

/**
 * @swagger
 * /api/activities/user/{userId}:
 *   get:
 *     summary: List activities by user
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of user activities
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/user/:userId', authenticate, listactivitiesByUser);

/**
 * @swagger
 * /api/activities/upcoming/{userId}:
 *   get:
 *     summary: List upcoming activities for a user
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: days
 *         schema: { type: integer, default: 7 }
 *         description: Number of days to look ahead
 *     responses:
 *       200:
 *         description: List of upcoming activities
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/upcoming/:userId', authenticate, listUpcomingactivities);

/**
 * @swagger
 * /api/activities:
 *   post:
 *     summary: Create a new activity
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type: { type: string }
 *               title: { type: string }
 *               notes: { type: string }
 *               scheduledAt: { type: string, format: date-time }
 *               completed: { type: boolean }
 *               relatedTo: { type: string }
 *               relatedId: { type: integer }
 *               createdById: { type: integer }
 *               assignedToId: { type: integer }
 *     responses:
 *       201:
 *         description: Activity created
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', authenticate, createactivity);

/**
 * @swagger
 * /api/activities/{id}:
 *   put:
 *     summary: Update an activity
 *     tags: [Activities]
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
 *               type: { type: string }
 *               title: { type: string }
 *               notes: { type: string }
 *               scheduledAt: { type: string, format: date-time }
 *               completed: { type: boolean }
 *               relatedTo: { type: string }
 *               relatedId: { type: integer }
 *               createdById: { type: integer }
 *               assignedToId: { type: integer }
 *     responses:
 *       200:
 *         description: Activity updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Activity not found
 *       422:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticate, updateactivity);

/**
 * @swagger
 * /api/activities/{id}:
 *   delete:
 *     summary: Delete an activity
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Activity deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Activity not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticate, deleteactivity);

module.exports = router;