"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import axios from "axios";

type ApiProposal = {
  _id: string;
  title: string;
  category?: string;
  district?: string;
  estimated_budget?: number;
  status: string;
  createdAt?: string;
  project?: {
    state?: string;
    district?: string;
    IA_code?: string;
    SNA_code?: string;
    project_name?: string;
  };
};

export default function ProposalsPage() {
  const router = useRouter();
  const [proposals, setProposals] = useState<ApiProposal[]>([]);
  const [selectedProposals, setSelectedProposals] = useState<string[]>([]);
  const [filterState, setFilterState] = useState<string>("All States");
  const [filterStatus, setFilterStatus] = useState<string>("All Status");
  const [filterCategory, setFilterCategory] =
    useState<string>("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [starredProposals, setStarredProposals] = useState<string[]>([]);

  const api = useMemo(() => {
    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE || "/api",
      withCredentials: true,
    });
  }, []);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/proposals", {
          params: {
            page: 1,
            limit: 100,
          },
        });
        const list: ApiProposal[] = res.data?.proposals || [];
        setProposals(list);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load proposals");
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, [api]);

  useEffect(() => {
    const starred = localStorage.getItem('starredProposals');
    if (starred) {
      setStarredProposals(JSON.parse(starred));
    }
  }, []);

  const toggleStar = (id: string) => {
    setStarredProposals(prev => {
      const newStarred = prev.includes(id)
        ? prev.filter(pid => pid !== id)
        : [...prev, id];
      localStorage.setItem('starredProposals', JSON.stringify(newStarred));
      return newStarred;
    });
  };

  const states = useMemo(() => {
    const set = new Set<string>();
    proposals.forEach((p) => {
      const st = p.project?.state;
      if (st) set.add(st);
    });
    return Array.from(set).sort();
  }, [proposals]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    proposals.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  }, [proposals]);

  const statuses = useMemo(() => {
    const set = new Set<string>();
    proposals.forEach((p) => {
      if (p.status) set.add(p.status);
    });
    return Array.from(set).sort();
  }, [proposals]);

  // Filter proposals
  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch =
      searchQuery === "" ||
      (proposal.title || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      proposal._id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState =
      filterState === "All States" || proposal.project?.state === filterState;
    const matchesStatus =
      filterStatus === "All Status" || proposal.status === filterStatus;
    const matchesCategory =
      filterCategory === "All Categories" ||
      proposal.category === filterCategory;
    const notDraft = (proposal.status || "").toLowerCase() !== "draft";

    return (
      notDraft &&
      matchesSearch &&
      matchesState &&
      matchesStatus &&
      matchesCategory
    );
  });

  const getStatusColor = (status: string) => {
    const s = (status || "").toLowerCase();
    switch (s) {
      case "under_review":
      case "under review":
      case "in_progress":
      case "in progress":
        return "bg-blue-100 text-blue-700";
      case "submitted":
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "revision required":
        return "bg-orange-100 text-orange-700";
      case "draft":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatCurrency = (amount?: number) => {
    const val = Number(amount || 0);
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(1)} Cr`;
    } else if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1)} L`;
    } else {
      return `₹${val.toLocaleString("en-IN")}`;
    }
  };

  const handleExportCSV = () => {
    const selected = proposals.filter((p) => selectedProposals.includes(p._id));
    const data = selected.length > 0 ? selected : filteredProposals;

    const csv = [
      [
        "Proposal ID",
        "Title",
        "State",
        "District",
        "Category",
        "Budget",
        "Status",
        "Submitted",
      ],
      ...data.map((p) => [
        p._id,
        p.title,
        p.project?.state || "",
        p.district || p.project?.district || "",
        p.category,
        String(p.estimated_budget || 0),
        p.status,
        p.createdAt || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "proposals.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const selected = proposals.filter((p) => selectedProposals.includes(p._id));
    const data = selected.length > 0 ? selected : filteredProposals;

    if (data.length === 0) {
      alert('No proposals to export');
      return;
    }

    // Fetch detailed proposal data
    const detailedProposals = await Promise.all(
      data.map(async (p) => {
        try {
          const res = await api.get(`/proposals/${p._id}`);
          return res.data?.proposal || p;
        } catch (e) {
          return p;
        }
      })
    );

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;

    // Header - First Page Only
    pdf.setFillColor(234, 144, 0);
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PACC Proposals Report', pageWidth / 2, 18, { align: 'center' });
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const dateStr = new Date().toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    pdf.text(`Generated: ${dateStr} | Total: ${detailedProposals.length} Proposals`, pageWidth / 2, 28, { align: 'center' });

    yPos = 55;

    // Loop through each detailed proposal
    detailedProposals.forEach((proposal, index) => {
      // Start new page for each proposal
      if (index > 0) {
        pdf.addPage();
      }
      
      yPos = 20;

      // Status Badge Colors
      const status = proposal.status || 'Unknown';
      const statusColors: Record<string, [number, number, number]> = {
        'submitted': [250, 204, 21],
        'pending': [250, 204, 21],
        'under_review': [59, 130, 246],
        'under review': [59, 130, 246],
        'in_progress': [59, 130, 246],
        'approved': [34, 197, 94],
        'rejected': [239, 68, 68],
        'draft': [156, 163, 175],
      };
      
      const statusKey = status.toLowerCase().replace(' ', '_');
      const color = statusColors[statusKey] || [156, 163, 175];

      // Header Section
      pdf.setFillColor(255, 255, 255);
      pdf.setDrawColor(234, 144, 0);
      pdf.setLineWidth(0.8);
      pdf.rect(margin, yPos, pageWidth - 2 * margin, 25, 'FD');
      
      // Proposal Number
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(234, 144, 0);
      pdf.text(`Proposal ${index + 1} of ${detailedProposals.length}`, margin + 5, yPos + 8);
      
      // Status Badge
      const badgeWidth = 40;
      const badgeX = pageWidth - margin - badgeWidth - 5;
      pdf.setFillColor(color[0], color[1], color[2]);
      pdf.roundedRect(badgeX, yPos + 4, badgeWidth, 8, 2, 2, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text(status.toUpperCase(), badgeX + badgeWidth / 2, yPos + 9, { align: 'center' });
      
      // Proposal ID
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      pdf.text(`ID: ${proposal._id}`, margin + 5, yPos + 15);
      
      // Submission Date
      const submittedDate = proposal.createdAt 
        ? new Date(proposal.createdAt).toLocaleDateString('en-IN')
        : 'N/A';
      pdf.text(`Submitted: ${submittedDate}`, margin + 5, yPos + 21);
      
      yPos += 28;
      
      // Title Section
      pdf.setFillColor(250, 250, 250);
      pdf.rect(margin, yPos, pageWidth - 2 * margin, 18, 'F');
      pdf.setDrawColor(220, 220, 220);
      pdf.rect(margin, yPos, pageWidth - 2 * margin, 18);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(44, 62, 80);
      const title = proposal.title || 'Untitled Proposal';
      const titleLines = pdf.splitTextToSize(title, pageWidth - 2 * margin - 10);
      pdf.text(titleLines.slice(0, 2), margin + 5, yPos + 8);
      
      yPos += 22;

      // --- KEY INFORMATION GRID ---
      pdf.setFillColor(247, 248, 250);
      pdf.rect(margin, yPos, pageWidth - 2 * margin, 50, 'F');
      pdf.setDrawColor(220, 220, 220);
      pdf.rect(margin, yPos, pageWidth - 2 * margin, 50);
      
      let infoY = yPos + 8;
      const labelX = margin + 8;
      const valueX = margin + 50;
      const col2LabelX = margin + (pageWidth - 2 * margin) / 2 + 8;
      const col2ValueX = col2LabelX + 50;
      
      // Row 1: Category and Budget
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(100, 100, 100);
      pdf.text('Category:', labelX, infoY);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(44, 62, 80);
      pdf.text(proposal.category || 'N/A', valueX, infoY);
      
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(100, 100, 100);
      pdf.text('Budget:', col2LabelX, infoY);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(34, 139, 34);
      pdf.text(formatCurrency(proposal.estimated_budget), col2ValueX, infoY);
      infoY += 8;
      
      // Row 2: Location and Beneficiaries
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(100, 100, 100);
      pdf.text('Location:', labelX, infoY);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(44, 62, 80);
      const location = `${proposal.district || proposal.project?.district || 'N/A'}, ${proposal.project?.state || 'N/A'}`;
      const locText = pdf.splitTextToSize(location, 55);
      pdf.text(locText[0], valueX, infoY);
      
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(100, 100, 100);
      pdf.text('Beneficiaries:', col2LabelX, infoY);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(44, 62, 80);
      pdf.text(proposal.expected_beneficiary_count?.toString() || 'N/A', col2ValueX, infoY);
      infoY += 8;
      
      // Row 3: Project Name
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(100, 100, 100);
      pdf.text('Project Name:', labelX, infoY);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(44, 62, 80);
      const projectName = proposal.project?.project_name || 'N/A';
      const projNameText = pdf.splitTextToSize(projectName, pageWidth - 2 * margin - 70);
      pdf.text(projNameText[0], valueX, infoY);
      infoY += 8;
      
      // Row 4: IA Code and SNA Code
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(100, 100, 100);
      pdf.text('IA Code:', labelX, infoY);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(44, 62, 80);
      pdf.text(proposal.project?.IA_code || 'N/A', valueX, infoY);
      
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(100, 100, 100);
      pdf.text('SNA Code:', col2LabelX, infoY);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(44, 62, 80);
      pdf.text(proposal.project?.SNA_code || 'N/A', col2ValueX, infoY);
      
      yPos += 54;
      
      // --- OBJECTIVE SECTION ---
      if (proposal.objective) {
        pdf.setFillColor(255, 255, 255);
        pdf.rect(margin, yPos, pageWidth - 2 * margin, 30, 'F');
        pdf.setDrawColor(220, 220, 220);
        pdf.rect(margin, yPos, pageWidth - 2 * margin, 30);
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(234, 144, 0);
        pdf.text('OBJECTIVE', margin + 5, yPos + 7);
        
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 60, 60);
        const objLines = pdf.splitTextToSize(proposal.objective, pageWidth - 2 * margin - 12);
        pdf.text(objLines.slice(0, 3), margin + 5, yPos + 14);
        
        yPos += 34;
      }
      
      // --- KEY ACTIVITIES SECTION ---
      if (proposal.activities && proposal.activities.length > 0) {
        const activities = proposal.activities.slice(0, 5);
        const activityHeight = 8 + (activities.length * 7);
        
        pdf.setFillColor(247, 248, 250);
        pdf.rect(margin, yPos, pageWidth - 2 * margin, activityHeight, 'F');
        pdf.setDrawColor(220, 220, 220);
        pdf.rect(margin, yPos, pageWidth - 2 * margin, activityHeight);
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(234, 144, 0);
        pdf.text('KEY ACTIVITIES', margin + 5, yPos + 7);
        
        let actY = yPos + 14;
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 60, 60);
        
        activities.forEach((act: any, idx: number) => {
          const actText = act.activity || String(act);
          const actLines = pdf.splitTextToSize(`${idx + 1}. ${actText}`, pageWidth - 2 * margin - 15);
          pdf.text(actLines[0], margin + 8, actY);
          actY += 7;
        });
        
        yPos += activityHeight + 4;
      }
      
      // --- EXPECTED OUTCOMES SECTION ---
      if (proposal.expected_outcomes) {
        pdf.setFillColor(255, 255, 255);
        pdf.rect(margin, yPos, pageWidth - 2 * margin, 26, 'F');
        pdf.setDrawColor(220, 220, 220);
        pdf.rect(margin, yPos, pageWidth - 2 * margin, 26);
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(234, 144, 0);
        pdf.text('EXPECTED OUTCOMES', margin + 5, yPos + 7);
        
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 60, 60);
        const outLines = pdf.splitTextToSize(proposal.expected_outcomes, pageWidth - 2 * margin - 12);
        pdf.text(outLines.slice(0, 2), margin + 5, yPos + 14);
      }
    });

    // Footer on all pages
    const pageCount = pdf.internal.getNumberOfPages();
    pdf.setFontSize(8);
    pdf.setTextColor(120, 120, 120);
    
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      const footerY = pageHeight - 10;
      pdf.text(
        `Page ${i} of ${pageCount}`,
        margin,
        footerY
      );
      pdf.text(
        'PACC Dashboard | Government of India',
        pageWidth / 2,
        footerY,
        { align: 'center' }
      );
      pdf.text(
        'Confidential',
        pageWidth - margin,
        footerY,
        { align: 'right' }
      );
    }

    // Open in new tab and download
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
    
    const fileName = `PACC_Proposals_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-[#2C3E50]">
              PACC Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Review and manage submitted proposals
            </p>
          </div>
          <div className="flex items-center gap-3">
            {loading && <span className="text-sm text-gray-500">Loading…</span>}
            {error && <span className="text-sm text-red-600">{error}</span>}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.66667 6.66667L8 10L11.3333 6.66667"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 10V2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Export CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.66667 6.66667L8 10L11.3333 6.66667"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 10V2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Export PDF
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
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
            <input
              type="text"
              placeholder="Search proposals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA9000] focus:border-transparent outline-none"
            />
          </div>

          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA9000] focus:border-transparent outline-none bg-white"
          >
            <option>All States</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA9000] focus:border-transparent outline-none bg-white"
          >
            <option>All Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA9000] focus:border-transparent outline-none bg-white"
          >
            <option>All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="p-8">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Proposal ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    State
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    District
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProposals.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-6 py-10 text-center text-sm text-gray-500"
                    >
                      No proposals found.
                    </td>
                  </tr>
                )}
                {filteredProposals.map((proposal) => (
                  <tr key={proposal._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {proposal._id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {proposal.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {proposal.project?.project_name || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {proposal.project?.state || "MH"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {proposal.district || proposal.project?.district || ""}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {proposal.category}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(proposal.estimated_budget)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          proposal.status
                        )}`}
                      >
                        {proposal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {proposal.createdAt
                        ? new Date(proposal.createdAt).toLocaleDateString(
                            "en-IN"
                          )
                        : ""}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={async () => {
                            const current = (
                              proposal.status || ""
                            ).toLowerCase();
                            if (current === "submitted") {
                              try {
                                // call backend to transition to in_progress
                                await api.patch(
                                  `/proposals/${proposal._id}/status`,
                                  {
                                    status: "in_progress",
                                  }
                                );
                                // optimistically update local state
                                setProposals((prev) =>
                                  prev.map((p) =>
                                    p._id === proposal._id
                                      ? { ...p, status: "in_progress" }
                                      : p
                                  )
                                );
                              } catch (err: any) {
                                alert(
                                  err?.response?.data?.message ||
                                    "Failed to update status to In Progress"
                                );
                              }
                            }
                            router.push(`/proposals/${proposal._id}`);
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          title="View Details"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            className="text-gray-600"
                          >
                            <path
                              d="M1 9C1 9 4 3 9 3C14 3 17 9 17 9C17 9 14 15 9 15C4 15 1 9 1 9Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <circle
                              cx="9"
                              cy="9"
                              r="2.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => toggleStar(proposal._id)}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          title={starredProposals.includes(proposal._id) ? "Unstar" : "Star"}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill={starredProposals.includes(proposal._id) ? "#EA9000" : "none"}
                            className={starredProposals.includes(proposal._id) ? "text-[#EA9000]" : "text-gray-600"}
                          >
                            <path
                              d="M9 2L11.5 7L17 8L13 12L14 17.5L9 14.5L4 17.5L5 12L1 8L6.5 7L9 2Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              {filteredProposals.length > 0 ? (
                <>
                  Showing 1 to {filteredProposals.length} of{" "}
                  {filteredProposals.length} proposals
                </>
              ) : (
                <>No proposals to display</>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button className="px-3 py-1 text-sm text-white bg-[#EA9000] border border-[#EA9000] rounded">
                1
              </button>
              <button className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
