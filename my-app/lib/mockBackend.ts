/**
 * Mock Backend API Service
 * Simulates backend API calls with realistic delays and responses
 * This creates the illusion of a real backend without needing a server
 */

import {
    MockUser,
    UserRole,
    findUserByPhone,
    addUserToDatabase,
    getUsersDatabase,
} from './mockData/users';
import {
    MockBeneficiary,
    findBeneficiaryByUserId,
    addBeneficiary,
    getBeneficiariesDatabase,
} from './mockData/beneficiaries';

// Simulate network delay (300-800ms like a real API)
const simulateNetworkDelay = (): Promise<void> => {
    const delay = 300 + Math.random() * 500;
    return new Promise((resolve) => setTimeout(resolve, delay));
};

// Generate a mock JWT token
const generateMockToken = (userId: string): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
        JSON.stringify({
            userId,
            iat: Date.now(),
            exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        })
    );
    const signature = btoa(`mock-signature-${userId}-${Date.now()}`);
    return `${header}.${payload}.${signature}`;
};

// Generate unique IDs
const generateId = (prefix: string): string => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ============================================
// AUTH API
// ============================================

interface LoginResponse {
    success: boolean;
    token?: string;
    user?: {
        id: string;
        phoneNumber: string;
        role: UserRole;
        name: string;
    };
    error?: string;
}

interface SignupResponse extends LoginResponse { }

/**
 * Mock Login API
 */
export const mockLogin = async (
    phoneNumber: string,
    password: string
): Promise<LoginResponse> => {
    await simulateNetworkDelay();

    const user = findUserByPhone(phoneNumber);

    if (!user) {
        return { success: false, error: 'User not found. Please sign up first.' };
    }

    if (user.password !== password) {
        return { success: false, error: 'Invalid password' };
    }

    const token = generateMockToken(user.id);

    return {
        success: true,
        token,
        user: {
            id: user.id,
            phoneNumber: user.phoneNumber,
            role: user.role,
            name: user.name,
        },
    };
};

/**
 * Mock Signup API
 */
export const mockSignup = async (
    phoneNumber: string,
    password: string,
    role: UserRole
): Promise<SignupResponse> => {
    await simulateNetworkDelay();

    // Check if user already exists
    const existingUser = findUserByPhone(phoneNumber);
    if (existingUser) {
        return { success: false, error: 'Phone number already registered' };
    }

    // Validate phone number
    if (!/^\d{10}$/.test(phoneNumber)) {
        return { success: false, error: 'Please enter a valid 10-digit phone number' };
    }

    // Validate password
    if (password.length < 4) {
        return { success: false, error: 'Password must be at least 4 characters' };
    }

    // Create new user
    const newUser: MockUser = {
        id: generateId('user'),
        phoneNumber,
        password,
        role,
        name: role === 'enumerator' ? 'फील्ड वर्कर' : 'नया लाभार्थी',
        createdAt: new Date().toISOString(),
    };

    addUserToDatabase(newUser);

    // If beneficiary, create beneficiary record
    if (role === 'beneficiary') {
        const newBeneficiary: MockBeneficiary = {
            id: generateId('ben'),
            userId: newUser.id,
            name: newUser.name,
            aadhaar: '',
            phone: phoneNumber,
            address: '',
            annualIncome: 0,
            caste: 'General',
            occupation: '',
            trustScore: 0,
            applicationStatus: null,
            createdAt: new Date().toISOString(),
        };
        addBeneficiary(newBeneficiary);
    }

    const token = generateMockToken(newUser.id);

    return {
        success: true,
        token,
        user: {
            id: newUser.id,
            phoneNumber: newUser.phoneNumber,
            role: newUser.role,
            name: newUser.name,
        },
    };
};

// ============================================
// BENEFICIARY API
// ============================================

interface GetBeneficiaryResponse {
    success: boolean;
    beneficiary?: MockBeneficiary;
    error?: string;
}

/**
 * Get beneficiary profile
 */
export const mockGetBeneficiary = async (
    userId: string
): Promise<GetBeneficiaryResponse> => {
    await simulateNetworkDelay();

    const beneficiary = findBeneficiaryByUserId(userId);
    if (!beneficiary) {
        return { success: false, error: 'Beneficiary not found' };
    }

    return { success: true, beneficiary };
};

// ============================================
// APPLICATION API
// ============================================

interface SubmitApplicationResponse {
    success: boolean;
    applicationId?: string;
    message?: string;
    error?: string;
}

/**
 * Submit scheme application
 */
