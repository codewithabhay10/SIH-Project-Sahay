'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import { ChevronLeft, ChevronRight, Search, Plus, Calendar, Users, TrendingUp, CheckCircle2, Clock, AlertCircle, Eye, Download, Trash2, Upload } from 'lucide-react';

export default function ProjectDetailPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);
  const [showUploadEvidenceModal, setShowUploadEvidenceModal] = useState(false);
  const [showCreateActionModal, setShowCreateActionModal] = useState(false);

  // Mock data
  const projectData = {
    id: 'PROJ-001',
    title: 'Youth Skill Development Program - Phase 1',
    status: 'In Progress',
    projectCode: 'PROJ-001',
    implementingAgency: 'Rural Development Society',
    budget: 50000000,
    spent: 32500000,
    beneficiaries: { completed: 345, target: 500 },
    progress: 65,
    startDate: '15/1/2024',
    endDate: '31/12/2024',
    description: 'A comprehensive skill development program aimed at training 500 youth in various technical and vocational skills across 10 districts.',
    district: 'Multiple Districts',
    sanctionedBy: 'Ministry of Rural Development',
    milestonesCompleted: 2,
    milestonesTotal: 5,
    evidenceCount: 5,
    openActions: 3,
  };

  const milestones = [
    {
      id: 1,
      title: 'Baseline Survey & Planning',
      targetDate: '28/2/2024',
      completionDate: '25/2/2024',
      status: 'completed',
      percentage: 100,
      remarks: 'Successfully completed baseline survey across all 10 districts',
    },
    {
      id: 2,
      title: 'Training Center Setup',
      targetDate: '31/3/2024',
      completionDate: '28/3/2024',
      status: 'completed',
      percentage: 100,
      remarks: 'All 10 training centers operational and ready for enrollment',
    },
    {
      id: 3,
      title: 'Beneficiary Enrollment',
      targetDate: '30/4/2024',
      status: 'in-progress',
      percentage: 69,
      remarks: 'Currently at 345 out of 500 beneficiaries enrolled',
    },
    {
      id: 4,
      title: 'Mid-term Review & Assessment',
      targetDate: '31/7/2024',
      status: 'pending',
      percentage: 0,
    },
    {
      id: 5,
      title: 'Final Evaluation & Reporting',
      targetDate: '31/12/2024',
      status: 'pending',
      percentage: 0,
    },
  ];

  const evidenceFiles = [
    {
      id: 1,
      title: 'Training Session 1',
      category: 'Training',
      fileSize: '2.4 MB',
      date: '15 Mar',
      type: 'photo',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=200',
    },
    {
      id: 2,
      title: 'Infrastructure Setup',
      category: 'Infrastructure',
      fileSize: '3.1 MB',
      date: '14 Mar',
      type: 'photo',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200',
    },
    {
      id: 3,
      title: 'Attendance Register March',
      category: 'Documentation',
      fileSize: '856 KB',
      date: '10 Mar',
      type: 'document',
    },
    {
      id: 4,
      title: 'Skill Training Demo',
      category: 'Training',
      fileSize: '45.2 MB',
      date: '8 Mar',
      type: 'video',
    },
    {
      id: 5,
      title: 'Facility Inspection Report',
      category: 'Assessment',
      fileSize: '1.2 MB',
      date: '5 Mar',
      type: 'document',
    },
  ];

  const actionItems = [
    {
      id: 1,
      title: 'Resolve internet connectivity issue at Bangalore center',
      owner: 'Rajesh Kumar',
      dueDate: '10 Mar',
      status: 'open',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Update beneficiary database with March attendance',
      owner: 'Priya Singh',
      dueDate: '15 Mar',
      status: 'open',
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Arrange placement interviews for batch 1',
      owner: 'Amit Patel',
      dueDate: '20 Mar',
      status: 'open',
      priority: 'high',
    },
  ];

  return (
    <DashboardLayout>
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-gray-900">{projectData.title}</h1>
                <span className="px-2 py-1 rounded text-xs capitalize bg-blue-100 text-blue-700">{projectData.status}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{projectData.projectCode} • {projectData.implementingAgency}</p>
            </div>
          </div>
          <div className="flex gap-1 border-b border-gray-200 -mb-px">
            {['Overview', 'Milestones', 'Evidence', 'Action Items'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-2 text-sm border-b-2 transition-colors ${
                  activeTab === tab.toLowerCase()
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-orange-600" aria-hidden="true">
                        <line x1="12" x2="12" y1="2" y2="22"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Budget</p>
                      <p className="text-lg text-gray-900">₹50,00,000</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-600" aria-hidden="true">
                        <path d="M16 7h6v6"></path>
                        <path d="m22 7-8.5 8.5-5-5L2 17"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Spent</p>
                      <p className="text-lg text-gray-900">₹32,50,000</p>
                      <p className="text-xs text-gray-500">65% utilized</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-green-600" aria-hidden="true">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Beneficiaries</p>
                      <p className="text-lg text-gray-900">{projectData.beneficiaries.completed} / {projectData.beneficiaries.target}</p>
                      <p className="text-xs text-gray-500">69% achieved</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-purple-600" aria-hidden="true">
                        <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                        <path d="m9 11 3 3L22 4"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Progress</p>
                      <p className="text-lg text-gray-900">65%</p>
                      <p className="text-xs text-gray-500">Overall completion</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-gray-900 mb-4">Project Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Description</p>
                    <p className="text-sm text-gray-900">{projectData.description}</p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">District</p>
                      <p className="text-sm text-gray-900">{projectData.district}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Implementing Agency</p>
                      <p className="text-sm text-gray-900">{projectData.implementingAgency}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Sanctioned By</p>
                      <p className="text-sm text-gray-900">{projectData.sanctionedBy}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-gray-900 mb-4">Timeline</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-600" aria-hidden="true">
                        <path d="M8 2v4"></path>
                        <path d="M16 2v4"></path>
                        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                        <path d="M3 10h18"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Start Date</p>
                      <p className="text-sm text-gray-900">{projectData.startDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-orange-600" aria-hidden="true">
                        <path d="M8 2v4"></path>
                        <path d="M16 2v4"></path>
                        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                        <path d="M3 10h18"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">End Date</p>
                      <p className="text-sm text-gray-900">{projectData.endDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-xs text-gray-600 mb-2">Milestones</p>
                  <p className="text-2xl text-gray-900 mb-1">{projectData.milestonesCompleted} / {projectData.milestonesTotal}</p>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-xs text-gray-600 mb-2">Evidence Files</p>
                  <p className="text-2xl text-gray-900 mb-1">{projectData.evidenceCount}</p>
                  <p className="text-xs text-gray-500">Photos &amp; Videos</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-xs text-gray-600 mb-2">Open Actions</p>
                  <p className="text-2xl text-gray-900 mb-1">{projectData.openActions}</p>
                  <p className="text-xs text-gray-500">Pending items</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'milestones' && (
            <div className="flex-1 overflow-auto p-4 sm:p-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-900">Project Milestones</h3>
                  <button onClick={() => setShowAddMilestoneModal(true)} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                      <path d="M5 12h14"></path>
                      <path d="M12 5v14"></path>
                    </svg>
                    Add Milestone
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-gray-900">Beneficiary Enrollment</h4>
                          <span className="px-2 py-0.5 rounded text-xs capitalize bg-green-100 text-green-700">completed</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Complete enrollment of 500 beneficiaries across all districts</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400" aria-hidden="true">
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>Rajesh Kumar</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400" aria-hidden="true">
                          <path d="M8 2v4"></path>
                          <path d="M16 2v4"></path>
                          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                          <path d="M3 10h18"></path>
                        </svg>
                        <span>Due: 31/3/2024</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-green-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                          <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                          <path d="m9 11 3 3L22 4"></path>
                        </svg>
                        <span>Completed: 28/3/2024</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Progress</span>
                        <span className="text-xs text-gray-900">100%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full transition-all" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-gray-900">Training Infrastructure Setup</h4>
                          <span className="px-2 py-0.5 rounded text-xs capitalize bg-green-100 text-green-700">completed</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Establish training centers and procure necessary equipment</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400" aria-hidden="true">
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>Priya Sharma</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400" aria-hidden="true">
                          <path d="M8 2v4"></path>
                          <path d="M16 2v4"></path>
                          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                          <path d="M3 10h18"></path>
                        </svg>
                        <span>Due: 30/4/2024</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-green-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                          <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                          <path d="m9 11 3 3L22 4"></path>
                        </svg>
                        <span>Completed: 25/4/2024</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Progress</span>
                        <span className="text-xs text-gray-900">100%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full transition-all" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-gray-900">Phase 1 Training Completion</h4>
                          <span className="px-2 py-0.5 rounded text-xs capitalize bg-blue-100 text-blue-700">in progress</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Complete first phase of skill training for 250 beneficiaries</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400" aria-hidden="true">
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>Amit Patel</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400" aria-hidden="true">
                          <path d="M8 2v4"></path>
                          <path d="M16 2v4"></path>
                          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                          <path d="M3 10h18"></path>
                        </svg>
                        <span>Due: 31/8/2024</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Progress</span>
                        <span className="text-xs text-gray-900">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full transition-all" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-gray-900">Mid-Term Assessment</h4>
                          <span className="px-2 py-0.5 rounded text-xs capitalize bg-blue-100 text-blue-700">in progress</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Conduct assessment and evaluation of training effectiveness</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400" aria-hidden="true">
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>Sunita Devi</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400" aria-hidden="true">
                          <path d="M8 2v4"></path>
                          <path d="M16 2v4"></path>
                          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                          <path d="M3 10h18"></path>
                        </svg>
                        <span>Due: 30/9/2024</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Progress</span>
                        <span className="text-xs text-gray-900">40%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full transition-all" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-gray-900">Phase 2 Training Completion</h4>
                          <span className="px-2 py-0.5 rounded text-xs capitalize bg-yellow-100 text-yellow-700">pending</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Complete second phase of training for remaining beneficiaries</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400" aria-hidden="true">
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>Mohammed Ali</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400" aria-hidden="true">
                          <path d="M8 2v4"></path>
                          <path d="M16 2v4"></path>
                          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                          <path d="M3 10h18"></path>
                        </svg>
                        <span>Due: 30/11/2024</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Progress</span>
                        <span className="text-xs text-gray-900">0%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full transition-all" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="flex-1 overflow-auto p-4 sm:p-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-900">Evidence Gallery</h3>
                  <button onClick={() => setShowUploadEvidenceModal(true)} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                      <path d="M12 3v12"></path>
                      <path d="m17 8-5-5-5 5"></path>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    </svg>
                    Upload Evidence
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative aspect-video bg-gray-100">
                      <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400" alt="Training Center Setup" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">Photo</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="text-sm text-gray-900 mb-1 truncate">Training Center Setup</h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">Main training hall with computer workstations</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden="true">
                          <path d="M8 2v4"></path>
                          <path d="M16 2v4"></path>
                          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                          <path d="M3 10h18"></path>
                        </svg>
                        <span>20/4/2024</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden="true">
                          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span className="truncate">District Training Center, Pune</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative aspect-video bg-gray-100">
                      <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400" alt="Beneficiary Enrollment" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">Photo</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="text-sm text-gray-900 mb-1 truncate">Beneficiary Enrollment</h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">Group photo of enrolled beneficiaries - Batch 1</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden="true">
                          <path d="M8 2v4"></path>
                          <path d="M16 2v4"></path>
                          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                          <path d="M3 10h18"></path>
                        </svg>
                        <span>15/3/2024</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden="true">
                          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span className="truncate">Community Center, Pune</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative aspect-video bg-gray-100">
                      <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400" alt="Training Session Recording" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-white" aria-hidden="true">
                          <path d="M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z"></path>
                          <circle cx="12" cy="12" r="10"></circle>
                        </svg>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">Video</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="text-sm text-gray-900 mb-1 truncate">Training Session Recording</h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">Web development training session recording</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden="true">
                          <path d="M8 2v4"></path>
                          <path d="M16 2v4"></path>
                          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                          <path d="M3 10h18"></path>
                        </svg>
                        <span>10/7/2024</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden="true">
                          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span className="truncate">Training Center A</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative aspect-video bg-gray-100">
                      <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400" alt="Equipment Installation" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">Photo</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="text-sm text-gray-900 mb-1 truncate">Equipment Installation</h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">New computers and equipment installed</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden="true">
                          <path d="M8 2v4"></path>
                          <path d="M16 2v4"></path>
                          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                          <path d="M3 10h18"></path>
                        </svg>
                        <span>22/4/2024</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden="true">
                          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span className="truncate">District Training Center</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative aspect-video bg-gray-100">
                      <img src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=400" alt="Practical Training Session" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">Photo</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="text-sm text-gray-900 mb-1 truncate">Practical Training Session</h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">Students working on practical assignments</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden="true">
                          <path d="M8 2v4"></path>
                          <path d="M16 2v4"></path>
                          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                          <path d="M3 10h18"></path>
                        </svg>
                        <span>5/8/2024</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden="true">
                          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span className="truncate">Training Lab</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'action items' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Action Items</h2>
                <button
                  onClick={() => setShowCreateActionModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Action
                </button>
              </div>

              <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Action Item</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Owner</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {actionItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.title}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-700">{item.owner}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-700">{item.dueDate}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.priority === 'high'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-xs px-3 py-1 text-green-700 bg-green-50 rounded hover:bg-green-100 transition-colors">
                            Close Action
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      {/* Add Milestone Modal */}
      {showAddMilestoneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Milestone</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Milestone Title</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" placeholder="Enter milestone title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAddMilestoneModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">Add</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Evidence Modal */}
      {showUploadEvidenceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Evidence</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File Title</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" placeholder="Enter file title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600">
                  <option>Training</option>
                  <option>Infrastructure</option>
                  <option>Documentation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowUploadEvidenceModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">Upload</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Action Modal */}
      {showCreateActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Action Item</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Action Title</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" placeholder="Enter action title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" placeholder="Enter assignee name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowCreateActionModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
