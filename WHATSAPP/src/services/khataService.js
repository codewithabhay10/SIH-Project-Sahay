const localStore = require('../storage/localStore');

// Khata command steps
const KHATA_STEPS = {
    add_entry: {
        type: { prompt: 'Select transaction type:\n1. Credit (Money In) ➕\n2. Debit (Money Out) ➖', next: 'amount' },
        amount: { prompt: 'Enter the amount (in ₹):', next: 'description' },
        description: { prompt: 'Enter description/purpose:', next: 'category' },
        category: { prompt: 'Select category:\n1. Income\n2. Expense\n3. Loan Given\n4. Loan Taken\n5. Repayment\n6. Savings\n7. Other', next: 'party' },
        party: { prompt: 'Enter party name (or type "skip"):', next: 'confirm' },
        confirm: { prompt: null, next: null }
    }
};

class KhataService {
    // Get user's current balance
    async getBalance(phoneNumber) {
        return localStore.getBalance(phoneNumber);
    }
    
    // Add new khata entry
    async addEntry(phoneNumber, entryData) {
        return localStore.addEntry(phoneNumber, entryData);
    }
    
    // Get recent entries
    async getRecentEntries(phoneNumber, limit = 10) {
        return localStore.getRecentEntries(phoneNumber, limit);
    }
    
    // Format entry for display
    formatEntry(entry, index) {
        const typeEmoji = entry.type === 'credit' ? '➕' : '➖';
        const date = new Date(entry.transactionDate).toLocaleDateString('en-IN');
        return `${index}. ${typeEmoji} ₹${entry.amount.toLocaleString('en-IN')} - ${entry.description}\n   📅 ${date} | Balance: ₹${entry.balanceAfter.toLocaleString('en-IN')}`;
    }
    
    // Get khata summary
    async getSummary(phoneNumber) {
        const user = localStore.findUserByPhone(phoneNumber);
        if (!user) {
            return 'User not found. Please register first.';
        }
        
        const balance = localStore.getBalance(phoneNumber);
        const entries = localStore.getRecentEntries(phoneNumber, 5);
        const { totalCredit, totalDebit, totalEntries } = localStore.getTotals(phoneNumber);
        
        let message = `📒 *Digital Khata Summary*\n\n`;
        message += `👤 ${user.name}\n`;
        message += `━━━━━━━━━━━━━━━━━━\n`;
        message += `💰 *Current Balance:* ₹${balance.toLocaleString('en-IN')}\n`;
        message += `➕ Total Credit: ₹${totalCredit.toLocaleString('en-IN')}\n`;
        message += `➖ Total Debit: ₹${totalDebit.toLocaleString('en-IN')}\n`;
        message += `📊 Total Entries: ${totalEntries}\n`;
        message += `━━━━━━━━━━━━━━━━━━\n\n`;
        
        if (entries.length > 0) {
            message += `📋 *Recent Transactions:*\n\n`;
            entries.forEach((entry, index) => {
                message += this.formatEntry(entry, index + 1) + '\n\n';
            });
        } else {
            message += `No transactions yet.\n`;
        }
        
        message += `\nType *ADD* to add a new entry`;
        
        return message;
    }
    
    // Start add entry process
    async startAddEntry(phoneNumber) {
        const user = localStore.findUserByPhone(phoneNumber);
        if (!user) {
            return { success: false, message: 'Please register first by typing REGISTER' };
        }
        
        localStore.updateUser(phoneNumber, {
            conversationState: 'adding_entry',
            tempData: { step: 'type' }
        });
        
        return {
            success: true,
            message: KHATA_STEPS.add_entry.type.prompt
        };
    }
    
