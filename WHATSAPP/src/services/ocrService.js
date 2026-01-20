const Tesseract = require('tesseract.js');
const axios = require('axios');
const config = require('../../config');
const path = require('path');

/**
 * OCR Service using Tesseract.js
 * Handles image text extraction from WhatsApp images
 * Special support for Aadhaar Card parsing
 */
class OCRService {
    constructor() {
        // Twilio credentials for authenticated media download
        this.twilioAccountSid = config.twilio.accountSid;
        this.twilioAuthToken = config.twilio.authToken;
        
        // Path to trained data files (for Hindi + English)
        this.langPath = path.join(process.cwd());
        
        console.log('✅ OCR Service (Tesseract.js) enabled');
        console.log('📄 Aadhaar Card parsing supported');
    }

    /**
     * Download image from Twilio media URL
     * @param {string} mediaUrl - The Twilio media URL
     * @returns {Buffer} - Image data buffer
     */
    async downloadImage(mediaUrl) {
        try {
            console.log('📥 Downloading image from Twilio...');
            const response = await axios.get(mediaUrl, {
                auth: {
                    username: this.twilioAccountSid,
                    password: this.twilioAuthToken
                },
                responseType: 'arraybuffer'
            });
            console.log('✅ Image downloaded successfully, size:', response.data.length, 'bytes');
            return response.data;
        } catch (error) {
            console.error('❌ Error downloading image:', error.message);
            return null;
        }
    }

    /**
     * Extract text from image using Tesseract OCR
     * @param {Buffer} imageBuffer - Image data buffer
     * @param {string} language - Language code (default: 'eng+hin' for English and Hindi)
     * @returns {object} - { text: string, confidence: number }
     */
    async extractText(imageBuffer, language = 'eng+hin') {
        try {
            console.log('🔍 Extracting text with Tesseract OCR...');
            
            const result = await Tesseract.recognize(
                imageBuffer,
                language,
                {
                    langPath: this.langPath,
                    logger: (info) => {
                        if (info.status === 'recognizing text' && info.progress === 1) {
                            console.log('📄 OCR processing complete');
                        }
                    }
                }
            );

            const extractedText = result.data.text.trim();
            const confidence = result.data.confidence;

            console.log(`✅ OCR Result (${confidence.toFixed(1)}% confidence):`, 
                extractedText.substring(0, 100) + (extractedText.length > 100 ? '...' : ''));

            return {
                text: extractedText,
                confidence: confidence,
                words: result.data.words?.length || 0
            };

        } catch (error) {
            console.error('❌ OCR extraction error:', error.message);
            return {
                text: '',
                confidence: 0,
                error: error.message
            };
        }
    }

