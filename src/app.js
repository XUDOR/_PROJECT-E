const express = require('express');
const path = require('path');
const cors = require('cors');
const mainRoutes = require('./routes/mainRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3005; // Project E port

// Enable CORS for all routes
app.use(cors());

// Middleware for parsing JSON
app.use(express.json());

// Middleware for serving static files
app.use(express.static(path.join(__dirname, '../public')));

// Use the main routes
app.use('/', mainRoutes);

// Basic error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start the server on port 3005
app.listen(PORT, () => {
    console.log(`Project E (Parser) is running on http://localhost:${PORT}`);
});
