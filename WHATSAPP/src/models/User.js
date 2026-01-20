const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // WhatsApp Phone Number (Primary Identifier)
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    
    // Personal Details
    name: {
        type: String,
        trim: true
    },
    
    age: {
        type: Number,
        min: 0,
        max: 150
    },
    
    dateOfBirth: {
        type: Date
    },
    
    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer_not_to_say']
    },
    
    // Address Details
    address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        pincode: { type: String, trim: true },
        country: { type: String, default: 'India', trim: true }
    },
    
    // Additional Details
    income: {
        type: Number,
        min: 0
    },
    
    caste: {
        type: String,
        trim: true
    },
    
    occupation: {
        type: String,
        trim: true
    },
    
    education: {
        type: String,
        trim: true
    },
    
    // Registration Status
    registrationStatus: {
        type: String,
        enum: ['started', 'in_progress', 'completed'],
        default: 'started'
    },
    
    // Current Registration Step (for multi-step registration)
    currentStep: {
        type: String,
        default: 'welcome'
    },
    
    // User State (for conversation context)
    conversationState: {
        type: String,
        default: 'idle',
        enum: ['idle', 'registering', 'adding_entry', 'viewing_khata', 'adding_transaction']
    },
    
    // Temp data during registration/operations
    tempData: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
userSchema.index({ phoneNumber: 1 });
userSchema.index({ registrationStatus: 1 });

module.exports = mongoose.model('User', userSchema);
