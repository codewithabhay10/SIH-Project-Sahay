"use client";

import React from 'react';
import { Milestone, MilestoneStatus } from '@/lib/types';

interface MilestoneTrackerProps {
  milestones: Milestone[];
  onMarkComplete: (milestoneId: string) => void;
  onAddRemark: (milestoneId: string) => void;
}

export default function MilestoneTracker({ 
  milestones, 
  onMarkComplete, 
  onAddRemark 
}: MilestoneTrackerProps) {
  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const totalCount = milestones.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  const getStatusIcon = (status: MilestoneStatus) => {
    if (status === 'completed') {
      return (
        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M11 4.5L5.5 10L3 7.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    }
    
    if (status === 'in-progress') {
      return (
        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 3.5V7L9.5 9.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    }
    
    return (
      <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex-shrink-0"></div>
    );
  };

  const getStatusColor = (status: MilestoneStatus) => {
    if (status === 'completed') return 'text-green-600';
    if (status === 'in-progress') return 'text-orange-600';
    return 'text-gray-500';
  };

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <div className="pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">
            {completedCount} of {totalCount} milestones completed
          </p>
          <p className="text-sm font-bold text-[#EA9000]">{progressPercentage}%</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-500 flex-shrink-0">Overall Progress</p>
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#EA9000] transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Milestone List */}
      <div className="space-y-3">
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className={`p-4 rounded-lg border ${
              milestone.status === 'completed'
                ? 'bg-green-50 border-green-100'
                : milestone.status === 'in-progress'
                ? 'bg-orange-50 border-orange-100'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {getStatusIcon(milestone.status)}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-semibold text-gray-900 text-sm">
                    {milestone.name}
                  </p>
                  {milestone.status === 'in-progress' && (
                    <button
                      onClick={() => onMarkComplete(milestone.id)}
                      className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors flex-shrink-0 flex items-center gap-1"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Mark Complete
                    </button>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-gray-600">
                    Target: <span className="font-medium">{milestone.targetDate}</span>
                  </span>
                  {milestone.completionDate && (
                    <span className="text-green-600">
                      Completed: <span className="font-medium">{milestone.completionDate}</span>
                    </span>
                  )}
                </div>
                
                {milestone.remark && (
                  <div className="mt-2 p-2 bg-white rounded text-xs text-gray-700 italic border-l-2 border-blue-400">
                    Remark: {milestone.remark}
                  </div>
                )}
                
                {!milestone.remark && milestone.status !== 'pending' && (
                  <button
                    onClick={() => onAddRemark(milestone.id)}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M10 8V9.33333C10 9.68696 9.85952 10.0261 9.60947 10.2761C9.35942 10.5262 9.02029 10.6667 8.66666 10.6667H3.33333C2.97971 10.6667 2.64057 10.5262 2.39052 10.2761C2.14048 10.0261 2 9.68696 2 9.33333V8"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.66667 5.33333L6 2.66667L3.33334 5.33333"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6 2.66667V8"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Add Remark
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
