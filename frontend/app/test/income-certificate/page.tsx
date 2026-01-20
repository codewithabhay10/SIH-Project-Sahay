"use client";

import { useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
  QrCode,
  FileCheck,
  Sparkles,
  Lock,
  Clock,
  ScrollText,
  ArrowRight,
  Info,
} from "lucide-react";

type CheckDocResult = {
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

const stats = [
  { label: "Faster onboarding", value: "3×" },
  { label: "Data availability", value: "98%" },
  { label: "Access anywhere", value: "24h" },
];

const highlights = [
  {
    icon: Sparkles,
    title: "Zero manual friction",
    desc: "Streamlined uploads with automated checks and instant feedback.",
  },
  {
    icon: Lock,
    title: "Secure by default",
    desc: "Encrypted transfer, tamper-aware analysis, and safe temp storage.",
  },
  {
    icon: Clock,
    title: "Real-time results",
    desc: "See authenticity verdicts, scores, and QR signals immediately.",
  },
];

const faqs = [
  {
    q: "Which file types are supported?",
    a: "PDF uploads only. Maximum size 10MB to ensure quick verification.",
  },
  {
    q: "What signals do you check?",
    a: "We assess metadata, QR presence and source, and content cues to flag likely genuine or suspicious documents.",
  },
  {
    q: "Is my data stored?",
    a: "Files are processed securely and can be removed after analysis. Only transient temp storage is used for QR decoding.",
  },
  {
    q: "Does this replace official validation?",
    a: "No. This provides a confidence score. For official use, confirm with the issuing authority.",
  },
];

export default function IncomeCertificateUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<CheckDocResult | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [analyzingStep, setAnalyzingStep] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setResult(null);
    setError("");
    
    // Create PDF preview URL
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPdfPreview(url);
    } else {
      setPdfPreview(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setResult(null);
        setError("");
        
        // Create PDF preview URL
        const url = URL.createObjectURL(droppedFile);
        setPdfPreview(url);
      } else {
        setError("Please drop a valid PDF file.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB.");
      return;
    }

    const formData = new FormData();
    // Must match multer field name in backend (single('pdf'))
    formData.append("pdf", file);

    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Show analyzing steps
      setAnalyzingStep("Uploading document...");
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setAnalyzingStep("Extracting metadata...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalyzingStep("Analyzing QR code...");
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setAnalyzingStep("Verifying authenticity...");
      
      // API base can be configured via `NEXT_PUBLIC_API_BASE` env var.
      // Defaults to the backend's default port (8080) used in `backend/.env`.
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:1604/api";
      const res = await fetch(`${API_BASE}/check/doc-check`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let errMsg = `Upload failed with status ${res.status}`;
        try {
          const errData = await res.json();
          errMsg = (errData && (errData.error || errData.message)) || errMsg;
        } catch {
          // If response is not JSON, try to get text
          try {
            const text = await res.text();
            if (text) errMsg += `: ${text}`;
          } catch {}
        }
        throw new Error(errMsg);
      }

      const data: CheckDocResult = await res.json();
      setAnalyzingStep("Analysis complete!");
      await new Promise(resolve => setTimeout(resolve, 500));
      setResult(data);
    } catch (err: any) {
      let errorMessage = err?.message || "Something went wrong";
      
      // Provide more helpful error messages
      if (errorMessage.includes("Failed to fetch")) {
        errorMessage = "Cannot connect to backend server. Please ensure the backend is running on port 8080.";
      } else if (errorMessage.includes("NetworkError")) {
        errorMessage = "Network error. Please check your internet connection and backend server.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
      setAnalyzingStep("");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "LIKELY_GENUINE":
        return "bg-green-50 border-green-200 text-green-800";
      case "LIKELY_FAKE":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-amber-50 border-amber-200 text-amber-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "LIKELY_GENUINE":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "LIKELY_FAKE":
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-amber-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#fdfaf3] via-[#f6ecd7] to-[#f2e4c6] text-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Upload Section */}
        <div
          id="upload-card"
          className="bg-white rounded-2xl shadow-2xl border border-amber-100 p-8 md:p-10 mb-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
              <ScrollText className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-amber-600 font-semibold">Upload & Verify</p>
              <h2 className="text-2xl font-bold text-gray-900">Income Certificate (PDF)</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 bg-amber-50/40 ${
                dragActive ? "border-amber-500 bg-amber-50" : "border-amber-200 hover:border-amber-400"
              } ${file ? "bg-white" : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {!file ? (
                <label htmlFor="file-upload" className="cursor-pointer block space-y-3">
                  <div className="mx-auto w-16 h-16 rounded-full bg-white flex items-center justify-center shadow">
                    <Upload className="w-8 h-8 text-amber-600" />
                  </div>
                  <p className="text-xl font-semibold text-gray-900">Drop your PDF or browse</p>
                  <p className="text-sm text-gray-600">PDF only · Max 10MB · Secure upload</p>
                </label>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setResult(null);
                      setError("");
                      setPdfPreview(null);
                    }}
                    className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-semibold"
                  >
                    <XCircle className="w-5 h-5" />
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* PDF Preview */}
            {pdfPreview && !loading && !result && (
              <div className="mt-6 bg-white rounded-xl border-2 border-amber-100 overflow-hidden">
                <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-semibold text-gray-900">Document Preview</span>
                </div>
                <iframe
                  src={pdfPreview}
                  className="w-full h-[500px]"
                  title="PDF Preview"
                />
              </div>
            )}

            {/* Analyzing Steps */}
            {loading && analyzingStep && (
              <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-amber-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-900">{analyzingStep}</p>
                    <p className="text-sm text-gray-600 mt-1">Please wait while we verify your document</p>
                  </div>
                </div>
                
                {/* Progress Steps */}
                <div className="mt-6 space-y-3">
                  <div className={`flex items-center gap-3 ${analyzingStep.includes("Uploading") ? "text-amber-600" : "text-green-600"}`}>
                    {analyzingStep.includes("Uploading") ? (
                      <Clock className="w-5 h-5 animate-pulse" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">Upload document</span>
                  </div>
                  <div className={`flex items-center gap-3 ${analyzingStep.includes("metadata") ? "text-amber-600" : analyzingStep.includes("Uploading") ? "text-gray-400" : "text-green-600"}`}>
                    {analyzingStep.includes("metadata") ? (
                      <Clock className="w-5 h-5 animate-pulse" />
                    ) : analyzingStep.includes("Uploading") ? (
                      <Clock className="w-5 h-5" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">Extract metadata</span>
                  </div>
                  <div className={`flex items-center gap-3 ${analyzingStep.includes("QR") ? "text-amber-600" : analyzingStep.includes("Uploading") || analyzingStep.includes("metadata") ? "text-gray-400" : "text-green-600"}`}>
                    {analyzingStep.includes("QR") ? (
                      <QrCode className="w-5 h-5 animate-pulse" />
                    ) : analyzingStep.includes("Uploading") || analyzingStep.includes("metadata") ? (
                      <QrCode className="w-5 h-5" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">Analyze QR code</span>
                  </div>
                  <div className={`flex items-center gap-3 ${analyzingStep.includes("authenticity") || analyzingStep.includes("complete") ? "text-amber-600" : "text-gray-400"}`}>
                    {analyzingStep.includes("authenticity") || analyzingStep.includes("complete") ? (
                      <Shield className="w-5 h-5 animate-pulse" />
                    ) : (
                      <Shield className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">Verify authenticity</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !file}
              className={`w-full mt-6 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                loading || !file
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-linear-to-r from-amber-500 to-amber-600 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying document...</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-5 h-5" />
                  <span>Verify Certificate</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-700">
              <XCircle className="w-5 h-5 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-2xl shadow-2xl border border-amber-100 overflow-hidden animate-fade-in">
            <div
              className={`p-6 md:p-8 border-b-4 ${getStatusColor(
                result.overallStatus
              )}`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  {getStatusIcon(result.overallStatus)}
                  <div>
                    <p className="text-sm uppercase tracking-wide text-gray-700 font-semibold">
                      Verification Result
                    </p>
                    <h3 className="text-2xl font-bold">
                      {result.overallStatus.replace(/_/g, " ")}
                    </h3>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-700">Overall Score</p>
                  <p className="text-3xl font-bold text-amber-700">{result.overallScore}</p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-amber-600" />
                  Why this verdict
                </h4>
                <ul className="space-y-2">
                  {result.reasons?.map((reason, idx) => (
                    <li key={idx} className="flex gap-2 text-gray-800">
                      <span className="text-amber-600">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3 text-amber-700 font-semibold">
                    <FileText className="w-5 h-5" /> Metadata Analysis
                  </div>
                  <div className="space-y-2 text-sm text-gray-800">
                    <div className="flex justify-between">
                      <span>Verdict</span>
                      <span className="font-semibold">{result.metaResult?.verdict ?? "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Score</span>
                      <span className="font-semibold">{result.metaResult?.score ?? "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3 text-amber-700 font-semibold">
                    <QrCode className="w-5 h-5" /> QR Verification
                  </div>
                  <div className="space-y-2 text-sm text-gray-800">
                    <div className="flex justify-between">
                      <span>Found</span>
                      <span className={`font-semibold ${result.qrResult?.found ? "text-emerald-700" : "text-red-600"}`}>
                        {result.qrResult?.found ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Valid Source</span>
                      <span className={`font-semibold ${result.qrResult?.validSource ? "text-emerald-700" : "text-red-600"}`}>
                        {result.qrResult?.validSource ? "Yes" : "No"}
                      </span>
                    </div>
                    {result.qrResult?.data && (
                      <div className="pt-2">
                        <p className="text-xs text-gray-600 mb-1">QR Data</p>
                        <p className="text-xs bg-white rounded border border-amber-100 p-2 break-all">
                          {result.qrResult.data}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer note */}
        <div className="text-center text-sm text-gray-600 mt-8">
          Built for quick screening. For official validation, always confirm with the issuing authority.
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.35s ease-out; }
      `}</style>
    </div>
  );
}