    /**
     * Check if text contains Aadhaar card indicators
     * @param {string} text - Extracted text
     * @returns {boolean}
     */
    isAadhaarCard(text) {
        const lowerText = text.toLowerCase();
        const aadhaarIndicators = [
            'aadhaar', 'आधार', 'uidai', 
            'government of india', 'भारत सरकार',
            'unique identification', 'enrollment',
            'male', 'female', 'पुरुष', 'महिला',
            /\d{4}\s*\d{4}\s*\d{4}/ // Aadhaar number pattern
        ];

        for (const indicator of aadhaarIndicators) {
            if (indicator instanceof RegExp) {
                if (indicator.test(text)) return true;
            } else if (lowerText.includes(indicator)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Parse Aadhaar card details from OCR text
     * @param {string} text - Extracted text from Aadhaar card
     * @returns {object} - Parsed Aadhaar details
     */
    parseAadhaarCard(text) {
        const aadhaar = {
            isAadhaar: true,
            aadhaarNumber: null,
            name: null,
            nameHindi: null,
            dob: null,
            yearOfBirth: null,
            gender: null,
            address: null,
            pincode: null,
            fatherName: null,
            confidence: 0
        };

        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        
        // Extract Aadhaar Number (12 digits, may have spaces)
        const aadhaarPattern = /(\d{4}[\s-]?\d{4}[\s-]?\d{4})/g;
        const aadhaarMatch = text.match(aadhaarPattern);
        if (aadhaarMatch) {
            // Get the one that looks most like an Aadhaar (12 digits)
            for (const match of aadhaarMatch) {
                const digits = match.replace(/[\s-]/g, '');
                if (digits.length === 12) {
                    aadhaar.aadhaarNumber = digits.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
                    aadhaar.confidence += 30;
                    break;
                }
            }
        }

        // Extract DOB (multiple formats)
        const dobPatterns = [
            /DOB[:\s]*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i,
            /Date of Birth[:\s]*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i,
            /जन्म तिथि[:\s]*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/,
            /(\d{2}[\/\-]\d{2}[\/\-]\d{4})/
        ];
        
        for (const pattern of dobPatterns) {
            const dobMatch = text.match(pattern);
            if (dobMatch) {
                aadhaar.dob = dobMatch[1];
                aadhaar.confidence += 15;
                break;
            }
        }

        // Extract Year of Birth
        const yobPatterns = [
            /Year of Birth[:\s]*(\d{4})/i,
            /YOB[:\s]*(\d{4})/i,
            /जन्म वर्ष[:\s]*(\d{4})/
        ];
        
        for (const pattern of yobPatterns) {
            const yobMatch = text.match(pattern);
            if (yobMatch) {
                aadhaar.yearOfBirth = yobMatch[1];
                aadhaar.confidence += 10;
                break;
            }
        }

        // Extract Gender
        const genderPatterns = [
            { pattern: /\b(MALE|पुरुष)\b/i, value: 'Male' },
            { pattern: /\b(FEMALE|महिला|स्त्री)\b/i, value: 'Female' },
            { pattern: /\bTRANSGENDER\b/i, value: 'Other' }
        ];
        
        for (const { pattern, value } of genderPatterns) {
            if (pattern.test(text)) {
                aadhaar.gender = value;
                aadhaar.confidence += 15;
                break;
            }
        }

        // Extract Name (usually after "To" or before DOB/Gender line)
        // Look for lines that seem like names (proper capitalization, no numbers)
        const namePattern = /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})$/;
        const hindiNamePattern = /^([\u0900-\u097F\s]+)$/;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Skip common header lines
            if (line.toLowerCase().includes('government') || 
                line.toLowerCase().includes('india') ||
                line.toLowerCase().includes('aadhaar') ||
                line.toLowerCase().includes('uidai') ||
                line.includes('भारत सरकार')) {
                continue;
            }

            // Check for English name
            if (!aadhaar.name && namePattern.test(line)) {
                aadhaar.name = line;
                aadhaar.confidence += 20;
            }

            // Check for Hindi name
            if (!aadhaar.nameHindi && hindiNamePattern.test(line) && line.length > 3) {
                aadhaar.nameHindi = line;
            }

            // Check for S/O, D/O, W/O (Father's/Husband's name)
            const relationMatch = line.match(/(?:S\/O|D\/O|W\/O|C\/O)[:\s]*(.+)/i);
            if (relationMatch) {
                aadhaar.fatherName = relationMatch[1].trim();
                aadhaar.confidence += 10;
            }
        }

        // Extract Address and Pincode
        const pincodeMatch = text.match(/(\d{6})/);
        if (pincodeMatch) {
            aadhaar.pincode = pincodeMatch[1];
            aadhaar.confidence += 10;
        }

        // Try to find address (lines containing common address keywords)
        const addressKeywords = ['house', 'street', 'road', 'lane', 'nagar', 'colony', 
                                  'sector', 'block', 'ward', 'village', 'town', 'city',
                                  'district', 'state', 'गली', 'मकान', 'नगर', 'जिला'];
        
        const addressLines = [];
        for (const line of lines) {
            const lowerLine = line.toLowerCase();
            if (addressKeywords.some(kw => lowerLine.includes(kw))) {
                addressLines.push(line);
            }
        }
        
        if (addressLines.length > 0) {
            aadhaar.address = addressLines.join(', ');
        }

        return aadhaar;
    }

