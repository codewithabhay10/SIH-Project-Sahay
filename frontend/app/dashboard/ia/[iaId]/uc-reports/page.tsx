"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FileText,
  Eye,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Upload,
  Shield,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { getDashboardRoute } from "@/lib/auth";

type UCStatus = "Approved" | "Rejected";

type VerificationResult = {
  success?: boolean;
  overallStatus: string;
  overallScore: number;
  reasons: string[];
  metaResult?: {
    verdict: string;
    score: number;
  } | null;
  qrResult?: {
    found: boolean;
    validSource: boolean;
    data: string | null;
  } | null;
};

interface UCRecord {
  ucNumber: string;
  filename: string;
  project: string;
  period: string;
  amount: string;
  uploaded: string;
  uploadedBy: string;
  status: UCStatus;
}

// Removed mock data - using state management instead

const statusConfig: Record<
  UCStatus,
  { color: string; icon: React.ElementType; bgColor: string }
> = {
  Approved: {
    color: "text-green-700",
    bgColor: "bg-green-100",
    icon: CheckCircle,
  },
  Rejected: {
    color: "text-red-700",
    bgColor: "bg-red-100",
    icon: XCircle,
  },
};

export default function UCReportsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const iaId = params.iaId as string;

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [amountUpload, setAmountUpload] = useState("");
  const [remarks, setRemarks] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [ucData, setUcData] = useState<UCRecord[]>([]);
  const [periodUpload, setPeriodUpload] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch UCs from database
  const fetchUCs = async () => {
    try {
      setLoading(true);
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const res = await fetch(`${API_BASE}/uc?iaId=${iaId}`);
      
      if (!res.ok) {
        throw new Error("Failed to fetch UCs");
      }
      
      const result = await res.json();
      
      if (result.success && result.data) {
        // Transform data to match UCRecord format
        const transformedData: UCRecord[] = result.data.map((uc: any) => ({
          ucNumber: uc.ucNumber,
          filename: uc.filename,
          project: uc.project,
          period: uc.period,
          amount: `₹${parseFloat(uc.amount).toLocaleString('en-IN')}`,
          uploaded: new Date(uc.createdAt).toLocaleDateString('en-GB'),
          uploadedBy: uc.uploadedBy || "Unknown",
          status: uc.status,
        }));
        
        setUcData(transformedData);
      }
    } catch (err: any) {
      console.error("Error fetching UCs:", err);
      setUploadError("Failed to load UC records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.replace(
        `/login?redirect=${encodeURIComponent(`/dashboard/ia/${iaId}/uc-reports`)}`
      );
      return;
    }
    if (user.role !== "ia") {
      router.replace(getDashboardRoute(user));
      return;
    }
    setIsAuthorized(true);
    fetchUCs();
  }, [user, iaId, router]);

  const filteredData = ucData.filter((uc) => {
    const matchesSearch =
      uc.ucNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uc.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uc.filename.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" || uc.status === statusFilter;

    const matchesProject =
      projectFilter === "All Projects" || uc.project === projectFilter;

    return matchesSearch && matchesStatus && matchesProject;
  });

  const calculateTotalAmount = () => {
    const total = ucData.reduce((sum, uc) => {
      const amount = parseFloat(uc.amount.replace(/[₹,]/g, ''));
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    return `₹${total.toLocaleString('en-IN')}`;
  };

  const stats = {
    total: ucData.length,
    approved: ucData.filter((u) => u.status === "Approved").length,
    rejected: ucData.filter((u) => u.status === "Rejected").length,
    totalAmount: calculateTotalAmount(),
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setUploadError("Only PDF files are allowed.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("File size must be under 10MB.");
        return;
      }
      setSelectedFile(file);
      setUploadError("");
      setVerificationResult(null);
      
      // Auto-verify the document
      await verifyDocument(file);
    }
  };

  const verifyDocument = async (file: File) => {
    setVerifying(true);
    setUploadError("");
    
    try {
      const formData = new FormData();
      formData.append("pdf", file);
      
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const res = await fetch(`${API_BASE}/check/doc-check`, {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error("Verification failed");
      }
      
      const result: VerificationResult = await res.json();
      setVerificationResult(result);
    } catch (err: any) {
      setUploadError("Verification failed. Document will be manually reviewed.");
      // Set a fallback result
      setVerificationResult({
        overallStatus: "UNCERTAIN",
        overallScore: 50,
        reasons: ["Automated verification unavailable", "Document will be manually reviewed"],
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !selectedFile || !amountUpload || !periodUpload) {
      setUploadError("Please fill all required fields.");
      return;
    }
    
    // Warn if document appears fake
    if (verificationResult && verificationResult.overallStatus === "LIKELY_FAKE") {
      const confirmSubmit = confirm(
        "⚠️ WARNING: This document appears to be FAKE based on verification checks.\n\n" +
        "Submitting fake documents may result in:\n" +
        "• Legal action\n" +
        "• Fund release rejection\n" +
        "• Account suspension\n\n" +
        "Are you sure you want to proceed?"
      );
      if (!confirmSubmit) {
        return;
      }
    }

    setUploading(true);
    setUploadError("");

    try {
      // Generate UC number
      const ucNumber = `UC-${new Date().getFullYear()}-${String(ucData.length + 1).padStart(3, '0')}`;
      
      // Determine status based on verification result
      let status: UCStatus = "Approved";
      if (verificationResult) {
        if (verificationResult.overallStatus === "LIKELY_FAKE") {
          status = "Rejected";
        }
      }

      const formData = new FormData();
      formData.append("pdf", selectedFile);
      formData.append("ucNumber", ucNumber);
      formData.append("project", selectedProject);
      formData.append("amount", amountUpload);
      formData.append("period", periodUpload);
      formData.append("remarks", remarks);
      formData.append("iaId", iaId);
      formData.append("uploadedBy", user?.email || "Unknown");
      formData.append("status", status);
      
      // Include verification result
      if (verificationResult) {
        formData.append("verificationResult", JSON.stringify(verificationResult));
      }

      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const res = await fetch(`${API_BASE}/uc`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}`);
      }

      const result = await res.json();
      
      if (result.success) {
        alert(`UC uploaded successfully!\nStatus: ${status}\nUC Number: ${ucNumber}`);
        
        // Refresh UC list from database
        await fetchUCs();
        
        // Reset form
        setShowUploadModal(false);
        setSelectedProject("");
        setSelectedFile(null);
        setAmountUpload("");
        setPeriodUpload("");
        setRemarks("");
        setVerificationResult(null);
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (err: any) {
      setUploadError(err?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (!isAuthorized) {
    return null;
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              UC & Reports Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Upload and manage Utilisation Certificates and monthly reports
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload UC
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 overflow-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Total UCs</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-green-50 rounded-lg border border-green-200 p-6">
            <p className="text-sm text-green-700 mb-2">Approved</p>
            <p className="text-3xl font-bold text-green-800">{stats.approved}</p>
          </div>
          <div className="bg-red-50 rounded-lg border border-red-200 p-6">
            <p className="text-sm text-red-700 mb-2">Rejected</p>
            <p className="text-3xl font-bold text-red-800">{stats.rejected}</p>
          </div>
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
            <p className="text-sm text-blue-700 mb-2">Total Amount</p>
            <p className="text-2xl font-bold text-blue-800">{stats.totalAmount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by UC number, project, or period..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer"
                >
                  <option>All Status</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
              </div>
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 cursor-pointer"
              >
                <option>All Projects</option>
                <option>Youth Skill Development Program</option>
                <option>Women Empowerment Scheme</option>
                <option>Farmer Training and Support</option>
                <option>Digital Literacy Program</option>
                <option>Rural Infrastructure Improvement</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    UC Number
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                        <p className="text-sm text-gray-600">Loading UC records...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <FileText className="w-12 h-12 text-gray-300" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">No UCs uploaded yet</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {ucData.length === 0 
                              ? "Click 'Upload UC' to submit your first Utilisation Certificate"
                              : "No results match your search criteria"}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((uc) => {
                    const config = statusConfig[uc.status];
                    const StatusIcon = config.icon;
                    return (
                      <tr
                        key={uc.ucNumber}
                        className="hover:bg-gray-50 transition-colors"
                      >
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900">
                            {uc.ucNumber}
                          </span>
                          <span className="text-xs text-gray-500">
                            {uc.filename}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-900">
                        {uc.project}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-900">
                        {uc.period}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">
                        {uc.amount}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900">
                            {uc.uploaded}
                          </span>
                          <span className="text-xs text-gray-500">
                            {uc.uploadedBy}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {uc.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-5 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing 1 to {filteredData.length} of {filteredData.length} results
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Previous
              </button>
              <button className="px-3 py-1 border rounded text-sm bg-orange-600 text-white border-orange-600">
                1
              </button>
              <button
                disabled
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upload UC Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Upload Utilisation Certificate</h3>
                    <p className="text-xs text-gray-600">Submit UC for project verification</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadError("");
                    setSelectedFile(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                >
                  <option value="">-- Select project --</option>
                  <option>Youth Skill Development Program</option>
                  <option>Women Empowerment Scheme</option>
                  <option>Farmer Training and Support</option>
                  <option>Digital Literacy Program</option>
                  <option>Rural Infrastructure Improvement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Period <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={periodUpload}
                  onChange={(e) => setPeriodUpload(e.target.value)}
                  placeholder="e.g., Q1 2024 (Jan-Mar)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={amountUpload}
                  onChange={(e) => setAmountUpload(e.target.value)}
                  placeholder="Enter amount in rupees"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload UC Document (PDF) <span className="text-red-500">*</span>
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-orange-400 transition-colors">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <div className="text-center">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    {selectedFile ? (
                      <p className="text-sm text-gray-900 font-medium">{selectedFile.name}</p>
                    ) : (
                      <>
                        <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">PDF only, max 10MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Verification Result */}
              {verifying && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600 animate-spin" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Verifying document...</p>
                    <p className="text-xs text-blue-700">Checking authenticity and metadata</p>
                  </div>
                </div>
              )}

              {verificationResult && !verifying && (
                <div className={`p-4 rounded-lg border-2 ${
                  verificationResult.overallStatus === "LIKELY_GENUINE"
                    ? "bg-green-50 border-green-300"
                    : verificationResult.overallStatus === "LIKELY_FAKE"
                    ? "bg-red-50 border-red-300"
                    : "bg-amber-50 border-amber-300"
                }`}>
                  <div className="flex items-start gap-3">
                    {verificationResult.overallStatus === "LIKELY_GENUINE" ? (
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-6 h-6 text-green-700" />
                      </div>
                    ) : verificationResult.overallStatus === "LIKELY_FAKE" ? (
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-6 h-6 text-red-700" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-6 h-6 text-amber-700" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`text-base font-bold ${
                          verificationResult.overallStatus === "LIKELY_GENUINE"
                            ? "text-green-900"
                            : verificationResult.overallStatus === "LIKELY_FAKE"
                            ? "text-red-900"
                            : "text-amber-900"
                        }`}>
                          {verificationResult.overallStatus === "LIKELY_GENUINE"
                            ? "✅ Document Appears Genuine"
                            : verificationResult.overallStatus === "LIKELY_FAKE"
                            ? "❌ Document Appears Fake"
                            : "⚠️ Verification Uncertain"}
                        </h4>
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                          verificationResult.overallStatus === "LIKELY_GENUINE"
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : verificationResult.overallStatus === "LIKELY_FAKE"
                            ? "bg-red-100 text-red-800 border border-red-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}>
                          Score: {verificationResult.overallScore}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mt-3">
                        {verificationResult.reasons.map((reason, idx) => {
                          // Skip the summary line (first reason) for the detail list
                          if (idx === 0) return null;
                          
                          return (
                            <div key={idx} className="flex items-start gap-2 pl-2 border-l-2 border-current border-opacity-30">
                              <p className={`text-sm leading-relaxed ${
                                verificationResult.overallStatus === "LIKELY_GENUINE"
                                  ? "text-green-800"
                                  : verificationResult.overallStatus === "LIKELY_FAKE"
                                  ? "text-red-800"
                                  : "text-amber-800"
                              }`}>
                                {reason}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {verificationResult.qrResult && (
                        <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                          <p className={`text-xs font-semibold ${
                            verificationResult.overallStatus === "LIKELY_GENUINE"
                              ? "text-green-800"
                              : verificationResult.overallStatus === "LIKELY_FAKE"
                              ? "text-red-800"
                              : "text-amber-800"
                          }`}>
                            QR Code: {verificationResult.qrResult.found ? "Found" : "Not Found"}
                            {verificationResult.qrResult.validSource && " ✓ Valid Source"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Remarks (Optional)
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add any additional notes..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {uploadError && (
                <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              <div className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Note:</strong> Ensure the UC is signed by an authorized person and all supporting documents are attached.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadError("");
                    setSelectedFile(null);
                    setVerificationResult(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload UC
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
