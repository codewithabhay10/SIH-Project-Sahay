import { FileText, MessageCircle, ExternalLink } from "lucide-react";

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
];

export default function ReportsSection() {
  return (
    <section id="reports" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 shadow-sm border border-amber-100">
          <FileText className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-semibold text-amber-700">Reports</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs text-gray-600">Annual & snapshots</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Annual reports and quick insights</h2>
        <p className="max-w-3xl mx-auto text-lg text-gray-700">
          Browse latest annual reports and snapshots. Top report opens the current PM-AJAY annual PDF; chat for clarifications.
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
                <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                <p className="text-sm text-gray-700">{report.desc}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <a
                href={report.href}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-amber-200 text-amber-700 bg-white hover:border-amber-400"
              >
                <ExternalLink className="w-4 h-4" />
                Open report
              </a>
              <a
                href="/raise-issue"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-linear-to-r from-amber-500 to-amber-600"
              >
                <MessageCircle className="w-4 h-4" />
                Chat about this
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
