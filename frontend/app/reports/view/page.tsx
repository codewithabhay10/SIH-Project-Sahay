"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import issueData from "../../../db/issue.json";
import clusterData from "../../../db/cluster.json";

type ChatMessage = { user: string; text: string; time: string };

type Challenge = { user: string; text: string; time: string };

type Report = {
  title: string;
  desc: string;
  href: string;
  highlight?: boolean;
};

const defaultReport: Report = {
  title: "PM-AJAY Annual Report (Current)",
  desc: "Latest consolidated report with fund utilization, beneficiary outcomes, and convergence details.",
  href: "/pdfs/PM-AJAY-Annual-Report-Form.pdf",
  highlight: true,
};

const mockChats: ChatMessage[] = [
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

const publicChallenges: Challenge[] = [
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

type ClusterRecord = {
  issue: string;
  issue_id: string;
  cluster: number;
  count: number;
};
const clusters: ClusterRecord[] = (clusterData as ClusterRecord[]) || [];
// Sort by count desc and take top N as frequently raised
const topFrequent = [...clusters]
  .sort((a, b) => b.count - a.count)
  .slice(0, 12);
const frequentlyRaised: { text: string; count: number }[] = topFrequent.map(
  (c) => ({ text: c.issue, count: c.count })
);

type IssueRecord = { Issue: string };
const allIssues: string[] = (issueData as IssueRecord[])
  .map((r) => r.Issue)
  .filter((s) => typeof s === "string" && s.trim().length > 0);

export default function ReportViewPage() {
  const search = useSearchParams();
  const pdfParam = search.get("pdf") || defaultReport.href;
  const titleParam = search.get("title") || defaultReport.title;

  const [activeTab, setActiveTab] = useState<"frequent" | "all">("frequent");
  const [issue, setIssue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);

  const visibleList = useMemo(
    () => (activeTab === "frequent" ? frequentlyRaised : allIssues),
    [activeTab]
  );

  // derive color shade based on count
  const getShadeClass = (count: number) => {
    // Determine bins based on min/max of top frequent
    const counts = topFrequent.map((c) => c.count);
    const min = Math.min(...counts);
    const max = Math.max(...counts);
    const range = Math.max(1, max - min);
    const t = (count - min) / range; // 0..1
    // Map t to discrete classes from light to dark
    if (t < 0.2) return "bg-amber-50/60 border-amber-100";
    if (t < 0.4) return "bg-amber-100 border-amber-200";
    if (t < 0.6) return "bg-amber-200 border-amber-300";
    if (t < 0.8) return "bg-amber-300 border-amber-400";
    return "bg-amber-400/60 border-amber-500";
  };

  const handleSubmit = (e: React.FormEvent) => {
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

  return (
    <div className="min-h-screen bg-linear-to-br from-[#fdfaf3] via-[#f6ecd7] to-[#f2e4c6] text-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {titleParam}
            </h1>
            <p className="text-sm text-gray-700">
              Open report with live chat and public challenges.
            </p>
          </div>
          <a
            href="/raise-issue"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-amber-200 text-amber-700 bg-white hover:border-amber-400"
          >
            <ExternalLink className="w-4 h-4" />
            Back to Reports
          </a>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* PDF Viewer */}
          <div className="bg-white rounded-2xl shadow-2xl border border-amber-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-amber-100 flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-wide text-amber-700 font-semibold">
                  Reference PDF
                </p>
                <p className="text-base font-semibold text-gray-900">
                  {titleParam}
                </p>
              </div>
            </div>
            <div className="h-full bg-amber-50/60 min-h-[520px]">
              <iframe
                title="Report PDF"
                src={pdfParam}
                className="w-full h-full"
              />
            </div>
            <div className="px-6 py-4 flex items-center gap-3 text-sm text-gray-700 bg-amber-50/60 border-t border-amber-100">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>
                Preview only. Share context in chat for clarifications.
              </span>
            </div>
          </div>

          {/* Chat / Issues */}
          <div className="bg-white rounded-2xl shadow-2xl border border-amber-100 flex flex-col h-[680px]">
            <div className="px-6 py-4 border-b border-amber-100 flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-wide text-amber-700 font-semibold">
                  Conversation
                </p>
                <p className="text-base font-semibold text-gray-900">
                  Discuss and log issues
                </p>
              </div>
            </div>

            {/* Tabs at Top */}
            <div className="px-6 pt-4 flex gap-2 border-b border-amber-100 pb-4">
              <button
                type="button"
                onClick={() => setActiveTab("frequent")}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition border ${
                  activeTab === "frequent"
                    ? "bg-amber-500 text-white border-amber-500"
                    : "bg-white text-gray-700 border-amber-200 hover:border-amber-400"
                }`}
              >
                Frequently raised issues
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition border ${
                  activeTab === "all"
                    ? "bg-amber-500 text-white border-amber-500"
                    : "bg-white text-gray-700 border-amber-200 hover:border-amber-400"
                }`}
              >
                All issues
              </button>
            </div>

            {/* Issues List */}
            <div className="px-6 py-4 border-b border-amber-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-600">
                  {activeTab === "frequent"
                    ? "Quick picks from common issues"
                    : `Showing ${allIssues.length} reported issues`}
                </p>
                <p className="text-xs text-gray-500">Click to add to message</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-auto">
                {activeTab === "frequent"
                  ? frequentlyRaised.map((item, i) => (
                      <button
                        key={`freq-${i}`}
                        type="button"
                        onClick={() =>
                          setIssue((prev) =>
                            prev ? prev + "\n" + item.text : item.text
                          )
                        }
                        className={`text-left w-full px-3 py-2 rounded-lg border ${getShadeClass(
                          item.count
                        )} hover:bg-amber-200 transition text-sm text-gray-800`}
                        title="Click to append"
                      >
                        <span className="block font-medium">{item.text}</span>
                        <span className="text-xs text-amber-700">
                          Count: {item.count}
                        </span>
                      </button>
                    ))
                  : (allIssues as string[]).map((txt, i) => (
                      <button
                        key={`iss-${i}`}
                        type="button"
                        onClick={() =>
                          setIssue((prev) => (prev ? prev + "\n" + txt : txt))
                        }
                        className="text-left w-full px-3 py-2 rounded-lg border border-amber-200 bg-amber-50/50 hover:bg-amber-100 transition text-sm text-gray-800"
                        title="Click to append"
                      >
                        {txt}
                      </button>
                    ))}
              </div>
            </div>

            {/* Chat Window with Mock Data and User Messages */}
            <div className="flex-1 overflow-auto px-6 py-4 space-y-3">
              {/* User Messages */}
              {messages.map((msg, idx) => (
                <div
                  key={`user-${idx}`}
                  className="flex flex-col bg-blue-50 rounded-lg border border-blue-200 px-3 py-2 ml-4"
                >
                  <div className="flex items-center justify-between text-[11px] text-blue-700 font-semibold">
                    <span>{msg.user}</span>
                    <span className="text-gray-500">{msg.time}</span>
                  </div>
                  <p className="text-sm text-gray-800 mt-1 wrap-break-words whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Input Form at Bottom */}
            <form
              onSubmit={handleSubmit}
              className="p-6 border-t border-amber-100 space-y-3"
            >
              <label className="text-sm font-semibold text-gray-800">
                Type your issue
              </label>
              <textarea
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Describe the issue with context, IDs, and expected resolution..."
                rows={3}
                className="w-full rounded-xl border border-amber-200 bg-amber-50/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 px-3 py-2 text-sm text-gray-900"
              />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowShareModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-200 text-amber-700 bg-white hover:border-amber-400 text-sm font-semibold"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button
                  type="submit"
                  disabled={submitting || !issue.trim()}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow transition ${
                    submitting || !issue.trim()
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-linear-to-r from-amber-500 to-amber-600 text-white"
                  }`}
                >
                  {submitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Submit
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="p-6 border-b border-amber-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
                    <Share2 className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Share Report
                    </h3>
                    <p className="text-sm text-gray-600">
                      Help us raise awareness
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
            </div>

            <div className="p-6 space-y-6">
              {/* Message */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-gray-800 leading-relaxed">
                  <strong className="text-amber-900">
                    Share the following Annual Report:
                  </strong>
                  <br />"{titleParam}"<br />
                  <br />
                  Tag us and help raise issues that matter to our community!
                </p>
              </div>

              {/* Social Media Handles */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Share on Social Media
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {/* Twitter/X */}
                  <button
                    onClick={() => {
                      const text = `Check out the ${titleParam}! #PMScheme #AnnualReport #RaiseIssues`;
                      window.open(
                        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                          text
                        )}&url=${encodeURIComponent(window.location.href)}`,
                        "_blank"
                      );
                    }}
                    className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
                  >
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900">
                        Twitter/X
                      </p>
                      <p className="text-xs text-gray-600">Post on X</p>
                    </div>
                  </button>

                  {/* Facebook */}
                  <button
                    onClick={() => {
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          window.location.href
                        )}`,
                        "_blank"
                      );
                    }}
                    className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all"
                  >
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900">
                        Facebook
                      </p>
                      <p className="text-xs text-gray-600">Share on FB</p>
                    </div>
                  </button>

                  {/* LinkedIn */}
                  <button
                    onClick={() => {
                      window.open(
                        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                          window.location.href
                        )}`,
                        "_blank"
                      );
                    }}
                    className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-700 hover:bg-blue-50 transition-all"
                  >
                    <svg
                      className="w-6 h-6 text-blue-700"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900">
                        LinkedIn
                      </p>
                      <p className="text-xs text-gray-600">Share on LinkedIn</p>
                    </div>
                  </button>

                  {/* WhatsApp */}
                  <button
                    onClick={() => {
                      const text = `Check out the ${titleParam}! ${window.location.href}`;
                      window.open(
                        `https://wa.me/?text=${encodeURIComponent(text)}`,
                        "_blank"
                      );
                    }}
                    className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-green-600 hover:bg-green-50 transition-all"
                  >
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900">
                        WhatsApp
                      </p>
                      <p className="text-xs text-gray-600">
                        Share via WhatsApp
                      </p>
                    </div>
                  </button>

                  {/* Telegram */}
                  <button
                    onClick={() => {
                      const text = `Check out the ${titleParam}!`;
                      window.open(
                        `https://t.me/share/url?url=${encodeURIComponent(
                          window.location.href
                        )}&text=${encodeURIComponent(text)}`,
                        "_blank"
                      );
                    }}
                    className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900">
                        Telegram
                      </p>
                      <p className="text-xs text-gray-600">Share on Telegram</p>
                    </div>
                  </button>

                  {/* Email */}
                  <button
                    onClick={() => {
                      const subject = `Annual Report: ${titleParam}`;
                      const body = `I wanted to share this important Annual Report with you:\n\n${titleParam}\n\n${window.location.href}\n\nFeel free to raise any issues or concerns!`;
                      window.location.href = `mailto:?subject=${encodeURIComponent(
                        subject
                      )}&body=${encodeURIComponent(body)}`;
                    }}
                    className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all"
                  >
                    <svg
                      className="w-6 h-6 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900">
                        Email
                      </p>
                      <p className="text-xs text-gray-600">Share via Email</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Copy Link */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Or copy link
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={window.location.href}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-700"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copied to clipboard!");
                    }}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-semibold"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Hashtags */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-600 mb-2">
                  Suggested hashtags:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "#PMScheme",
                    "#AnnualReport",
                    "#RaiseIssues",
                    "#Transparency",
                    "#Accountability",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
