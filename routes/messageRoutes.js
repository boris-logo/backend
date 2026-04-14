const express = require('express');
const router = express.Router();

const messageController = require('../controllers/messageController');
const verifyToken = require('../middleware/auth');

// ================= MESSAGE ROUTES ================= //

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send a message
 *     description: Send a message to another user regarding a property (requires authentication)
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiver_id
 *               - property_id
 *               - content
 *             properties:
 *               receiver_id:
 *                 type: integer
 *                 description: ID of the message recipient
 *                 example: 456
 *               property_id:
 *                 type: integer
 *                 description: ID of the property being discussed
 *                 example: 123
 *               content:
 *                 type: string
 *                 description: Message content
 *                 example: "I'm interested in this property. Can we schedule a viewing?"
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Message sent successfully"
 *                 id:
 *                   type: integer
 *                   description: Message ID
 *                   example: 789
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Send message (all logged-in users)
router.post('/', verifyToken, messageController.sendMessage);

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get all messages for logged-in user
 *     description: Retrieve all messages sent to or from the authenticated user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Get all messages for logged-in user
router.get('/', verifyToken, messageController.getMessages);

/**
 * @swagger
 * /api/messages/{receiver_id}/{property_id}:
 *   get:
 *     summary: Get conversation between users
 *     description: Retrieve conversation between the logged-in user and another user for a specific property
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: receiver_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the other user in the conversation
 *         example: 456
 *       - in: path
 *         name: property_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the property being discussed
 *         example: 123
 *     responses:
 *       200:
 *         description: Conversation retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Get conversation between logged-in user and another user for a property
router.get('/:receiver_id/:property_id', verifyToken, messageController.getConversation);

module.exports = router;