const mongoose = require('mongoose');

const khataEntrySchema = new mongoose.Schema({
    // Reference to User
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    
    // Phone number for quick lookup
    phoneNumber: {
        type: String,
        required: true,
        index: true
    },
    
    // Transaction Type
    type: {
        type: String,
        enum: ['credit', 'debit'],
        required: true
    },
    
    // Amount
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    
    // Description/Purpose
    description: {
        type: String,
        required: true,
        trim: true
    },
    
    // Category
    category: {
        type: String,
        enum: ['income', 'expense', 'loan_given', 'loan_taken', 'repayment', 'savings', 'other'],
        default: 'other'
    },
    
    // Party Name (who the transaction is with)
    partyName: {
        type: String,
        trim: true
    },
    
    // Transaction Date
    transactionDate: {
        type: Date,
        default: Date.now
    },
    
    // Balance after this transaction
    balanceAfter: {
        type: Number,
        default: 0
    },
    
    // Notes
    notes: {
        type: String,
        trim: true
    },
    
    // Status
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'completed'
    }
}, {
    timestamps: true
});

// Compound index for user queries
khataEntrySchema.index({ userId: 1, transactionDate: -1 });
khataEntrySchema.index({ phoneNumber: 1, transactionDate: -1 });

module.exports = mongoose.model('KhataEntry', khataEntrySchema);
