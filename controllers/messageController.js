const db = require('../config/db');

// ================= SEND MESSAGE =================
exports.sendMessage = (req, res) => {
    const sender_id = req.user.id;
    const { receiver_id, property_id, message } = req.body;

    if (!receiver_id || !property_id || !message) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const sql = `
        INSERT INTO messages (sender_id, receiver_id, property_id, message)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [sender_id, receiver_id, property_id, message], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to send message' });
        }

        res.status(201).json({ message: 'Message sent successfully' });
    });
};

// ================= GET ALL MESSAGES =================
exports.getMessages = (req, res) => {
    const user_id = req.user.id;

    const sql = `
        SELECT * FROM messages
        WHERE sender_id = ? OR receiver_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [user_id, user_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }

        res.json(results);
    });
};

// ================= GET CONVERSATION =================
exports.getConversation = (req, res) => {
    const sender_id = req.user.id;
    const { receiver_id, property_id } = req.params;

    const sql = `
        SELECT * FROM messages
        WHERE (
            sender_id = ? AND receiver_id = ?
            OR sender_id = ? AND receiver_id = ?
        )
        AND property_id = ?
        ORDER BY created_at ASC
    `;

    db.query(
        sql,
        [sender_id, receiver_id, receiver_id, sender_id, property_id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Database error' });
            }

            res.json(results);
        }
    );
};