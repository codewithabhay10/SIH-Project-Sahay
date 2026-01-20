import { FTORecord, BankTransaction, Anomaly, ReconciliationMatch } from './types';

// Mock FTO Records
export const ftoRecords: FTORecord[] = [
  {
    id: '1',
    ftoId: 'FTO-2024-001',
    projectName: 'Rural Infrastructure Development',
    projectId: 'MH-2024-001',
    amount: 125.5,
    issuedAt: '2024-11-15 10:30:00',
    status: 'unreconciled'
  },
  {
    id: '2',
    ftoId: 'FTO-2024-002',
    projectName: 'Healthcare Facility Upgradation',
    projectId: 'KA-2024-003',
    amount: 89.2,
    issuedAt: '2024-11-18 14:20:00',
    status: 'reconciled',
    matchedBankTxId: 'BANK-TX-002'
  },
  {
    id: '3',
    ftoId: 'FTO-2024-003',
    projectName: 'Education Infrastructure Program',
    projectId: 'TN-2024-005',
    amount: 156.8,
    issuedAt: '2024-11-20 09:15:00',
    status: 'unreconciled'
  },
  {
    id: '4',
    ftoId: 'FTO-2024-004',
    projectName: 'Water Supply Enhancement',
    projectId: 'UP-2024-012',
    amount: 234.5,
    issuedAt: '2024-11-22 16:45:00',
    status: 'unreconciled'
  },
  {
    id: '5',
    ftoId: 'FTO-2024-005',
    projectName: 'Skill Development Initiative',
    projectId: 'GJ-2024-008',
    amount: 98.3,
    issuedAt: '2024-11-25 11:00:00',
    status: 'reconciled',
    matchedBankTxId: 'BANK-TX-005'
  },
  {
    id: '6',
    ftoId: 'FTO-2024-006',
    projectName: 'Solar Energy Project',
    projectId: 'RJ-2024-004',
    amount: 178.9,
    issuedAt: '2024-11-26 13:30:00',
    status: 'partially-reconciled',
    matchedBankTxId: 'BANK-TX-007'
  },
  {
    id: '7',
    ftoId: 'FTO-2024-007',
    projectName: 'Urban Housing Scheme',
    projectId: 'WB-2024-002',
    amount: 145.6,
    issuedAt: '2024-11-28 10:20:00',
    status: 'unreconciled'
  }
];

// Mock Bank Transactions
export const bankTransactions: BankTransaction[] = [
  {
    id: '1',
    bankTxId: 'BANK-TX-001',
    date: '2024-11-15',
    amount: 125.5,
    narration: 'PFMS TRANSFER - RURAL INFRA DEV',
    isMatched: false
  },
  {
    id: '2',
    bankTxId: 'BANK-TX-002',
    date: '2024-11-18',
    amount: 89.2,
    narration: 'GOVT TRANSFER - HEALTHCARE FACILITY',
    isMatched: true,
    matchedFTOId: 'FTO-2024-002'
  },
  {
    id: '3',
    bankTxId: 'BANK-TX-003',
    date: '2024-11-20',
    amount: 156.8,
    narration: 'PFMS CR - EDUCATION INFRA',
    isMatched: false
  },
  {
    id: '4',
    bankTxId: 'BANK-TX-004',
    date: '2024-11-21',
    amount: 50.0,
    narration: 'BANK CHARGES - QUARTERLY',
    isMatched: false
  },
  {
    id: '5',
    bankTxId: 'BANK-TX-005',
    date: '2024-11-25',
    amount: 98.3,
    narration: 'PFMS TRANSFER - SKILL DEV INIT',
    isMatched: true,
    matchedFTOId: 'FTO-2024-005'
  },
  {
    id: '6',
    bankTxId: 'BANK-TX-006',
    date: '2024-11-26',
    amount: 234.5,
    narration: 'GOVT CR - WATER SUPPLY',
    isMatched: false
  },
  {
    id: '7',
    bankTxId: 'BANK-TX-007',
    date: '2024-11-26',
    amount: 178.0,
    narration: 'PFMS TRANSFER - SOLAR ENERGY',
    isMatched: true,
    matchedFTOId: 'FTO-2024-006'
  },
  {
    id: '8',
    bankTxId: 'BANK-TX-008',
    date: '2024-11-27',
    amount: 145.6,
    narration: 'GOVT TRANSFER - HOUSING SCHEME',
    isMatched: false
  },
  {
    id: '9',
    bankTxId: 'BANK-TX-009',
    date: '2024-11-28',
    amount: 25.0,
    narration: 'INTEREST CREDIT',
    isMatched: false
  }
];

