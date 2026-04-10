const { body, validationResult, query } = require('express-validator');

// ================= USER VALIDATION =================
exports.registerValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 chars')
];

// ================= PROPERTY VALIDATION =================
exports.propertyValidation = [
    body('title').notEmpty().withMessage('Title required'),
    body('price').isNumeric().withMessage('Price must be number'),
    body('location').notEmpty().withMessage('Location required')
];

// ================= HANDLE ERRORS =================
exports.validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    next();
};