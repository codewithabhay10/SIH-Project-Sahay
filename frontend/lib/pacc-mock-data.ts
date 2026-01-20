import { PACCMeeting, PACCAttendee, ProposalAgendaItem, MinutesOfMeeting } from './types';

export const mockAttendees: PACCAttendee[] = [
  {
    id: 'ATT001',
    name: 'Dr. Rajesh Kumar',
    role: 'PACC Chairperson',
    email: 'rajesh.kumar@gov.in',
    avatar: 'RK'
  },
  {
    id: 'ATT002',
    name: 'Mrs. Priya Sharma',
    role: 'State Representative',
    email: 'priya.sharma@gov.in',
    avatar: 'PS'
  },
  {
    id: 'ATT003',
    name: 'Mr. Amit Patel',
    role: 'Technical Expert',
    email: 'amit.patel@gov.in',
    avatar: 'AP'
  },
  {
    id: 'ATT004',
    name: 'Dr. Sunita Rao',
    role: 'Financial Advisor',
    email: 'sunita.rao@gov.in',
    avatar: 'SR'
  },
  {
    id: 'ATT005',
    name: 'Mr. Vikram Singh',
    role: 'Ministry Representative',
    email: 'vikram.singh@gov.in',
    avatar: 'VS'
  }
];

export const mockProposals: ProposalAgendaItem[] = [
  {
    id: 'PROP001',
    proposalId: 'PROP-2024-001',
    proposalTitle: 'Youth Skill Development Program',
    proposer: 'Maharashtra State',
    category: 'Skill Development',
    budget: 5000000
  },
  {
    id: 'PROP002',
    proposalId: 'PROP-2024-002',
    proposalTitle: 'Rural Infrastructure Improvement',
    proposer: 'Gujarat State',
    category: 'Infrastructure',
    budget: 8500000
  },
  {
    id: 'PROP003',
    proposalId: 'PROP-2024-006',
    proposalTitle: 'Community Health Centers',
    proposer: 'Karnataka State',
    category: 'Infrastructure',
    budget: 6200000
  },
  {
    id: 'PROP004',
    proposalId: 'PROP-2024-003',
    proposalTitle: 'Women Empowerment Initiative',
    proposer: 'Rajasthan State',
    category: 'Income Generation',
    budget: 4500000
  },
  {
    id: 'PROP005',
    proposalId: 'PROP-2024-007',
    proposalTitle: 'Artisan Support Scheme',
    proposer: 'Uttar Pradesh State',
    category: 'Income Generation',
    budget: 3800000
  }
];

export const mockMOM: MinutesOfMeeting = {
  id: 'MOM001',
  meetingId: 'MEET003',
  generatedAt: '2024-11-28T12:30:00Z',
  generatedBy: 'Dr. Rajesh Kumar',
  attendees: [
    'Dr. Rajesh Kumar - PACC Chairperson',
    'Mrs. Priya Sharma - State Representative',
    'Mr. Amit Patel - Technical Expert',
    'Dr. Sunita Rao - Financial Advisor',
    'Mr. Vikram Singh - Ministry Representative'
  ],
  agenda: [
    'Review of PROP-2024-003 - Women Empowerment Initiative',
    'Review of PROP-2024-007 - Artisan Support Scheme'
  ],
  discussions: [
    'Detailed presentation on Women Empowerment Initiative targeting 5000 beneficiaries',
    'Financial sustainability concerns raised and addressed',
    'Implementation timeline reviewed and approved',
    'Artisan Support Scheme alignment with national policy discussed',
    'Budget allocation and convergence opportunities identified'
  ],
  decisions: [
    {
      proposalId: 'PROP-2024-003',
      decision: 'Approved',
      comments: 'Approved with recommendation to include monitoring framework. Budget sanctioned: ₹45,00,000',
      votesFor: 5,
      votesAgainst: 0
    },
    {
      proposalId: 'PROP-2024-007',
      decision: 'Needs Revision',
      comments: 'Requires detailed beneficiary selection criteria and impact assessment framework before final approval',
      votesFor: 2,
      votesAgainst: 3
    }
  ],
  actionItems: [
    {
      id: 'AI001',
      description: 'Issue sanction letter for Women Empowerment Initiative',
      assignedTo: 'Dr. Rajesh Kumar',
      dueDate: '2024-12-05',
      status: 'Completed'
    },
    {
      id: 'AI002',
      description: 'Request revised proposal for Artisan Support Scheme with additional criteria',
      assignedTo: 'Mrs. Priya Sharma',
      dueDate: '2024-12-15',
      status: 'In Progress'
    },
    {
      id: 'AI003',
      description: 'Prepare monitoring framework template',
      assignedTo: 'Mr. Amit Patel',
      dueDate: '2024-12-10',
      status: 'Pending'
    }
  ],
  nextMeetingDate: '2024-12-10'
};

