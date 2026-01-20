require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config');
const routes = require('./routes');
const { localStore } = require('./storage');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
    const stats = localStore.getStats();
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        storage: stats
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: config.app.name,
        version: '1.0.0',
        status: 'running',
        message: 'Welcome to WhatsApp Digital Khata Bot!',
        webhook: '/api/whatsapp/webhook',
        storage: 'in-memory (data resets on restart)'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: config.server.nodeEnv === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`
    });
});

// Start server
const startServer = () => {
    const PORT = config.server.port;
    
    app.listen(PORT, () => {
        console.log(`\n🚀 Server running on port ${PORT}`);
        console.log(`📱 WhatsApp Webhook URL: http://localhost:${PORT}/api/whatsapp/webhook`);
        console.log(`🔧 Environment: ${config.server.nodeEnv}`);
        console.log(`📦 Storage: In-Memory (data resets on restart)`);
        console.log(`\n✨ ${config.app.name} is ready!\n`);
    });
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Start the server
startServer();

module.exports = app;
