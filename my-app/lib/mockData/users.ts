/**
 * Mock User Database
 * Simulates a backend user database stored locally
 */

export type UserRole = 'enumerator' | 'beneficiary';

export interface MockUser {
    id: string;
    phoneNumber: string;
    password: string; // In real app, this would be hashed
    role: UserRole;
    name: string;
    createdAt: string;
}

// Pre-seeded demo users
export const mockUsers: MockUser[] = [
    {
        id: 'user-001',
        phoneNumber: '9876543210',
        password: 'password123',
        role: 'beneficiary',
        name: 'राम कुमार',
        createdAt: '2024-01-15T10:30:00Z',
    },
    {
        id: 'user-002',
        phoneNumber: '9876543211',
        password: 'password123',
        role: 'enumerator',
        name: 'सीता देवी',
        createdAt: '2024-01-10T08:00:00Z',
    },
    {
        id: 'user-003',
        phoneNumber: '1234567890',
        password: 'test',
        role: 'beneficiary',
        name: 'Test User',
        createdAt: '2024-06-01T12:00:00Z',
    },
];

// Runtime storage for new users (will reset on app restart)
let runtimeUsers: MockUser[] = [...mockUsers];

export const getUsersDatabase = (): MockUser[] => runtimeUsers;

export const addUserToDatabase = (user: MockUser): void => {
    runtimeUsers.push(user);
};

export const findUserByPhone = (phoneNumber: string): MockUser | undefined => {
    return runtimeUsers.find((u) => u.phoneNumber === phoneNumber);
};

export const resetUsersDatabase = (): void => {
    runtimeUsers = [...mockUsers];
};
