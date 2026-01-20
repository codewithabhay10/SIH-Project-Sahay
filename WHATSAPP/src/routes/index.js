const express = require('express');
const whatsappRoutes = require('./whatsapp');

const router = express.Router();

// API Routes
router.use('/whatsapp', whatsappRoutes);

// Root route
router.get('/', (req, res) => {
    res.json({
        name: 'WhatsApp Digital Khata Bot',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            webhook: '/api/whatsapp/webhook',
            health: '/health'
        }
    });
});

module.exports = router;
