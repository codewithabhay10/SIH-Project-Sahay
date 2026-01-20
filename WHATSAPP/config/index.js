require('dotenv').config();

module.exports = {
    // Twilio Configuration
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER
    },
    
    // Groq API Configuration (for Speech-to-Text)
    groq: {
        apiKey: process.env.GROQ_API_KEY
    },
    
    // MongoDB Configuration
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsapp_khata'
    },
    
    // Server Configuration
    server: {
        port: process.env.PORT || 3000,
        nodeEnv: process.env.NODE_ENV || 'development'
    },
    
    // App Configuration
    app: {
        name: process.env.APP_NAME || 'WhatsApp Khata Bot'
    }
};
