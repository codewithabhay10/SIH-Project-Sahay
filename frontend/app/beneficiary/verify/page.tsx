"use client";

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import { 
  mockBeneficiaries, 
  filterBeneficiaries,
  BeneficiaryForVerification,
  VerificationStatus,
  AadhaarStatus,
  BankStatus
} from '@/lib/beneficiary-verification-mock-data';

export default function BeneficiaryVerifyPage() {
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryForVerification[]>(mockBeneficiaries);
  const [filterStatus, setFilterStatus] = useState<'all' | VerificationStatus>('unverified');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<BeneficiaryForVerification | null>(null);

  const filteredBeneficiaries = useMemo(() => {
    let filtered = filterBeneficiaries(beneficiaries, filterStatus);
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b => 
        b.beneficiaryId.toLowerCase().includes(query) ||
        b.name.toLowerCase().includes(query) ||
        b.projectName.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [beneficiaries, filterStatus, searchQuery]);

  const handleMarkVerified = async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setBeneficiaries(prev => prev.map(b => 
      b.id === id ? { ...b, verificationStatus: 'verified' as VerificationStatus } : b
    ));
  };

  const handleFlag = async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setBeneficiaries(prev => prev.map(b => 
      b.id === id ? { ...b, verificationStatus: 'flagged' as VerificationStatus } : b
    ));
  };

  const handleRequestDocuments = async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setBeneficiaries(prev => prev.map(b => 
      b.id === id ? { ...b, verificationStatus: 'pending-documents' as VerificationStatus } : b
    ));
  };

  const getStatusBadge = (status: VerificationStatus) => {
    const styles: Record<VerificationStatus, string> = {
      'unverified': 'bg-yellow-100 text-yellow-700',
      'verified': 'bg-green-100 text-green-700',
      'flagged': 'bg-red-100 text-red-700',
      'pending-documents': 'bg-blue-100 text-blue-700'
    };
    const labels: Record<VerificationStatus, string> = {
      'unverified': 'Unverified',
      'verified': 'Verified',
      'flagged': 'Flagged',
      'pending-documents': 'Pending Docs'
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
  };

  const getAadhaarBadge = (status: AadhaarStatus) => {
    const styles: Record<AadhaarStatus, string> = {
      'verified': 'bg-green-100 text-green-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'failed': 'bg-red-100 text-red-700'
    };
    const icons: Record<AadhaarStatus, string> = {
      'verified': '✓',
      'pending': '⏱',
      'failed': '✗'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getBankBadge = (status: BankStatus) => {
    const styles: Record<BankStatus, string> = {
      'verified': 'bg-green-100 text-green-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'failed': 'bg-red-100 text-red-700'
    };
    const icons: Record<BankStatus, string> = {
      'verified': '✓',
      'pending': '⏱',
      'failed': '✗'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const stats = {
    total: beneficiaries.length,
    unverified: beneficiaries.filter(b => b.verificationStatus === 'unverified').length,
    verified: beneficiaries.filter(b => b.verificationStatus === 'verified').length,
    flagged: beneficiaries.filter(b => b.verificationStatus === 'flagged').length,
    pendingDocs: beneficiaries.filter(b => b.verificationStatus === 'pending-documents').length,
  };

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#2C3E50]">Beneficiary Verification</h1>
              <p className="text-gray-600 mt-1">Review and verify registered beneficiaries</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-yellow-700">Unverified</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.unverified}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-700">Verified</p>
              <p className="text-2xl font-bold text-green-700">{stats.verified}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-red-700">Flagged</p>
              <p className="text-2xl font-bold text-red-700">{stats.flagged}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-700">Pending Docs</p>
              <p className="text-2xl font-bold text-blue-700">{stats.pendingDocs}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="unverified">Unverified</option>
              <option value="verified">Verified</option>
              <option value="flagged">Flagged</option>
              <option value="pending-documents">Pending Documents</option>
            </select>

            <input
              type="text"
              placeholder="Search by ID, name, or project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 max-w-md px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="p-8">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Beneficiary ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Aadhaar Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Bank Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBeneficiaries.map(beneficiary => (
                    <tr 
                      key={beneficiary.id} 
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedBeneficiary(beneficiary)}
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-sm text-gray-900">{beneficiary.beneficiaryId}</p>
                        <p className="text-xs text-gray-500">Reg: {beneficiary.registeredDate}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-sm text-gray-900">{beneficiary.name}</p>
                        <p className="text-xs text-gray-500">{beneficiary.mobile}</p>
                      </td>
                      <td className="px-6 py-4">{getAadhaarBadge(beneficiary.aadhaarStatus)}</td>
                      <td className="px-6 py-4">{getBankBadge(beneficiary.bankStatus)}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{beneficiary.projectName}</p>
                        <p className="text-xs text-gray-500">{beneficiary.projectId}</p>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(beneficiary.verificationStatus)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                          {beneficiary.verificationStatus !== 'verified' && (
                            <button
                              onClick={() => handleMarkVerified(beneficiary.id)}
                              disabled={beneficiary.aadhaarStatus !== 'verified' || beneficiary.bankStatus !== 'verified'}
                              className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title={beneficiary.aadhaarStatus !== 'verified' || beneficiary.bankStatus !== 'verified' ? 'Both Aadhaar and Bank must be verified first' : ''}
                            >
                              Verify
                            </button>
                          )}
                          {beneficiary.verificationStatus !== 'flagged' && (
                            <button
                              onClick={() => handleFlag(beneficiary.id)}
                              className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors"
                            >
                              Flag
                            </button>
                          )}
                          {beneficiary.verificationStatus !== 'pending-documents' && (
                            <button
                              onClick={() => handleRequestDocuments(beneficiary.id)}
                              className="px-3 py-1.5 border border-blue-600 text-blue-600 text-xs font-medium rounded hover:bg-blue-50 transition-colors"
                            >
                              Request Docs
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredBeneficiaries.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No beneficiaries found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedBeneficiary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedBeneficiary(null)}>
          <div className="bg-white rounded-lg max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Beneficiary Details</h2>
              <button onClick={() => setSelectedBeneficiary(null)} className="text-gray-400 hover:text-gray-600">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Beneficiary ID</p>
                  <p className="font-semibold text-gray-900">{selectedBeneficiary.beneficiaryId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-semibold text-gray-900">{selectedBeneficiary.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Mobile</p>
                  <p className="font-medium text-gray-900">{selectedBeneficiary.mobile}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Aadhaar (Last 4)</p>
                  <p className="font-medium text-gray-900">XXXX-XXXX-{selectedBeneficiary.aadhaarLast4}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Registered Date</p>
                  <p className="font-medium text-gray-900">{selectedBeneficiary.registeredDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Project</p>
                  <p className="font-medium text-gray-900">{selectedBeneficiary.projectName}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Verification Status</p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Aadhaar</p>
                    {getAadhaarBadge(selectedBeneficiary.aadhaarStatus)}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Bank</p>
                    {getBankBadge(selectedBeneficiary.bankStatus)}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Overall</p>
                    {getStatusBadge(selectedBeneficiary.verificationStatus)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
