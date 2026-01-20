const axios = require('axios');
const Groq = require('groq-sdk');
const { toFile } = require('groq-sdk');
const config = require('../../config');
const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Speech to Text Service using Groq Whisper API
 * Handles voice message transcription from WhatsApp
 */
class SpeechService {
    constructor() {
        // Twilio credentials for authenticated media download
        this.twilioAccountSid = config.twilio.accountSid;
        this.twilioAuthToken = config.twilio.authToken;

        // Initialize Groq client
        this.groqApiKey = config.groq.apiKey;
        this.groq = (this.groqApiKey && this.groqApiKey !== 'your_groq_api_key_here') 
            ? new Groq({ apiKey: this.groqApiKey }) 
            : null;

        if (this.groq) {
            console.log('✅ Groq Speech-to-Text enabled');
        } else {
            console.log('⚠️ Groq API key not set - using fallback defaults for voice');
        }

        // Voice command mappings - what users might say
        this.voiceCommands = {
            // Menu commands - Numbers
            '1': 'REGISTER', 'one': 'REGISTER', 'ek': 'REGISTER', 'first': 'REGISTER', 'pehla': 'REGISTER',
            '2': 'KHATA', 'two': 'KHATA', 'do': 'KHATA', 'second': 'KHATA', 'doosra': 'KHATA',
            '3': 'ADD', 'three': 'ADD', 'teen': 'ADD', 'third': 'ADD', 'teesra': 'ADD',
            '4': 'PROFILE', 'four': 'PROFILE', 'char': 'PROFILE', 'fourth': 'PROFILE', 'chautha': 'PROFILE',
            '5': 'BALANCE', 'five': 'BALANCE', 'paanch': 'BALANCE', 'fifth': 'BALANCE',
            '6': 'DELETE', 'six': 'DELETE', 'chhe': 'DELETE', 'sixth': 'DELETE',
            '7': 'HELP', 'seven': 'HELP', 'saat': 'HELP', 'seventh': 'HELP',

            // Word commands
            'register': 'REGISTER', 'registration': 'REGISTER', 'signup': 'REGISTER', 'join': 'REGISTER',
            'khata': 'KHATA', 'ledger': 'KHATA', 'bahi': 'KHATA', 'record': 'KHATA', 'history': 'KHATA',
            'add': 'ADD', 'new': 'ADD', 'entry': 'ADD', 'naya': 'ADD', 'jodo': 'ADD',
            'profile': 'PROFILE', 'details': 'PROFILE', 'mera': 'PROFILE',
            'balance': 'BALANCE', 'money': 'BALANCE', 'paisa': 'BALANCE', 'kitna': 'BALANCE', 'total': 'BALANCE',
            'delete': 'DELETE', 'remove': 'DELETE', 'hatao': 'DELETE',
            'help': 'HELP', 'madad': 'HELP', 'sahayata': 'HELP',
            'menu': 'MENU', 'home': 'MENU', 'start': 'MENU', 'hi': 'MENU', 'hello': 'MENU', 'namaste': 'MENU',
            'cancel': 'CANCEL', 'band': 'CANCEL', 'ruko': 'CANCEL',

            // Yes/No responses
            'yes': 'YES', 'haan': 'YES', 'ha': 'YES', 'ok': 'YES', 'okay': 'YES', 'theek': 'YES', 'sahi': 'YES',
            'no': 'NO', 'nahi': 'NO', 'na': 'NO', 'nope': 'NO', 'mat': 'NO',
            'skip': 'skip', 'chhodo': 'skip', 'aage': 'skip'
        };

        // Gender mappings
        this.genderCommands = {
            'male': '1', 'man': '1', 'boy': '1', 'ladka': '1', 'purush': '1', 'aadmi': '1',
            'female': '2', 'woman': '2', 'girl': '2', 'ladki': '2', 'mahila': '2', 'aurat': '2',
            'other': '3', 'others': '3', 'anya': '3',
            'prefer not': '4', 'private': '4', 'secret': '4'
        };

        // Transaction type mappings
        this.transactionCommands = {
            'credit': '1', 'income': '1', 'received': '1', 'aaya': '1', 'mila': '1', 'jama': '1', 'plus': '1',
            'debit': '2', 'expense': '2', 'spent': '2', 'gaya': '2', 'kharch': '2', 'minus': '2', 'paid': '2'
        };

        // Category mappings
        this.categoryCommands = {
            'income': '1', 'salary': '1', 'tankhwah': '1', 'kamai': '1',
            'expense': '2', 'kharch': '2', 'kharcha': '2',
            'loan given': '3', 'udhar diya': '3', 'lent': '3',
            'loan taken': '4', 'udhar liya': '4', 'borrowed': '4',
            'repayment': '5', 'wapsi': '5', 'return': '5',
            'savings': '6', 'bachat': '6', 'save': '6',
            'other': '7', 'anya': '7', 'misc': '7'
        };
    }

