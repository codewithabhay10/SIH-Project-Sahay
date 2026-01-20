import React from 'react';
import { SNAAccount } from '@/lib/types';

interface SNAAccountsListProps {
  accounts: SNAAccount[];
  totalBalance: number;
}

export default function SNAAccountsList({ accounts, totalBalance }: SNAAccountsListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-600">Total Balance</h4>
        <p className="text-2xl font-bold text-[#2C3E50]">₹{totalBalance.toFixed(1)}Cr</p>
      </div>
      
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M13.3333 4H2.66667C1.93029 4 1.33333 4.59695 1.33333 5.33333V12.6667C1.33333 13.403 1.93029 14 2.66667 14H13.3333C14.0697 14 14.6667 13.403 14.6667 12.6667V5.33333C14.6667 4.59695 14.0697 4 13.3333 4Z"
                        stroke="#EA9000"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.6667 14V3.33333C10.6667 2.97971 10.5262 2.64057 10.2761 2.39052C10.0261 2.14048 9.68696 2 9.33333 2H6.66667C6.31304 2 5.97391 2.14048 5.72386 2.39052C5.47381 2.64057 5.33333 2.97971 5.33333 3.33333V14"
                        stroke="#EA9000"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{account.name}</p>
                    <p className="text-xs text-gray-500">{account.accountNumber}</p>
                  </div>
                </div>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                account.changeType === 'positive' ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  {account.changeType === 'positive' ? (
                    <path
                      d="M5 7.5V2.5M5 2.5L2.5 5M5 2.5L7.5 5"
                      stroke="#10B981"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <path
                      d="M5 2.5V7.5M5 7.5L2.5 5M5 7.5L7.5 5"
                      stroke="#EF4444"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
                <span className={`text-xs font-semibold ${
                  account.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {Math.abs(account.change)}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-gray-900">₹{account.balance.toFixed(1)}Cr</p>
              <span className="text-xs text-gray-500">{account.lastUpdated}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t border-gray-200 text-center">
        <a 
          href="/funds/sna" 
          className="text-sm font-medium text-[#EA9000] hover:text-[#d88000] transition-colors inline-flex items-center gap-1"
        >
          View All & Reconcile
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 12L10 8L6 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
