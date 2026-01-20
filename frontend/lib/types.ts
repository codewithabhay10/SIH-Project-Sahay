// State Dashboard Types

export interface Project {
  id: string;
  name: string;
  district: string;
  iaType: string;
  status: 'Approved' | 'Submitted' | 'In Review' | 'Funds Released' | 'Pending';
  allocated: number;
  released: number;
  ucStatus: string;
  releasePercentage: number;
  submittedDate: string;
}

export interface SNAAccount {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
  change: number;
  changeType: 'positive' | 'negative';
  lastUpdated: string;
}

export interface ProposalFunnelData {
  submitted: number;
  inReview: number;
  approved: number;
  fundsReleased: number;
}

export interface KPIData {
  title: string;
  value: string | number;
  change: number;
  changeType: 'positive' | 'negative';
  subtitle?: string;
}

export interface StateDashboardData {
  stateId: string;
  stateName: string;
  kpis: {
    totalProjects: KPIData;
    fundsReceived: KPIData;
    unspentBalance: KPIData;
    pendingUCs: KPIData;
  };
  proposalFunnel: ProposalFunnelData;
  snaAccounts: {
    totalBalance: number;
    accounts: SNAAccount[];
  };
  projects: Project[];
}

export interface FilterOptions {
  district: string;
  iaType: string;
  status: string;
  search: string;
}

export type SortField = 'name' | 'allocated' | 'released' | 'submittedDate';
export type SortOrder = 'asc' | 'desc';

// IA Dashboard Types

export type MilestoneStatus = 'completed' | 'in-progress' | 'pending';
export type EvidenceCategory = 'photo' | 'video' | 'document';
export type TrainingStatus = 'completed' | 'in-progress' | 'not-started';
export type PlacementStatus = 'placed' | 'searching' | 'not-applicable';

export interface Milestone {
  id: string;
  name: string;
  targetDate: string;
  completionDate?: string;
  status: MilestoneStatus;
  remark?: string;
}

export interface Evidence {
  id: string;
  name: string;
  category: EvidenceCategory;
  url: string;
  size: number;
  uploadDate: string;
  thumbnail?: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  mobile: string;
  district: string;
  registrationDate: string;
  trainingStatus: TrainingStatus;
  placementStatus: PlacementStatus;
  disbursal: number;
}

export interface IAProjectInfo {
  iaId: string;
  iaName: string;
  projectName: string;
  projectId: string;
  startDate: string;
  endDate: string;
  district: string;
}

export interface IAKPIs {
  beneficiariesRegistered: {
    current: number;
    target: number;
  };
  amountReleased: {
    amount: number;
    allocated: number;
  };
  amountUtilized: {
    amount: number;
    percentage: number;
  };
  placementRate: {
    percentage: number;
    placed: number;
    total: number;
  };
}

export interface IADashboardData {
  project: IAProjectInfo;
  kpis: IAKPIs;
  milestones: Milestone[];
  evidence: Evidence[];
  beneficiaries: Beneficiary[];
}

// Fund Release Queue Types

export type PACCDecision = 'approved' | 'pending' | 'conditionally-approved' | 'rejected';
export type UCStatus = 'submitted' | 'approved' | 'pending' | 'overdue' | 'not-required';
export type ProposalStatus = 'pending-release' | 'processing' | 'completed' | 'on-hold' | 'rejected';

export interface FundProposal {
  id: string;
  proposalId: string;
  stateName: string;
  stateCode: string;
  amountRequested: number;
  paccDecision: PACCDecision;
  ucStatus: UCStatus;
  status: ProposalStatus;
  snaAccountId: string;
  snaAccountNumber: string;
  submittedDate: string;
  projectName: string;
  documents: {
    name: string;
    url: string;
    uploadedDate: string;
  }[];
}

export interface FundReleaseRequest {
  proposalId: string;
  amount: number;
  snaAccountId: string;
  paymentMode: 'NEFT' | 'RTGS' | 'ACH';
}

// SNA Reconciliation Types

export type FTOStatus = 'unreconciled' | 'reconciled' | 'partially-reconciled' | 'disputed';
export type AnomalyType = 'amount-mismatch' | 'missing-fto' | 'missing-bank-tx' | 'duplicate' | 'date-mismatch';

export interface FTORecord {
  id: string;
  ftoId: string;
  projectName: string;
  projectId: string;
  amount: number;
  issuedAt: string;
  status: FTOStatus;
  matchedBankTxId?: string;
}

export interface BankTransaction {
  id: string;
  bankTxId: string;
  date: string;
  amount: number;
  narration: string;
  isMatched: boolean;
  matchedFTOId?: string;
}