    /**
     * Download audio from Twilio media URL
     * @param {string} mediaUrl - The Twilio media URL
     * @returns {Buffer} - Audio data buffer
     */
    async downloadAudio(mediaUrl) {
        try {
            console.log('📥 Downloading audio from Twilio...');
            const response = await axios.get(mediaUrl, {
                auth: {
                    username: this.twilioAccountSid,
                    password: this.twilioAuthToken
                },
                responseType: 'arraybuffer'
            });
            console.log('✅ Audio downloaded successfully, size:', response.data.length, 'bytes');
            return response.data;
        } catch (error) {
            console.error('❌ Error downloading audio:', error.message);
            return null;
        }
    }

    /**
     * Transcribe audio using Groq Whisper API
     * @param {Buffer} audioBuffer - Audio data buffer
     * @param {string} contentType - Audio content type (e.g., audio/ogg)
     * @returns {string} - Transcribed text
     */
    async transcribeWithGroq(audioBuffer, contentType) {
        if (!this.groq) {
            console.log('⚠️ Groq API not configured');
            return null;
        }

        try {
            // Determine file extension from content type
            let extension = 'ogg';
            let filename = 'audio.ogg';
            if (contentType.includes('mp3')) { extension = 'mp3'; filename = 'audio.mp3'; }
            else if (contentType.includes('wav')) { extension = 'wav'; filename = 'audio.wav'; }
            else if (contentType.includes('m4a')) { extension = 'm4a'; filename = 'audio.m4a'; }
            else if (contentType.includes('webm')) { extension = 'webm'; filename = 'audio.webm'; }
            else if (contentType.includes('opus')) { extension = 'ogg'; filename = 'audio.ogg'; }

            console.log('🎙️ Transcribing with Groq Whisper...');
            
            // Use toFile helper to convert buffer to file object
            const audioFile = await toFile(audioBuffer, filename);
            
            const transcription = await this.groq.audio.transcriptions.create({
                file: audioFile,
                model: 'whisper-large-v3-turbo', // Faster and cheaper
                response_format: 'text'
            });

            // Handle different response formats
            let result;
            if (typeof transcription === 'string') {
                result = transcription;
            } else if (transcription && transcription.text) {
                result = transcription.text;
            } else {
                result = String(transcription);
            }

            console.log('✅ Transcription result:', result);
            return result ? result.trim() : null;

        } catch (error) {
            console.error('❌ Groq transcription error:', error.message);
            if (error.response) {
                console.error('Response status:', error.response.status);
            }
            return null;
        }
    }