    /**
     * Format Aadhaar card details for display
     * @param {object} aadhaar - Parsed Aadhaar details
     * @returns {string} - Formatted message
     */
    formatAadhaarResponse(aadhaar) {
        let response = `🪪 *AADHAAR CARD DETECTED*\n`;
        response += `━━━━━━━━━━━━━━━━━━━━\n\n`;

        if (aadhaar.aadhaarNumber) {
            // Mask middle digits for privacy
            const masked = aadhaar.aadhaarNumber.replace(/(\d{4})\s(\d{4})\s(\d{4})/, '$1 XXXX $3');
            response += `🔢 *Aadhaar No:* ${masked}\n`;
        }

        if (aadhaar.name) {
            response += `👤 *Name:* ${aadhaar.name}\n`;
        }

        if (aadhaar.nameHindi) {
            response += `👤 *नाम:* ${aadhaar.nameHindi}\n`;
        }

        if (aadhaar.fatherName) {
            response += `👨 *S/O, D/O:* ${aadhaar.fatherName}\n`;
        }

        if (aadhaar.dob) {
            response += `📅 *DOB:* ${aadhaar.dob}\n`;
        } else if (aadhaar.yearOfBirth) {
            response += `📅 *Year of Birth:* ${aadhaar.yearOfBirth}\n`;
        }

        if (aadhaar.gender) {
            const genderEmoji = aadhaar.gender === 'Male' ? '♂️' : aadhaar.gender === 'Female' ? '♀️' : '⚧️';
            response += `${genderEmoji} *Gender:* ${aadhaar.gender}\n`;
        }

        if (aadhaar.address) {
            response += `📍 *Address:* ${aadhaar.address}\n`;
        }

        if (aadhaar.pincode) {
            response += `📮 *Pincode:* ${aadhaar.pincode}\n`;
        }

        response += `\n━━━━━━━━━━━━━━━━━━━━\n`;
        response += `📊 *Confidence:* ${aadhaar.confidence}%\n\n`;
        
        response += `💡 *Want to use this for registration?*\n`;
        response += `Type *REGISTER* to start and this info will be used!\n`;
        response += `\n⚠️ *Privacy Note:* Aadhaar number is partially masked for security.`;

        return response;
    }

    /**
     * Process image message from WhatsApp
     * @param {object} params - Twilio message parameters
     * @returns {object} - { text: string, notice: string, isImage: boolean }
     */
    async processImageMessage(params) {
        const { MediaUrl0, MediaContentType0 } = params;

        console.log(`🖼️ Processing image: ${MediaContentType0}`);

        if (!MediaUrl0) {
            return {
                text: '',
                notice: '❌ No image URL found',
                isImage: true,
                success: false
            };
        }

        // Download the image
        const imageBuffer = await this.downloadImage(MediaUrl0);

        if (!imageBuffer) {
            return {
                text: '',
                notice: '❌ Failed to download image',
                isImage: true,
                success: false
            };
        }

        // Extract text using OCR
        const ocrResult = await this.extractText(imageBuffer);

        if (!ocrResult.text || ocrResult.text.length === 0) {
            return {
                text: '',
                notice: '🖼️ Image received but no text could be extracted.\n\nTry sending a clearer image with visible text.',
                isImage: true,
                success: false
            };
        }

        // Check if it's an Aadhaar card
        if (this.isAadhaarCard(ocrResult.text)) {
            console.log('🪪 Aadhaar card detected!');
            const aadhaarData = this.parseAadhaarCard(ocrResult.text);
            
            return {
                text: ocrResult.text,
                notice: this.formatAadhaarResponse(aadhaarData),
                isImage: true,
                success: true,
                isAadhaar: true,
                aadhaarData: aadhaarData,
                confidence: ocrResult.confidence
            };
        }

        // Parse the extracted text to find useful data
        const parsedData = this.parseExtractedText(ocrResult.text);

        return {
            text: ocrResult.text,
            notice: `🖼️ *Image OCR Result* (${ocrResult.confidence.toFixed(0)}% confidence)\n\n"${ocrResult.text.substring(0, 500)}${ocrResult.text.length > 500 ? '...' : ''}"`,
            isImage: true,
            success: true,
            parsedData: parsedData,
            confidence: ocrResult.confidence
        };
    }

