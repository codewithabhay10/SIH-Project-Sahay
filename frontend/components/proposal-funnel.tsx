import React from 'react';
import { ProposalFunnelData } from '@/lib/types';

interface ProposalFunnelProps {
  data: ProposalFunnelData;
}

export default function ProposalFunnel({ data }: ProposalFunnelProps) {
  const stages = [
    { key: 'submitted', label: 'Submitted', count: data.submitted, color: 'bg-orange-500' },
    { key: 'inReview', label: 'In Review', count: data.inReview, color: 'bg-orange-500' },
    { key: 'approved', label: 'Approved', count: data.approved, color: 'bg-orange-500' },
    { key: 'fundsReleased', label: 'Funds Released', count: data.fundsReleased, color: 'bg-orange-400' }
  ];

  // Calculate conversion rates
  const submittedToReview = data.submitted > 0 ? Math.round((data.inReview / data.submitted) * 100) : 0;
  const reviewToApproved = data.inReview > 0 ? Math.round((data.approved / data.inReview) * 100) : 0;
  const approvedToReleased = data.approved > 0 ? Math.round((data.fundsReleased / data.approved) * 100) : 0;
  const overallConversion = data.submitted > 0 ? Math.round((data.fundsReleased / data.submitted) * 100) : 0;

  const conversions = [100, submittedToReview, reviewToApproved, approvedToReleased];

  return (
    <div className="space-y-4">
      {stages.map((stage, index) => {
        const percentage = conversions[index];
        
        return (
          <div key={stage.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">{stage.label}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M4.5 3L7.5 6L4.5 9"
                    stroke="#9CA3AF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900">{stage.count}</span>
                <span className="text-sm text-gray-500 w-12">{percentage}%</span>
              </div>
            </div>
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full ${stage.color} rounded-full transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            {index < stages.length - 1 && (
              <p className="text-xs text-gray-500 text-right">{conversions[index + 1]}% conversion</p>
            )}
          </div>
        );
      })}
      
      <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Overall Conversion Rate</span>
          <span className="text-lg font-bold text-[#EA9000]">{overallConversion}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Average Processing Time</span>
          <span className="text-lg font-bold text-gray-900">14 days</span>
        </div>
      </div>
    </div>
  );
}
