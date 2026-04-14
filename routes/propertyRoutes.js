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

/**
 * @swagger
 * /api/properties:
 *   post:
 *     summary: Create a new property
 *     description: Create a new property listing with image upload (requires authentication and agent/admin role)
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - price
 *               - location
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *                 description: Property title
 *                 example: "Beautiful 3-bedroom house"
 *               description:
 *                 type: string
 *                 description: Property description
 *                 example: "A lovely family home in a quiet neighborhood"
 *               price:
 *                 type: number
 *                 format: decimal
 *                 description: Property price
 *                 example: 450000
 *               location:
 *                 type: string
 *                 description: Property location
 *                 example: "New York, NY"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Property image file
 *     responses:
 *       201:
 *         description: Property created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Property created successfully"
 *                 propertyId:
 *                   type: integer
 *                   example: 123
 *       400:
 *         description: Bad request - validation error or missing required fields
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
// Create Property (agent or admin)
router.post(
    '/',
    verifyToken,
    upload.single('image'),           // ✅ multer first to parse form-data
    propertyValidation,              // ✅ validation after parsing
    validate,
    propertyController.createProperty
);

/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: Get all properties
 *     description: Retrieve all properties with optional filtering by location, price range, and keyword
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location (partial match)
 *         example: "New York"
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           format: decimal
 *         description: Minimum price filter
 *         example: 100000
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           format: decimal
 *         description: Maximum price filter
 *         example: 500000
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword in title or description
 *         example: "apartment"
 *     responses:
 *       200:
 *         description: Properties retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Property'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Get all properties (with optional filters)
router.get('/', propertyController.getAllProperties);

/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     summary: Get property by ID
 *     description: Retrieve a specific property by its ID
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Property ID
 *         example: 123
 *     responses:
 *       200:
 *         description: Property retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Property'
 *       404:
 *         description: Property not found
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
// Get property by ID
router.get('/:id', propertyController.getPropertyById);

/**
 * @swagger
 * /api/properties/{id}:
 *   put:
 *     summary: Update property
 *     description: Update an existing property (requires authentication and ownership or admin role)
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Property ID
 *         example: 123
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Property title
 *                 example: "Updated beautiful 3-bedroom house"
 *               description:
 *                 type: string
 *                 description: Property description
 *                 example: "Updated description of the lovely family home"
 *               price:
 *                 type: number
 *                 format: decimal
 *                 description: Property price
 *                 example: 475000
 *               location:
 *                 type: string
 *                 description: Property location
 *                 example: "Updated location"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Updated property image file (optional)
 *     responses:
 *       200:
 *         description: Property updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Property updated successfully"
 *       400:
 *         description: Bad request - validation error
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
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Property not found
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
// Update property
router.put(
    '/:id',
    verifyToken,
    upload.single('image'),           // ✅ handle image if updated
    propertyValidation,
    validate,
    propertyController.updateProperty
);

/**
 * @swagger
 * /api/properties/{id}:
 *   delete:
 *     summary: Delete property
 *     description: Delete an existing property (requires authentication and ownership or admin role)
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Property ID
 *         example: 123
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Property deleted successfully"
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Property not found
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
// Delete property
router.delete('/:id', verifyToken, propertyController.deleteProperty);

module.exports = router;