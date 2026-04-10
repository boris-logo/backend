const express = require('express');
const router = express.Router();

const messageController = require('../controllers/messageController');
const verifyToken = require('../middleware/auth');

// ================= MESSAGE ROUTES ================= //

// Send message (all logged-in users)
router.post('/', verifyToken, messageController.sendMessage);

// Get all messages for logged-in user
router.get('/', verifyToken, messageController.getMessages);

// Get conversation between logged-in user and another user for a property
router.get('/:receiver_id/:property_id', verifyToken, messageController.getConversation);

module.exports = router;