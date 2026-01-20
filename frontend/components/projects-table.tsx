"use client";

import React, { useState } from 'react';
import { Project, SortField, SortOrder } from '@/lib/types';
import RequestClarificationModal from '@/components/request-clarification-modal';

interface ProjectsTableProps {
  projects: Project[];
  onSort: (field: SortField, order: SortOrder) => void;
  currentSort?: { field: SortField; order: SortOrder };
}

export default function ProjectsTable({ projects, onSort, currentSort }: ProjectsTableProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showClarificationModal, setShowClarificationModal] = useState(false);

  const handleSort = (field: SortField) => {
    if (currentSort?.field === field) {
      const newOrder = currentSort.order === 'asc' ? 'desc' : 'asc';
      onSort(field, newOrder);
    } else {
      onSort(field, 'asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (currentSort?.field !== field) {
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-40">
          <path d="M7 3v8M7 3l-3 3M7 3l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    
    if (currentSort.order === 'asc') {
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 11V3M7 3l-3 3M7 3l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 3v8M7 11l-3-3M7 11l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'Approved': 'bg-green-100 text-green-700',
      'Submitted': 'bg-blue-100 text-blue-700',
      'In Review': 'bg-yellow-100 text-yellow-700',
      'Funds Released': 'bg-purple-100 text-purple-700',
      'Pending': 'bg-orange-100 text-orange-700'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  const handleRequestClarification = (project: Project) => {
    setSelectedProject(project);
    setShowClarificationModal(true);
  };

  const handleUploadUC = (project: Project) => {
    setSelectedProject(project);
    setShowUploadModal(true);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 text-xs font-semibold text-gray-600 uppercase hover:text-gray-900"
                >
                  Project
                  {getSortIcon('name')}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                District / IA Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort('allocated')}
                  className="flex items-center gap-1 ml-auto text-xs font-semibold text-gray-600 uppercase hover:text-gray-900"
                >
                  Allocated
                  {getSortIcon('allocated')}
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort('released')}
                  className="flex items-center gap-1 ml-auto text-xs font-semibold text-gray-600 uppercase hover:text-gray-900"
                >
                  Released
                  {getSortIcon('released')}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                UC Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{project.name}</p>
                    <p className="text-xs text-gray-500">{project.id}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p className="text-sm text-gray-900">{project.district}</p>
                    <p className="text-xs text-gray-500">{project.iaType}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {getStatusBadge(project.status)}
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="font-semibold text-gray-900">₹{project.allocated.toFixed(1)}Cr</p>
                  <p className="text-xs text-gray-500">50%</p>
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="font-semibold text-gray-900">₹{project.released.toFixed(1)}L</p>
                  <p className="text-xs text-gray-500">{project.releasePercentage}%</p>
                </td>
                <td className="px-4 py-4">
                  {getStatusBadge(project.ucStatus)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => window.open(`/projects/${project.id}`, '_blank')}
                      className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Open Project"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 2H14V6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6.66667 9.33333L14 2"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleRequestClarification(project)}
                      className="p-1.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                      title="Request Clarification"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M14 10.6667C14 11.0203 13.8595 11.3594 13.6095 11.6095C13.3594 11.8595 13.0203 12 12.6667 12H4.66667L2 14V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H12.6667C13.0203 2 13.3594 2.14048 13.6095 2.39052C13.8595 2.64057 14 2.97971 14 3.33333V10.6667Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleUploadUC(project)}
                      className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                      title="Upload UC"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11.3333 5.33333L8 2L4.66667 5.33333"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 2V10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedProject && (
        <>
          <RequestClarificationModal
            isOpen={showClarificationModal}
            onClose={() => {
              setShowClarificationModal(false);
              setSelectedProject(null);
            }}
            project={selectedProject}
            onSubmit={(message: string) => {
              console.log('Clarification requested:', message);
              setShowClarificationModal(false);
              setSelectedProject(null);
            }}
          />
        </>
      )}
    </>
  );
}
