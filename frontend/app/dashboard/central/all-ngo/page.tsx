"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import ngoData from "@/db/ngo.json";
import { color } from "html2canvas/dist/types/css/types/color";

type NGO = {
  Name: string;
  Address: string;
  District: string;
  State: string;
  No_of_Successful_Projects: number;
  No_of_Failed_Projects: number;
  Certificate_No: string;
  Establishment_Year: number;
  Contact_Person: string;
  Email: string;
  Category: string;
};

type Project = {
  project_id: string;
  title: string;
  status: "Successful" | "Failed";
  category: string;
  budget: number;
  actual_spent: number;
  start_date: string;
  end_date: string;
  duration_months: number;
  beneficiaries_count: number;
  target_beneficiaries: number;
  location: string;
  description: string;
  outcome_percentage: number;
  failure_reason?: string;
  key_achievements: string[];
  documents: Array<{
    name: string;
    type: string;
    date: string;
  }>;
  milestones: Array<{
    title: string;
    status: "Completed" | "Pending" | "Failed";
    date: string;
    description: string;
  }>;
  team_size: number;
  funding_source: string;
};

const generateSyntheticProjects = (
  ngo: NGO,
  successfulCount: number,
  failedCount: number
): Project[] => {
  const projectCategories = [
    "Education",
    "Healthcare",
    "Women Empowerment",
    "Child Welfare",
    "Rural Development",
    "Environmental Conservation",
    "Skill Training",
    "Water & Sanitation",
    "Disaster Relief",
    "Elderly Care",
  ];

  const fundingSources = [
    "Government Grant",
    "CSR Funding",
    "International Donor",
    "Private Philanthropy",
    "Crowdfunding",
    "Corporate Partnership",
  ];

  const failureReasons = [
    "Insufficient funding leading to incomplete implementation",
    "Poor community engagement and participation",
    "Administrative delays and bureaucratic hurdles",
    "Natural disaster impacting project execution",
    "Change in government policy affecting project viability",
    "Inadequate project planning and resource allocation",
    "Staff turnover and management issues",
  ];

  const projects: Project[] = [];
  const totalProjects = successfulCount + failedCount;

  // Generate successful projects
  for (let i = 0; i < successfulCount; i++) {
    const category =
      projectCategories[Math.floor(Math.random() * projectCategories.length)];
    const duration = 12 + Math.floor(Math.random() * 24);
    const budget = 500000 + Math.floor(Math.random() * 4500000);
    const actual = Math.floor(budget * (0.85 + Math.random() * 0.1));
    const target = 100 + Math.floor(Math.random() * 400);
    const achieved = Math.floor(target * (1 + Math.random() * 0.2));

    const startDate = new Date();
    startDate.setMonth(
      startDate.getMonth() -
        (totalProjects - i) * 8 -
        Math.floor(Math.random() * 6)
    );
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + duration);

    projects.push({
      project_id: `PRJ-${ngo.Certificate_No.slice(-4)}-${String(i + 1).padStart(
        3,
        "0"
      )}`,
      title: `${category} Initiative - ${ngo.District}`,
      status: "Successful",
      category,
      budget,
      actual_spent: actual,
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
      duration_months: duration,
      beneficiaries_count: achieved,
      target_beneficiaries: target,
      location: `${ngo.District}, ${ngo.State}`,
      description: `A comprehensive ${category.toLowerCase()} project aimed at improving quality of life and creating sustainable impact in the community.`,
      outcome_percentage: 85 + Math.floor(Math.random() * 15),
      key_achievements: [
        `Successfully reached ${achieved} beneficiaries exceeding target`,
        `Established ${3 + Math.floor(Math.random() * 5)} community centers`,
        `Trained ${50 + Math.floor(Math.random() * 150)} local volunteers`,
        `Generated positive impact with ${
          90 + Math.floor(Math.random() * 10)
        }% satisfaction rate`,
      ],
      documents: [
        {
          name: "Project Proposal.pdf",
          type: "Proposal",
          date: startDate.toISOString().split("T")[0],
        },
        {
          name: "Approval Letter.pdf",
          type: "Approval",
          date: new Date(startDate.getTime() + 15 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        },
        {
          name: "Mid-term Report.pdf",
          type: "Report",
          date: new Date(
            startDate.getTime() + duration * 15 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0],
        },
        {
          name: "Final Report.pdf",
          type: "Report",
          date: endDate.toISOString().split("T")[0],
        },
        {
          name: "Impact Assessment.pdf",
          type: "Assessment",
          date: new Date(endDate.getTime() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        },
      ],
      milestones: [
        {
          title: "Project Kickoff",
          status: "Completed",
          date: startDate.toISOString().split("T")[0],
          description: "Initial setup and team formation",
        },
        {
          title: "Community Mobilization",
          status: "Completed",
          date: new Date(
            startDate.getTime() + duration * 10 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0],
          description: "Engaged with local communities",
        },
        {
          title: "Implementation Phase",
          status: "Completed",
          date: new Date(
            startDate.getTime() + duration * 20 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0],
          description: "Core activities executed",
        },
        {
          title: "Project Completion",
          status: "Completed",
          date: endDate.toISOString().split("T")[0],
          description: "All objectives achieved",
        },
      ],
      team_size: 8 + Math.floor(Math.random() * 15),
      funding_source:
        fundingSources[Math.floor(Math.random() * fundingSources.length)],
    });
  }

  // Generate failed projects
  for (let i = 0; i < failedCount; i++) {
    const category =
      projectCategories[Math.floor(Math.random() * projectCategories.length)];
    const duration = 6 + Math.floor(Math.random() * 18);
    const budget = 400000 + Math.floor(Math.random() * 3600000);
    const actual = Math.floor(budget * (0.4 + Math.random() * 0.3));
    const target = 80 + Math.floor(Math.random() * 320);
    const achieved = Math.floor(target * (0.3 + Math.random() * 0.3));

    const startDate = new Date();
    startDate.setMonth(
      startDate.getMonth() -
        (totalProjects - successfulCount - i) * 8 -
        Math.floor(Math.random() * 6)
    );
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + duration);

    projects.push({
      project_id: `PRJ-${ngo.Certificate_No.slice(-4)}-${String(
        successfulCount + i + 1
      ).padStart(3, "0")}`,
      title: `${category} Project - ${ngo.District}`,
      status: "Failed",
      category,
      budget,
      actual_spent: actual,
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
      duration_months: duration,
      beneficiaries_count: achieved,
      target_beneficiaries: target,
      location: `${ngo.District}, ${ngo.State}`,
      description: `An ambitious ${category.toLowerCase()} project that faced challenges during implementation.`,
      outcome_percentage: 30 + Math.floor(Math.random() * 30),
      failure_reason:
        failureReasons[Math.floor(Math.random() * failureReasons.length)],
      key_achievements: [
        `Reached ${achieved} beneficiaries (${Math.floor(
          (achieved / target) * 100
        )}% of target)`,
        `Completed ${
          1 + Math.floor(Math.random() * 2)
        } out of planned milestones`,
        `Identified key learnings for future projects`,
      ],
      documents: [
        {
          name: "Project Proposal.pdf",
          type: "Proposal",
          date: startDate.toISOString().split("T")[0],
        },
        {
          name: "Approval Letter.pdf",
          type: "Approval",
          date: new Date(startDate.getTime() + 15 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        },
        {
          name: "Progress Report.pdf",
          type: "Report",
          date: new Date(
            startDate.getTime() + duration * 15 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0],
        },
        {
          name: "Closure Report.pdf",
          type: "Report",
          date: endDate.toISOString().split("T")[0],
        },
      ],
      milestones: [
        {
          title: "Project Kickoff",
          status: "Completed",
          date: startDate.toISOString().split("T")[0],
          description: "Initial setup completed",
        },
        {
          title: "Community Engagement",
          status: "Failed",
          date: new Date(
            startDate.getTime() + duration * 10 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0],
          description: "Challenges in community participation",
        },
        {
          title: "Implementation Phase",
          status: "Failed",
          date: new Date(
            startDate.getTime() + duration * 20 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0],
          description: "Unable to complete core activities",
        },
        {
          title: "Project Closure",
          status: "Completed",
          date: endDate.toISOString().split("T")[0],
          description: "Project officially closed",
        },
      ],
      team_size: 5 + Math.floor(Math.random() * 10),
      funding_source:
        fundingSources[Math.floor(Math.random() * fundingSources.length)],
    });
  }

  return projects.sort(
    (a, b) =>
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );
};

export default function AllNGOPage() {
  const [rows, setRows] = useState<
    (NGO & {
      totalProjects: number;
      successRate: number;
      failureRate: number;
      onHold?: boolean;
      holdStart?: number;
      blocked?: boolean;
    })[]
  >(() => {
    const MAX_PROJECTS = 20; // threshold for hold
    const BLOCK_THRESHOLD = 0.2; // failure rate to block
    return (ngoData as NGO[]).map((r) => {
      const total =
        (r.No_of_Successful_Projects || 0) + (r.No_of_Failed_Projects || 0);
      const successRate = total > 0 ? r.No_of_Successful_Projects / total : 0;
      const failureRate = total > 0 ? r.No_of_Failed_Projects / total : 0;
      const blocked = failureRate >= BLOCK_THRESHOLD;
      const onHold = !blocked && total >= MAX_PROJECTS;
      return {
        ...r,
        totalProjects: total,
        successRate,
        failureRate,
        blocked,
        onHold,
        holdStart: onHold ? Date.now() : undefined,
      };
    });
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterState, setFilterState] = useState<string>("all");
  const [filterDistrict, setFilterDistrict] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [now, setNow] = useState<number>(Date.now());
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedNGO, setSelectedNGO] = useState<
    | (NGO & {
        totalProjects: number;
        successRate: number;
        failureRate: number;
        onHold?: boolean;
        holdStart?: number;
        blocked?: boolean;
      })
    | null
  >(null);
  const [ngoProjects, setNgoProjects] = useState<Project[]>([]);

  const states = useMemo(
    () => Array.from(new Set(rows.map((r) => r.State))).sort(),
    [rows]
  );
  const districts = useMemo(() => {
    if (filterState === "all") {
      return Array.from(new Set(rows.map((r) => r.District))).sort();
    }
    return Array.from(
      new Set(
        rows.filter((r) => r.State === filterState).map((r) => r.District)
      )
    ).sort();
  }, [rows, filterState]);
  const categories = useMemo(
    () => Array.from(new Set(rows.map((r) => r.Category))).sort(),
    [rows]
  );

  const filteredRows = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return rows.filter((r) => {
      const matchesSearch =
        !q ||
        r.Name.toLowerCase().includes(q) ||
        r.Address.toLowerCase().includes(q) ||
        r.District.toLowerCase().includes(q) ||
        r.State.toLowerCase().includes(q) ||
        r.Certificate_No.toLowerCase().includes(q) ||
        r.Contact_Person.toLowerCase().includes(q) ||
        r.Email.toLowerCase().includes(q) ||
        r.Category.toLowerCase().includes(q);
      const matchesState = filterState === "all" || r.State === filterState;
      const matchesDistrict =
        filterDistrict === "all" || r.District === filterDistrict;
      const matchesCategory =
        filterCategory === "all" || r.Category === filterCategory;
      return (
        matchesSearch && matchesState && matchesDistrict && matchesCategory
      );
    });
  }, [rows, searchQuery, filterState, filterDistrict, filterCategory]);

  const stats = {
    total: rows.length,
    categories: categories.length,
    states: states.length,
  };

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const getCountdownFrom = (start?: number) => {
    if (!start) return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    const threeMonthsMs = 90 * 24 * 60 * 60 * 1000;
    const target = start + threeMonthsMs;
    let diff = target - now;
    if (diff < 0) diff = 0;
    const months = Math.floor(diff / (30 * 24 * 60 * 60 * 1000));
    const days = Math.floor(
      (diff % (30 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000)
    );
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((diff % (60 * 1000)) / 1000);
    return { months, days, hours, minutes, seconds };
  };

  const handleRemoveHold = (certificateNo: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.Certificate_No === certificateNo
          ? { ...r, onHold: false, holdStart: undefined }
          : r
      )
    );
  };

  const handleRowClick = (
    ngo: NGO & {
      totalProjects: number;
      successRate: number;
      failureRate: number;
      onHold?: boolean;
      holdStart?: number;
      blocked?: boolean;
    }
  ) => {
    setSelectedNGO(ngo);
    const projects = generateSyntheticProjects(
      ngo,
      ngo.No_of_Successful_Projects,
      ngo.No_of_Failed_Projects
    );
    setNgoProjects(projects);
  };

  const handleCloseModal = () => {
    setSelectedNGO(null);
    setNgoProjects([]);
  };

  // Color flag like earlier based on total projects
  const flagColor = (total: number) => {
    if (total <= 0) return "bg-white";
    if (total >= 5) return "bg-red-600";
    const shades = ["bg-red-100", "bg-red-200", "bg-red-300", "bg-red-400"];
    return shades[total - 1] || "bg-red-100";
  };

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      const scoreA =
        (a.blocked ? -100 : 0) +
        (a.onHold ? -10 : 0) +
        a.successRate * 10 -
        a.failureRate * 10 -
        a.totalProjects * 0.1;
      const scoreB =
        (b.blocked ? -100 : 0) +
        (b.onHold ? -10 : 0) +
        b.successRate * 10 -
        b.failureRate * 10 -
        b.totalProjects * 0.1;
      return scoreB - scoreA;
    });
  }, [filteredRows]);

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#2C3E50]">All NGOs</h1>
              <p className="text-gray-600 mt-1">Imported from ngo.json</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total NGOs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-700">States Covered</p>
              <p className="text-2xl font-bold text-blue-700">{stats.states}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-700">Categories</p>
              <p className="text-2xl font-bold text-purple-700">
                {stats.categories}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Search by name, certificate, contact, email, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-[350px] px-4 py-3 border border-gray-300 rounded-lg text-sm"
            />
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg text-sm min-w-[160px]"
            >
              <option value="all">All States</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg text-sm min-w-[160px]"
            >
              <option value="all">All Districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg text-sm min-w-[160px]"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-4">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                      Address
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                      District
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                      State
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                      Successful Projects
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                      Failed Projects
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                      Certificate No.
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                      Est. Year
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                      Contact Person
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                      Category
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRows.map((r) => (
                    <tr
                      key={r.Certificate_No}
                      className="relative border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleRowClick(r)}
                      onMouseEnter={() => setHoveredId(r.Certificate_No)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block w-2 h-2 rounded ${flagColor(
                              r.totalProjects
                            )}`}
                          />
                          {r.Name}
                        </div>
                      </td>
                      <td className="px-4 py-2">{r.Address}</td>
                      <td className="px-4 py-2">{r.District}</td>
                      <td className="px-4 py-2">{r.State}</td>
                      <td className="px-4 py-2">
                        {r.No_of_Successful_Projects}
                      </td>
                      <td className="px-4 py-2">{r.No_of_Failed_Projects}</td>
                      <td className="px-4 py-2">{r.Certificate_No}</td>
                      <td className="px-4 py-2">{r.Establishment_Year}</td>
                      <td className="px-4 py-2">{r.Contact_Person}</td>
                      <td className="px-4 py-2">{r.Email}</td>
                      <td className="px-4 py-2">{r.Category}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          {r.blocked ? (
                            <span className="px-2 py-1 text-xs rounded bg-gray-800 text-white">
                              Blocked
                            </span>
                          ) : r.onHold ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveHold(r.Certificate_No);
                              }}
                              className="px-3 py-1.5 bg-orange-600 text-white text-xs font-medium rounded hover:bg-orange-700 transition-colors"
                            >
                              Remove Hold
                            </button>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                              Active
                            </span>
                          )}
                        </div>
                      </td>
                      {hoveredId === r.Certificate_No &&
                        (r.onHold || r.blocked) && (
                          <td className="absolute inset-0 bg-black/60 text-white flex items-center justify-center">
                            <div className="flex items-center gap-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-6 h-6"
                              >
                                <path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 8V7a3 3 0 116 0v3H9z" />
                              </svg>
                              {r.blocked ? (
                                <span className="font-medium">
                                  Blocked indefinitely
                                </span>
                              ) : (
                                <>
                                  <span className="font-medium">On Hold:</span>
                                  <span>
                                    {getCountdownFrom(r.holdStart).months}m{" "}
                                    {getCountdownFrom(r.holdStart).days}d{" "}
                                    {getCountdownFrom(r.holdStart).hours}h{" "}
                                    {getCountdownFrom(r.holdStart).minutes}m{" "}
                                    {getCountdownFrom(r.holdStart).seconds}s
                                  </span>
                                </>
                              )}
                            </div>
                          </td>
                        )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {sortedRows.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No NGOs found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* NGO Detail Modal */}
        {selectedNGO && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-linear-to-rrom-[#EA9000] to-[#D68000] text-white p-6 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2" style={{color: "black"}}    >
                    {selectedNGO.Name}
                  </h2>
                  <p className="text-black mb-1">
                    Certificate No: {selectedNGO.Certificate_No}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* NGO Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Organization Information
                  </h3>
                  <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Category</p>
                      <p className="font-medium text-gray-900">
                        {selectedNGO.Category}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Established</p>
                      <p className="font-medium text-gray-900">
                        {selectedNGO.Establishment_Year}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium text-gray-900">
                        {selectedNGO.District}, {selectedNGO.State}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Contact Person</p>
                      <p className="font-medium text-gray-900">
                        {selectedNGO.Contact_Person}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">
                        {selectedNGO.Email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium text-gray-900">
                        {selectedNGO.Address}
                      </p>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-green-700">
                        Successful Projects
                      </p>
                      <p className="text-3xl font-bold text-green-700">
                        {selectedNGO.No_of_Successful_Projects}
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-red-700">Failed Projects</p>
                      <p className="text-3xl font-bold text-red-700">
                        {selectedNGO.No_of_Failed_Projects}
                      </p>
                    </div>
                    <div className="bg-[#EA9000]/10 rounded-lg p-4 text-center">
                      <p className="text-sm text-[#EA9000]">Success Rate</p>
                      <p className="text-3xl font-bold text-[#EA9000]">
                        {Math.round(selectedNGO.successRate * 100)}%
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-700">Total Projects</p>
                      <p className="text-3xl font-bold text-gray-700">
                        {selectedNGO.totalProjects}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Projects Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Project Portfolio ({ngoProjects.length})
                  </h3>

                  {ngoProjects.length > 0 ? (
                    <div className="space-y-6">
                      {ngoProjects.map((project) => (
                        <div
                          key={project.project_id}
                          className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                          {/* Project Header */}
                          <div className="bg-gray-50 p-4 border-b border-gray-200">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1 text-lg">
                                  {project.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Project ID: {project.project_id}
                                </p>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  project.status === "Successful"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {project.status}
                              </span>
                            </div>
                          </div>

                          {/* Project Details */}
                          <div className="p-4 space-y-4">
                            {/* Description */}
                            <p className="text-gray-700">
                              {project.description}
                            </p>

                            {/* Basic Info Grid */}
                            <div className="grid grid-cols-4 gap-4">
                              <div>
                                <p className="text-sm text-gray-600">
                                  Category
                                </p>
                                <p className="font-medium text-gray-900">
                                  {project.category}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Budget</p>
                                <p className="font-medium text-gray-900">
                                  ₹{project.budget.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  Actual Spent
                                </p>
                                <p className="font-medium text-gray-900">
                                  ₹{project.actual_spent.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  Budget Utilization
                                </p>
                                <p className="font-medium text-gray-900">
                                  {Math.round(
                                    (project.actual_spent / project.budget) *
                                      100
                                  )}
                                  %
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  Start Date
                                </p>
                                <p className="font-medium text-gray-900">
                                  {project.start_date}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  End Date
                                </p>
                                <p className="font-medium text-gray-900">
                                  {project.end_date}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  Duration
                                </p>
                                <p className="font-medium text-gray-900">
                                  {project.duration_months} months
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  Location
                                </p>
                                <p className="font-medium text-gray-900">
                                  {project.location}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  Team Size
                                </p>
                                <p className="font-medium text-gray-900">
                                  {project.team_size} members
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  Funding Source
                                </p>
                                <p className="font-medium text-gray-900">
                                  {project.funding_source}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  Target Beneficiaries
                                </p>
                                <p className="font-medium text-gray-900">
                                  {project.target_beneficiaries}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Reached</p>
                                <p
                                  className={`font-medium ${
                                    project.beneficiaries_count >=
                                    project.target_beneficiaries
                                      ? "text-green-600"
                                      : "text-orange-600"
                                  }`}
                                >
                                  {project.beneficiaries_count}
                                </p>
                              </div>
                            </div>

                            {/* Outcome Percentage */}
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <p className="text-sm text-gray-600">
                                  Overall Outcome Achievement
                                </p>
                                <p className="font-semibold text-gray-900">
                                  {project.outcome_percentage}%
                                </p>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    project.outcome_percentage >= 80
                                      ? "bg-green-500"
                                      : project.outcome_percentage >= 50
                                      ? "bg-[#EA9000]"
                                      : "bg-red-500"
                                  }`}
                                  style={{
                                    width: `${project.outcome_percentage}%`,
                                  }}
                                />
                              </div>
                            </div>

                            {/* Failure Reason */}
                            {project.failure_reason && (
                              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                                <p className="text-sm font-medium text-red-900 mb-1">
                                  Reason for Failure
                                </p>
                                <p className="text-sm text-red-800">
                                  {project.failure_reason}
                                </p>
                              </div>
                            )}

                            {/* Key Achievements */}
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">
                                {project.status === "Successful"
                                  ? "Key Achievements"
                                  : "Outcomes"}
                              </p>
                              <ul className="space-y-1">
                                {project.key_achievements.map(
                                  (achievement, idx) => (
                                    <li
                                      key={idx}
                                      className="flex items-start gap-2 text-sm text-gray-700"
                                    >
                                      <span
                                        className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                                          project.status === "Successful"
                                            ? "bg-green-500"
                                            : "bg-orange-500"
                                        }`}
                                      />
                                      {achievement}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>

                            {/* Milestones */}
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">
                                Project Milestones
                              </p>
                              <div className="space-y-2">
                                {project.milestones.map((milestone, mIdx) => (
                                  <div
                                    key={mIdx}
                                    className="flex items-start gap-3 bg-gray-50 p-3 rounded"
                                  >
                                    <div
                                      className={`w-3 h-3 rounded-full mt-1 shrink-0 ${
                                        milestone.status === "Completed"
                                          ? "bg-green-500"
                                          : milestone.status === "Pending"
                                          ? "bg-gray-300"
                                          : "bg-red-500"
                                      }`}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex justify-between items-start mb-1">
                                        <p className="text-sm font-medium text-gray-900">
                                          {milestone.title}
                                        </p>
                                        <span
                                          className={`text-xs px-2 py-1 rounded ml-2 shrink-0 ${
                                            milestone.status === "Completed"
                                              ? "bg-green-50 text-green-700"
                                              : milestone.status === "Pending"
                                              ? "bg-gray-100 text-gray-600"
                                              : "bg-red-50 text-red-700"
                                          }`}
                                        >
                                          {milestone.status}
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-600">
                                        {milestone.description}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {milestone.date}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Documents */}
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">
                                Project Documents
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                {project.documents.map((doc, dIdx) => (
                                  <div
                                    key={dIdx}
                                    className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 text-red-600 shrink-0"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                      />
                                    </svg>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium text-gray-900 truncate">
                                        {doc.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {doc.type} • {doc.date}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-gray-400 mx-auto mb-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-gray-600 font-medium">
                        No projects found
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        This NGO has not executed any projects yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}