export const mockSubmitApplication = async (
    userId: string,
    data: {
        name: string;
        aadhaar: string;
        mobile: string;
        address: string;
    }
): Promise<SubmitApplicationResponse> => {
    await simulateNetworkDelay();

    // Find and update beneficiary
    const beneficiary = findBeneficiaryByUserId(userId);
    if (beneficiary) {
        beneficiary.name = data.name;
        beneficiary.aadhaar = data.aadhaar;
        beneficiary.phone = data.mobile;
        beneficiary.address = data.address;
        beneficiary.applicationStatus = 'PENDING';
    }

    return {
        success: true,
        applicationId: generateId('app'),
        message: 'Application submitted successfully. An enumerator will visit for verification.',
    };
};

// ============================================
// SURVEY API
// ============================================

interface SubmitSurveyResponse {
    success: boolean;
    surveyId?: string;
    eligibilityResult?: string;
    error?: string;
}

/**
 * Submit survey data
 */
export const mockSubmitSurvey = async (
    enumeratorId: string,
    surveyData: any
): Promise<SubmitSurveyResponse> => {
    await simulateNetworkDelay();

    // Simulate survey processing
    const surveyId = generateId('survey');

    return {
        success: true,
        surveyId,
        eligibilityResult: surveyData.eligibilityResult || 'PENDING_REVIEW',
    };
};

// ============================================
// DELIVERY API
// ============================================

interface ConfirmDeliveryResponse {
    success: boolean;
    deliveryId?: string;
    message?: string;
    error?: string;
}

/**
 * Confirm asset delivery
 */
export const mockConfirmDelivery = async (
    data: {
        beneficiaryId: string;
        assetBarcode: string;
        gps: { lat: number; lng: number } | null;
        otp: string;
    }
): Promise<ConfirmDeliveryResponse> => {
    await simulateNetworkDelay();

    // Validate OTP (mock: 123456 is valid)
    if (data.otp !== '123456') {
        return { success: false, error: 'Invalid OTP' };
    }

    return {
        success: true,
        deliveryId: generateId('del'),
        message: 'Asset successfully linked to beneficiary',
    };
};

// ============================================
// SYNC API
// ============================================

interface SyncResponse {
    success: boolean;
    syncedCount?: number;
    failedCount?: number;
    message?: string;
}

/**
 * Sync offline data
 */
export const mockSyncData = async (
    records: any[]
): Promise<SyncResponse> => {
    await simulateNetworkDelay();

    // Simulate 95% success rate
    const successRate = 0.95;
    const syncedCount = Math.floor(records.length * successRate);
    const failedCount = records.length - syncedCount;

    return {
        success: true,
        syncedCount,
        failedCount,
        message: failedCount > 0
            ? `Synced ${syncedCount} records. ${failedCount} failed.`
            : `All ${syncedCount} records synced successfully!`,
    };
};

// ============================================
// TRANSLATION API (Mock Google Translate)
// ============================================

interface TranslateResponse {
    success: boolean;
    translatedText?: string;
    error?: string;
}

// Simple Hindi-English dictionary for common phrases
const translationDictionary: Record<string, string> = {
    'hello': 'नमस्ते',
    'welcome': 'स्वागत है',
    'thank you': 'धन्यवाद',
    'good morning': 'शुभ प्रभात',
    'how are you': 'आप कैसे हैं',
    'submit': 'जमा करें',
    'login': 'लॉगिन',
    'logout': 'लॉगआउट',
};

/**
 * Mock translation API
 */
export const mockTranslate = async (
    text: string,
    sourceLang: string,
    targetLang: string
): Promise<TranslateResponse> => {
    await simulateNetworkDelay();

    // Simple mock translation
    const lowerText = text.toLowerCase();

    if (targetLang === 'hi' && translationDictionary[lowerText]) {
        return { success: true, translatedText: translationDictionary[lowerText] };
    }

    // For unknown text, add a suffix to show it was "translated"
    const translatedText = targetLang === 'hi'
        ? `${text} (हिंदी)`
        : `${text} (English)`;

    return { success: true, translatedText };
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if the mock backend is available (always true for local)
 */
export const checkMockBackendHealth = async (): Promise<boolean> => {
    await simulateNetworkDelay();
    return true;
};

/**
 * Get all registered users (for debugging)
 */
export const getMockUsers = () => getUsersDatabase();

/**
 * Get all beneficiaries (for debugging)
 */
export const getMockBeneficiaries = () => getBeneficiariesDatabase();
