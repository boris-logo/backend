const express = require('express');
const router = express.Router();

const favoriteController = require('../controllers/favoriteController');
const verifyToken = require('../middleware/auth');

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Add property to favorites
 *     description: Add a property to the authenticated user's favorites list
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - property_id
 *             properties:
 *               property_id:
 *                 type: integer
 *                 description: ID of the property to add to favorites
 *                 example: 123
 *     responses:
 *       201:
 *         description: Property added to favorites successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Property added to favorites"
 *                 id:
 *                   type: integer
 *                   description: Favorite record ID
 *                   example: 456
 *       400:
 *         description: Bad request - property already in favorites or missing property_id
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
router.post('/', verifyToken, favoriteController.addFavorite);

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Get user's favorite properties
 *     description: Retrieve all properties that the authenticated user has marked as favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favorites retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Favorite'
 *                   - type: object
 *                     properties:
 *                       property:
 *                         $ref: '#/components/schemas/Property'
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
router.get('/', verifyToken, favoriteController.getFavorites);

/**
 * @swagger
 * /api/favorites/{property_id}:
 *   delete:
 *     summary: Remove property from favorites
 *     description: Remove a property from the authenticated user's favorites list
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: property_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the property to remove from favorites
 *         example: 123
 *     responses:
 *       200:
 *         description: Property removed from favorites successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Property removed from favorites"
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Favorite not found
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
router.delete('/:property_id', verifyToken, favoriteController.removeFavorite);

module.exports = router;