export const mockMeetings: PACCMeeting[] = [
  {
    id: 'MEET001',
    title: 'PACC Review - December 2024 Batch 1',
    type: 'Review',
    status: 'Upcoming',
    organizer: 'Dr. Rajesh Kumar',
    organizerId: 'ATT001',
    date: '2024-12-10',
    time: '10:00 AM',
    duration: 120,
    attendees: [mockAttendees[0], mockAttendees[1], mockAttendees[2], mockAttendees[3]],
    proposalsOnAgenda: [mockProposals[0], mockProposals[1]],
    meetingLink: 'https://meet.gov.in/pacc-dec-2024-batch1',
    createdAt: '2024-11-25T08:00:00Z',
    updatedAt: '2024-11-25T08:00:00Z'
  },
  {
    id: 'MEET002',
    title: 'Emergency PACC Session - Infrastructure Projects',
    type: 'Emergency',
    status: 'Upcoming',
    organizer: 'Mrs. Priya Sharma',
    organizerId: 'ATT002',
    date: '2024-12-08',
    time: '3:00 PM',
    duration: 90,
    attendees: [mockAttendees[0], mockAttendees[1], mockAttendees[4]],
    proposalsOnAgenda: [mockProposals[2]],
    meetingLink: 'https://meet.gov.in/pacc-emergency-infra',
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-01T10:00:00Z'
  },
  {
    id: 'MEET003',
    title: 'PACC Review - November 2024',
    type: 'Review',
    status: 'Completed',
    organizer: 'Dr. Rajesh Kumar',
    organizerId: 'ATT001',
    date: '2024-11-28',
    time: '10:00 AM',
    duration: 180,
    attendees: mockAttendees,
    proposalsOnAgenda: [mockProposals[3], mockProposals[4]],
    meetingLink: 'https://meet.gov.in/pacc-nov-2024',
    recordingLink: 'https://recordings.gov.in/pacc-nov-2024.mp4',
    transcriptLink: 'https://recordings.gov.in/pacc-nov-2024-transcript.pdf',
    mom: mockMOM,
    createdAt: '2024-11-15T08:00:00Z',
    updatedAt: '2024-11-28T13:30:00Z'
  },
  {
    id: 'MEET004',
    title: 'PACC Review - October 2024',
    type: 'Review',
    status: 'Completed',
    organizer: 'Dr. Rajesh Kumar',
    organizerId: 'ATT001',
    date: '2024-10-15',
    time: '2:00 PM',
    duration: 150,
    attendees: [mockAttendees[0], mockAttendees[2], mockAttendees[3], mockAttendees[4]],
    proposalsOnAgenda: [],
    meetingLink: 'https://meet.gov.in/pacc-oct-2024',
    recordingLink: 'https://recordings.gov.in/pacc-oct-2024.mp4',
    createdAt: '2024-10-01T08:00:00Z',
    updatedAt: '2024-10-15T16:30:00Z'
  }
];

export const getPACCMeetings = () => mockMeetings;

export const getUpcomingMeetings = () => 
  mockMeetings.filter(m => m.status === 'Upcoming').sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

export const getCompletedMeetings = () => 
  mockMeetings.filter(m => m.status === 'Completed').sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

export const getMeetingById = (id: string) => 
  mockMeetings.find(m => m.id === id);
