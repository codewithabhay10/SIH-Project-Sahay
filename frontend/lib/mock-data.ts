import { StateDashboardData, Project, SNAAccount, FilterOptions, SortField, SortOrder } from './types';

// Mock State Dashboard Data for Maharashtra
export const maharashtraData: StateDashboardData = {
  stateId: 'MH',
  stateName: 'Maharashtra',
  kpis: {
    totalProjects: {
      title: 'Total Projects',
      value: 234,
      change: 12,
      changeType: 'positive',
      subtitle: '42 active this month'
    },
    fundsReceived: {
      title: 'Funds Received',
      value: '₹1,250.5 Cr',
      change: 8,
      changeType: 'positive',
      subtitle: 'Current FY'
    },
    unspentBalance: {
      title: 'Unspent Balance',
      value: '₹342.8 Cr',
      change: 3,
      changeType: 'negative',
      subtitle: '27.4% of received'
    },
    pendingUCs: {
      title: 'Pending UCs',
      value: 18,
      change: 0,
      changeType: 'positive',
      subtitle: '6 overdue'
    }
  },
  proposalFunnel: {
    submitted: 156,
    inReview: 98,
    approved: 72,
    fundsReleased: 58
  },
  snaAccounts: {
    totalBalance: 72900,
    accounts: [
      {
        id: 'sna1',
        name: 'District Fund - North',
        accountNumber: '***7234',
        balance: 4420,
        change: -2.8,
        changeType: 'negative',
        lastUpdated: '5 hours ago'
      },
      {
        id: 'sna2',
        name: 'District Fund - South',
        accountNumber: '***5878',
        balance: 3880,
        change: 1.5,
        changeType: 'positive',
        lastUpdated: '1 day ago'
      },
      {
        id: 'sna3',
        name: 'District Fund - East',
        accountNumber: '***9012',
        balance: 2900,
        change: 0.8,
        changeType: 'positive',
        lastUpdated: '1 day ago'
      },
      {
        id: 'sna4',
        name: 'District Fund - West',
        accountNumber: '***3456',
        balance: 3100,
        change: -3.2,
        changeType: 'negative',
        lastUpdated: '6 hours ago'
      }
    ]
  },
  projects: [
    {
      id: 'PR006',
      name: 'Agriculture Extension Program',
      district: 'Pune',
      iaType: 'Agriculture Dept',
      status: 'Approved',
      allocated: 6.2,
      released: 3.1,
      ucStatus: 'Pending',
      releasePercentage: 50,
      submittedDate: '2024-09-15'
    },
    {
      id: 'PR005',
      name: 'Integrated Child Development',
      district: 'Aurangabad',
      iaType: 'Women & Child',
      status: 'Submitted',
      allocated: 4.5,
      released: 0,
      ucStatus: 'Pending',
      releasePercentage: 0,
      submittedDate: '2024-10-20'
    },
    {
      id: 'PR002',
      name: 'Primary Health Center Upgradation',
      district: 'Mumbai',
      iaType: 'Health Dept',
      status: 'Approved',
      allocated: 8.5,
      released: 4.3,
      ucStatus: 'Submitted',
      releasePercentage: 50,
      submittedDate: '2024-08-10'
    },
    {
      id: 'PR021',
      name: 'Rural Road Construction - Phase 2',
      district: 'Pune',
      iaType: 'PWD',
      status: 'Funds Released',
      allocated: 12.5,
      released: 7.5,
      ucStatus: 'Pending',
      releasePercentage: 60,
      submittedDate: '2024-07-05'
    },
    {
      id: 'PR003',
      name: 'School Building Construction',
      district: 'Nagpur',
      iaType: 'Education Dept',
      status: 'In Review',
      allocated: 9.5,
      released: 0,
      ucStatus: 'Pending',
      releasePercentage: 0,
      submittedDate: '2024-11-01'
    },
    {
      id: 'PR015',
      name: 'Water Supply Enhancement Project',
      district: 'Nashik',
      iaType: 'Water Resources',
      status: 'Approved',
      allocated: 15.2,
      released: 7.6,
      ucStatus: 'Submitted',
      releasePercentage: 50,
      submittedDate: '2024-06-22'
    },
    {
      id: 'PR008',
      name: 'Urban Housing Scheme',
      district: 'Mumbai',
      iaType: 'Housing Dept',
      status: 'Funds Released',
      allocated: 25.0,
      released: 18.75,
      ucStatus: 'Approved',
      releasePercentage: 75,
      submittedDate: '2024-05-10'
    },
    {
      id: 'PR012',
      name: 'Skill Development Center',
      district: 'Pune',
      iaType: 'Skill Development',
      status: 'In Review',
      allocated: 3.8,
      released: 0,
      ucStatus: 'Pending',
      releasePercentage: 0,
      submittedDate: '2024-10-15'
    },
    {
      id: 'PR019',
      name: 'Rural Electrification Phase 3',
      district: 'Kolhapur',
      iaType: 'Energy Dept',
      status: 'Approved',
      allocated: 11.5,
      released: 5.75,
      ucStatus: 'Pending',
      releasePercentage: 50,
      submittedDate: '2024-08-28'
    },
    {
      id: 'PR024',
      name: 'Digital Literacy Program',
      district: 'Thane',
      iaType: 'IT Dept',
      status: 'Submitted',
      allocated: 2.9,
      released: 0,
      ucStatus: 'Pending',
      releasePercentage: 0,
      submittedDate: '2024-11-10'
    }
  ]
};

// Get unique filter options from projects
export function getFilterOptions(projects: Project[]) {
  const districts = Array.from(new Set(projects.map(p => p.district))).sort();
  const iaTypes = Array.from(new Set(projects.map(p => p.iaType))).sort();
  const statuses = Array.from(new Set(projects.map(p => p.status))).sort();
  
  return {
    districts: ['All Districts', ...districts],
    iaTypes: ['All IA Types', ...iaTypes],
    statuses: ['All Statuses', ...statuses]
  };
}

// Filter projects based on filter options
export function filterProjects(projects: Project[], filters: FilterOptions): Project[] {
  return projects.filter(project => {
    const matchesDistrict = filters.district === 'All Districts' || filters.district === '' || project.district === filters.district;
    const matchesIAType = filters.iaType === 'All IA Types' || filters.iaType === '' || project.iaType === filters.iaType;
    const matchesStatus = filters.status === 'All Statuses' || filters.status === '' || project.status === filters.status;
    const matchesSearch = filters.search === '' || 
      project.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      project.id.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesDistrict && matchesIAType && matchesStatus && matchesSearch;
  });
}

// Sort projects
export function sortProjects(projects: Project[], field: SortField, order: SortOrder): Project[] {
  const sorted = [...projects].sort((a, b) => {
    let aVal: any = a[field];
    let bVal: any = b[field];
    
    if (field === 'submittedDate') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sorted;
}

// Paginate projects
export function paginateProjects(projects: Project[], page: number, perPage: number) {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return {
    projects: projects.slice(start, end),
    totalPages: Math.ceil(projects.length / perPage),
    totalCount: projects.length,
    currentPage: page,
    hasNext: end < projects.length,
    hasPrev: page > 1
  };
}

// Get state data by ID
export function getStateData(stateId: string): StateDashboardData {
  // For now, only Maharashtra data is available
  // In future, add more states
  if (stateId.toUpperCase() === 'MH' || stateId.toLowerCase() === 'maharashtra') {
    return maharashtraData;
  }
  
  // Return default/placeholder for other states
  return {
    ...maharashtraData,
    stateId,
    stateName: stateId.toUpperCase(),
  };
}
