const express = require('express');
const router = express.Router();

const favoriteController = require('../controllers/favoriteController');
const verifyToken = require('../middleware/auth');

router.post('/', verifyToken, favoriteController.addFavorite);
router.get('/', verifyToken, favoriteController.getFavorites);
router.delete('/:property_id', verifyToken, favoriteController.removeFavorite);

module.exports = router;