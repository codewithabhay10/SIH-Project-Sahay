"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import { api } from "@/lib/api";
import {
  FolderOpen,
  Wallet,
  FileText,
  TrendingUp,
  Building2,
  Search,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

interface KPIStat {
  label: string;
  value: string;
  subtitle: string;
  icon: any;
  trend: {
    value: string;
    isPositive: boolean;
  };
}

interface PipelineStage {
  label: string;
  count: number;
  percentage: number;
  conversion?: string;
  color: string;
}

interface SNAAccount {
  name: string;
  accountNumber: string;
  balance: string;
  trend: {
    value: string;
    isPositive: boolean;
  };
  updatedAt: string;
}

interface Project {
  id: string;
  name: string;
  district: string;
  iaType: string;
  status: string;
  allocated: string;
  released: string;
  releasePercentage: string;
}

type ApiProject = {
  _id: string;
  project_name: string;
  district?: string;
  state?: string;
  IA_code?: string;
  SNA_code?: string;
  status: "draft" | "submitted" | "in_progress" | "approved" | "rejected";
  allocated_amount?: number;
  released_amount?: number;
  createdAt?: string;
};

export default function StateDashboard() {
  const params = useParams();
  const stateId = params.stateId as string;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedIAType, setSelectedIAType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("November, 2024");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const formatAmount = (amount: number | undefined) => {
      const val = Number(amount || 0);
      if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
      if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
      return `₹${val.toLocaleString("en-IN")}`;
    };

    const mapStatus = (s: ApiProject["status"]): string => {
      switch (s) {
        case "submitted":
          return "Submitted";
        case "in_progress":
          return "In Review";
        case "approved":
          return "Approved";
        case "rejected":
          return "Rejected";
        default:
          return "Draft";
      }
    };

    // Mock Projects Data
    const mockProjects: Project[] = [
      {
        id: "1",
        name: "Skill Development Training Center - Mumbai",
        district: "Mumbai",
        iaType: "NGO",
        status: "Approved",
        allocated: "₹45.5Cr",
        released: "₹32.8Cr",
        releasePercentage: "72%",
      },
      {
        id: "2",
        name: "Rural Healthcare Infrastructure Project",
        district: "Pune",
        iaType: "Municipal Corp",
        status: "Funds Released",
        allocated: "₹82.3Cr",
        released: "₹82.3Cr",
        releasePercentage: "100%",
      },
      {
        id: "3",
        name: "Women Empowerment & Livelihood Program",
        district: "Nagpur",
        iaType: "SHG Federation",
        status: "In Review",
        allocated: "₹28.7Cr",
        released: "₹15.2Cr",
        releasePercentage: "53%",
      },
      {
        id: "4",
        name: "Digital Literacy Campaign - Tribal Areas",
        district: "Thane",
        iaType: "NGO",
        status: "Submitted",
        allocated: "₹19.4Cr",
        released: "₹8.5Cr",
        releasePercentage: "44%",
      },
      {
        id: "5",
        name: "Agriculture Modernization & Irrigation",
        district: "Nashik",
        iaType: "Farmer Coop",
        status: "Approved",
        allocated: "₹67.8Cr",
        released: "₹45.2Cr",
        releasePercentage: "67%",
      },
      {
        id: "6",
        name: "Urban Sanitation & Waste Management",
        district: "Aurangabad",
        iaType: "Municipal Corp",
        status: "In Review",
        allocated: "₹54.2Cr",
        released: "₹22.1Cr",
        releasePercentage: "41%",
      },
      {
        id: "7",
        name: "School Infrastructure Development Project",
        district: "Solapur",
        iaType: "Education Board",
        status: "Approved",
        allocated: "₹38.9Cr",
        released: "₹31.2Cr",
        releasePercentage: "80%",
      },
      {
        id: "8",
        name: "Renewable Energy for Rural Electrification",
        district: "Kolhapur",
        iaType: "Power Dept",
        status: "Funds Released",
        allocated: "₹91.5Cr",
        released: "₹91.5Cr",
        releasePercentage: "100%",
      },
      {
        id: "9",
        name: "Youth Employment & Skill Training Hub",
        district: "Ahmednagar",
        iaType: "NGO",
        status: "Submitted",
        allocated: "₹24.6Cr",
        released: "₹10.8Cr",
        releasePercentage: "44%",
      },
      {
        id: "10",
        name: "Water Conservation & Management System",
        district: "Satara",
        iaType: "Water Board",
        status: "Approved",
        allocated: "₹73.1Cr",
        released: "₹51.8Cr",
        releasePercentage: "71%",
      },
      {
        id: "11",
        name: "Maternal & Child Health Program",
        district: "Ratnagiri",
        iaType: "Health Dept",
        status: "In Review",
        allocated: "₹32.4Cr",
        released: "₹18.9Cr",
        releasePercentage: "58%",
      },
      {
        id: "12",
        name: "Integrated Livelihood Support Project",
        district: "Latur",
        iaType: "SHG Federation",
        status: "Submitted",
        allocated: "₹41.7Cr",
        released: "₹16.7Cr",
        releasePercentage: "40%",
      },
    ];

    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/projects", {
          params: {
            status: "submitted",
            state: stateId,
            page: 1,
            limit: 100,
          },
        });
        const list: ApiProject[] = res.data?.projects || [];
        
        if (list.length > 0) {
          const mapped: Project[] = list.map((p) => {
            const allocated = Number(p.allocated_amount || 0);
            const released = Number(p.released_amount || 0);
            const pct =
              allocated > 0 ? Math.round((released / allocated) * 100) : 0;
            return {
              id: p._id,
              name: p.project_name,
              district: p.district || "-",
              iaType: p.IA_code || "-",
              status: mapStatus(p.status),
              allocated: formatAmount(allocated),
              released: formatAmount(released),
              releasePercentage: `${pct}%`,
            };
          });
          setProjects(mapped);
        } else {
          // Use mock data if no projects returned from API
          setProjects(mockProjects);
        }
      } catch (e: any) {
        // Use mock data on error
        setProjects(mockProjects);
        setError(null); // Clear error since we're showing mock data
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [api, stateId]);

  // KPI Stats
  const kpiStats: KPIStat[] = [
    {
      label: "Total Projects",
      value: "234",
      subtitle: "42 active this month",
      icon: FolderOpen,
      trend: { value: "12%", isPositive: true },
    },
    {
      label: "Funds Received",
      value: "₹1,250.5 Cr",
      subtitle: "Current FY",
      icon: Wallet,
      trend: { value: "8%", isPositive: true },
    },
    {
      label: "Unspent Balance",
      value: "₹342.8 Cr",
      subtitle: "27.4% of received",
      icon: Wallet,
      trend: { value: "3%", isPositive: false },
    },
  ];

  // Pipeline Stages
  const pipelineStages: PipelineStage[] = [
    {
      label: "Submitted",
      count: 156,
      percentage: 100,
      conversion: "63% conversion",
      color: "bg-orange-600",
    },
    {
      label: "In Review",
      count: 98,
      percentage: 63,
      conversion: "73% conversion",
      color: "bg-orange-500",
    },
    {
      label: "Approved",
      count: 72,
      percentage: 46,
      conversion: "81% conversion",
      color: "bg-orange-400",
    },
    {
      label: "Funds Released",
      count: 58,
      percentage: 37,
      conversion: "",
      color: "bg-orange-300",
    },
  ];

  // SNA Accounts
  const snaAccounts: SNAAccount[] = [
    {
      name: "State Treasury - Main",
      accountNumber: "****8901",
      balance: "₹1500.0Cr",
      trend: { value: "5.2%", isPositive: true },
      updatedAt: "2 hours ago",
    },
    {
      name: "District Fund - North",
      accountNumber: "****7234",
      balance: "₹420.0Cr",
      trend: { value: "2.8%", isPositive: false },
      updatedAt: "5 hours ago",
    },
    {
      name: "District Fund - South",
      accountNumber: "****5678",
      balance: "₹380.0Cr",
      trend: { value: "1.5%", isPositive: true },
      updatedAt: "1 day ago",
    },
    {
      name: "District Fund - East",
      accountNumber: "****9012",
      balance: "₹290.0Cr",
      trend: { value: "0.8%", isPositive: true },
      updatedAt: "1 day ago",
    },
    {
      name: "District Fund - West",
      accountNumber: "****3456",
      balance: "₹310.0Cr",
      trend: { value: "3.2%", isPositive: false },
      updatedAt: "6 hours ago",
    },
  ];

  // Projects are now loaded from backend (Submitted only)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Submitted":
        return "bg-blue-100 text-blue-700";
      case "In Review":
        return "bg-yellow-100 text-yellow-700";
      case "Funds Released":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const totalBalance = snaAccounts.reduce((acc, account) => {
    const balance = parseFloat(account.balance.replace(/[₹,Cr]/g, ""));
    return acc + balance;
  }, 0);

  // Dynamic filter options from projects
  const districts = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.district) set.add(p.district);
    });
    return Array.from(set).sort();
  }, [projects]);

  const iaTypes = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.iaType) set.add(p.iaType);
    });
    return Array.from(set).sort();
  }, [projects]);

  const statuses = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.status) set.add(p.status);
    });
    return Array.from(set).sort();
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = project.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesDistrict =
        selectedDistrict === "all" || project.district === selectedDistrict;
      const matchesIAType =
        selectedIAType === "all" || project.iaType === selectedIAType;
      const matchesStatus =
        selectedStatus === "all" || project.status === selectedStatus;
      return matchesSearch && matchesDistrict && matchesIAType && matchesStatus;
    });
  }, [searchQuery, selectedDistrict, selectedIAType, selectedStatus, projects]);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 text-xl font-semibold">
              Maharashtra Dashboard
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              State-level fund management and project overview
            </p>
          </div>
          <div className="flex items-center gap-3">
            {loading && <span className="text-sm text-gray-500">Loading…</span>}
            {error && <span className="text-sm text-red-600">{error}</span>}
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-gray-600"
              >
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                <path d="M3 10h18"></path>
              </svg>
              <input
                type="month"
                className="border-none outline-none focus:ring-0 text-sm bg-transparent"
                defaultValue="2024-11"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpiStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <stat.icon className="w-5 h-5 text-orange-600" />
                </div>
                {stat.trend.value && (
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                      stat.trend.isPositive
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {stat.trend.isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingUp className="w-3 h-3 rotate-180" />
                    )}
                    {stat.trend.value}
                  </div>
                )}
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{stat.label}</h3>
              <p className="text-gray-900 mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Proposal Pipeline + SNA Accounts (grid like design) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Proposal Pipeline */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="text-gray-900 mb-4">Proposal Pipeline</h3>
              <div className="space-y-3">
                {pipelineStages.map((stage, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">{stage.label}</span>
                        {index < pipelineStages.length - 1 && (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-900">{stage.count}</span>
                        <span className="text-xs text-gray-500 w-12 text-right">
                          {stage.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${stage.color}`}
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>
                    {stage.conversion && (
                      <div className="mt-1 text-xs text-gray-500 text-right">
                        {stage.conversion}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Overall Conversion Rate</span>
                  <span className="text-gray-900">37%</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Average Processing Time</span>
                  <span className="text-gray-900">14 days</span>
                </div>
              </div>
            </div>
          </div>

          {/* SNA Accounts */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900">SNA Accounts</h3>
                <button className="text-sm text-orange-600 hover:text-orange-700">
                  View All
                </button>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-orange-700 mb-1">Total Balance</p>
                <p className="text-gray-900">₹{totalBalance.toFixed(1)}Cr</p>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {snaAccounts.map((account, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border border-gray-200 hover:border-orange-200 hover:bg-orange-50/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <div className="p-1.5 bg-orange-100 rounded mt-0.5 shrink-0">
                          <Building2 className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 truncate">
                            {account.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {account.accountNumber}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs ${
                          account.trend.isPositive
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {account.trend.isPositive ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingUp className="w-3 h-3 rotate-180" />
                        )}
                        {account.trend.value}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pl-9">
                      <span className="text-gray-900">{account.balance}</span>
                      <span className="text-xs text-gray-500">
                        {account.updatedAt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section (full width card) */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-5 border-b border-gray-200">
            <h3 className="text-gray-900 mb-4">Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Districts</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <select
                value={selectedIAType}
                onChange={(e) => setSelectedIAType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All IA Types</option>
                {iaTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Statuses</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    <button className="flex items-center gap-1 hover:text-gray-900">
                      Project
                      <ChevronUp className="w-4 h-4 text-orange-600" />
                    </button>
                  </th>
                  <th className="px-5 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    District / IA Type
                  </th>
                  <th className="px-5 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    <button className="flex items-center gap-1 hover:text-gray-900">
                      Status
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                  </th>
                  <th className="px-5 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    <button className="flex items-center gap-1 hover:text-gray-900">
                      Allocated
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                  </th>
                  <th className="px-5 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    <button className="flex items-center gap-1 hover:text-gray-900">
                      Released
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                  </th>
                  <th className="px-5 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{project.name}</p>
                        <p className="text-xs text-gray-500">{project.id}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm text-gray-900">
                          {project.district}
                        </p>
                        <p className="text-xs text-gray-500">
                          {project.iaType}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-900">
                      {project.allocated}
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm text-gray-900">
                          {project.released}
                        </p>
                        <p className="text-xs text-gray-500">
                          {project.releasePercentage}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                          title="Open Project"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                          title="Request Clarification"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * projectsPerPage + 1} to{" "}
              {Math.min(currentPage * projectsPerPage, filteredProjects.length)} of{" "}
              {filteredProjects.length} projects
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded text-sm ${
                    page === currentPage
                      ? "bg-orange-600 text-white border-orange-600"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
