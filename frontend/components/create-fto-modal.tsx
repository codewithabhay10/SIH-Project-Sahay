"use client";

import React, { useState } from "react";

interface BeneficiaryForFTO {
  id: string;
  beneficiaryId: string;
  name: string;
  mobile: string;
  aadhaarLast4: string;
  bankAccount: string;
  ifscCode: string;
  projectId: string;
  projectName: string;
  amount: number;
  isVerified: boolean;
}

interface CreateFTOModalProps {
  isOpen: boolean;
  onClose: () => void;
  beneficiaries: BeneficiaryForFTO[];
  onCreateFTO: (selectedIds: string[], file: File | null) => void;
}

export default function CreateFTOModal({
  isOpen,
  onClose,
  beneficiaries,
  onCreateFTO,
}: CreateFTOModalProps) {
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<Set<string>>(new Set());
  const [authFile, setAuthFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const handleToggleSelection = (id: string) => {
    const newSelection = new Set(selectedBeneficiaries);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedBeneficiaries(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedBeneficiaries.size === filteredBeneficiaries.length) {
      setSelectedBeneficiaries(new Set());
    } else {
      setSelectedBeneficiaries(new Set(filteredBeneficiaries.map(b => b.id)));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAuthFile(e.target.files[0]);
    }
  };

  const handleCreate = () => {
    if (selectedBeneficiaries.size === 0) {
      alert("Please select at least one beneficiary");
      return;
    }
    if (!authFile) {
      alert("Please upload authorization document");
      return;
    }
    onCreateFTO(Array.from(selectedBeneficiaries), authFile);
    setSelectedBeneficiaries(new Set());
    setAuthFile(null);
    setSearchQuery("");
  };

  const handleCancel = () => {
    setSelectedBeneficiaries(new Set());
    setAuthFile(null);
    setSearchQuery("");
    onClose();
  };

  const filteredBeneficiaries = beneficiaries.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.beneficiaryId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAmount = Array.from(selectedBeneficiaries)
    .map(id => beneficiaries.find(b => b.id === id)?.amount || 0)
    .reduce((sum, amount) => sum + amount, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#2C3E50]">Create Fund Transfer Order</h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Search and Summary */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search beneficiaries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA9000] focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 14L11.1 11.1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-[#2C3E50]">{selectedBeneficiaries.size}</span>
              <span className="text-gray-600"> selected • Total: </span>
              <span className="font-semibold text-[#EA9000]">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-6 py-4">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedBeneficiaries.size === filteredBeneficiaries.length && filteredBeneficiaries.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-[#EA9000] border-gray-300 rounded focus:ring-[#EA9000]"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Beneficiary ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Mobile</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Bank Account</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">IFSC</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Project</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBeneficiaries.map((beneficiary) => (
                <tr
                  key={beneficiary.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    selectedBeneficiaries.has(beneficiary.id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedBeneficiaries.has(beneficiary.id)}
                      onChange={() => handleToggleSelection(beneficiary.id)}
                      className="w-4 h-4 text-[#EA9000] border-gray-300 rounded focus:ring-[#EA9000]"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{beneficiary.beneficiaryId}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{beneficiary.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{beneficiary.mobile}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono">{beneficiary.bankAccount}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono">{beneficiary.ifscCode}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{beneficiary.projectName}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                    ₹{beneficiary.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredBeneficiaries.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No beneficiaries found
            </div>
          )}
        </div>

        {/* File Upload */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Authorization Document *
          </label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#EA9000] file:text-white hover:file:bg-[#d88000] file:cursor-pointer"
            />
            {authFile && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M13.3333 4L6 11.3333L2.66667 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {authFile.name}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={selectedBeneficiaries.size === 0 || !authFile}
            className="px-4 py-2 bg-[#EA9000] text-white rounded-lg font-medium hover:bg-[#d88000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create FTO
          </button>
        </div>
      </div>
    </div>
  );
}
