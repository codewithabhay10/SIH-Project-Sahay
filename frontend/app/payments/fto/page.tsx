"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import CreateFTOModal from "@/components/create-fto-modal";
import {
  mockFTOs,
  mockBeneficiariesForFTO,
  getVerifiedBeneficiaries,
  type FTOManagement,
  type BeneficiaryForFTO,
  type FTOManagementStatus,
} from "@/lib/fto-mock-data";

export default function FTOManagementPage() {
  const [ftos, setFtos] = useState<FTOManagement[]>(mockFTOs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleCreateFTO = (selectedBeneficiaryIds: string[], authFile: File | null) => {
    const selectedBeneficiaries = mockBeneficiariesForFTO.filter(b =>
      selectedBeneficiaryIds.includes(b.id)
    );
    
    const totalAmount = selectedBeneficiaries.reduce((sum, b) => sum + b.amount, 0);
    const projectName = selectedBeneficiaries[0]?.projectName || "Mixed Projects";
    const projectId = selectedBeneficiaries[0]?.projectId || "MIXED";

    const newFTO: FTOManagement = {
      id: String(ftos.length + 1),
      ftoId: `FTO-2024-${String(ftos.length + 1).padStart(3, '0')}`,
      projectId,
      projectName,
      beneficiaryCount: selectedBeneficiaries.length,
      totalAmount,
      status: 'draft',
      createdAt: new Date().toISOString(),
      createdBy: 'IA Officer',
      authorizationDoc: authFile?.name,
      beneficiaryIds: selectedBeneficiaryIds,
    };

    setFtos([newFTO, ...ftos]);
    setIsModalOpen(false);
  };

  const handleSendToPFMS = (ftoId: string) => {
    setFtos(ftos.map(fto => 
      fto.id === ftoId
        ? {
            ...fto,
            status: 'sent' as FTOManagementStatus,
            sentAt: new Date().toISOString(),
            pfmsReferenceId: `PFMS-REF-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
          }
        : fto
    ));
  };

  const filteredFTOs = ftos.filter(fto => {
    const matchesSearch = 
      fto.ftoId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fto.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || fto.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: FTOManagementStatus) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-700',
      pending: 'bg-yellow-100 text-yellow-700',
      sent: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700',
    };
    return styles[status] || styles.draft;
  };

  const verifiedBeneficiaries = getVerifiedBeneficiaries();

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-gray-900">FTO / DBT Management</h1>
              <p className="text-gray-600 text-sm mt-1">Create and manage Fund Transfer Orders for direct benefit transfer</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                  <path d="M12 15V3"></path>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <path d="m7 10 5 5 5-5"></path>
                </svg>
                <span>Export</span>
              </button>
              <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                  <path d="M5 12h14"></path>
                  <path d="M12 5v14"></path>
                </svg>
                <span>Create FTO</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Total FTOs</p>
              <p className="text-xl text-gray-900">{ftos.length}</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="text-xs text-gray-700 mb-1">Draft</p>
              <p className="text-xl text-gray-900">{ftos.filter(f => f.status === 'draft').length}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3">
              <p className="text-xs text-yellow-700 mb-1">Pending</p>
              <p className="text-xl text-yellow-900">{ftos.filter(f => f.status === 'pending').length}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-blue-700 mb-1">Sent to PFMS</p>
              <p className="text-xl text-blue-900">{ftos.filter(f => f.status === 'sent').length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xs text-green-700 mb-1">Approved</p>
              <p className="text-xl text-green-900">{ftos.filter(f => f.status === 'completed').length}</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3">
              <p className="text-xs text-emerald-700 mb-1">Disbursed</p>
              <p className="text-xl text-emerald-900">{ftos.filter(f => f.status === 'completed').length}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 col-span-2 sm:col-span-1">
              <p className="text-xs text-orange-700 mb-1">Total Amount</p>
              <p className="text-lg text-orange-900">₹{ftos.reduce((sum, fto) => sum + fto.totalAmount, 0).toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 shrink-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400" aria-hidden="true">
                  <path d="m21 21-4.34-4.34"></path>
                  <circle cx="11" cy="11" r="8"></circle>
                </svg>
              </div>
              <input type="text" placeholder="Search by FTO ID or project..." className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400" aria-hidden="true">
                    <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"></path>
                  </svg>
                </div>
                <select className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm appearance-none bg-white" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="sent">Sent to PFMS</option>
                  <option value="completed">Approved</option>
                  <option value="failed">Rejected</option>
                  <option value="disbursed">Disbursed</option>
                </select>
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm">
                <option value="all">All Projects</option>
                <option value="PROJ-001">Youth Skill Development Program</option>
                <option value="PROJ-002">Rural Infrastructure Improvement</option>
                <option value="PROJ-003">Farmer Training and Support</option>
                <option value="PROJ-004">Women Empowerment Scheme</option>
                <option value="PROJ-005">Digital Literacy Program</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="bg-white rounded-lg border border-gray-200">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs text-gray-600">FTO ID</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600">Project</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-600">Beneficiaries</th>
                    <th className="px-4 py-3 text-right text-xs text-gray-600">Amount</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600">Created Date</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-600">Status</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredFTOs.map((fto) => (
                    <tr key={fto.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{fto.ftoId}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-900 max-w-xs truncate">{fto.projectName}</p>
                        <p className="text-xs text-gray-500">{fto.createdBy}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-sm text-gray-900">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400" aria-hidden="true">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                          </svg>
                          {fto.beneficiaryCount}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="text-sm text-gray-900">₹{fto.totalAmount.toLocaleString('en-IN')}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {new Date(fto.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          <span className={`px-2 py-1 rounded text-xs capitalize flex items-center gap-1 ${getStatusBadge(fto.status)}`}>
                            {fto.status === 'completed' && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                                <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                                <path d="m9 11 3 3L22 4"></path>
                              </svg>
                            )}
                            {fto.status === 'sent' && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                                <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                                <path d="m21.854 2.147-10.94 10.939"></path>
                              </svg>
                            )}
                            {fto.status === 'pending' && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                                <path d="M12 6v6l4 2"></path>
                                <circle cx="12" cy="12" r="10"></circle>
                              </svg>
                            )}
                            {fto.status === 'draft' && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                                <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
                                <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
                                <path d="M10 9H8"></path>
                                <path d="M16 13H8"></path>
                                <path d="M16 17H8"></path>
                              </svg>
                            )}
                            {fto.status === 'sent' ? 'sent to pfms' : fto.status === 'completed' ? 'disbursed' : fto.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="View Details">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-600" aria-hidden="true">
                              <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </button>
                          {(fto.status === 'draft' || fto.status === 'pending') && (
                            <button onClick={() => handleSendToPFMS(fto.id)} className="p-1.5 hover:bg-blue-100 rounded transition-colors" title="Send to PFMS">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-blue-600" aria-hidden="true">
                                <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                                <path d="m21.854 2.147-10.94 10.939"></path>
                              </svg>
                            </button>
                          )}
                          {fto.status === 'draft' && (
                            <button className="p-1.5 hover:bg-red-100 rounded transition-colors" title="Cancel FTO">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-red-600" aria-hidden="true">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="m15 9-6 6"></path>
                                <path d="m9 9 6 6"></path>
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden p-4">
              <div className="space-y-3">
                {filteredFTOs.map((fto) => (
                  <div key={fto.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-900 mb-1">{fto.ftoId}</p>
                        <p className="text-xs text-gray-500">{fto.createdBy}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs capitalize flex items-center gap-1 ${getStatusBadge(fto.status)}`}>
                        {fto.status === 'completed' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                            <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                            <path d="m9 11 3 3L22 4"></path>
                          </svg>
                        )}
                        {fto.status === 'sent' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                            <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                            <path d="m21.854 2.147-10.94 10.939"></path>
                          </svg>
                        )}
                        {fto.status === 'pending' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                            <path d="M12 6v6l4 2"></path>
                            <circle cx="12" cy="12" r="10"></circle>
                          </svg>
                        )}
                        {fto.status === 'draft' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                            <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
                            <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
                            <path d="M10 9H8"></path>
                            <path d="M16 13H8"></path>
                            <path d="M16 17H8"></path>
                          </svg>
                        )}
                        {fto.status === 'sent' ? 'sent to pfms' : fto.status === 'completed' ? 'disbursed' : fto.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{fto.projectName}</p>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-600 mb-0.5">Beneficiaries</p>
                        <p className="text-sm text-gray-900 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden="true">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                          </svg>
                          {fto.beneficiaryCount}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-600 mb-0.5">Amount</p>
                        <p className="text-sm text-gray-900">₹{fto.totalAmount.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-1 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        View
                      </button>
                      {(fto.status === 'draft' || fto.status === 'pending') && (
                        <button onClick={() => handleSendToPFMS(fto.id)} className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                            <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                            <path d="m21.854 2.147-10.94 10.939"></path>
                          </svg>
                          Send to PFMS
                        </button>
                      )}
                      {fto.status === 'draft' && (
                        <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="m15 9-6 6"></path>
                            <path d="m9 9 6 6"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Create FTO Modal */}
      <CreateFTOModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        beneficiaries={verifiedBeneficiaries}
        onCreateFTO={handleCreateFTO}
      />
    </DashboardLayout>
  );
}
