"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import ReleaseFundsModal from '@/components/release-funds-modal';
import { fundQueueProposals, filterProposals } from '@/lib/fund-queue-mock-data';
import { FundProposal, PACCDecision, UCStatus, ProposalStatus } from '@/lib/types';
import DashboardLayout from '@/components/dashboard-layout';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000',
  withCredentials: true,
});

interface BackendProposal {
  _id: string;
  title: string;
  category?: string;
  district?: string;
  estimated_budget?: number;
  status?: string;
  createdAt?: string;
  project?: {
    state?: string;
    district?: string;
    project_name?: string;
  };
}

export default function FundQueuePage() {
  const router = useRouter();
  const [selectedProposal, setSelectedProposal] = useState<any | null>(null);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [proposalToRelease, setProposalToRelease] = useState<any | null>(null);
  
  // Backend data
  const [proposals, setProposals] = useState<BackendProposal[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [stateFilter, setStateFilter] = useState('All States');
  const [paccFilter, setPaccFilter] = useState('All Decisions');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch proposals from backend
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        const response = await api.get('/proposals');
        setProposals(response.data.proposals || []);
      } catch (error: any) {
        console.error('Failed to fetch proposals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  // Filter proposals
  const filteredProposals = useMemo(() => {
    return proposals.filter(proposal => {
      // State filter
      if (stateFilter !== 'All States') {
        const state = proposal.project?.state || 'MH';
        if (state !== stateFilter) return false;
      }

      // Status filter
      if (statusFilter !== 'All Status') {
        if (proposal.status?.toLowerCase() !== statusFilter.toLowerCase()) return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = proposal.title?.toLowerCase().includes(query);
        const matchesId = proposal._id?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesId) return false;
      }

      return true;
    });
  }, [proposals, stateFilter, statusFilter, searchQuery]);

  const handleRelease = (proposal: BackendProposal) => {
    setProposalToRelease(proposal);
    setShowReleaseModal(true);
  };

  const handleConfirmRelease = (paymentMode: 'NEFT' | 'RTGS' | 'ACH') => {
    console.log('Releasing funds via', paymentMode, proposalToRelease);
    setShowReleaseModal(false);
    setProposalToRelease(null);
    // In real app, would update proposal status to 'processing'
  };

  const getPACCBadge = (decision: PACCDecision) => {
    const styles: Record<PACCDecision, string> = {
      'approved': 'bg-green-100 text-green-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'conditionally-approved': 'bg-blue-100 text-blue-700',
      'rejected': 'bg-red-100 text-red-700'
    };
    const labels: Record<PACCDecision, string> = {
      'approved': 'Approved',
      'pending': 'Pending',
      'conditionally-approved': 'Conditional',
      'rejected': 'Rejected'
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[decision]}`}>{labels[decision]}</span>;
  };

  const getUCBadge = (status: UCStatus) => {
    const styles: Record<UCStatus, string> = {
      'submitted': 'bg-blue-100 text-blue-700',
      'approved': 'bg-green-100 text-green-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'overdue': 'bg-red-100 text-red-700',
      'not-required': 'bg-gray-100 text-gray-700'
    };
    const labels: Record<UCStatus, string> = {
      'submitted': 'Submitted',
      'approved': 'Approved',
      'pending': 'Pending',
      'overdue': 'Overdue',
      'not-required': 'N/A'
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
  };

  const getStatusBadge = (status: ProposalStatus) => {
    const styles: Record<ProposalStatus, string> = {
      'pending-release': 'bg-orange-100 text-orange-700',
      'processing': 'bg-blue-100 text-blue-700',
      'completed': 'bg-green-100 text-green-700',
      'on-hold': 'bg-yellow-100 text-yellow-700',
      'rejected': 'bg-red-100 text-red-700'
    };
    const labels: Record<ProposalStatus, string> = {
      'pending-release': 'Pending Release',
      'processing': 'Processing',
      'completed': 'Completed',
      'on-hold': 'On Hold',
      'rejected': 'Rejected'
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
  };

  const getStatusColor = (status?: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'draft') return 'bg-gray-100 text-gray-700';
    if (s === 'submitted') return 'bg-blue-100 text-blue-700';
    if (s === 'in_progress') return 'bg-yellow-100 text-yellow-700';
    if (s === 'approved') return 'bg-green-100 text-green-700';
    if (s === 'rejected') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-[#2C3E50]">Fund Release Queue</h1>
            <p className="text-gray-600 mt-1">Review and release funds to state SNA accounts</p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>All States</option>
              <option>Maharashtra</option>
              <option>Karnataka</option>
              <option>Tamil Nadu</option>
              <option>Gujarat</option>
            </select>
            
            <select value={paccFilter} onChange={(e) => setPaccFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>All Decisions</option>
              <option value="approved">Approved</option>
              <option value="conditionally-approved">Conditional</option>
              <option value="pending">Pending</option>
            </select>

            <input
              type="text"
              placeholder="Search proposals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Proposal ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      State
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      District
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading && (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-6 py-10 text-center text-sm text-gray-500"
                      >
                        Loading proposals...
                      </td>
                    </tr>
                  )}
                  {!loading && filteredProposals.length === 0 && (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-6 py-10 text-center text-sm text-gray-500"
                      >
                        No proposals found.
                      </td>
                    </tr>
                  )}
                  {!loading && filteredProposals.map((proposal) => (
                    <tr key={proposal._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {proposal._id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {proposal.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {proposal.project?.project_name || ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {proposal.project?.state || "MH"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {proposal.district || proposal.project?.district || ""}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {proposal.category}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(proposal.estimated_budget)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            proposal.status
                          )}`}
                        >
                          {proposal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {proposal.createdAt
                          ? new Date(proposal.createdAt).toLocaleDateString(
                              "en-IN"
                            )
                          : ""}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={async () => {
                              const current = (
                                proposal.status || ""
                              ).toLowerCase();
                              if (current === "submitted") {
                                try {
                                  // call backend to transition to in_progress
                                  await api.patch(
                                    `/proposals/${proposal._id}/status`,
                                    {
                                      status: "in_progress",
                                    }
                                  );
                                  // optimistically update local state
                                  setProposals((prev) =>
                                    prev.map((p) =>
                                      p._id === proposal._id
                                        ? { ...p, status: "in_progress" }
                                        : p
                                    )
                                  );
                                } catch (err: any) {
                                  alert(
                                    err?.response?.data?.message ||
                                      "Failed to update status to In Progress"
                                  );
                                }
                              }
                              router.push(`/proposals/${proposal._id}`);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                            title="View Details"
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              className="text-gray-600"
                            >
                              <path
                                d="M1 9C1 9 4 3 9 3C14 3 17 9 17 9C17 9 14 15 9 15C4 15 1 9 1 9Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <circle
                                cx="9"
                                cy="9"
                                r="2.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRelease(proposal);
                            }}
                            disabled={proposal.status?.toLowerCase() !== 'approved'}
                            className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Release Funds"
                          >
                            Release
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                {filteredProposals.length > 0 ? (
                  <>
                    Showing 1 to {filteredProposals.length} of{" "}
                    {filteredProposals.length} proposals
                  </>
                ) : (
                  <>No proposals to display</>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>
                <button className="px-3 py-1 text-sm text-white bg-[#EA9000] border border-[#EA9000] rounded">
                  1
                </button>
                <button className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Release Modal */}
      <ReleaseFundsModal
        isOpen={showReleaseModal}
        onClose={() => {
          setShowReleaseModal(false);
          setProposalToRelease(null);
        }}
        proposals={proposalToRelease ? [proposalToRelease] : []}
        onConfirm={handleConfirmRelease}
      />
    </DashboardLayout>
  );
}
