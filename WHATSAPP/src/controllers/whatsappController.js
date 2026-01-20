const { userService, khataService } = require('../services');
const localStore = require('../storage/localStore');
const speechService = require('../services/speechService');
const ocrService = require('../services/ocrService');

// Main menu text
const MAIN_MENU = `
📱 *WhatsApp Digital Khata*
━━━━━━━━━━━━━━━━━━

*📋 COMMANDS:*
1️⃣ *REGISTER* - Register yourself
2️⃣ *KHATA* - View your khata/ledger
3️⃣ *ADD* - Add new transaction
4️⃣ *PROFILE* - View your profile
5️⃣ *BALANCE* - Check balance
6️⃣ *DELETE* - Delete last entry
7️⃣ *HELP* - Get help

━━━━━━━━━━━━━━━━━━
🎤 *VOICE INPUT*
_Speak commands or registration details!_
• Just send a voice message
• Works in Hindi & English

━━━━━━━━━━━━━━━━━━
🆔 *AADHAAR SCAN*
_Auto-fill registration with Aadhaar!_
• Send photo of your Aadhaar card
• Bot extracts Name, DOB, Address
• Use for quick registration

━━━━━━━━━━━━━━━━━━
Type a command, send voice, or scan Aadhaar! 📲
`;

const HELP_TEXT = `
📚 *Help Guide*
━━━━━━━━━━━━━━━━━━

*📋 TEXT COMMANDS:*
• MENU - Show main menu
• REGISTER - Start registration
• KHATA - View your digital ledger
• ADD - Add a new transaction
• PROFILE - View your profile
• BALANCE - Check current balance
• DELETE - Delete last entry
• CANCEL - Cancel current operation

━━━━━━━━━━━━━━━━━━
*🎤 VOICE COMMANDS:*
Send voice notes anytime!
• "I want to register" → Starts registration
• "Show my khata" → View ledger
• "Add 500 rupees" → Add entry
• "What's my balance" → Check balance
• Works in *Hindi* & *English*!

━━━━━━━━━━━━━━━━━━
*🆔 AADHAAR CARD SCAN:*
📸 Send photo of Aadhaar card to:
• Auto-extract Name, DOB, Gender
• Extract Address & Pincode
• Aadhaar number (masked for privacy)
• Use info for quick registration!

━━━━━━━━━━━━━━━━━━
*🖼️ OTHER IMAGE OCR:*
• Send any image with text
• Extracts text automatically
• Great for receipts & bills
• Detects amounts in ₹

━━━━━━━━━━━━━━━━━━
*💡 TIPS:*
• Complete registration first
• Voice & Aadhaar make it faster!
• Type MENU anytime for options

━━━━━━━━━━━━━━━━━━
`;

class WhatsAppController {
    // Handle incoming WhatsApp message
    async handleIncomingMessage(req, res) {
        try {
            const params = req.body;
            const { Body, From, To } = params;
            
            // Extract phone number (remove 'whatsapp:' prefix)
            const phoneNumber = From ? From.replace('whatsapp:', '') : '';
            
            // Get or create user first to get context
            const user = await userService.findOrCreateUser(phoneNumber);
            
            // Check if image was sent - process with OCR
            const isImageMessage = ocrService.isImageMessage(params);
            if (isImageMessage) {
                const ocrResult = await ocrService.processImageMessage(params);
                const responseMessage = ocrService.formatOCRResponse(ocrResult);
                
                const twiml = this.generateTwiML(responseMessage);
                res.type('text/xml');
                return res.send(twiml);
            }
            
            // Check if voice message was sent
            const isVoiceMessage = speechService.isVoiceMessage(params);
            
            let messageBody = '';
            let voiceNotice = '';
            
            if (isVoiceMessage) {
                // Process voice message with context-aware defaults
                const voiceResult = await speechService.processVoiceMessage(params, user);
                messageBody = voiceResult.text;
                voiceNotice = voiceResult.notice + '\n\n';
                console.log(`🎤 Voice message from ${phoneNumber} - Converted to: "${messageBody}"`);
            } else {
                messageBody = Body ? Body.trim() : '';
            }
            
            const messageUpper = messageBody.toUpperCase();
            
            console.log(`📩 Message from ${phoneNumber}: ${messageBody}`);
            
            let responseMessage = '';
            
            // Check if user is in a conversation flow
            if (user.conversationState === 'registering') {
                // Handle registration flow
                responseMessage = await this.handleRegistrationFlow(phoneNumber, messageBody, messageUpper);
            } else if (user.conversationState === 'adding_entry') {
                // Handle khata entry flow
                responseMessage = await this.handleKhataEntryFlow(phoneNumber, messageBody, messageUpper);
            } else {
                // Handle commands
                responseMessage = await this.handleCommand(phoneNumber, messageBody, messageUpper, user);
            }
            
            // Add voice notice if applicable
            if (isVoiceMessage && voiceNotice) {
                responseMessage = voiceNotice + responseMessage;
            }
            
            // Send TwiML response
            const twiml = this.generateTwiML(responseMessage);
            res.type('text/xml');
            res.send(twiml);
            
        } catch (error) {
            console.error('Error handling message:', error);
            const errorTwiml = this.generateTwiML('❌ Sorry, something went wrong. Please try again.\n\nType *MENU* to start over.');
            res.type('text/xml');
            res.send(errorTwiml);
        }
    }
    
