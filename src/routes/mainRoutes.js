// mainRoutes.js


const express = require('express');
const axios = require('axios');
const { PROJECT_F_URL, PROJECT_B_URL } = require('../../config/const');
const router = express.Router();

// ------------------- PARSER OPERATIONS ------------------- //

// Route to handle document parsing and notify other services
router.post('/api/parse', async (req, res) => {
    try {
        const documentData = req.body;
        console.log('Received document for parsing:', documentData);

        // Parse document to JSON-R format
        const jsonRData = {
            section1: {
                ml_ready: true,
                timestamp: new Date().toISOString(),
                // Add other machine-ready data
            },
            section2: {
                // Add categorization and identifiers
            },
            // Add other sections
        };

        // Store parsed data in Project B (Database)
        const dbResponse = await axios.post(`${PROJECT_B_URL}/store`, jsonRData);
        console.log('Stored parsed data:', dbResponse.data);

        // Notify Communication Hub (Project F)
        await axios.post(`${PROJECT_F_URL}/api/notifications`, {
            message: `Document parsed successfully: ${documentData.id}`
        });

        // Log success to communication hub
        await axios.post(`${PROJECT_F_URL}/api/communication`, {
            type: 'PARSE_SUCCESS',
            data: {
                documentId: documentData.id,
                timestamp: new Date().toISOString()
            }
        });

        res.status(200).json({
            message: 'Document parsed successfully',
            data: jsonRData
        });

    } catch (error) {
        console.error('Error in parse operation:', error.message);

        // Notify hub of error
        await axios.post(`${PROJECT_F_URL}/api/notifications`, {
            message: `Parse error: ${error.message}`
        });

        res.status(500).json({ error: 'Failed to parse document.' });
    }
});

// ------------------- OPTIMIZATION ROUTES ------------------- //

// Route to optimize parsed documents for specific purposes (ATS, ML, etc)
router.post('/api/optimize', async (req, res) => {
    try {
        const { documentId, optimizationType } = req.body;
        console.log(`Optimizing document ${documentId} for ${optimizationType}`);

        // Optimization logic here
        const optimizedData = {
            // Add optimization results
        };

        // Notify hub of optimization completion
        await axios.post(`${PROJECT_F_URL}/api/notifications`, {
            message: `Document ${documentId} optimized for ${optimizationType}`
        });

        res.status(200).json({
            message: 'Document optimized successfully',
            data: optimizedData
        });

    } catch (error) {
        console.error('Optimization error:', error.message);
        res.status(500).json({ error: 'Optimization failed.' });
    }
});

// ------------------- STATUS ROUTES ------------------- //

// Route to check parser status and recent operations
router.get('/api/status', (req, res) => {
    res.json({
        status: 'active',
        version: '1.0',
        lastOperation: new Date().toISOString()
    });
});

module.exports = router;