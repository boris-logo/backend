console.log("NEW SERVER FILE RUNNING");

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// ================= CREATE APP ================= //
const app = express();

// ================= MIDDLEWARE ================= //
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// ================= IMPORT ROUTES ================= //
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const messageRoutes = require('./routes/messageRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

// ================= USE ROUTES ================= //
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/favorites', favoriteRoutes); // ✅ NOW CORRECT

// ================= TEST ROUTE ================= //
app.get('/', (req, res) => {
    res.send('HomeLink API Running...');
});

// ================= 404 HANDLER ================= //
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// ================= GLOBAL ERROR HANDLER ================= //
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// ================= START SERVER ================= //
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});