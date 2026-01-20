"use client";

import React from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import Link from 'next/link';

export default function SNADashboard() {
  return (
    <DashboardLayout>
      <main className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-3xl font-bold text-[#2C3E50]">SNA Dashboard</h1>
          <p className="text-gray-600 mt-1">State Nodal Agency - Fund Management & Beneficiary Oversight</p>
        </div>

        <div className="p-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.6667 5L7.50001 14.1667L3.33334 10" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">247</p>
                  <p className="text-sm text-gray-600">Total Beneficiaries</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 5V10L13.3333 11.6667" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-700">34</p>
                  <p className="text-sm text-gray-600">Pending Verification</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z" stroke="#10B981" strokeWidth="1.5"/>
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700">₹145.2 Cr</p>
                  <p className="text-sm text-gray-600">Funds Disbursed</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2.5L12.5 7.5L17.5 8.33333L13.75 12.0833L14.5833 17.0833L10 14.5L5.41667 17.0833L6.25 12.0833L2.5 8.33333L7.5 7.5L10 2.5Z" stroke="#EA9000" strokeWidth="1.5"/>
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#EA9000]">18</p>
                  <p className="text-sm text-gray-600">Active Projects</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link 
                href="/beneficiary/verify"
                className="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-lg hover:border-[#EA9000] hover:bg-orange-50 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-[#EA9000] transition-colors">
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="none" className="group-hover:text-white text-blue-600 transition-colors">
                    <path d="M16.6667 5L7.50001 14.1667L3.33334 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Verify Beneficiaries</h3>
                  <p className="text-sm text-gray-600">Review and approve pending beneficiary registrations</p>
                </div>
              </Link>

              <div className="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-lg opacity-50 cursor-not-allowed">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="none" className="text-gray-400">
                    <path d="M10 2.5V10M10 10L13.75 12.5M10 10L6.25 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Review Fund Releases</h3>
                  <p className="text-sm text-gray-600">Coming soon - Monitor fund disbursements</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-lg opacity-50 cursor-not-allowed">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="none" className="text-gray-400">
                    <path d="M2.5 7.5L10 2.5L17.5 7.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V7.5Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Manage Accounts</h3>
                  <p className="text-sm text-gray-600">Coming soon - SNA account management</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-lg opacity-50 cursor-not-allowed">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="none" className="text-gray-400">
                    <path d="M16.6667 2.5H3.33333C2.8731 2.5 2.5 2.8731 2.5 3.33333V16.6667C2.5 17.1269 2.8731 17.5 3.33333 17.5H16.6667C17.1269 17.5 17.5 17.1269 17.5 16.6667V3.33333C17.5 2.8731 17.1269 2.5 16.6667 2.5Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Generate Reports</h3>
                  <p className="text-sm text-gray-600">Coming soon - Compliance and audit reports</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
