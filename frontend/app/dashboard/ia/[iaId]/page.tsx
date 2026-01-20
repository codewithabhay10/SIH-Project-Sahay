"use client";

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard-layout';
import UploadDocumentModal from '@/components/upload-document-modal';
import { getIAData, filterBeneficiaries } from '@/lib/ia-mock-data';
import { EvidenceCategory } from '@/lib/types';
import { useAuth } from '@/components/auth-provider';
import { getDashboardRoute } from '@/lib/auth';

export default function IADashboard() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const iaId = params.iaId as string;
  const data = getIAData(iaId);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [placementFilter, setPlacementFilter] = useState('All Placement Status');
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(`/dashboard/ia/${iaId}`)}`);
      return;
    }

    if (user.role !== 'ia') {
      router.replace(getDashboardRoute(user));
      return;
    }

    setIsAuthorized(true);
  }, [user, router, iaId]);

  // Filter beneficiaries
  const filteredBeneficiaries = useMemo(() => {
    return filterBeneficiaries(data.beneficiaries, searchQuery, placementFilter);
  }, [data.beneficiaries, searchQuery, placementFilter]);

  // Handlers


  const handleUploadEvidence = () => {
    setShowUploadModal(true);
  };

  const handleFileUpload = (files: File[], category: EvidenceCategory) => {
    console.log('Upload files:', files.length, 'Category:', category);
    setShowUploadModal(false);
    // In real app, would upload files
  };
  if (!isAuthorized) {
    return null;
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{data.project.iaName}</h1>
              <p className="text-sm text-gray-600 mt-1">{data.project.projectName}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>Project ID: <span className="font-medium text-gray-700">{data.project.projectId}</span></span>
                <span>•</span>
                <span>Start Date: <span className="font-medium">{data.project.startDate}</span></span>
                <span>•</span>
                <span>End Date: <span className="font-medium">{data.project.endDate}</span></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => router.push('/beneficiary/register')}
                className="px-4 py-2 bg-[#EA9000] text-white text-sm font-medium rounded-lg hover:bg-[#d88000] transition-colors"
              >
                Register Beneficiary
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.66667 6.66667L8 10L11.3333 6.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 10V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Generate FTO
              </button>
              <button 
                onClick={handleUploadEvidence}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11.3333 5.33333L8 2L4.66667 5.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 2V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Upload Document
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10.6667 1.33333H4C3.26362 1.33333 2.66667 1.93029 2.66667 2.66667V13.3333C2.66667 14.0697 3.26362 14.6667 4 14.6667H12C12.7364 14.6667 13.3333 14.0697 13.3333 13.3333V5.33333L10.6667 1.33333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.6667 1.33333V5.33333H13.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Submit Report
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6 overflow-auto">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Beneficiaries Registered */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-orange-600">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-1">Beneficiaries Registered</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">1,247</p>
              <p className="text-xs text-gray-500 mb-3">Target: 1,500</p>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-600 rounded-full" style={{ width: "83%" }}></div>
              </div>
            </div>

            {/* Amount Released */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-orange-600">
                    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-1">Amount Released</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">₹45.8 Cr</p>
              <p className="text-xs text-gray-500 mb-3">of ₹50 Cr allocated</p>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-600 rounded-full" style={{ width: "92%" }}></div>
              </div>
            </div>

            {/* Amount Utilized */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-orange-600">
                    <path d="M16 7h6v6"></path>
                    <path d="m22 7-8.5 8.5-5-5L2 17"></path>
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-1">Amount Utilized</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">₹38.2 Cr</p>
              <p className="text-xs text-gray-500 mb-3">83.4% of released</p>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-600 rounded-full" style={{ width: "83%" }}></div>
              </div>
            </div>

            {/* Placement Rate */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-orange-600">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="6"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-1">Placement Rate</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">76%</p>
              <p className="text-xs text-gray-500 mb-3">949 placed out of 1,247</p>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-600 rounded-full" style={{ width: "76%" }}></div>
              </div>
            </div>
          </div>

          {/* Milestones and Evidence Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Milestones */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-gray-900 font-semibold">Project Milestones</h3>
                  <p className="text-sm text-gray-600 mt-1">2 of 5 milestones completed</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">40%</p>
                  <p className="text-xs text-gray-600">Overall Progress</p>
                </div>
              </div>
              <div className="mb-8">
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="bg-orange-600 h-3 rounded-full transition-all duration-500" style={{ width: "40%" }}></div>
                </div>
              </div>
              <div className="space-y-4">
                {/* Completed Milestone 1 */}
                <div>
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-green-600">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">Project Approval & Fund Allocation</p>
                      <div className="flex items-center gap-3 mt-1 text-xs">
                        <p className="text-gray-500">Target: 15 Jan 2024</p>
                        <p className="text-green-600">Completed: 12 Jan 2024</p>
                      </div>
                      <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800 border border-blue-100">
                        <span className="font-medium">Remark:</span> Completed ahead of schedule
                      </div>
                    </div>
                  </div>
                  <div className="ml-3 h-6 w-0.5 bg-gray-200"></div>
                </div>

                {/* Completed Milestone 2 */}
                <div>
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-green-600">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">Beneficiary Registration (50%)</p>
                      <div className="flex items-center gap-3 mt-1 text-xs">
                        <p className="text-gray-500">Target: 1 Mar 2024</p>
                        <p className="text-green-600">Completed: 28 Feb 2024</p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-3 h-6 w-0.5 bg-gray-200"></div>
                </div>

                {/* In Progress Milestone */}
                <div>
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-orange-600">
                        <path d="M12 6v6l4 2"></path>
                        <circle cx="12" cy="12" r="10"></circle>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">Infrastructure Setup</p>
                      <div className="flex items-center gap-3 mt-1 text-xs">
                        <p className="text-gray-500">Target: 30 Jun 2024</p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <button className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                            <path d="M20 6 9 17l-5-5"></path>
                          </svg>
                          Mark Complete
                        </button>
                        <button className="p-1 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors" title="Add Remark">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="ml-3 h-6 w-0.5 bg-gray-200"></div>
                </div>

                {/* Pending Milestones */}
                <div>
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-300">
                        <circle cx="12" cy="12" r="10"></circle>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500">Training Completion</p>
                      <div className="flex items-center gap-3 mt-1 text-xs">
                        <p className="text-gray-500">Target: 15 Sept 2024</p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-3 h-6 w-0.5 bg-gray-200"></div>
                </div>

                <div>
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-300">
                        <circle cx="12" cy="12" r="10"></circle>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500">Placement Target (75%)</p>
                      <div className="flex items-center gap-3 mt-1 text-xs">
                        <p className="text-gray-500">Target: 31 Dec 2024</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Evidence Repository */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 font-semibold">Evidence Repository</h3>
                <button onClick={handleUploadEvidence} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M12 3v12"></path>
                    <path d="m17 8-5-5-5 5"></path>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  </svg>
                  Upload Evidence
                </button>
              </div>
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
                <button className="px-3 py-1 rounded-lg text-sm transition-colors bg-orange-100 text-orange-700 font-medium">All (6)</button>
                <button className="px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1 bg-gray-100 text-gray-700 hover:bg-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                    <circle cx="9" cy="9" r="2"></circle>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                  </svg>
                  Photos (3)
                </button>
                <button className="px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1 bg-gray-100 text-gray-700 hover:bg-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                    <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path>
                    <rect x="2" y="6" width="14" height="12" rx="2"></rect>
                  </svg>
                  Videos (1)
                </button>
                <button className="px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1 bg-gray-100 text-gray-700 hover:bg-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                    <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
                    <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
                    <path d="M10 9H8"></path>
                    <path d="M16 13H8"></path>
                    <path d="M16 17H8"></path>
                  </svg>
                  Documents (2)
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Evidence Card 1 */}
                <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=200" alt="Training Session 1" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                      <button className="p-1.5 bg-white rounded-lg hover:bg-gray-100 transition-colors" title="View">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-700">
                          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                      <button className="p-1.5 bg-white rounded-lg hover:bg-gray-100 transition-colors" title="Download">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-700">
                          <path d="M12 15V3"></path>
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <path d="m7 10 5 5 5-5"></path>
                        </svg>
                      </button>
                      <button className="p-1.5 bg-white rounded-lg hover:bg-gray-100 transition-colors" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-red-600">
                          <path d="M10 11v6"></path>
                          <path d="M14 11v6"></path>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                          <path d="M3 6h18"></path>
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-gray-900 truncate font-medium">Training Session 1</p>
                    <p className="text-xs text-gray-500">Training</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                      <span>2.4 MB</span>
                      <span>15 Mar</span>
                    </div>
                  </div>
                </div>

                {/* Evidence Card 2 */}
                <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200" alt="Infrastructure Setup" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                      <button className="p-1.5 bg-white rounded-lg hover:bg-gray-100 transition-colors" title="View">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-700">
                          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                      <button className="p-1.5 bg-white rounded-lg hover:bg-gray-100 transition-colors" title="Download">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-700">
                          <path d="M12 15V3"></path>
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <path d="m7 10 5 5 5-5"></path>
                        </svg>
                      </button>
                      <button className="p-1.5 bg-white rounded-lg hover:bg-gray-100 transition-colors" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-red-600">
                          <path d="M10 11v6"></path>
                          <path d="M14 11v6"></path>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                          <path d="M3 6h18"></path>
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-gray-900 truncate font-medium">Infrastructure Setup</p>
                    <p className="text-xs text-gray-500">Infrastructure</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                      <span>3.1 MB</span>
                      <span>14 Mar</span>
                    </div>
                  </div>
                </div>

                {/* Evidence Card 3 - Document */}
                <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                    <div className="flex flex-col items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-orange-600">
                        <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
                        <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
                        <path d="M10 9H8"></path>
                        <path d="M16 13H8"></path>
                        <path d="M16 17H8"></path>
                      </svg>
                      <p className="text-xs text-gray-500 uppercase">document</p>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                      <button className="p-1.5 bg-white rounded-lg hover:bg-gray-100 transition-colors" title="View">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-700">
                          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                      <button className="p-1.5 bg-white rounded-lg hover:bg-gray-100 transition-colors" title="Download">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-700">
                          <path d="M12 15V3"></path>
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <path d="m7 10 5 5 5-5"></path>
                        </svg>
                      </button>
                      <button className="p-1.5 bg-white rounded-lg hover:bg-gray-100 transition-colors" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-red-600">
                          <path d="M10 11v6"></path>
                          <path d="M14 11v6"></path>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                          <path d="M3 6h18"></path>
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-gray-900 truncate font-medium">Attendance Register</p>
                    <p className="text-xs text-gray-500">Documentation</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                      <span>856 KB</span>
                      <span>10 Mar</span>
                    </div>
                  </div>
                </div>

                {/* Evidence Card 4 - Video */}
                <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                    <div className="flex flex-col items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-purple-600">
                        <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path>
                        <rect x="2" y="6" width="14" height="12" rx="2"></rect>
                      </svg>
                      <p className="text-xs text-gray-500 uppercase">video</p>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                      <button className="p-1.5 bg-white rounded-lg hover:bg-gray-100 transition-colors" title="View">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-700">
                          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                      <button className="p-1.5 bg-white rounded-lg hover:bg-gray-100 transition-colors" title="Download">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-700">
                          <path d="M12 15V3"></path>
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <path d="m7 10 5 5 5-5"></path>
                        </svg>
                      </button>
                      <button className="p-1.5 bg-white rounded-lg hover:bg-gray-100 transition-colors" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-red-600">
                          <path d="M10 11v6"></path>
                          <path d="M14 11v6"></path>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                          <path d="M3 6h18"></path>
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-gray-900 truncate font-medium">Skill Training Demo</p>
                    <p className="text-xs text-gray-500">Training</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                      <span>45.2 MB</span>
                      <span>8 Mar</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Beneficiary List */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-5 border-b border-gray-200">
              <h3 className="text-gray-900 mb-4">Beneficiary List</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400">
                    <path d="m21 21-4.34-4.34"></path>
                    <circle cx="11" cy="11" r="8"></circle>
                  </svg>
                  <input 
                    type="text" 
                    placeholder="Search by name, ID, mobile..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
                  />
                </div>
                <select 
                  value={placementFilter}
                  onChange={(e) => setPlacementFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="All Placement Status">All Placement Status</option>
                  <option value="placed">Placed</option>
                  <option value="searching">Searching</option>
                  <option value="not-eligible">Not Eligible</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Beneficiary</th>
                    <th className="px-5 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Contact</th>
                    <th className="px-5 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Training</th>
                    <th className="px-5 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Placement</th>
                    <th className="px-5 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Disbursed</th>
                    <th className="px-5 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBeneficiaries.slice(0, 5).map((beneficiary) => (
                    <tr key={beneficiary.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm text-gray-900">{beneficiary.name}</p>
                          <p className="text-xs text-gray-500">{beneficiary.id}</p>
                          <p className="text-xs text-gray-500">****-****-{beneficiary.mobile?.slice(-4)}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-900">{beneficiary.mobile}</p>
                        <p className="text-xs text-gray-500">Reg: {beneficiary.registrationDate}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded text-xs capitalize ${beneficiary.trainingStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {beneficiary.trainingStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded text-xs capitalize ${beneficiary.placementStatus === 'placed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {beneficiary.placementStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-900">₹{beneficiary.disbursal?.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors" title="View Details">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye w-4 h-4">
                              <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </button>
                          <button className="p-1.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-pen w-4 h-4">
                              <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">Showing 1 to 5 of 6 beneficiaries</p>
              <div className="flex items-center gap-2">
                <button disabled className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm">Previous</button>
                <button className="px-3 py-1 border rounded text-sm bg-orange-600 text-white border-orange-600">1</button>
                <button className="px-3 py-1 border rounded text-sm border-gray-300 hover:bg-gray-50">2</button>
                <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm">Next</button>
              </div>
            </div>
          </div>
        </div>

      {/* Modals */}
      <UploadDocumentModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleFileUpload}
      />
    </DashboardLayout>
  );
}