    // Process add entry step
    async processAddEntryStep(phoneNumber, input) {
        const user = localStore.findUserByPhone(phoneNumber);
        if (!user) {
            return { success: false, message: 'User not found.' };
        }
        
        const step = user.tempData?.step || 'type';
        const trimmedInput = input ? input.trim() : '1000';
        
        switch (step) {
            case 'type':
                const typeMap = { '1': 'credit', '2': 'debit' };
                // Default to credit if voice/invalid input
                const type = typeMap[trimmedInput] || typeMap[trimmedInput.charAt(0)] || 'credit';
                localStore.updateUser(phoneNumber, {
                    tempData: { ...user.tempData, type, step: 'amount' }
                });
                return { success: true, message: KHATA_STEPS.add_entry.amount.prompt };
                
            case 'amount':
                // Parse amount, default to 1000 for voice messages
                const amount = parseFloat(trimmedInput.replace(/[₹,]/g, '')) || 1000;
                localStore.updateUser(phoneNumber, {
                    tempData: { ...user.tempData, amount: Math.max(amount, 1), step: 'description' }
                });
                return { success: true, message: KHATA_STEPS.add_entry.description.prompt };
                
            case 'description':
                // Accept any description, default if empty
                const description = trimmedInput.length >= 1 ? trimmedInput : 'Voice entry';
                localStore.updateUser(phoneNumber, {
                    tempData: { ...user.tempData, description, step: 'category' }
                });
                return { success: true, message: KHATA_STEPS.add_entry.category.prompt };
                
            case 'category':
                const categoryMap = {
                    '1': 'income', '2': 'expense', '3': 'loan_given',
                    '4': 'loan_taken', '5': 'repayment', '6': 'savings', '7': 'other'
                };
                const category = categoryMap[trimmedInput] || categoryMap[trimmedInput.charAt(0)] || 'other';
                localStore.updateUser(phoneNumber, {
                    tempData: { ...user.tempData, category, step: 'party' }
                });
                return { success: true, message: KHATA_STEPS.add_entry.party.prompt };
                
            case 'party':
                const partyName = (trimmedInput.toLowerCase() === 'skip' || trimmedInput === '1000') ? 'N/A' : trimmedInput;
                const updatedUser = localStore.findUserByPhone(phoneNumber);
                const entryData = { ...updatedUser.tempData, partyName };
                
                // Create the entry
                try {
                    const entry = localStore.addEntry(phoneNumber, entryData);
                    
                    // Reset user state
                    localStore.updateUser(phoneNumber, {
                        conversationState: 'idle',
                        tempData: {}
                    });
                    
                    const typeEmoji = entry.type === 'credit' ? '➕' : '➖';
                    return {
                        success: true,
                        completed: true,
                        message: `✅ *Entry Added Successfully!*\n\n` +
                            `${typeEmoji} Amount: ₹${entry.amount.toLocaleString('en-IN')}\n` +
                            `📝 Description: ${entry.description}\n` +
                            `💰 New Balance: ₹${entry.balanceAfter.toLocaleString('en-IN')}\n\n` +
                            `Type *KHATA* to view your ledger.`
                    };
                } catch (error) {
                    console.error('Error adding entry:', error);
                    // Reset state on error
                    localStore.updateUser(phoneNumber, {
                        conversationState: 'idle',
                        tempData: {}
                    });
                    return { success: false, message: 'Error adding entry. Type *ADD* to try again.' };
                }
                
            default:
                // Reset and return to idle
                localStore.updateUser(phoneNumber, {
                    conversationState: 'idle',
                    tempData: {}
                });
                return { success: false, message: 'Unknown step. Type *ADD* to start over.' };
        }
    }
    
    // Delete last entry
    async deleteLastEntry(phoneNumber) {
        const lastEntry = localStore.deleteLastEntry(phoneNumber);
        
        if (!lastEntry) {
            return { success: false, message: 'No entries to delete.' };
        }
        
        return {
            success: true,
            message: `🗑️ Deleted entry: ₹${lastEntry.amount.toLocaleString('en-IN')} - ${lastEntry.description}`
        };
    }
}

module.exports = new KhataService();
