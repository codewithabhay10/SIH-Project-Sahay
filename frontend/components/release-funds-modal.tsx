"use client";

import React, { useState } from 'react';
import { FundProposal } from '@/lib/types';

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

interface ReleaseFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposals: (FundProposal | BackendProposal | any)[];
  onConfirm: (paymentMode: 'NEFT' | 'RTGS' | 'ACH') => void;
}

export default function ReleaseFundsModal({
  isOpen,
  onClose,
  proposals,
  onConfirm
}: ReleaseFundsModalProps) {
  const [paymentMode, setPaymentMode] = useState<'NEFT' | 'RTGS' | 'ACH'>('NEFT');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || proposals.length === 0) return null;

  const getAmount = (p: any) => {
    return p.amountRequested || p.estimated_budget || 0;
  };

  const totalAmount = proposals.reduce((sum, p) => sum + getAmount(p), 0);
  const isBulk = proposals.length > 1;

  const handleConfirm = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    onConfirm(paymentMode);
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4 scrollbar-hide">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {isBulk ? 'Confirm Bulk Fund Release' : 'Confirm Fund Release'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {isBulk 
              ? `Releasing funds for ${proposals.length} proposals` 
              : 'Please review and confirm fund release details'}
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Proposals Summary */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              {isBulk ? 'Proposals' : 'Proposal Details'}
            </h3>
            <div className="space-y-2">
              {proposals.map(proposal => (
                <div key={proposal.id || proposal._id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{proposal.proposalId || proposal._id}</p>
                      <p className="text-sm text-gray-600">{proposal.projectName || proposal.title || proposal.project?.project_name}</p>
                      <p className="text-xs text-gray-500 mt-1">{proposal.stateName || proposal.project?.state || 'N/A'}</p>
                    </div>
                    <p className="font-bold text-lg text-[#EA9000]">
                      ₹{(getAmount(proposal) / 10000000).toFixed(2)} Cr
                    </p>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500">District:</span>
                      <p className="font-medium text-gray-900">{proposal.district || proposal.project?.district || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <p className="font-medium text-gray-900">{proposal.category || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Amount */}
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Total Amount to Release:</span>
              <span className="text-2xl font-bold text-[#EA9000]">₹{(totalAmount / 10000000).toFixed(2)} Cr</span>
            </div>
          </div>

          {/* Payment Mode */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Payment Mode <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['NEFT', 'RTGS', 'ACH'] as const).map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPaymentMode(mode)}
                  className={`px-4 py-3 border-2 rounded-lg font-medium text-sm transition-colors ${
                    paymentMode === mode
                      ? 'border-[#EA9000] bg-orange-50 text-[#EA9000]'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {paymentMode === 'NEFT' && '• NEFT: Processed in batches, settlement within 2 hours'}
              {paymentMode === 'RTGS' && '• RTGS: Real-time transfer for amounts above ₹2 lakh'}
              {paymentMode === 'ACH' && '• ACH: Automated clearing for scheduled bulk transfers'}
            </p>
          </div>

          {/* Important Notice */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 mt-0.5">
                <path d="M10 6.66667V10M10 13.3333H10.0083M18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10Z" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <p className="text-sm font-medium text-yellow-800">Important Notice</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Once confirmed, the transaction will be processed immediately and cannot be reversed. 
                  Please ensure all details are correct.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="px-6 py-2.5 bg-[#EA9000] text-white rounded-lg font-medium hover:bg-[#d88000] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Confirm Release
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
