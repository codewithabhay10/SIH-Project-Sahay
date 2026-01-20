// FTO/DBT Management Mock Data

export type FTOManagementStatus = 'draft' | 'pending' | 'sent' | 'completed' | 'failed';

export interface BeneficiaryForFTO {
  id: string;
  beneficiaryId: string;
  name: string;
  mobile: string;
  aadhaarLast4: string;
  bankAccount: string;
  ifscCode: string;
  projectId: string;
  projectName: string;
  amount: number;
  isVerified: boolean;
}

export interface FTOManagement {
  id: string;
  ftoId: string;
  projectId: string;
  projectName: string;
  beneficiaryCount: number;
  totalAmount: number;
  status: FTOManagementStatus;
  createdAt: string;
  sentAt?: string;
  completedAt?: string;
  createdBy: string;
  authorizationDoc?: string;
  pfmsReferenceId?: string;
  beneficiaryIds: string[];
}

export const mockBeneficiariesForFTO: BeneficiaryForFTO[] = [
  {
    id: '1',
    beneficiaryId: 'BEN-2024-0001',
    name: 'Ramesh Kumar',
    mobile: '9876543210',
    aadhaarLast4: '4567',
    bankAccount: 'XXXX-XXXX-1234',
    ifscCode: 'SBIN0001234',
    projectId: 'PROJ-001',
    projectName: 'Rural Infrastructure Development',
    amount: 25000,
    isVerified: true,
  },
  {
    id: '2',
    beneficiaryId: 'BEN-2024-0002',
    name: 'Sunita Devi',
    mobile: '9876543211',
    aadhaarLast4: '8901',
    bankAccount: 'XXXX-XXXX-5678',
    ifscCode: 'HDFC0001234',
    projectId: 'PROJ-002',
    projectName: 'Skill Development Initiative',
    amount: 15000,
    isVerified: true,
  },
  {
    id: '3',
    beneficiaryId: 'BEN-2024-0003',
    name: 'Amit Patil',
    mobile: '9876543212',
    aadhaarLast4: '2345',
    bankAccount: 'XXXX-XXXX-9012',
    ifscCode: 'ICIC0001234',
    projectId: 'PROJ-003',
    projectName: 'Water Supply Enhancement',
    amount: 30000,
    isVerified: true,
  },
  {
    id: '4',
    beneficiaryId: 'BEN-2024-0004',
    name: 'Priya Sharma',
    mobile: '9876543213',
    aadhaarLast4: '6789',
    bankAccount: 'XXXX-XXXX-3456',
    ifscCode: 'AXIS0001234',
    projectId: 'PROJ-004',
    projectName: 'Urban Housing Scheme',
    amount: 50000,
    isVerified: true,
  },
  {
    id: '5',
    beneficiaryId: 'BEN-2024-0006',
    name: 'Lakshmi Rao',
    mobile: '9876543215',
    aadhaarLast4: '5678',
    bankAccount: 'XXXX-XXXX-7890',
    ifscCode: 'SBIN0005678',
    projectId: 'PROJ-002',
    projectName: 'Skill Development Initiative',
    amount: 15000,
    isVerified: true,
  },
  {
    id: '6',
    beneficiaryId: 'BEN-2024-0008',
    name: 'Kiran Desai',
    mobile: '9876543217',
    aadhaarLast4: '3456',
    bankAccount: 'XXXX-XXXX-2345',
    ifscCode: 'HDFC0005678',
    projectId: 'PROJ-001',
    projectName: 'Rural Infrastructure Development',
    amount: 25000,
    isVerified: true,
  },
  {
    id: '7',
    beneficiaryId: 'BEN-2024-0009',
    name: 'Manoj Singh',
    mobile: '9876543218',
    aadhaarLast4: '7890',
    bankAccount: 'XXXX-XXXX-6789',
    ifscCode: 'ICIC0005678',
    projectId: 'PROJ-003',
    projectName: 'Water Supply Enhancement',
    amount: 30000,
    isVerified: true,
  },
  {
    id: '8',
    beneficiaryId: 'BEN-2024-0010',
    name: 'Geeta Patel',
    mobile: '9876543219',
    aadhaarLast4: '1234',
    bankAccount: 'XXXX-XXXX-4567',
    ifscCode: 'AXIS0005678',
    projectId: 'PROJ-004',
    projectName: 'Urban Housing Scheme',
    amount: 50000,
    isVerified: true,
  },
];

export const mockFTOs: FTOManagement[] = [
  {
    id: '1',
    ftoId: 'FTO-2024-001',
    projectId: 'PROJ-001',
    projectName: 'Rural Infrastructure Development',
    beneficiaryCount: 2,
    totalAmount: 50000,
    status: 'completed',
    createdAt: '2024-11-20T10:30:00',
    sentAt: '2024-11-20T14:00:00',
    completedAt: '2024-11-21T09:00:00',
    createdBy: 'IA Officer',
    authorizationDoc: 'auth_001.pdf',
    pfmsReferenceId: 'PFMS-REF-001',
    beneficiaryIds: ['1', '6'],
  },
  {
    id: '2',
    ftoId: 'FTO-2024-002',
    projectId: 'PROJ-002',
    projectName: 'Skill Development Initiative',
    beneficiaryCount: 2,
    totalAmount: 30000,
    status: 'sent',
    createdAt: '2024-11-22T11:00:00',
    sentAt: '2024-11-22T16:30:00',
    createdBy: 'IA Officer',
    authorizationDoc: 'auth_002.pdf',
    pfmsReferenceId: 'PFMS-REF-002',
    beneficiaryIds: ['2', '5'],
  },
  {
    id: '3',
    ftoId: 'FTO-2024-003',
    projectId: 'PROJ-003',
    projectName: 'Water Supply Enhancement',
    beneficiaryCount: 2,
    totalAmount: 60000,
    status: 'pending',
    createdAt: '2024-11-25T09:15:00',
    createdBy: 'IA Officer',
    authorizationDoc: 'auth_003.pdf',
    beneficiaryIds: ['3', '7'],
  },
  {
    id: '4',
    ftoId: 'FTO-2024-004',
    projectId: 'PROJ-004',
    projectName: 'Urban Housing Scheme',
    beneficiaryCount: 2,
    totalAmount: 100000,
    status: 'draft',
    createdAt: '2024-11-28T14:20:00',
    createdBy: 'IA Officer',
    beneficiaryIds: ['4', '8'],
  },
];

export function getBeneficiariesByProject(projectId: string): BeneficiaryForFTO[] {
  return mockBeneficiariesForFTO.filter(b => b.projectId === projectId);
}

export function getFTOById(id: string): FTOManagement | undefined {
  return mockFTOs.find(fto => fto.id === id);
}

export function getVerifiedBeneficiaries(): BeneficiaryForFTO[] {
  return mockBeneficiariesForFTO.filter(b => b.isVerified);
}
