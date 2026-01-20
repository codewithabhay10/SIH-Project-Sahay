export interface Proposal {
  id: string;
  title: string;
  department: string;
  state: string;
  district: string;
  category: string;
  budget: number;
  status: 'Under Review' | 'Approved' | 'Rejected';
  submittedAt: string;
}

export const mockProposalsData: Proposal[] = [
  {
    id: 'PROP-2024-001',
    title: 'Youth Skill Development Program',
    department: 'PWD Department',
    state: 'Maharashtra',
    district: 'Pune',
    category: 'Skill Development',
    budget: 5000000,
    status: 'Under Review',
    submittedAt: '15 Nov 2024'
  },
  {
    id: 'PROP-2024-002',
    title: 'Rural Infrastructure Improvement',
    department: 'Rural Development',
    state: 'Maharashtra',
    district: 'Nagpur',
    category: 'Infrastructure',
    budget: 8500000,
    status: 'Under Review',
    submittedAt: '20 Nov 2024'
  },
  {
    id: 'PROP-2024-003',
    title: 'Women Empowerment Initiative',
    department: 'Women & Child Dept',
    state: 'Gujarat',
    district: 'Ahmedabad',
    category: 'Income Generation',
    budget: 3200000,
    status: 'Approved',
    submittedAt: '10 Nov 2024'
  },
  {
    id: 'PROP-2024-004',
    title: 'Farmer Training and Support',
    department: 'Agriculture Dept',
    state: 'Karnataka',
    district: 'Bangalore',
    category: 'Skill Development',
    budget: 4500000,
    status: 'Rejected',
    submittedAt: '18 Nov 2024'
  },
  {
    id: 'PROP-2024-005',
    title: 'Digital Literacy Program',
    department: 'Education Department',
    state: 'Maharashtra',
    district: 'Mumbai',
    category: 'Skill Development',
    budget: 2800000,
    status: 'Under Review',
    submittedAt: '22 Nov 2024'
  },
  {
    id: 'PROP-2024-006',
    title: 'Community Health Centers',
    department: 'Health Department',
    state: 'Tamil Nadu',
    district: 'Chennai',
    category: 'Infrastructure',
    budget: 11200000,
    status: 'Under Review',
    submittedAt: '25 Nov 2024'
  },
  {
    id: 'PROP-2024-007',
    title: 'Artisan Support Scheme',
    department: 'Handicrafts Board',
    state: 'Rajasthan',
    district: 'Jaipur',
    category: 'Income Generation',
    budget: 1500000,
    status: 'Approved',
    submittedAt: '5 Nov 2024'
  },
  {
    id: 'PROP-2024-008',
    title: 'Youth Employment Training',
    department: 'Labour Department',
    state: 'Maharashtra',
    district: 'Nashik',
    category: 'Skill Development',
    budget: 6200000,
    status: 'Rejected',
    submittedAt: '12 Nov 2024'
  }
];

export const getProposals = () => mockProposalsData;

export const getProposalById = (id: string) => 
  mockProposalsData.find(p => p.id === id);

export const getStates = () => 
  Array.from(new Set(mockProposalsData.map(p => p.state)));

export const getCategories = () => 
  Array.from(new Set(mockProposalsData.map(p => p.category)));

export const getStatuses = () => 
  ['Under Review', 'Approved', 'Rejected'];
