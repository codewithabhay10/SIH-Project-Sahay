/**
 * Mock Beneficiaries Database
 * Simulates beneficiary records stored in a backend
 */

export interface MockBeneficiary {
    id: string;
    userId: string;
    name: string;
    aadhaar: string;
    phone: string;
    address: string;
    annualIncome: number;
    caste: 'SC' | 'ST' | 'OBC' | 'General';
    occupation: string;
    trustScore: number;
    applicationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | null;
    createdAt: string;
}

// Pre-seeded beneficiaries
export const mockBeneficiaries: MockBeneficiary[] = [
    {
        id: 'ben-001',
        userId: 'user-001',
        name: 'राम कुमार',
        aadhaar: '123456789012',
        phone: '9876543210',
        address: 'Village Rampur, District Varanasi, UP',
        annualIncome: 45000,
        caste: 'SC',
        occupation: 'Farmer',
        trustScore: 65,
        applicationStatus: 'PENDING',
        createdAt: '2024-01-15T10:30:00Z',
    },
    {
        id: 'ben-002',
        userId: 'user-003',
        name: 'Sunita Devi',
        aadhaar: '987654321012',
        phone: '9876543212',
        address: 'Village Sitapur, District Lucknow, UP',
        annualIncome: 35000,
        caste: 'OBC',
        occupation: 'Artisan',
        trustScore: 80,
        applicationStatus: 'APPROVED',
        createdAt: '2024-02-20T14:00:00Z',
    },
];

// Runtime storage
let runtimeBeneficiaries: MockBeneficiary[] = [...mockBeneficiaries];

export const getBeneficiariesDatabase = (): MockBeneficiary[] => runtimeBeneficiaries;

export const addBeneficiary = (beneficiary: MockBeneficiary): void => {
    runtimeBeneficiaries.push(beneficiary);
};

export const findBeneficiaryByUserId = (userId: string): MockBeneficiary | undefined => {
    return runtimeBeneficiaries.find((b) => b.userId === userId);
};

export const findBeneficiaryByAadhaar = (aadhaar: string): MockBeneficiary | undefined => {
    return runtimeBeneficiaries.find((b) => b.aadhaar === aadhaar);
};

export const updateBeneficiary = (id: string, updates: Partial<MockBeneficiary>): boolean => {
    const index = runtimeBeneficiaries.findIndex((b) => b.id === id);
    if (index !== -1) {
        runtimeBeneficiaries[index] = { ...runtimeBeneficiaries[index], ...updates };
        return true;
    }
    return false;
};

export const resetBeneficiariesDatabase = (): void => {
    runtimeBeneficiaries = [...mockBeneficiaries];
};
