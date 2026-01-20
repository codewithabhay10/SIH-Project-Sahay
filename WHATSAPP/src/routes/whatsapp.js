const express = require('express');
const { whatsappController } = require('../controllers');

const router = express.Router();

// Twilio WhatsApp Webhook endpoint
router.post('/webhook', (req, res) => whatsappController.handleIncomingMessage(req, res));

// Health check for webhook
router.get('/webhook', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        message: 'WhatsApp Webhook is active',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
