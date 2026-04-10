const express = require('express');
const router = express.Router();

// ✅ IMPORT CONTROLLER FIRST
const { registerUser, loginUser } = require('../controllers/userController');

// ✅ IMPORT VALIDATION
const { registerValidation, validate } = require('../middleware/validation');

// ================= ROUTES ================= //

// Register (with validation)
router.post('/register', registerValidation, validate, registerUser);

// Login
router.post('/login', loginUser);

// Export router
module.exports = router;