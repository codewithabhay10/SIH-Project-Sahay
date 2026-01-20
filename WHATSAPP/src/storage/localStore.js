/**
 * Local In-Memory Storage
 * Stores all data in memory using objects and maps
 * Note: Data will be lost when server restarts
 */

class LocalStore {
    constructor() {
        // Users storage - Map with phone number as key
        this.users = new Map();
        
        // Khata entries storage - Map with phone number as key, value is array of entries
        this.khataEntries = new Map();
        
        // Entry ID counter
        this.entryIdCounter = 1;
        
        console.log('📦 Local storage initialized (in-memory)');
    }
    
    // ==================== USER OPERATIONS ====================
    
    // Find user by phone number
    findUserByPhone(phoneNumber) {
        return this.users.get(phoneNumber) || null;
    }
    
    // Create new user
    createUser(phoneNumber, userData = {}) {
        const user = {
            _id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            phoneNumber,
            name: userData.name || null,
            age: userData.age || null,
            dateOfBirth: userData.dateOfBirth || null,
            gender: userData.gender || null,
            address: userData.address || {
                street: null,
                city: null,
                state: null,
                pincode: null,
                country: 'India'
            },
            income: userData.income || null,
            caste: userData.caste || null,
            occupation: userData.occupation || null,
            education: userData.education || null,
            registrationStatus: userData.registrationStatus || 'started',
            currentStep: userData.currentStep || 'welcome',
            conversationState: userData.conversationState || 'idle',
            tempData: userData.tempData || {},
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        this.users.set(phoneNumber, user);
        return user;
    }
    
    // Find or create user
    findOrCreateUser(phoneNumber) {
        let user = this.findUserByPhone(phoneNumber);
        if (!user) {
            user = this.createUser(phoneNumber);
        }
        return user;
    }
    
    // Update user
    updateUser(phoneNumber, updates) {
        const user = this.findUserByPhone(phoneNumber);
        if (!user) return null;
        
        Object.assign(user, updates, { updatedAt: new Date() });
        this.users.set(phoneNumber, user);
        return user;
    }
    
    // ==================== KHATA ENTRY OPERATIONS ====================
    
    // Get all entries for a user
    getEntriesByPhone(phoneNumber) {
        return this.khataEntries.get(phoneNumber) || [];
    }
    
    // Add new khata entry
    addEntry(phoneNumber, entryData) {
        const user = this.findUserByPhone(phoneNumber);
        if (!user) {
            throw new Error('User not found');
        }
        
        // Calculate current balance
        const currentBalance = this.getBalance(phoneNumber);
        const newBalance = entryData.type === 'credit' 
            ? currentBalance + entryData.amount 
            : currentBalance - entryData.amount;
        
        const entry = {
            _id: `entry_${this.entryIdCounter++}`,
            userId: user._id,
            phoneNumber,
            type: entryData.type,
            amount: entryData.amount,
            description: entryData.description,
            category: entryData.category || 'other',
            partyName: entryData.partyName || null,
            transactionDate: new Date(),
            balanceAfter: newBalance,
            notes: entryData.notes || null,
            status: 'completed',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        // Get existing entries or create new array
        const entries = this.khataEntries.get(phoneNumber) || [];
        entries.push(entry);
        this.khataEntries.set(phoneNumber, entries);
        
        return entry;
    }
    
    // Get balance for a user
    getBalance(phoneNumber) {
        const entries = this.getEntriesByPhone(phoneNumber);
        let balance = 0;
        
        for (const entry of entries) {
            if (entry.type === 'credit') {
                balance += entry.amount;
            } else {
                balance -= entry.amount;
            }
        }
        
        return balance;
    }
    
    // Get recent entries (sorted by date, newest first)
    getRecentEntries(phoneNumber, limit = 10) {
        const entries = this.getEntriesByPhone(phoneNumber);
        return entries
            .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
            .slice(0, limit);
    }
    
    // Delete last entry
    deleteLastEntry(phoneNumber) {
        const entries = this.getEntriesByPhone(phoneNumber);
        if (entries.length === 0) {
            return null;
        }
        
        // Sort by date to get the last one
        entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const lastEntry = entries.shift(); // Remove the first (most recent)
        
        this.khataEntries.set(phoneNumber, entries);
        return lastEntry;
    }
    
    // Get total credit and debit
    getTotals(phoneNumber) {
        const entries = this.getEntriesByPhone(phoneNumber);
        let totalCredit = 0;
        let totalDebit = 0;
        
        for (const entry of entries) {
            if (entry.type === 'credit') {
                totalCredit += entry.amount;
            } else {
                totalDebit += entry.amount;
            }
        }
        
        return { totalCredit, totalDebit, totalEntries: entries.length };
    }
    
    // ==================== UTILITY METHODS ====================
    
    // Get all users (for debugging)
    getAllUsers() {
        return Array.from(this.users.values());
    }
    
    // Get all entries (for debugging)
    getAllEntries() {
        const allEntries = [];
        for (const entries of this.khataEntries.values()) {
            allEntries.push(...entries);
        }
        return allEntries;
    }
    
    // Clear all data
    clearAll() {
        this.users.clear();
        this.khataEntries.clear();
        this.entryIdCounter = 1;
        console.log('🗑️ All data cleared');
    }
    
    // Get storage stats
    getStats() {
        return {
            totalUsers: this.users.size,
            totalEntries: this.getAllEntries().length,
            memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024
        };
    }
}

// Export singleton instance
module.exports = new LocalStore();
