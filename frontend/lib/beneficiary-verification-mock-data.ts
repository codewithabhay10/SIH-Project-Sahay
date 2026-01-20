// Mock beneficiary data for verification

export type VerificationStatus = 'unverified' | 'verified' | 'flagged' | 'pending-documents';
export type AadhaarStatus = 'verified' | 'pending' | 'failed';
export type BankStatus = 'verified' | 'pending' | 'failed';

export interface BeneficiaryForVerification {
  id: string;
  beneficiaryId: string;
  name: string;
  aadhaarStatus: AadhaarStatus;
  bankStatus: BankStatus;
  projectName: string;
  projectId: string;
  verificationStatus: VerificationStatus;
  registeredDate: string;
  mobile: string;
  aadhaarLast4: string;
}

export const mockBeneficiaries: BeneficiaryForVerification[] = [
  {
    id: '1',
    beneficiaryId: 'BEN-2024-0001',
    name: 'Ramesh Kumar',
    aadhaarStatus: 'verified',
    bankStatus: 'verified',
    projectName: 'Rural Infrastructure Development',
    projectId: 'PROJ-001',
    verificationStatus: 'unverified',
    registeredDate: '2024-11-20',
    mobile: '9876543210',
    aadhaarLast4: '4567'
  },
  {
    id: '2',
    beneficiaryId: 'BEN-2024-0002',
    name: 'Sunita Devi',
    aadhaarStatus: 'verified',
    bankStatus: 'pending',
    projectName: 'Skill Development Initiative',
    projectId: 'PROJ-002',
    verificationStatus: 'unverified',
    registeredDate: '2024-11-21',
    mobile: '9876543211',
    aadhaarLast4: '8901'
  },
  {
    id: '3',
    beneficiaryId: 'BEN-2024-0003',
    name: 'Amit Patil',
    aadhaarStatus: 'pending',
    bankStatus: 'verified',
    projectName: 'Water Supply Enhancement',
    projectId: 'PROJ-003',
    verificationStatus: 'pending-documents',
    registeredDate: '2024-11-22',
    mobile: '9876543212',
    aadhaarLast4: '2345'
  },
  {
    id: '4',
    beneficiaryId: 'BEN-2024-0004',
    name: 'Priya Sharma',
    aadhaarStatus: 'verified',
    bankStatus: 'verified',
    projectName: 'Urban Housing Scheme',
    projectId: 'PROJ-004',
    verificationStatus: 'verified',
    registeredDate: '2024-11-18',
    mobile: '9876543213',
    aadhaarLast4: '6789'
  },
  {
    id: '5',
    beneficiaryId: 'BEN-2024-0005',
    name: 'Vijay Singh',
    aadhaarStatus: 'failed',
    bankStatus: 'verified',
    projectName: 'Rural Infrastructure Development',
    projectId: 'PROJ-001',
    verificationStatus: 'flagged',
    registeredDate: '2024-11-23',
    mobile: '9876543214',
    aadhaarLast4: '1234'
  },
  {
    id: '6',
    beneficiaryId: 'BEN-2024-0006',
    name: 'Lakshmi Rao',
    aadhaarStatus: 'verified',
    bankStatus: 'verified',
    projectName: 'Skill Development Initiative',
    projectId: 'PROJ-002',
    verificationStatus: 'unverified',
    registeredDate: '2024-11-24',
    mobile: '9876543215',
    aadhaarLast4: '5678'
  },
  {
    id: '7',
    beneficiaryId: 'BEN-2024-0007',
    name: 'Rajesh Yadav',
    aadhaarStatus: 'verified',
    bankStatus: 'failed',
    projectName: 'Water Supply Enhancement',
    projectId: 'PROJ-003',
    verificationStatus: 'unverified',
    registeredDate: '2024-11-25',
    mobile: '9876543216',
    aadhaarLast4: '9012'
  }
];

export function filterBeneficiaries(
  beneficiaries: BeneficiaryForVerification[],
  filter?: 'all' | 'unverified' | 'verified' | 'flagged' | 'pending-documents'
): BeneficiaryForVerification[] {
  if (!filter || filter === 'all') {
    return beneficiaries;
  }
  return beneficiaries.filter(b => b.verificationStatus === filter);
}

export function getBeneficiaryById(id: string): BeneficiaryForVerification | undefined {
  return mockBeneficiaries.find(b => b.id === id);
}
