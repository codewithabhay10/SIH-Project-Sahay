"use client";

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import { 
  ftoRecords, 
  bankTransactions, 
  anomalies,
  autoMatchRecords,
  filterFTOs,
  filterBankTransactions
} from '@/lib/reconciliation-mock-data';
import { FTORecord, BankTransaction, Anomaly, FTOStatus, AnomalyType } from '@/lib/types';

// Consistent date formatting function to avoid hydration errors
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${month}/${day}/${year}, ${hours}:${minutes}`;
};

export default function SNAReconciliationPage() {
  const [ftos, setFtos] = useState<FTORecord[]>(ftoRecords);
  const [bankTxs, setBankTxs] = useState<BankTransaction[]>(bankTransactions);
  const [detectedAnomalies, setDetectedAnomalies] = useState<Anomaly[]>(anomalies);
  
  const [selectedFTO, setSelectedFTO] = useState<FTORecord | null>(null);
  const [selectedBankTx, setSelectedBankTx] = useState<BankTransaction | null>(null);
  
  const [dateFrom, setDateFrom] = useState('2024-11-01');
  const [dateTo, setDateTo] = useState('2024-11-30');
  const [accountFilter, setAccountFilter] = useState('all');
  const [ftoSearchQuery, setFtoSearchQuery] = useState('');
  const [bankSearchQuery, setBankSearchQuery] = useState('');
  const [isAutoMatching, setIsAutoMatching] = useState(false);

  // Filtered data
  const filteredFTOs = useMemo(() => {
    const sorted = filterFTOs(ftos, { search: ftoSearchQuery });
    // Sort: unreconciled first
    return sorted.sort((a, b) => {
      if (a.status === 'unreconciled' && b.status !== 'unreconciled') return -1;
      if (a.status !== 'unreconciled' && b.status === 'unreconciled') return 1;
      return 0;
    });
  }, [ftos, ftoSearchQuery]);

  const filteredBankTxs = useMemo(() => {
    return filterBankTransactions(bankTxs, { search: bankSearchQuery });
  }, [bankTxs, bankSearchQuery]);

  const unreconciledCount = ftos.filter(f => f.status === 'unreconciled').length;
  const totalFTOAmount = ftos.reduce((sum, f) => sum + f.amount, 0);
  const totalBankAmount = bankTxs.filter(b => b.isMatched).reduce((sum, b) => sum + b.amount, 0);

  const handleManualMatch = () => {
    if (!selectedFTO || !selectedBankTx) {
      alert('Please select both an FTO and a Bank Transaction to match');
      return;
    }

    // Update FTO
    setFtos(prev => prev.map(f => 
      f.id === selectedFTO.id 
        ? { ...f, status: 'reconciled' as FTOStatus, matchedBankTxId: selectedBankTx.bankTxId }
        : f
    ));

    // Update Bank Transaction
    setBankTxs(prev => prev.map(tx =>
      tx.id === selectedBankTx.id
        ? { ...tx, isMatched: true, matchedFTOId: selectedFTO.ftoId }
        : tx
    ));

    setSelectedFTO(null);
    setSelectedBankTx(null);
  };

  const handleUnmatch = (fto: FTORecord) => {
    if (!fto.matchedBankTxId) return;

    // Update FTO
    setFtos(prev => prev.map(f =>
      f.id === fto.id
        ? { ...f, status: 'unreconciled' as FTOStatus, matchedBankTxId: undefined }
        : f
    ));

    // Update Bank Transaction
    setBankTxs(prev => prev.map(tx =>
      tx.matchedFTOId === fto.ftoId
        ? { ...tx, isMatched: false, matchedFTOId: undefined }
        : tx
    ));
  };

  const handleAutoMatch = async () => {
    setIsAutoMatching(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const matches = autoMatchRecords(ftos, bankTxs);
    
    // Apply matches
    matches.forEach(match => {
      setFtos(prev => prev.map(f =>
        f.ftoId === match.ftoId
          ? { ...f, status: 'reconciled' as FTOStatus, matchedBankTxId: match.bankTxId }
          : f
      ));
      
      setBankTxs(prev => prev.map(tx =>
        tx.bankTxId === match.bankTxId
          ? { ...tx, isMatched: true, matchedFTOId: match.ftoId }
          : tx
      ));
    });
    
    setIsAutoMatching(false);
    alert(`Auto-matched ${matches.length} records successfully!`);
  };

  const handleExport = () => {
    console.log('Exporting reconciliation data...');
    alert('Export functionality will download CSV/Excel file');
  };

  const getFTOStatusBadge = (status: FTOStatus) => {
    const styles: Record<FTOStatus, string> = {
      'unreconciled': 'bg-red-100 text-red-700',
      'reconciled': 'bg-green-100 text-green-700',
      'partially-reconciled': 'bg-yellow-100 text-yellow-700',
      'disputed': 'bg-orange-100 text-orange-700'
    };
    const labels: Record<FTOStatus, string> = {
      'unreconciled': 'Unreconciled',
      'reconciled': 'Reconciled',
      'partially-reconciled': 'Partial',
      'disputed': 'Disputed'
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
  };

  const getAnomalyBadge = (type: AnomalyType) => {
    const styles: Record<AnomalyType, string> = {
      'amount-mismatch': 'bg-red-100 text-red-700',
      'missing-fto': 'bg-orange-100 text-orange-700',
      'missing-bank-tx': 'bg-yellow-100 text-yellow-700',
      'duplicate': 'bg-purple-100 text-purple-700',
      'date-mismatch': 'bg-blue-100 text-blue-700'
    };
    const labels: Record<AnomalyType, string> = {
      'amount-mismatch': 'Amount Mismatch',
      'missing-fto': 'Missing FTO',
      'missing-bank-tx': 'Missing Bank Tx',
      'duplicate': 'Duplicate',
      'date-mismatch': 'Date Mismatch'
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type]}`}>{labels[type]}</span>;
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#2C3E50]">SNA Fund Reconciliation</h1>
              <p className="text-gray-600 mt-1">Match FTO records with bank transactions</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleAutoMatch}
                disabled={isAutoMatching}
                className="px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isAutoMatching ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Auto-matching...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1V15M1 8H15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Auto-match
                  </>
                )}
              </button>
              
              <button
                onClick={handleManualMatch}
                disabled={!selectedFTO || !selectedBankTx}
                className="px-4 py-2.5 bg-[#EA9000] text-white font-medium rounded-lg hover:bg-[#d88000] transition-colors disabled:opacity-50"
              >
                Manual Match
              </button>
              
              <button
                onClick={handleExport}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.66667 6.66667L8 10L11.3333 6.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 10V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Export
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            
            <select value={accountFilter} onChange={(e) => setAccountFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="all">All SNA Accounts</option>
              <option value="sna1">SNA-MH-001</option>
              <option value="sna2">SNA-KA-001</option>
              <option value="sna3">SNA-TN-001</option>
            </select>
            
            <div className="flex-1"></div>
            
            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-gray-500">Unreconciled:</span>
                <span className="ml-2 font-semibold text-red-600">{unreconciledCount}</span>
              </div>
              <div>
                <span className="text-gray-500">FTO Total:</span>
                <span className="ml-2 font-semibold text-gray-900">₹{totalFTOAmount.toFixed(2)} Cr</span>
              </div>
              <div>
                <span className="text-gray-500">Matched:</span>
                <span className="ml-2 font-semibold text-green-600">₹{totalBankAmount.toFixed(2)} Cr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Three-column layout */}
        <div className="grid grid-cols-12 gap-6 p-8">
          {/* Left: FTO List */}
          <div className="col-span-4 bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">FTO Records</h3>
              <input
                type="text"
                placeholder="Search FTO..."
                value={ftoSearchQuery}
                onChange={(e) => setFtoSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            
            <div className="overflow-y-auto scrollbar-hide" style={{ maxHeight: '600px' }}>
              {filteredFTOs.map(fto => (
                <div
                  key={fto.id}
                  onClick={() => setSelectedFTO(selectedFTO?.id === fto.id ? null : fto)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                    selectedFTO?.id === fto.id ? 'bg-orange-50 border-l-4 border-l-[#EA9000]' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-sm text-gray-900">{fto.ftoId}</p>
                    {getFTOStatusBadge(fto.status)}
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{fto.projectName}</p>
                  <p className="text-xs text-gray-500 mb-2">{fto.projectId}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-[#EA9000]">₹{fto.amount.toFixed(2)} Cr</p>
                    <p className="text-xs text-gray-500">{formatDate(fto.issuedAt)}</p>
                  </div>
                  {fto.matchedBankTxId && (
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs text-green-600">✓ Matched: {fto.matchedBankTxId}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnmatch(fto);
                        }}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Unmatch
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Middle: Bank Transactions */}
          <div className="col-span-4 bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Bank Transactions</h3>
              <input
                type="text"
                placeholder="Search bank tx..."
                value={bankSearchQuery}
                onChange={(e) => setBankSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            
            <div className="overflow-y-auto scrollbar-hide" style={{ maxHeight: '600px' }}>
              {filteredBankTxs.map(tx => (
                <div
                  key={tx.id}
                  onClick={() => setSelectedBankTx(selectedBankTx?.id === tx.id ? null : tx)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                    selectedBankTx?.id === tx.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50'
                  } ${tx.isMatched ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-sm text-gray-900">{tx.bankTxId}</p>
                    {tx.isMatched && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">Matched</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{tx.narration}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-blue-600">₹{tx.amount.toFixed(2)} Cr</p>
                    <p className="text-xs text-gray-500">{formatDate(tx.date)}</p>
                  </div>
                  {tx.matchedFTOId && (
                    <p className="text-xs text-green-600 mt-2">✓ Matched: {tx.matchedFTOId}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Reconciliation Panel */}
          <div className="col-span-4 space-y-6">
            {/* Match Panel */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Reconciliation Panel</h3>
              
              {selectedFTO && (
                <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-xs text-gray-600 mb-1">Selected FTO</p>
                  <p className="font-semibold text-sm">{selectedFTO.ftoId}</p>
                  <p className="text-lg font-bold text-[#EA9000]">₹{selectedFTO.amount.toFixed(2)} Cr</p>
                </div>
              )}
              
              {selectedBankTx && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-gray-600 mb-1">Selected Bank Transaction</p>
                  <p className="font-semibold text-sm">{selectedBankTx.bankTxId}</p>
                  <p className="text-lg font-bold text-blue-600">₹{selectedBankTx.amount.toFixed(2)} Cr</p>
                </div>
              )}
              
              {selectedFTO && selectedBankTx && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Difference</p>
                  <p className={`text-sm font-bold ${Math.abs(selectedFTO.amount - selectedBankTx.amount) < 0.1 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(selectedFTO.amount - selectedBankTx.amount) < 0.1 
                      ? '✓ Exact Match'
                      : `₹${Math.abs(selectedFTO.amount - selectedBankTx.amount).toFixed(2)} Cr difference`
                    }
                  </p>
                </div>
              )}
              
              {!selectedFTO && !selectedBankTx && (
                <p className="text-sm text-gray-500 text-center py-8">
                  Select an FTO and Bank Transaction to match
                </p>
              )}
            </div>

            {/* Anomalies */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Anomalies ({detectedAnomalies.filter(a => a.status === 'pending').length})</h3>
              </div>
              
              <div className="divide-y divide-gray-100" style={{ maxHeight: '400px', overflow: 'auto' }}>
                {detectedAnomalies.filter(a => a.status === 'pending').map(anomaly => (
                  <div key={anomaly.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      {getAnomalyBadge(anomaly.type)}
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        anomaly.severity === 'high' ? 'bg-red-100 text-red-700' :
                        anomaly.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {anomaly.severity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 mb-2">{anomaly.description}</p>
                    <p className="text-xs text-gray-500">{formatDateTime(anomaly.detectedAt)}</p>
                    {anomaly.amount && (
                      <p className="text-xs font-semibold text-red-600 mt-1">Amount: ₹{anomaly.amount.toFixed(2)} Cr</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
    </DashboardLayout>
  );
}
