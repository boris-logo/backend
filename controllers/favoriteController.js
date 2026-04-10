const db = require('../config/db');

// ADD FAVORITE
exports.addFavorite = (req, res) => {
    const user_id = req.user.id;
    const { property_id } = req.body;

    const sql = 'INSERT INTO favorites (user_id, property_id) VALUES (?, ?)';

    db.query(sql, [user_id, property_id], (err) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Already in favorites' });
            }
            return res.status(500).json(err);
        }

        res.json({ message: 'Added to favorites' });
    });
};

// GET FAVORITES
exports.getFavorites = (req, res) => {
    const user_id = req.user.id;

    const sql = `
        SELECT p.* FROM favorites f
        JOIN properties p ON f.property_id = p.id
        WHERE f.user_id = ?
    `;

    db.query(sql, [user_id], (err, results) => {
        if (err) return res.status(500).json(err);

        res.json(results);
    });
};

// REMOVE FAVORITE
exports.removeFavorite = (req, res) => {
    const user_id = req.user.id;
    const { property_id } = req.params;

    const sql = 'DELETE FROM favorites WHERE user_id = ? AND property_id = ?';

    db.query(sql, [user_id, property_id], (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: 'Removed from favorites' });
    });
};