const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// ================= CREATE PROPERTY =================
exports.createProperty = (req, res) => {
    const { title, description, price, location } = req.body;
    const owner_id = req.user.id;

    if (!title || !price || !location) {
        return res.status(400).json({ message: 'Required fields missing' });
    }

    // Ensure price is a number
    if (isNaN(price)) {
        return res.status(400).json({ message: 'Price must be a number' });
    }

    if (!req.file) {
        return res.status(400).json({ message: 'Property image is required' });
    }

    const image = req.file.filename;

    const sql = `
        INSERT INTO properties 
        (title, description, price, location, image, owner_id) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [title, description, price, location, image, owner_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }

        res.status(201).json({
            message: 'Property created successfully',
            propertyId: result.insertId
        });
    });
};

// ================= GET ALL PROPERTIES =================
exports.getAllProperties = (req, res) => {
    let { location, minPrice, maxPrice, keyword } = req.query;

    let sql = `SELECT * FROM properties WHERE 1=1`;
    let params = [];

    if (location) {
        sql += ' AND location LIKE ?';
        params.push(`%${location}%`);
    }

    if (minPrice) {
        sql += ' AND price >= ?';
        params.push(minPrice);
    }

    if (maxPrice) {
        sql += ' AND price <= ?';
        params.push(maxPrice);
    }

    if (keyword) {
        sql += ' AND title LIKE ?';
        params.push(`%${keyword}%`);
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }

        res.json(results);
    });
};

// ================= GET PROPERTY BY ID =================
exports.getPropertyById = (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT p.*, u.name AS owner_name, u.role AS owner_role
        FROM properties p
        JOIN users u ON p.owner_id = u.id
        WHERE p.id = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Property not found' });
        }

        res.json(results[0]);
    });
};

// ================= UPDATE PROPERTY =================
exports.updateProperty = (req, res) => {
    const { id } = req.params;
    const { title, description, price, location } = req.body;

    const sqlCheck = 'SELECT * FROM properties WHERE id = ?';

    db.query(sqlCheck, [id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        if (results.length === 0) {
            return res.status(404).json({ message: 'Property not found' });
        }

        const property = results[0];

        // Ownership check
        if (req.user.role === 'agent' && property.owner_id !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        let image = property.image;

        if (req.file) {
            const oldPath = path.join(__dirname, '..', 'uploads', property.image);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
            image = req.file.filename;
        }

        const sqlUpdate = `
            UPDATE properties 
            SET title=?, description=?, price=?, location=?, image=? 
            WHERE id=?
        `;

        db.query(
            sqlUpdate,
            [
                title || property.title,
                description || property.description,
                price || property.price,
                location || property.location,
                image,
                id
            ],
            (err2) => {
                if (err2) {
                    console.error(err2);
                    return res.status(500).json({ message: 'Update failed' });
                }

                res.json({ message: 'Property updated successfully' });
            }
        );
    });
};

// ================= DELETE PROPERTY =================
exports.deleteProperty = (req, res) => {
    const { id } = req.params;

    const sqlCheck = 'SELECT * FROM properties WHERE id = ?';

    db.query(sqlCheck, [id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        if (results.length === 0) {
            return res.status(404).json({ message: 'Property not found' });
        }

        const property = results[0];

        const sqlDelete = 'DELETE FROM properties WHERE id = ?';

        db.query(sqlDelete, [id], (err2) => {
            if (err2) {
                console.error(err2);
                return res.status(500).json({ message: 'Delete failed' });
            }

            const filePath = path.join(__dirname, '..', 'uploads', property.image);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            res.json({ message: 'Property deleted successfully' });
        });
    });
};