    /**
     * Parse transcribed text to find matching command
     * @param {string} text - Transcribed text
     * @param {object} context - User context
     * @returns {object} - Parsed result
     */
    parseTranscription(text, context) {
        if (!text) return null;

        const lowerText = text.toLowerCase().trim();
        console.log(`🔍 Parsing transcription: "${lowerText}"`);

        const { step, state } = context;

        // Check for menu commands first (for idle/menu state)
        if (state === 'idle' || state === 'menu' || !state) {
            for (const [phrase, command] of Object.entries(this.voiceCommands)) {
                if (lowerText.includes(phrase)) {
                    console.log(`✅ Matched menu command: ${phrase} → ${command}`);
                    return { value: command, matched: phrase };
                }
            }
        }

        // Context-specific parsing
        if (state === 'registering') {
            // Gender step
            if (step === 'gender') {
                for (const [phrase, value] of Object.entries(this.genderCommands)) {
                    if (lowerText.includes(phrase)) {
                        return { value, matched: phrase };
                    }
                }
            }
            
            // Age step - extract number
            if (step === 'age') {
                const age = this.extractNumber(lowerText);
                if (age && age > 0 && age < 150) {
                    return { value: String(age), matched: 'age' };
                }
            }

            // Income step - extract amount
            if (step === 'income') {
                const amount = this.extractAmount(lowerText);
                if (amount) {
                    return { value: String(amount), matched: 'income' };
                }
            }

            // For other registration steps, return the transcribed text as-is
            return { value: text.trim(), matched: 'direct_input' };
        }

        if (state === 'adding_entry') {
            // Transaction type step
            if (step === 'type') {
                for (const [phrase, value] of Object.entries(this.transactionCommands)) {
                    if (lowerText.includes(phrase)) {
                        return { value, matched: phrase };
                    }
                }
                // Default to credit if not matched
                return { value: '1', matched: 'default_credit' };
            }
            
            // Category step
            if (step === 'category') {
                for (const [phrase, value] of Object.entries(this.categoryCommands)) {
                    if (lowerText.includes(phrase)) {
                        return { value, matched: phrase };
                    }
                }
            }
            
            // Amount step - extract numbers
            if (step === 'amount') {
                const amount = this.extractAmount(lowerText);
                if (amount) {
                    return { value: String(amount), matched: 'amount' };
                }
            }
            
            // For other steps, return transcribed text
            return { value: text.trim(), matched: 'direct_input' };
        }

        // Check for yes/no/cancel commands
        for (const [phrase, command] of Object.entries(this.voiceCommands)) {
            if (lowerText.includes(phrase)) {
                return { value: command, matched: phrase };
            }
        }

        // Default: return the transcribed text
        return { value: text.trim(), matched: 'direct_input' };
    }

    /**
     * Extract a number from text
     */
    extractNumber(text) {
        const digitMatch = text.match(/\d+/);
        if (digitMatch) {
            return parseInt(digitMatch[0]);
        }
        return null;
    }

    /**
     * Extract amount from spoken text
     * @param {string} text - Spoken text
     * @returns {number|null}
     */
    extractAmount(text) {
        // First try to extract digits
        const digitMatch = text.match(/[\d,]+/);
        if (digitMatch) {
            return parseInt(digitMatch[0].replace(/,/g, ''));
        }

        // Number words mapping
        const numberWords = {
            'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
            'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
            'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
            'hundred': 100, 'thousand': 1000, 'lakh': 100000,
            'ek': 1, 'do': 2, 'teen': 3, 'char': 4, 'paanch': 5,
            'sau': 100, 'hazaar': 1000, 'hazar': 1000
        };

        let total = 0;
        const words = text.toLowerCase().split(/\s+/);
        
        for (const word of words) {
            if (numberWords[word]) {
                if (word === 'hundred' || word === 'sau') {
                    total = total === 0 ? 100 : total * 100;
                } else if (word === 'thousand' || word === 'hazaar' || word === 'hazar') {
                    total = total === 0 ? 1000 : total * 1000;
                } else if (word === 'lakh') {
                    total = total === 0 ? 100000 : total * 100000;
                } else {
                    total += numberWords[word];
                }
            }
        }

        return total > 0 ? total : null;
    }

