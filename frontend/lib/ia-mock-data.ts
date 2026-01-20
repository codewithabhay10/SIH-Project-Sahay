import { IADashboardData, Milestone, Evidence, Beneficiary, EvidenceCategory } from './types';

// Mock IA Dashboard Data
export const skillDevelopmentAgencyData: IADashboardData = {
  project: {
    iaId: 'IA001',
    iaName: 'Skill Development Agency - Pune',
    projectName: 'Youth Employment Training Program',
    projectId: 'PR-001',
    startDate: 'Jan 2024',
    endDate: 'Dec 2024',
    district: 'Pune'
  },
  kpis: {
    beneficiariesRegistered: {
      current: 1247,
      target: 1500
    },
    amountReleased: {
      amount: 45.8,
      allocated: 450
    },
    amountUtilized: {
      amount: 38.2,
      percentage: 83.4
    },
    placementRate: {
      percentage: 76,
      placed: 949,
      total: 1247
    }
  },
  milestones: [
    {
      id: 'M1',
      name: 'Project Approval & Fund Allocation',
      targetDate: '15 Jan 2024',
      completionDate: '12 Jan 2024',
      status: 'completed',
      remark: 'Completed ahead of schedule'
    },
    {
      id: 'M2',
      name: 'Beneficiary Registration (50%)',
      targetDate: '1 Mar 2024',
      completionDate: '28 Feb 2024',
      status: 'completed'
    },
    {
      id: 'M3',
      name: 'Infrastructure Setup',
      targetDate: '30 Jun 2024',
      status: 'in-progress'
    },
    {
      id: 'M4',
      name: 'Training Completion',
      targetDate: '15 Sept 2024',
      status: 'pending'
    },
    {
      id: 'M5',
      name: 'Placement Target (75%)',
      targetDate: '31 Dec 2024',
      status: 'pending'
    }
  ],
  evidence: [
    {
      id: 'E1',
      name: 'Training Session - Batch A',
      category: 'photo',
      url: '/evidence/training-session-1.jpg',
      size: 2400000,
      uploadDate: '15 Mar',
      thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400'
    },
    {
      id: 'E2',
      name: 'Infrastructure Setup Photos',
      category: 'photo',
      url: '/evidence/infrastructure.jpg',
      size: 3100000,
      uploadDate: '14 Mar',
      thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400'
    },
    {
      id: 'E3',
      name: 'Attendance Record',
      category: 'document',
      url: '/evidence/attendance.pdf',
      size: 856000,
      uploadDate: '10 Mar'
    },
    {
      id: 'E4',
      name: 'Skill Training Demo',
      category: 'video',
      url: '/evidence/training-demo.mp4',
      size: 45200000,
      uploadDate: '8 Mar'
    },
    {
      id: 'E5',
      name: 'Beneficiary Workshop',
      category: 'photo',
      url: '/evidence/workshop.jpg',
      size: 1800000,
      uploadDate: '5 Mar',
      thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400'
    },
    {
      id: 'E6',
      name: 'Monthly Progress Report',
      category: 'document',
      url: '/evidence/monthly-report.pdf',
      size: 1200000,
      uploadDate: '1 Mar'
    }
  ],
  beneficiaries: [
    {
      id: 'BEN001',
      name: 'Rajesh Kumar',
      mobile: '+91 98765-43210',
      district: 'Pune',
      registrationDate: '15 Jan 2024',
      trainingStatus: 'completed',
      placementStatus: 'placed',
      disbursal: 25000
    },
    {
      id: 'BEN002',
      name: 'Priya Sharma',
      mobile: '+91 98765-43211',
      district: 'Mumbai',
      registrationDate: '18 Jan 2024',
      trainingStatus: 'completed',
      placementStatus: 'placed',
      disbursal: 25000
    },
    {
      id: 'BEN003',
      name: 'Amit Patel',
      mobile: '+91 98765-43212',
      district: 'Nagpur',
      registrationDate: '5 Feb 2024',
      trainingStatus: 'in-progress',
      placementStatus: 'searching',
      disbursal: 15000
    },
    {
      id: 'BEN004',
      name: 'Sneha Desai',
      mobile: '+91 98765-43213',
      district: 'Nashik',
      registrationDate: '10 Feb 2024',
      trainingStatus: 'completed',
      placementStatus: 'searching',
      disbursal: 20000
    },
    {
      id: 'BEN005',
      name: 'Rahul Verma',
      mobile: '+91 98765-43214',
      district: 'Pune',
      registrationDate: '5 Feb 2024',
      trainingStatus: 'in-progress',
      placementStatus: 'searching',
      disbursal: 12000
    },
    {
      id: 'BEN006',
      name: 'Anita Singh',
      mobile: '+91 98765-43215',
      district: 'Aurangabad',
      registrationDate: '20 Jan 2024',
      trainingStatus: 'completed',
      placementStatus: 'placed',
      disbursal: 25000
    }
  ]
};

// Filter evidence by category
export function filterEvidence(evidence: Evidence[], category?: EvidenceCategory): Evidence[] {
  if (!category) return evidence;
  return evidence.filter(e => e.category === category);
}

// Get evidence counts by category
export function getEvidenceCounts(evidence: Evidence[]) {
  return {
    all: evidence.length,
    photos: evidence.filter(e => e.category === 'photo').length,
    videos: evidence.filter(e => e.category === 'video').length,
    documents: evidence.filter(e => e.category === 'document').length
  };
}

// Filter beneficiaries
export function filterBeneficiaries(
  beneficiaries: Beneficiary[],
  searchQuery: string,
  placementFilter?: string
): Beneficiary[] {
  let filtered = beneficiaries;

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      b =>
        b.name.toLowerCase().includes(query) ||
        b.id.toLowerCase().includes(query) ||
        b.mobile.includes(query)
    );
  }

  if (placementFilter && placementFilter !== 'All Placement Status') {
    filtered = filtered.filter(b => b.placementStatus === placementFilter.toLowerCase());
  }

  return filtered;
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Get IA data by ID
export function getIAData(iaId: string): IADashboardData {
  // For now, only one IA data available
  return skillDevelopmentAgencyData;
}
