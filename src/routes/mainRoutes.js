require('dotenv').config();
const express = require('express');
const axios = require('axios');

const router = express.Router();

// Import constants
const { PROJECT_F_URL, PROJECT_B_URL } = require('../../config/const');

// ------------------- API STATUS ROUTES ------------------- //

/**
 * Status route to check service availability
 */
router.get('/api/status', (req, res) => {
    res.json({
        status: 'active',
        version: '1.0',
        message: 'Project E is running',
    });
});

/**
 * Healthcheck route
 */
router.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        message: 'Project E is operational',
        timestamp: new Date().toISOString(),
    });
});

// ------------------- PARSER OPERATIONS ------------------- //

/**
 * Parse a document and notify other services
 */
router.post('/api/parse', async (req, res) => {
    try {
        const { id, filePath, metadata } = req.body;

        if (!filePath || !metadata) {
            return res.status(400).json({ error: 'File path and metadata are required' });
        }

        console.log('Received document for parsing:', { id, metadata });

        // Example parsing logic to JSON-R format
        const jsonRData = {
            documentId: id,
            parsedAt: new Date().toISOString(),
            sections: [
                { title: 'Section 1', ml_ready: true, data: metadata.section1 || {} },
                { title: 'Section 2', categories: metadata.categories || [] },
            ],
            originalFilePath: filePath,
        };

        // Store parsed data in Project B
        const dbResponse = await axios.post(`${PROJECT_B_URL}/store`, jsonRData);
        console.log('Stored parsed data in Project B:', dbResponse.data);

        // Notify Communication Hub (Project F)
        await axios.post(`${PROJECT_F_URL}/api/notifications`, {
            message: `Document parsed successfully: ${id}`,
            details: { documentId: id, timestamp: new Date().toISOString() },
        });

        res.status(200).json({
            message: 'Document parsed successfully',
            parsedData: jsonRData,
        });
    } catch (error) {
        console.error('Error in parse operation:', error.message);

        // Notify Communication Hub of failure
        await axios.post(`${PROJECT_F_URL}/api/notifications`, {
            message: `Parse error for document: ${req.body?.id || 'unknown'}`,
            error: error.message,
        });

        res.status(500).json({ error: 'Failed to parse document.' });
    }
});

/**
 * Optimize parsed document for specific use cases
 */
router.post('/api/optimize', async (req, res) => {
    try {
        const { documentId, optimizationType } = req.body;

        if (!documentId || !optimizationType) {
            return res.status(400).json({ error: 'Document ID and optimization type are required' });
        }

        console.log(`Optimizing document ${documentId} for ${optimizationType}`);

        // Example optimization logic
        const optimizedData = {
            documentId,
            optimizationType,
            optimizedAt: new Date().toISOString(),
            data: {
                // Add results of optimization
            },
        };

        // Notify Communication Hub of optimization completion
        await axios.post(`${PROJECT_F_URL}/api/notifications`, {
            message: `Document ${documentId} optimized for ${optimizationType}`,
            details: optimizedData,
        });

        res.status(200).json({
            message: 'Document optimized successfully',
            data: optimizedData,
        });
    } catch (error) {
        console.error('Error in optimization operation:', error.message);

        res.status(500).json({ error: 'Failed to optimize document.' });
    }
});

// ------------ New route to fetch parsed data ------------//

router.get('/api/display', async (req, res) => {
    try {
        // Mocked data for now, replace with actual data retrieval
        const parsedData = [
            {
                id: 'doc123',
                fileName: 'resume1.pdf',
                scannedAt: '2025-01-08T10:30:00Z',
                metadata: {
                    IP: '192.168.0.1',
                    section1: 'Work Experience',
                    categories: ['Engineering', 'AI'],
                },
            },
        ];

        res.status(200).json(parsedData);
    } catch (error) {
        console.error('Error fetching parsed data:', error.message);
        res.status(500).json({ error: 'Failed to fetch data.' });
    }
});

// ------------------- STATUS ROUTES ------------------- //

/**
 * Check parser status and recent operations
 */
router.get('/api/status', (req, res) => {
    res.json({
        status: 'active',
        version: '1.0',
        lastOperation: new Date().toISOString(),
    });
});

// ------------------- EXPORT ROUTER ------------------- //

module.exports = router;