// Mock Anomalies
export const anomalies: Anomaly[] = [
  {
    id: '1',
    type: 'amount-mismatch',
    severity: 'high',
    ftoId: 'FTO-2024-006',
    bankTxId: 'BANK-TX-007',
    description: 'Amount mismatch: FTO shows ₹178.9 Cr but bank transaction shows ₹178.0 Cr (₹0.9 Cr difference)',
    detectedAt: '2024-11-27 09:00:00',
    amount: 0.9,
    status: 'pending'
  },
  {
    id: '2',
    type: 'missing-bank-tx',
    severity: 'high',
    ftoId: 'FTO-2024-001',
    description: 'FTO issued on 15-Nov but no matching bank transaction found after 13 days',
    detectedAt: '2024-11-28 10:00:00',
    amount: 125.5,
    status: 'pending'
  },
  {
    id: '3',
    type: 'missing-fto',
    severity: 'medium',
    bankTxId: 'BANK-TX-004',
    description: 'Bank transaction for bank charges without corresponding FTO',
    detectedAt: '2024-11-21 16:00:00',
    amount: 50.0,
    status: 'resolved'
  },
  {
    id: '4',
    type: 'date-mismatch',
    severity: 'low',
    ftoId: 'FTO-2024-004',
    bankTxId: 'BANK-TX-006',
    description: 'FTO issued on 22-Nov but bank credit received on 26-Nov (4 days delay)',
    detectedAt: '2024-11-26 14:30:00',
    status: 'pending'
  }
];

// Mock Reconciliation Matches
export const reconciliationMatches: ReconciliationMatch[] = [
  {
    ftoId: 'FTO-2024-002',
    bankTxId: 'BANK-TX-002',
    matchedAt: '2024-11-18 15:00:00',
    matchedBy: 'system',
    isAutoMatched: true,
    confidence: 0.98
  },
  {
    ftoId: 'FTO-2024-005',
    bankTxId: 'BANK-TX-005',
    matchedAt: '2024-11-25 12:00:00',
    matchedBy: 'user@example.com',
    isAutoMatched: false
  },
  {
    ftoId: 'FTO-2024-006',
    bankTxId: 'BANK-TX-007',
    matchedAt: '2024-11-26 16:00:00',
    matchedBy: 'system',
    isAutoMatched: true,
    confidence: 0.85
  }
];

// Auto-match function (simulates AI matching)
export function autoMatchRecords(ftos: FTORecord[], bankTxs: BankTransaction[]): ReconciliationMatch[] {
  const matches: ReconciliationMatch[] = [];
  
  const unmatchedFTOs = ftos.filter(f => f.status === 'unreconciled');
  const unmatchedBankTxs = bankTxs.filter(b => !b.isMatched);

  unmatchedFTOs.forEach(fto => {
    // Try to find exact amount match within 7 days
    const potentialMatch = unmatchedBankTxs.find(tx => {
      const amountMatch = Math.abs(tx.amount - fto.amount) < 0.1;
      const ftoDate = new Date(fto.issuedAt);
      const txDate = new Date(tx.date);
      const daysDiff = Math.abs((txDate.getTime() - ftoDate.getTime()) / (1000 * 60 * 60 * 24));
      const dateMatch = daysDiff <= 7;
      
      return amountMatch && dateMatch && !tx.isMatched;
    });

    if (potentialMatch) {
      matches.push({
        ftoId: fto.ftoId,
        bankTxId: potentialMatch.bankTxId,
        matchedAt: new Date().toISOString(),
        matchedBy: 'system',
        isAutoMatched: true,
        confidence: 0.95
      });
    }
  });

  return matches;
}

// Filter functions
export function filterFTOs(
  ftos: FTORecord[],
  filters: { status?: string; dateFrom?: string; dateTo?: string; search?: string }
): FTORecord[] {
  return ftos.filter(fto => {
    if (filters.status && filters.status !== 'all' && fto.status !== filters.status) {
      return false;
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return (
        fto.ftoId.toLowerCase().includes(search) ||
        fto.projectName.toLowerCase().includes(search) ||
        fto.projectId.toLowerCase().includes(search)
      );
    }
    return true;
  });
}

export function filterBankTransactions(
  txs: BankTransaction[],
  filters: { matched?: boolean; dateFrom?: string; dateTo?: string; search?: string }
): BankTransaction[] {
  return txs.filter(tx => {
    if (filters.matched !== undefined && tx.isMatched !== filters.matched) {
      return false;
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return (
        tx.bankTxId.toLowerCase().includes(search) ||
        tx.narration.toLowerCase().includes(search)
      );
    }
    return true;
  });
}
