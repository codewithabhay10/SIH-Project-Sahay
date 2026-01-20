/**
 * OCR Utility for Aadhaar Verification (LOCAL MOCK VERSION)
 * 
 * This is a mock implementation that simulates OCR without external APIs.
 * It generates realistic demo data for testing purposes.
 */

// Mock delay to simulate processing
const simulateOCRDelay = (): Promise<void> => {
    const delay = 1000 + Math.random() * 1500; // 1-2.5 seconds
    return new Promise((resolve) => setTimeout(resolve, delay));
};

// Demo Aadhaar data for simulation
const demoAadhaarCards = [
    {
        aadhaar: '295534461658',
        name: 'Abhay Madan',
        dob: '15/08/1998',
        gender: 'Male',
        phone: '9717766947',
    },
];

export interface AadhaarData {
    success: boolean;
    aadhaar?: string;        // 12-digit Aadhaar number
    name?: string;           // Name from card
    dob?: string;            // Date of birth
    gender?: string;         // Male/Female
    address?: string;        // Address if detected
    rawText?: string;        // Full OCR text
    error?: string;
}

/**
 * Extract Aadhaar data from image using MOCK OCR
 * @param imageUri - Local file URI of the Aadhaar card image (ignored in mock)
 */
export const extractAadhaarFromImage = async (imageUri: string): Promise<AadhaarData> => {
    try {
        // Simulate OCR processing delay
        await simulateOCRDelay();

        // Return a random demo Aadhaar card
        const randomCard = demoAadhaarCards[Math.floor(Math.random() * demoAadhaarCards.length)];

        console.log('Mock OCR: Extracted Aadhaar data:', randomCard);

        return {
            success: true,
            aadhaar: randomCard.aadhaar,
            name: randomCard.name,
            dob: randomCard.dob,
            gender: randomCard.gender,
            address: 'Village Demo, District Test, State Sample - 123456',
            rawText: `Government of India\n${randomCard.name}\nDOB: ${randomCard.dob}\n${randomCard.gender}\nAadhaar: ${randomCard.aadhaar}`,
        };
    } catch (error) {
        console.error('Mock OCR Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'OCR failed',
        };
    }
};

// Re-export the old function name for backward compatibility
export const extractTextFromImage = extractAadhaarFromImage;

/**
 * Validate Aadhaar number format (basic check)
 */
export const isValidAadhaar = (aadhaar: string): boolean => {
    const cleaned = aadhaar.replace(/\s/g, '');
    // Must be 12 digits, not start with 0 or 1
    return /^\d{12}$/.test(cleaned) && !cleaned.startsWith('0') && !cleaned.startsWith('1');
};

/**
 * Format Aadhaar for display (XXXX-XXXX-XXXX)
 */
export const formatAadhaar = (aadhaar: string): string => {
    const cleaned = aadhaar.replace(/\s/g, '');
    if (cleaned.length !== 12) return aadhaar;
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8, 12)}`;
};

/**
 * Mask Aadhaar for privacy (XXXX-XXXX-1234)
 */
export const maskAadhaar = (aadhaar: string): string => {
    const cleaned = aadhaar.replace(/\s/g, '');
    if (cleaned.length !== 12) return aadhaar;
    return `XXXX-XXXX-${cleaned.slice(-4)}`;
};