    /**
     * Parse extracted text to find useful data (amounts, dates, names)
     * @param {string} text - Extracted text from OCR
     * @returns {object} - Parsed data
     */
    parseExtractedText(text) {
        const parsed = {
            amounts: [],
            dates: [],
            phoneNumbers: [],
            possibleNames: []
        };

        // Extract amounts (Indian currency format)
        const amountPatterns = [
            /₹\s*([\d,]+\.?\d*)/g,
            /Rs\.?\s*([\d,]+\.?\d*)/gi,
            /INR\s*([\d,]+\.?\d*)/gi,
            /(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:rupees?|rs)/gi
        ];

        for (const pattern of amountPatterns) {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const amount = parseFloat(match[1].replace(/,/g, ''));
                if (amount > 0 && !parsed.amounts.includes(amount)) {
                    parsed.amounts.push(amount);
                }
            }
        }

        // Also look for standalone numbers that could be amounts
        const standaloneNumbers = text.match(/\b(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\b/g);
        if (standaloneNumbers) {
            for (const numStr of standaloneNumbers) {
                const num = parseFloat(numStr.replace(/,/g, ''));
                if (num >= 100 && num <= 10000000 && !parsed.amounts.includes(num)) {
                    parsed.amounts.push(num);
                }
            }
        }

        // Extract dates
        const datePatterns = [
            /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/g,
            /(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{2,4})/gi
        ];

        for (const pattern of datePatterns) {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                if (!parsed.dates.includes(match[1])) {
                    parsed.dates.push(match[1]);
                }
            }
        }

        // Extract phone numbers (Indian format)
        const phonePattern = /(?:\+91|91)?[-\s]?([6-9]\d{9})/g;
        let phoneMatch;
        while ((phoneMatch = phonePattern.exec(text)) !== null) {
            if (!parsed.phoneNumbers.includes(phoneMatch[1])) {
                parsed.phoneNumbers.push(phoneMatch[1]);
            }
        }

        return parsed;
    }

    /**
     * Check if the message contains an image
     * @param {object} params - Twilio message parameters
     * @returns {boolean}
     */
    isImageMessage(params) {
        const numMedia = parseInt(params.NumMedia) || 0;
        if (numMedia === 0) return false;

        const mediaType = params.MediaContentType0 || '';
        return mediaType.includes('image');
    }

    /**
     * Format OCR result for display with parsed data
     * @param {object} ocrResult - OCR processing result
     * @returns {string} - Formatted message
     */
    formatOCRResponse(ocrResult) {
        // If it's an Aadhaar card, the notice already contains formatted response
        if (ocrResult.isAadhaar) {
            return ocrResult.notice;
        }

        let response = ocrResult.notice;

        if (ocrResult.parsedData) {
            const { amounts, dates, phoneNumbers } = ocrResult.parsedData;

            if (amounts.length > 0) {
                response += `\n\n💰 *Amounts Found:*\n`;
                amounts.slice(0, 5).forEach(amt => {
                    response += `• ₹${amt.toLocaleString('en-IN')}\n`;
                });
            }

            if (dates.length > 0) {
                response += `\n📅 *Dates Found:*\n`;
                dates.slice(0, 3).forEach(date => {
                    response += `• ${date}\n`;
                });
            }

            if (phoneNumbers.length > 0) {
                response += `\n📱 *Phone Numbers Found:*\n`;
                phoneNumbers.slice(0, 3).forEach(phone => {
                    response += `• ${phone}\n`;
                });
            }
        }

        response += `\n\n💡 *Tip:* You can use the extracted text/amounts to add entries to your Khata!`;

        return response;
    }
}

module.exports = new OCRService();
