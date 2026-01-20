"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import { User, CreditCard, Phone, Building2, Briefcase, Upload, Eye, Check } from 'lucide-react';

interface FormData {
  beneficiaryName: string;
  aadhaar: string;
  mobile: string;
  bankAccount: string;
  ifsc: string;
  projectId: string;
}

export default function RegisterBeneficiaryPage() {
  const [formData, setFormData] = useState<FormData>({
    beneficiaryName: '',
    aadhaar: '',
    mobile: '',
    bankAccount: '',
    ifsc: '',
    projectId: '',
  });

  const [validation, setValidation] = useState({
    aadhaar: { validated: false, loading: false },
    bank: { validated: false, loading: false },
  });

  const [showAadhaar, setShowAadhaar] = useState(false);
  const [showBankAccount, setShowBankAccount] = useState(false);

  const [files, setFiles] = useState({
    aadhaarDoc: null as File | null,
    casteCertificate: null as File | null,
  });

  const handleAadhaarValidate = async () => {
    if (formData.aadhaar.length !== 12) {
      alert('Please enter a valid 12-digit Aadhaar number');
      return;
    }
    setValidation(prev => ({ ...prev, aadhaar: { validated: false, loading: true } }));
    setTimeout(() => {
      setValidation(prev => ({ ...prev, aadhaar: { validated: true, loading: false } }));
    }, 1000);
  };

  const handleBankValidate = async () => {
    if (!formData.bankAccount || !formData.ifsc) {
      alert('Please enter both bank account number and IFSC code');
      return;
    }
    setValidation(prev => ({ ...prev, bank: { validated: false, loading: true } }));
    setTimeout(() => {
      setValidation(prev => ({ ...prev, bank: { validated: true, loading: false } }));
    }, 1000);
  };

  const handleFileChange = (field: 'aadhaarDoc' | 'casteCertificate', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [field]: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.aadhaar.validated) {
      alert('Please validate Aadhaar number first');
      return;
    }
    if (!validation.bank.validated) {
      alert('Please validate bank details first');
      return;
    }
    console.log('Submitting registration:', formData, files);
    alert('Beneficiary registered successfully!');
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-2xl font-bold text-[#2C3E50]">Beneficiary Registration</h1>
          <p className="text-sm text-gray-600 mt-1">Add new beneficiaries for projects</p>
        </div>
        <div className="p-8 flex justify-center">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 w-full max-w-4xl">
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-gray-900 mb-4 pb-2 border-b border-gray-200">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Beneficiary Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-2">Beneficiary Name *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter full name"
                        value={formData.beneficiaryName}
                        onChange={(e) => setFormData({ ...formData, beneficiaryName: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 border-gray-300"
                        required
                      />
                    </div>
                  </div>

                  {/* Aadhaar Number */}
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-2">Aadhaar Number *</label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CreditCard className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type={showAadhaar ? "text" : "password"}
                          placeholder="Enter 12-digit Aadhaar number"
                          maxLength={12}
                          value={formData.aadhaar}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setFormData({ ...formData, aadhaar: value });
                            setValidation(prev => ({ ...prev, aadhaar: { validated: false, loading: false } }));
                          }}
                          className="w-full pl-10 pr-20 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 border-gray-300"
                          required
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-3">
                          <button
                            type="button"
                            onClick={() => setShowAadhaar(!showAadhaar)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleAadhaarValidate}
                        disabled={validation.aadhaar.loading || validation.aadhaar.validated || formData.aadhaar.length !== 12}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                      >
                        {validation.aadhaar.validated && <Check className="w-4 h-4" />}
                        <span className="hidden sm:inline">
                          {validation.aadhaar.loading ? 'Validating...' : validation.aadhaar.validated ? 'Validated' : 'Validate'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Aadhaar Document */}
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-2">Aadhaar Document (Optional)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-orange-400 transition-colors">
                      <label className="flex flex-col items-center cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        {files.aadhaarDoc ? (
                          <span className="text-sm text-gray-700 font-medium">{files.aadhaarDoc.name}</span>
                        ) : (
                          <>
                            <span className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</span>
                            <span className="text-xs text-gray-500">PDF, JPG, PNG (Max 5MB)</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setFiles(prev => ({ ...prev, aadhaarDoc: file }));
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Mobile Number *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        maxLength={10}
                        value={formData.mobile}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setFormData({ ...formData, mobile: value });
                        }}
                        className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 border-gray-300"
                        required
                      />
                    </div>
                  </div>

                  {/* Caste Certificate */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Caste Certificate *</label>
                    <div className="border-2 border-dashed rounded-lg p-4 hover:border-orange-400 transition-colors border-gray-300">
                      <label className="flex flex-col items-center cursor-pointer">
                        <Upload className="w-6 h-6 text-gray-400 mb-1" />
                        {files.casteCertificate ? (
                          <span className="text-xs text-gray-700 font-medium truncate max-w-full">{files.casteCertificate.name}</span>
                        ) : (
                          <>
                            <span className="text-xs text-gray-600 mb-0.5">Upload certificate</span>
                            <span className="text-xs text-gray-500">PDF, JPG (Max 5MB)</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setFiles(prev => ({ ...prev, casteCertificate: file }));
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Account Details */}
              <div>
                <h3 className="text-gray-900 mb-4 pb-2 border-b border-gray-200">Bank Account Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bank Account Number */}
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-2">Bank Account Number *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building2 className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type={showBankAccount ? "text" : "password"}
                        placeholder="Enter bank account number"
                        value={formData.bankAccount}
                        onChange={(e) => {
                          setFormData({ ...formData, bankAccount: e.target.value });
                          setValidation(prev => ({ ...prev, bank: { validated: false, loading: false } }));
                        }}
                        className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 border-gray-300"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowBankAccount(!showBankAccount)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  {/* IFSC Code */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">IFSC Code *</label>
                    <input
                      type="text"
                      placeholder="e.g., SBIN0001234"
                      maxLength={11}
                      value={formData.ifsc}
                      onChange={(e) => {
                        setFormData({ ...formData, ifsc: e.target.value.toUpperCase() });
                        setValidation(prev => ({ ...prev, bank: { validated: false, loading: false } }));
                      }}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 border-gray-300"
                      required
                    />
                  </div>

                  {/* Validate Button */}
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleBankValidate}
                      disabled={validation.bank.loading || validation.bank.validated || !formData.bankAccount || !formData.ifsc}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <span>{validation.bank.loading ? 'Validating...' : validation.bank.validated ? 'Validated ✓' : 'Validate Bank Details'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Project Enrollment */}
              <div>
                <h3 className="text-gray-900 mb-4 pb-2 border-b border-gray-200">Project Enrollment</h3>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Select Project to Enroll *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                    </div>
                    <select
                      value={formData.projectId}
                      onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 border-gray-300"
                      required
                    >
                      <option value="">-- Select a project --</option>
                      <option value="proj-001">Youth Skill Development Program</option>
                      <option value="proj-002">Rural Infrastructure Improvement</option>
                      <option value="proj-003">Farmer Training and Support</option>
                      <option value="proj-004">Women Empowerment Scheme</option>
                      <option value="proj-005">Digital Literacy Program</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Section */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    <span>Save &amp; Register Beneficiary</span>
                  </button>
                  <p className="text-sm text-gray-500">All fields marked with * are required</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