    /**
     * Get fallback default value when transcription fails
     */
    getFallbackDefault(context) {
        const { step, state, isRegistered } = context;

        // Menu state fallbacks
        if (state === 'idle' || !state) {
            return isRegistered
                ? { value: 'KHATA', message: '🎤 Voice received! Opening your Khata...' }
                : { value: 'REGISTER', message: '🎤 Voice received! Starting registration...' };
        }

        // Registration fallbacks
        const regDefaults = {
            'name': { value: 'Voice User', message: '🎤 Using "Voice User" as name.' },
            'age': { value: '25', message: '🎤 Using 25 as age.' },
            'dob': { value: '01/01/2000', message: '🎤 Using 01/01/2000 as DOB.' },
            'gender': { value: '4', message: '🎤 Using "Prefer not to say".' },
            'address': { value: 'Voice Address, City, 000000', message: '🎤 Using placeholder address.' },
            'income': { value: '25000', message: '🎤 Using ₹25,000 as income.' },
            'caste': { value: 'General', message: '🎤 Using "General" as caste.' },
            'occupation': { value: 'Professional', message: '🎤 Using "Professional".' },
            'education': { value: 'Graduate', message: '🎤 Using "Graduate".' }
        };

        // Khata fallbacks
        const khataDefaults = {
            'type': { value: '1', message: '🎤 Using "Credit" (money received).' },
            'amount': { value: '1000', message: '🎤 Using ₹1,000 as amount.' },
            'description': { value: 'Voice Entry', message: '🎤 Using "Voice Entry".' },
            'category': { value: '7', message: '🎤 Using "Other" category.' },
            'party': { value: 'Voice Contact', message: '🎤 Using "Voice Contact".' }
        };

        if (state === 'registering' && regDefaults[step]) {
            return regDefaults[step];
        }
        if (state === 'adding_entry' && khataDefaults[step]) {
            return khataDefaults[step];
        }

        return { value: 'MENU', message: '🎤 Voice received! Here\'s the menu.' };
    }

    /**
     * Process voice message - Main entry point
     * @param {object} params - Twilio message parameters
     * @param {object} userContext - User's conversation context
     * @returns {object} - { text: string, notice: string, isVoice: boolean }
     */
    async processVoiceMessage(params, userContext) {
        const { MediaUrl0, MediaContentType0 } = params;

        console.log(`🎤 Processing voice message: ${MediaContentType0}`);

        const currentStep = userContext.currentStep || userContext.tempData?.step || 'idle';
        const currentState = userContext.conversationState || 'idle';
        const isRegistered = userContext.registrationStatus === 'completed';

        const context = {
            step: currentStep,
            state: currentState,
            isRegistered
        };

        // Try to transcribe with Groq
        if (this.groq && MediaUrl0) {
            const audioBuffer = await this.downloadAudio(MediaUrl0);
            
            if (audioBuffer) {
                const transcription = await this.transcribeWithGroq(audioBuffer, MediaContentType0 || 'audio/ogg');
                
                if (transcription && transcription.trim()) {
                    const parsed = this.parseTranscription(transcription, context);
                    
                    if (parsed) {
                        return {
                            text: parsed.value,
                            notice: `🎤 You said: "${transcription.trim()}"`,
                            isVoice: true,
                            transcription: transcription.trim()
                        };
                    }
                }
            }
        }

        // Fallback to smart defaults
        console.log('⚠️ Using fallback defaults');
        const fallback = this.getFallbackDefault(context);
        
        return {
            text: fallback.value,
            notice: fallback.message,
            isVoice: true,
            transcription: null
        };
    }

    /**
     * Check if the message contains voice/audio
     * @param {object} params - Twilio message parameters
     * @returns {boolean}
     */
    isVoiceMessage(params) {
        const numMedia = parseInt(params.NumMedia) || 0;
        if (numMedia === 0) return false;

        const mediaType = params.MediaContentType0 || '';
        return mediaType.includes('audio') || mediaType.includes('ogg');
    }
}

module.exports = new SpeechService();
