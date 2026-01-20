"use client";

import React, { useMemo, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";


const connectionStatus = {
  system: "Public Financial Management System",
  uptime: 99.8,
  responseTimeMs: 145,
};

const initialReceipts = [
  {
    id: "PFMS-REC-2024-0156",
    date: "6 Dec 2024",
    ftoNumber: "FTO-2024-0045",
    project: "Youth Skill Development Program",
    amount: "₹50,00,000",
    status: "acknowledged" as const,
    ackNumber: "ACK-2024-789456",
  },
  {
    id: "PFMS-REC-2024-0155",
    date: "5 Dec 2024",
    ftoNumber: "FTO-2024-0044",
    project: "Rural Infrastructure Improvement",
    amount: "₹75,00,000",
    status: "acknowledged" as const,
    ackNumber: "ACK-2024-789455",
  },
  {
    id: "PFMS-REC-2024-0154",
    date: "4 Dec 2024",
    ftoNumber: "FTO-2024-0043",
    project: "Farmer Training and Support Initiative",
    amount: "₹32,00,000",
    status: "pending" as const,
    ackNumber: "-",
  },
  {
    id: "PFMS-REC-2024-0153",
    date: "4 Dec 2024",
    ftoNumber: "FTO-2024-0042",
    project: "Digital Literacy Program",
    amount: "₹41,00,000",
    status: "acknowledged" as const,
    ackNumber: "ACK-2024-789454",
  },
  {
    id: "PFMS-REC-2024-0152",
    date: "4 Dec 2024",
    ftoNumber: "FTO-2024-0041",
    project: "Women Empowerment Scheme",
    amount: "₹68,00,000",
    status: "acknowledged" as const,
    ackNumber: "ACK-2024-789453",
  },
  {
    id: "PFMS-REC-2024-0151",
    date: "3 Dec 2024",
    ftoNumber: "FTO-2024-0040",
    project: "Health Infrastructure Development",
    amount: "₹25,00,000",
    status: "failed" as const,
    ackNumber: "-",
  },
];

const initialAccounts = [
  {
    accountNumber: "1234567890",
    name: "State EAT Account - Primary",
    balance: "₹12,50,00,000",
    lastUpdated: "6 Dec, 02:30 pm",
    status: "synced" as const,
  },
  {
    accountNumber: "2345678901",
    name: "State EAT Account - Secondary",
    balance: "₹7,50,00,000",
    lastUpdated: "6 Dec, 02:30 pm",
    status: "synced" as const,
  },
  {
    accountNumber: "3456789012",
    name: "District EAT Account - North",
    balance: "₹4,50,00,000",
    lastUpdated: "6 Dec, 02:25 pm",
    status: "synced" as const,
  },
  {
    accountNumber: "4567890123",
    name: "District EAT Account - South",
    balance: "₹3,80,00,000",
    lastUpdated: "6 Dec, 02:25 pm",
    status: "pending" as const,
  },
];

type Receipt = (typeof initialReceipts)[number];
type Account = (typeof initialAccounts)[number];

type StatusBadgeProps = {
  status: Receipt["status"];
};

function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    acknowledged: {
      text: "text-green-700",
      bg: "bg-green-50",
      dot: "bg-green-600",
      label: "Acknowledged",
    },
    pending: {
      text: "text-orange-700",
      bg: "bg-orange-50",
      dot: "bg-orange-500",
      label: "Pending",
    },
    failed: {
      text: "text-red-700",
      bg: "bg-red-50",
      dot: "bg-red-500",
      label: "Failed",
    },
  }[status];

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${styles.bg} ${styles.text}`}>
      <span className={`w-2 h-2 rounded-full ${styles.dot}`}></span>
      {styles.label}
    </span>
  );
}

export default function PFMSMonitorPage() {
  const [receipts, setReceipts] = useState<Receipt[]>(initialReceipts);
  const [lastSync, setLastSync] = useState<string>("6 Dec 2024 • 02:30 pm");
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  const acknowledgedCount = useMemo(
    () => receipts.filter((r) => r.status === "acknowledged").length,
    [receipts]
  );
  const pendingCount = useMemo(
    () => receipts.filter((r) => r.status === "pending").length,
    [receipts]
  );

  const lastSyncDate = lastSync.split("•")[0]?.trim() || lastSync;
  const lastSyncTime = lastSync.split("•")[1]?.trim() || "";

  const syncedAccounts = initialAccounts.filter((a) => a.status === "synced");

  const handleResync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const now = new Date();
      const newReceipt: Receipt = {
        id: `PFMS-REC-${now.getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`,
        date: now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
        ftoNumber: `FTO-${now.getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`,
        project: "Auto-sync: EAT transfer",
        amount: "₹15,00,000",
        status: "acknowledged",
        ackNumber: `ACK-${now.getFullYear()}-${Math.floor(Math.random() * 900000) + 100000}`,
      };
      setReceipts((prev) => [newReceipt, ...prev]);
      setLastSync(`${now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} • ${now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`);
      setIsSyncing(false);
    }, 800);
  };

  return (
    <DashboardLayout>
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-gray-900">PFMS Integration Monitor</h1>
            <p className="text-gray-600 text-sm mt-1">Monitor PFMS connectivity, receipts, and EAT account sync status</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full flex items-center gap-2 bg-green-100 text-green-700">
              <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
              <span className="text-sm">Live</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="max-w-screen-2xl mx-auto space-y-6">
          {/* Connection status */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wifi w-6 h-6 text-green-600" aria-hidden="true">
                    <path d="M12 20h.01"></path>
                    <path d="M2 8.82a15 15 0 0 1 20 0"></path>
                    <path d="M5 12.859a10 10 0 0 1 14 0"></path>
                    <path d="M8.5 16.429a5 5 0 0 1 7 0"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-gray-900">PFMS Connection Status</h3>
                  <p className="text-sm text-gray-500 mt-1">Public Financial Management System</p>
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-full flex items-center gap-2 bg-green-100 text-green-700">
                <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
                <span className="text-sm">Connected</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-activity w-4 h-4 text-gray-500" aria-hidden="true">
                    <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
                  </svg>
                  <p className="text-xs text-gray-600">System Uptime</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl text-gray-900">{connectionStatus.uptime.toFixed(2)}%</p>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-big w-4 h-4 text-green-600" aria-hidden="true">
                    <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                    <path d="m9 11 3 3L22 4"></path>
                  </svg>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-green-600" style={{ width: `${connectionStatus.uptime}%` }}></div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-4 h-4 text-gray-500" aria-hidden="true">
                    <path d="M12 6v6l4 2"></path>
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                  <p className="text-xs text-gray-600">Last Sync</p>
                </div>
                <p className="text-sm text-gray-900 mb-1">{lastSyncDate}</p>
                <p className="text-xs text-gray-500">{lastSyncTime || ""}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-activity w-4 h-4 text-gray-500" aria-hidden="true">
                    <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
                  </svg>
                  <p className="text-xs text-gray-600">Response Time</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl text-gray-900">{connectionStatus.responseTimeMs}</p>
                  <span className="text-sm text-gray-600">ms</span>
                </div>
                <p className="text-xs mt-1 text-green-600">Excellent</p>
              </div>
            </div>
          </div>

          {/* Receipts */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text w-6 h-6 text-orange-600" aria-hidden="true">
                    <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path>
                    <path d="M14 2v5a1 1 0 0 0 1 1h5"></path>
                    <path d="M10 9H8"></path>
                    <path d="M16 13H8"></path>
                    <path d="M16 17H8"></path>
                  </svg>
                  <div>
                    <h3 className="text-gray-900">Recent PFMS Receipts</h3>
                    <p className="text-sm text-gray-500 mt-1">Latest fund transfer acknowledgements</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded text-sm">{acknowledgedCount} Acknowledged</span>
                  <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded text-sm">{pendingCount} Pending</span>
                </div>
              </div>
            </div>

            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs text-gray-600">Receipt ID</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600">Date</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600">FTO Number</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600">Project</th>
                    <th className="px-4 py-3 text-right text-xs text-gray-600">Amount</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600">Ack. Number</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {receipts.map((receipt) => (
                    <tr key={receipt.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{receipt.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{receipt.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{receipt.ftoNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">{receipt.project}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">{receipt.amount}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          {receipt.status === "acknowledged" && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-big w-4 h-4 text-green-600" aria-hidden="true">
                              <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                              <path d="m9 11 3 3L22 4"></path>
                            </svg>
                          )}
                          {receipt.status === "pending" && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-4 h-4 text-yellow-600" aria-hidden="true">
                              <path d="M12 6v6l4 2"></path>
                              <circle cx="12" cy="12" r="10"></circle>
                            </svg>
                          )}
                          {receipt.status === "failed" && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-alert w-4 h-4 text-red-600" aria-hidden="true">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="12" x2="12" y1="8" y2="12"></line>
                              <line x1="12" x2="12.01" y1="16" y2="16"></line>
                            </svg>
                          )}
                          <span
                            className={`px-2 py-1 rounded text-xs capitalize ${
                              receipt.status === "acknowledged"
                                ? "bg-green-100 text-green-700"
                                : receipt.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {receipt.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{receipt.ackNumber}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedReceipt(receipt)}
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                            title="View Receipt"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye w-4 h-4 text-gray-600" aria-hidden="true">
                              <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Download Receipt">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download w-4 h-4 text-gray-600" aria-hidden="true">
                              <path d="M12 15V3"></path>
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <path d="m7 10 5 5 5-5"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden p-4">
              <div className="space-y-3">
                {receipts.map((receipt) => (
                  <div key={receipt.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-900 mb-1">{receipt.id}</p>
                        <p className="text-xs text-gray-600 truncate">{receipt.ftoNumber}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {receipt.status === "acknowledged" && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-big w-4 h-4 text-green-600" aria-hidden="true">
                            <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                            <path d="m9 11 3 3L22 4"></path>
                          </svg>
                        )}
                        {receipt.status === "pending" && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-4 h-4 text-yellow-600" aria-hidden="true">
                            <path d="M12 6v6l4 2"></path>
                            <circle cx="12" cy="12" r="10"></circle>
                          </svg>
                        )}
                        {receipt.status === "failed" && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-alert w-4 h-4 text-red-600" aria-hidden="true">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" x2="12" y1="8" y2="12"></line>
                            <line x1="12" x2="12.01" y1="16" y2="16"></line>
                          </svg>
                        )}
                        <span
                          className={`px-2 py-1 rounded text-xs capitalize ${
                            receipt.status === "acknowledged"
                              ? "bg-green-100 text-green-700"
                              : receipt.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {receipt.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 mb-2 line-clamp-2">{receipt.project}</p>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-gray-900">{receipt.amount}</p>
                      <p className="text-xs text-gray-600">{receipt.date.split(" ").slice(0, 2).join(" ")}</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded px-2 py-1 mb-2">
                      <p className="text-xs text-green-700">Ack: {receipt.ackNumber}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedReceipt(receipt)}
                        className="flex-1 px-3 py-1.5 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye w-4 h-4" aria-hidden="true">
                          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        <span>View</span>
                      </button>
                      <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download w-4 h-4" aria-hidden="true">
                          <path d="M12 15V3"></path>
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <path d="m7 10 5 5 5-5"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* EAT accounts */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-database w-6 h-6 text-blue-600" aria-hidden="true">
                      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                      <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
                      <path d="M3 12A9 3 0 0 0 21 12"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-gray-900">EAT Account Sync Status</h3>
                    <p className="text-sm text-gray-500 mt-1">Expenditure Advance Transfer Accounts</p>
                  </div>
                </div>
                <button
                  onClick={handleResync}
                  disabled={isSyncing}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw w-4 h-4" aria-hidden="true">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                    <path d="M21 3v5h-5"></path>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                    <path d="M8 16H3v5"></path>
                  </svg>
                  <span>{isSyncing ? "Resyncing..." : "Resync Now"}</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-700 mb-1">Total Accounts</p>
                  <p className="text-xl text-blue-900">{initialAccounts.length}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-green-700 mb-1">Synced Accounts</p>
                  <p className="text-xl text-green-900">{syncedAccounts.length} / {initialAccounts.length}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-700 mb-1">Total Balance</p>
                  <p className="text-xl text-gray-900">₹28,30,00,000</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-4 h-4" aria-hidden="true">
                  <path d="M12 6v6l4 2"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                <span>Last synced: {lastSync}</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs text-gray-600">Account Number</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600">Account Name</th>
                    <th className="px-4 py-3 text-right text-xs text-gray-600">Balance</th>
                    <th className="px-4 py-3 text-left text-xs text-gray-600">Last Updated</th>
                    <th className="px-4 py-3 text-center text-xs text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {initialAccounts.map((account) => (
                    <tr key={account.accountNumber} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{account.accountNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{account.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">{account.balance}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{account.lastUpdated}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          {account.status === "synced" ? (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-big w-4 h-4 text-green-600" aria-hidden="true">
                                <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                                <path d="m9 11 3 3L22 4"></path>
                              </svg>
                              <span className="px-2 py-1 rounded text-xs capitalize bg-green-100 text-green-700">synced</span>
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-4 h-4 text-yellow-600" aria-hidden="true">
                                <path d="M12 6v6l4 2"></path>
                                <circle cx="12" cy="12" r="10"></circle>
                              </svg>
                              <span className="px-2 py-1 rounded text-xs capitalize bg-yellow-100 text-yellow-700">pending</span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* View Receipt Modal */}
        {selectedReceipt && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500">Receipt ID</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedReceipt.id}</p>
                </div>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                  aria-label="Close receipt modal"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium">{selectedReceipt.date}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">FTO Number</p>
                  <p className="font-medium">{selectedReceipt.ftoNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Project</p>
                  <p className="font-medium">{selectedReceipt.project}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="font-medium">{selectedReceipt.amount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <StatusBadge status={selectedReceipt.status} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ack. Number</p>
                  <p className="font-medium">{selectedReceipt.ackNumber}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    const ftoNumber = selectedReceipt.ftoNumber;
                    window.open(`/payments/fto?id=${ftoNumber}`, '_blank');
                  }}
                  className="px-4 py-2 text-sm font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                >
                  View FTO
                </button>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#EA9000] hover:bg-[#d88000] rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
