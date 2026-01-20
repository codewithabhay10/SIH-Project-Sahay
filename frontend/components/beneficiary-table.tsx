"use client";

import React from 'react';
import { Beneficiary, TrainingStatus, PlacementStatus } from '@/lib/types';

interface BeneficiaryTableProps {
  beneficiaries: Beneficiary[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placementFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function BeneficiaryTable({
  beneficiaries,
  searchQuery,
  onSearchChange,
  placementFilter,
  onFilterChange
}: BeneficiaryTableProps) {
  const getTrainingBadge = (status: TrainingStatus) => {
    const styles: Record<TrainingStatus, string> = {
      'completed': 'bg-green-100 text-green-700',
      'in-progress': 'bg-yellow-100 text-yellow-700',
      'not-started': 'bg-gray-100 text-gray-700'
    };
    
    const labels: Record<TrainingStatus, string> = {
      'completed': 'Completed',
      'in-progress': 'In Progress',
      'not-started': 'Not Started'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getPlacementBadge = (status: PlacementStatus) => {
    const styles: Record<PlacementStatus, string> = {
      'placed': 'bg-green-100 text-green-700',
      'searching': 'bg-blue-100 text-blue-700',
      'not-applicable': 'bg-gray-100 text-gray-700'
    };
    
    const labels: Record<PlacementStatus, string> = {
      'placed': 'Placed',
      'searching': 'Searching',
      'not-applicable': 'N/A'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Row */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by name, ID, mobile..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EA9000] focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
              stroke="#9CA3AF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 14L11.1 11.1"
              stroke="#9CA3AF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <select
          value={placementFilter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EA9000] focus:border-transparent cursor-pointer"
        >
          <option>All Placement Status</option>
          <option value="placed">Placed</option>
          <option value="searching">Searching</option>
          <option value="not-applicable">Not Applicable</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Beneficiary
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                District
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Training
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Placement
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                Disbursal
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {beneficiaries.map((beneficiary) => (
              <tr key={beneficiary.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{beneficiary.name}</p>
                    <p className="text-xs text-gray-500">{beneficiary.id}</p>
                    <p className="text-xs text-gray-400">Reg: {beneficiary.registrationDate}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm text-gray-900">{beneficiary.mobile}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm text-gray-900">{beneficiary.district}</p>
                </td>
                <td className="px-4 py-4">
                  {getTrainingBadge(beneficiary.trainingStatus)}
                </td>
                <td className="px-4 py-4">
                  {getPlacementBadge(beneficiary.placementStatus)}
                </td>
                <td className="px-4 py-4 text-right">
                  <p className="font-semibold text-gray-900">₹{beneficiary.disbursal.toLocaleString()}</p>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="View Details"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M1 8C1 8 3.5 3 8 3C12.5 3 15 8 15 8C15 8 12.5 13 8 13C3.5 13 1 8 1 8Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      className="p-1.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                      title="Edit"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M11.3333 2.00004C11.5084 1.82494 11.716 1.68605 11.9438 1.59129C12.1717 1.49653 12.4154 1.44775 12.6616 1.44775C12.9079 1.44775 13.1516 1.49653 13.3795 1.59129C13.6073 1.68605 13.8149 1.82494 13.99 2.00004C14.1651 2.17513 14.304 2.3827 14.3987 2.61057C14.4935 2.83845 14.5423 3.08213 14.5423 3.32837C14.5423 3.57462 14.4935 3.8183 14.3987 4.04618C14.304 4.27405 14.1651 4.48162 13.99 4.65671L5.00001 13.6467L1.33334 14.6667L2.35334 11L11.3433 2.00004H11.3333Z"
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

      {beneficiaries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">No beneficiaries found</p>
        </div>
      )}
    </div>
  );
}
