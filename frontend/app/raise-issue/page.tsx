"use client";

import { useMemo, useState } from "react";
import {
  MessageSquare,
  Send,
  Share2,
  FileText,
  CheckCircle,
  Clock,
  MessageCircle,
  ExternalLink,
} from "lucide-react";

const pdfUrl = "/pdfs/PM-AJAY-Annual-Report-Form.pdf";

const reports = [
  {
    title: "PM-AJAY Annual Report (Current)",
    desc: "Latest consolidated report with fund utilization, beneficiary outcomes, and convergence details.",
    href: "/pdfs/PM-AJAY-Annual-Report-Form.pdf",
    highlight: true,
  },
  {
    title: "Quarterly Snapshot Q2",
    desc: "Disbursement progress, SLA adherence, and regional rollouts.",
    href: "#",
  },
  {
    title: "Audit Summary FY 23-24",
    desc: "Key findings, compliance notes, and remediation status.",
    href: "#",
  },
  {
    title: "Impact Brief: Skills & Livelihood",
    desc: "Placement rates, average income lift, and gender-disaggregated trends.",
    href: "#",
  },
  {
    title: "State Performance Dashboard",
    desc: "District-wise delivery KPIs, grievance closures, and turnaround times.",
    href: "#",
  },
  {
    title: "Digital Payments Readiness",
    desc: "Bank linkage status, AEPS uptime, and mitigation steps for failed transfers.",
    href: "#",
  },
  {
    title: "Compliance & Audit Follow-up",
    desc: "Pending observations, owner assignments, and remediation milestones.",
    href: "#",
  },
  {
    title: "Beneficiary Impact Deep Dive",
    desc: "Household-level outcomes, exclusion error samples, and course corrections.",
    href: "#",
  },
];

const mockChats = [
  {
    user: "Anita (District Officer)",
    text: "Need clarification on updating bank details post verification.",
    time: "2h ago",
  },
  {
    user: "Ravi (Field Lead)",
    text: "QR scan on certificate shows mismatch—requesting manual review.",
    time: "4h ago",
  },
  {
    user: "Salma (Coordinator)",
    text: "Beneficiary says OTP not received; can we trigger a resend?",
    time: "6h ago",
  },
];

const publicChallenges = [
  {
    user: "Ramesh (Beneficiary)",
    text: "Disbursement amount seems lower than communicated; please verify the final credited sum.",
    time: "1d ago",
  },
  {
    user: "Priya (Parent)",
    text: "Training batch list is missing my ward's name though attendance was full; requesting correction.",
    time: "2d ago",
  },
  {
    user: "Imran (Local Volunteer)",
    text: "Employment numbers for Ward 4 appear overstated; several candidates are still awaiting placement letters.",
    time: "3d ago",
  },
];

const frequentlyRaised = [
  "Update beneficiary bank details",
  "Clarification on document requirements",
  "Delay in verification status",
  "Resubmit income certificate",
];

const allIssues = [
  "Unable to upload PDF (size limits)",
  "Need multilingual support for forms",
  "OTP not received during login",
  "Requesting manual review of rejected document",
  "Want to track SLA for approval",
  "How to correct typo in application",
];

type ChatMessage = {
  user: string;
  text: string;
  time: string;
};

export default function RaiseIssuePage() {
  const [activeTab, setActiveTab] = useState<"frequent" | "all">("frequent");
  const [issue, setIssue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const selectedReport = reports[0];

  const visibleList = useMemo(
    () => (activeTab === "frequent" ? frequentlyRaised : allIssues),
    [activeTab]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue.trim()) return;
    setSubmitting(true);
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const entry: ChatMessage = { user: "You", text: issue.trim(), time };
    setMessages((prev) => [...prev, entry]);
    setTimeout(() => {
      setSubmitting(false);
      setIssue("");
    }, 200);
  };

  const currentPdf =
    selectedReport?.href && selectedReport.href !== "#"
      ? selectedReport.href
      : pdfUrl;

  return (
    <div className="min-h-screen bg-linear-to-br from-[#fdfaf3] via-[#f6ecd7] to-[#f2e4c6] text-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Reports overview (opens inline) */}
        <section id="reports" className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Annual reports and quick insights
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-700">
              Browse latest annual reports and snapshots. Top report opens the
              current PM-AJAY annual PDF; chat for clarifications.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {reports.map((report) => (
              <div
                key={report.title}
                className={`rounded-2xl border border-amber-100 bg-white shadow-sm p-5 flex flex-col gap-3 ${
                  report.highlight ? "ring-2 ring-amber-200" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-700">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-700">{report.desc}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <a
                    href={`/reports/view?title=${encodeURIComponent(
                      report.title
                    )}&pdf=${encodeURIComponent(
                      report.href !== "#" ? report.href : pdfUrl
                    )}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-amber-200 text-amber-700 bg-white hover:border-amber-400"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open report
                  </a>
                  <a
                    href={`/reports/view?title=${encodeURIComponent(
                      report.title
                    )}&pdf=${encodeURIComponent(
                      report.href !== "#" ? report.href : pdfUrl
                    )}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-linear-to-r from-amber-500 to-amber-600"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Raise Issue
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