export interface ReconciliationMatch {
  ftoId: string;
  bankTxId: string;
  matchedAt: string;
  matchedBy: string;
  isAutoMatched: boolean;
  confidence?: number;
}

export interface Anomaly {
  id: string;
  type: AnomalyType;
  severity: 'high' | 'medium' | 'low';
  ftoId?: string;
  bankTxId?: string;
  description: string;
  detectedAt: string;
  amount?: number;
  status: 'pending' | 'resolved' | 'ignored';
}

// Proposal Submission Types

export type ProposalCategory = 'Income' | 'Skill' | 'Infrastructure';
export type ProposalStatus = 'Draft' | 'Submitted' | 'In Review' | 'Approved' | 'Rejected';
export type ImplementationPartner = 'State Government' | 'District Administration' | 'Educational Institutions' | 'NGOs' | 'Community Organizations';
export type ConvergenceNeed = 'MGNREGA' | 'State Skill Development' | 'Others';

export interface BudgetLineItem {
  id: string;
  category: 'Labour' | 'Material' | 'Asset' | 'Training Fee' | 'Contingency';
  description: string;
  amount: number;
}

export interface Activity {
  id: string;
  description: string;
}

export interface TimelinePhase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'not-started' | 'in-progress' | 'completed';
}

export interface ProposalDocument {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'video';
  url: string;
  size: number;
  uploadDate: string;
}

export interface AIValidationResult {
  isValid: boolean;
  completeness: number; // percentage
  compliance: number; // percentage
  issues: string[];
}

export interface DuplicationCheck {
  isDuplicate: boolean;
  possibleDuplicates: {
    proposalId: string;
    proposalTitle: string;
    similarity: number; // percentage
    submittedBy: string;
    submittedDate: string;
  }[];
}

export interface AIRecommendation {
  score: number; // 0-100
  strengths: string[];
  improvements: string[];
  budgetAssessment: string;
}

export interface ProposalFormData {
  // Basic Information
  title: string;
  category: ProposalCategory;
  district: string;
  estimatedBudget: number;
  startDate: string;
  endDate: string;

  // Beneficiary Information
  expectedBeneficiaryCount: number;
  targetGroups: {
    women: boolean;
    youth: boolean;
    scSt: boolean;
    minorities: boolean;
    disabled: boolean;
    bplFamilies: boolean;
    farmers: boolean;
    ruralPoor: boolean;
  };
  eligibilityCriteria: string;

  // Project Blueprint
  objective: string;
  activities: Activity[];
  expectedOutcomes: string;
  implementationPartners: ImplementationPartner[];
  timeline: TimelinePhase[];
  convergenceNeeds: {
    mgnrega: boolean;
    stateSkill: boolean;
    others: boolean;
  };

  // Budget Breakup
  budgetLineItems: BudgetLineItem[];

  // Documents
  documents: ProposalDocument[];

  // Status & AI Analysis
  status: ProposalStatus;
  aiValidation?: AIValidationResult;
  duplicationCheck?: DuplicationCheck;
  aiRecommendation?: AIRecommendation;
}

// PACC Portal Types

export type MeetingStatus = 'Upcoming' | 'Completed' | 'Cancelled';
export type MeetingType = 'Review' | 'Emergency' | 'Regular';

export interface PACCAttendee {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
}

export interface ProposalAgendaItem {
  id: string;
  proposalId: string;
  proposalTitle: string;
  proposer: string;
  category: string;
  budget: number;
}

export interface MeetingDecision {
  proposalId: string;
  decision: 'Approved' | 'Rejected' | 'Deferred' | 'Needs Revision';
  comments: string;
  votesFor?: number;
  votesAgainst?: number;
}

export interface MinutesOfMeeting {
  id: string;
  meetingId: string;
  generatedAt: string;
  generatedBy: string;
  attendees: string[];
  agenda: string[];
  discussions: string[];
  decisions: MeetingDecision[];
  actionItems: {
    id: string;
    description: string;
    assignedTo: string;
    dueDate: string;
    status: 'Pending' | 'In Progress' | 'Completed';
  }[];
  nextMeetingDate?: string;
}

export interface PACCMeeting {
  id: string;
  title: string;
  type: MeetingType;
  status: MeetingStatus;
  organizer: string;
  organizerId: string;
  date: string;
  time: string;
  duration: number; // minutes
  attendees: PACCAttendee[];
  proposalsOnAgenda: ProposalAgendaItem[];
  meetingLink?: string;
  recordingLink?: string;
  transcriptLink?: string;
  mom?: MinutesOfMeeting;
  createdAt: string;
  updatedAt: string;
}
