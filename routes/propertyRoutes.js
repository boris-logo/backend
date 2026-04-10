const express = require('express');
const router = express.Router();

// Controllers
const propertyController = require('../controllers/propertyController');

// Middleware
const verifyToken = require('../middleware/auth');
const { propertyValidation, validate } = require('../middleware/validation');
const multer = require('multer');
const path = require('path');

// ================= MULTER SETUP ================= //
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = file.fieldname + '-' + Date.now() + ext;
        cb(null, filename);
    }
});

const upload = multer({ storage });

// ================= PROPERTY ROUTES ================= //

// Create Property (agent or admin)
router.post(
    '/',
    verifyToken,
    upload.single('image'),           // ✅ multer first to parse form-data
    propertyValidation,              // ✅ validation after parsing
    validate,
    propertyController.createProperty
);

// Get all properties (with optional filters)
router.get('/', propertyController.getAllProperties);

// Get property by ID
router.get('/:id', propertyController.getPropertyById);

// Update property
router.put(
    '/:id',
    verifyToken,
    upload.single('image'),           // ✅ handle image if updated
    propertyValidation,
    validate,
    propertyController.updateProperty
);

// Delete property
router.delete('/:id', verifyToken, propertyController.deleteProperty);

module.exports = router;