    // Handle main commands
    async handleCommand(phoneNumber, messageBody, messageUpper, user) {
        // Cancel command - reset state
        if (messageUpper === 'CANCEL') {
            await userService.updateState(phoneNumber, 'idle');
            return '❌ Operation cancelled.\n\nType *MENU* to see options.';
        }
        
        // Menu command
        if (messageUpper === 'MENU' || messageUpper === 'HI' || messageUpper === 'HELLO' || messageUpper === 'START') {
            return MAIN_MENU;
        }
        
        // Help command
        if (messageUpper === 'HELP' || messageUpper === '7') {
            return HELP_TEXT;
        }
        
        // Register command
        if (messageUpper === 'REGISTER' || messageUpper === '1') {
            if (user.registrationStatus === 'completed') {
                return '✅ You are already registered!\n\nType *PROFILE* to view your details or *KHATA* to view your ledger.';
            }
            const result = await userService.startRegistration(phoneNumber);
            return result.message;
        }
        
        // Commands that require registration
        if (user.registrationStatus !== 'completed') {
            return '⚠️ Please complete registration first.\n\nType *REGISTER* to start.';
        }
        
        // Khata/Ledger command
        if (messageUpper === 'KHATA' || messageUpper === '2' || messageUpper === 'LEDGER') {
            return await khataService.getSummary(phoneNumber);
        }
        
        // Add entry command
        if (messageUpper === 'ADD' || messageUpper === '3') {
            const result = await khataService.startAddEntry(phoneNumber);
            return result.message;
        }
        
        // Profile command
        if (messageUpper === 'PROFILE' || messageUpper === '4') {
            const profile = await userService.getProfile(phoneNumber);
            return profile || 'Profile not found. Please register first.';
        }
        
        // Balance command
        if (messageUpper === 'BALANCE' || messageUpper === '5') {
            const balance = await khataService.getBalance(phoneNumber);
            return `💰 *Your Current Balance*\n\n₹${balance.toLocaleString('en-IN')}\n\nType *ADD* to add a transaction.`;
        }
        
        // Delete last entry command
        if (messageUpper === 'DELETE' || messageUpper === '6') {
            const result = await khataService.deleteLastEntry(phoneNumber);
            return result.message;
        }
        
        // Unknown command
        return `❓ I didn't understand that.\n\nType *MENU* to see available options or *HELP* for guidance.`;
    }
    
    // Handle registration conversation flow
    async handleRegistrationFlow(phoneNumber, messageBody, messageUpper) {
        // Allow cancel during registration
        if (messageUpper === 'CANCEL') {
            await userService.updateState(phoneNumber, 'idle');
            return '❌ Registration cancelled.\n\nType *REGISTER* to start again.';
        }
        
        const result = await userService.processRegistrationStep(phoneNumber, messageBody);
        return result.message;
    }
    
    // Handle khata entry conversation flow
    async handleKhataEntryFlow(phoneNumber, messageBody, messageUpper) {
        // Allow cancel during entry
        if (messageUpper === 'CANCEL') {
            await userService.updateState(phoneNumber, 'idle');
            localStore.updateUser(phoneNumber, { tempData: {} });
            return '❌ Entry cancelled.\n\nType *MENU* to see options.';
        }
        
        const result = await khataService.processAddEntryStep(phoneNumber, messageBody);
        return result.message;
    }
    
    // Generate TwiML response
    generateTwiML(message) {
        return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${this.escapeXml(message)}</Message>
</Response>`;
    }
    
    // Escape XML special characters
    escapeXml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }
}

module.exports = new WhatsAppController();
