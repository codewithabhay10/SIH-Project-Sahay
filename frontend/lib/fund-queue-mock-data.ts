import { FundProposal, PACCDecision, UCStatus, ProposalStatus } from './types';

// Mock Fund Queue Data
export const fundQueueProposals: FundProposal[] = [
  {
    id: '1',
    proposalId: 'MH-2024-001',
    stateName: 'Maharashtra',
    stateCode: 'MH',
    amountRequested: 125.5,
    paccDecision: 'approved',
    ucStatus: 'submitted',
    status: 'pending-release',
    snaAccountId: 'SNA-MH-001',
    snaAccountNumber: '1234567890',
    submittedDate: '2024-11-15',
    projectName: 'Rural Infrastructure Development',
    documents: [
      { name: 'Project Proposal.pdf', url: '#', uploadedDate: '2024-11-15' },
      { name: 'Budget Breakdown.xlsx', url: '#', uploadedDate: '2024-11-15' },
      { name: 'UC Certificate.pdf', url: '#', uploadedDate: '2024-11-20' }
    ]
  },
  {
    id: '2',
    proposalId: 'KA-2024-003',
    stateName: 'Karnataka',
    stateCode: 'KA',
    amountRequested: 89.2,
    paccDecision: 'approved',
    ucStatus: 'approved',
    status: 'pending-release',
    snaAccountId: 'SNA-KA-001',
    snaAccountNumber: '9876543210',
    submittedDate: '2024-11-18',
    projectName: 'Healthcare Facility Upgradation',
    documents: [
      { name: 'Proposal Document.pdf', url: '#', uploadedDate: '2024-11-18' },
      { name: 'Financial Statement.pdf', url: '#', uploadedDate: '2024-11-18' }
    ]
  },
  {
    id: '3',
    proposalId: 'TN-2024-005',
    stateName: 'Tamil Nadu',
    stateCode: 'TN',
    amountRequested: 156.8,
    paccDecision: 'conditionally-approved',
    ucStatus: 'pending',
    status: 'on-hold',
    snaAccountId: 'SNA-TN-001',
    snaAccountNumber: '5555666677',
    submittedDate: '2024-11-20',
    projectName: 'Education Infrastructure Program',
    documents: [
      { name: 'Project Details.pdf', url: '#', uploadedDate: '2024-11-20' },
      { name: 'Site Assessment.pdf', url: '#', uploadedDate: '2024-11-22' }
    ]
  },
  {
    id: '4',
    proposalId: 'UP-2024-012',
    stateName: 'Uttar Pradesh',
    stateCode: 'UP',
    amountRequested: 234.5,
    paccDecision: 'approved',
    ucStatus: 'overdue',
    status: 'on-hold',
    snaAccountId: 'SNA-UP-001',
    snaAccountNumber: '1111222233',
    submittedDate: '2024-10-25',
    projectName: 'Water Supply Enhancement',
    documents: [
      { name: 'Proposal.pdf', url: '#', uploadedDate: '2024-10-25' }
    ]
  },
  {
    id: '5',
    proposalId: 'GJ-2024-008',
    stateName: 'Gujarat',
    stateCode: 'GJ',
    amountRequested: 98.3,
    paccDecision: 'approved',
    ucStatus: 'not-required',
    status: 'pending-release',
    snaAccountId: 'SNA-GJ-001',
    snaAccountNumber: '7777888899',
    submittedDate: '2024-11-25',
    projectName: 'Skill Development Initiative',
    documents: [
      { name: 'Project Plan.pdf', url: '#', uploadedDate: '2024-11-25' },
      { name: 'Budget.xlsx', url: '#', uploadedDate: '2024-11-25' }
    ]
  },
  {
    id: '6',
    proposalId: 'RJ-2024-004',
    stateName: 'Rajasthan',
    stateCode: 'RJ',
    amountRequested: 178.9,
    paccDecision: 'approved',
    ucStatus: 'submitted',
    status: 'pending-release',
    snaAccountId: 'SNA-RJ-001',
    snaAccountNumber: '3333444455',
    submittedDate: '2024-11-22',
    projectName: 'Solar Energy Project',
    documents: [
      { name: 'Project Proposal.pdf', url: '#', uploadedDate: '2024-11-22' },
      { name: 'Technical Specs.pdf', url: '#', uploadedDate: '2024-11-22' },
      { name: 'UC Report.pdf', url: '#', uploadedDate: '2024-11-28' }
    ]
  },
  {
    id: '7',
    proposalId: 'WB-2024-002',
    stateName: 'West Bengal',
    stateCode: 'WB',
    amountRequested: 145.6,
    paccDecision: 'pending',
    ucStatus: 'pending',
    status: 'on-hold',
    snaAccountId: 'SNA-WB-001',
    snaAccountNumber: '9999000011',
    submittedDate: '2024-11-28',
    projectName: 'Urban Housing Scheme',
    documents: [
      { name: 'Proposal.pdf', url: '#', uploadedDate: '2024-11-28' }
    ]
  }
];

// Filter proposals
export function filterProposals(
  proposals: FundProposal[],
  filters: {
    state?: string;
    paccDecision?: string;
    ucStatus?: string;
    status?: string;
    search?: string;
  }
): FundProposal[] {
  return proposals.filter(proposal => {
    if (filters.state && filters.state !== 'All States' && proposal.stateName !== filters.state) {
      return false;
    }
    if (filters.paccDecision && filters.paccDecision !== 'All Decisions' && proposal.paccDecision !== filters.paccDecision) {
      return false;
    }
    if (filters.ucStatus && filters.ucStatus !== 'All UC Status' && proposal.ucStatus !== filters.ucStatus) {
      return false;
    }
    if (filters.status && filters.status !== 'All Status' && proposal.status !== filters.status) {
      return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        proposal.proposalId.toLowerCase().includes(searchLower) ||
        proposal.stateName.toLowerCase().includes(searchLower) ||
        proposal.projectName.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });
}

// Get proposal by ID
export function getProposalById(proposalId: string): FundProposal | undefined {
  return fundQueueProposals.find(p => p.proposalId === proposalId || p.id === proposalId);
}

// Calculate total amount for selected proposals
export function calculateTotalAmount(proposalIds: string[]): number {
  return fundQueueProposals
    .filter(p => proposalIds.includes(p.id))
    .reduce((sum, p) => sum + p.amountRequested, 0);
}
