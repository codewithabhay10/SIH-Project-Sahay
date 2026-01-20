import { CheckCircle, Clock, FileText, MessageSquare, Send, Share2 } from "lucide-react";

const pdfUrl = "/pdfs/PM-AJAY-Annual-Report-Form.pdf";

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

const frequentlyRaised = [
  "Update beneficiary bank details",
  "Clarification on document requirements",
  "Delay in verification status",
  "Resubmit income certificate",
];

export default function RaiseIssueHome() {
  return (
    <section id="raise-issue" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 shadow-sm border border-amber-100">
          <MessageSquare className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-semibold text-amber-700">Raise Issue</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs text-gray-600">Track & resolve quickly</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Reference, chat, and submit in one place</h2>
        <p className="max-w-3xl mx-auto text-lg text-gray-700">
          Preview your PDF and see recent questions before submitting your own. For a deeper view, open the full Raise Issue page.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* PDF Preview */}
        <div className="bg-white rounded-2xl shadow-2xl border border-amber-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-amber-100 flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-amber-700 font-semibold">Reference PDF</p>
              <p className="text-base font-semibold text-gray-900">PM-AJAY Annual Report</p>
            </div>
          </div>
          <div className="h-[400px] bg-amber-50/60">
            <iframe title="Annual Report" src={pdfUrl} className="w-full h-full" />
          </div>
          <div className="px-6 py-4 flex items-center gap-3 text-sm text-gray-700 bg-amber-50/60 border-t border-amber-100">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Preview only. Open full report or start a chat for clarifications.</span>
          </div>
        </div>

        {/* Chat snippets + CTA */}
        <div className="bg-white rounded-2xl shadow-2xl border border-amber-100 flex flex-col">
          <div className="px-6 py-4 border-b border-amber-100 flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-amber-700 font-semibold">Conversation</p>
              <p className="text-base font-semibold text-gray-900">Recent queries</p>
            </div>
          </div>

          <div className="px-6 pt-4 space-y-2 text-sm text-gray-800">
            {mockChats.map((chat) => (
              <div
                key={`${chat.user}-${chat.time}`}
                className="bg-amber-50/80 border border-amber-100 rounded-xl px-4 py-3"
              >
                <div className="flex items-center justify-between text-xs text-amber-700 font-semibold">
                  <span>{chat.user}</span>
                  <span className="text-gray-500">{chat.time}</span>
                </div>
                <p className="mt-1 text-sm text-gray-800">{chat.text}</p>
              </div>
            ))}
          </div>

          <div className="px-6 pt-4 space-y-2 text-sm text-gray-800 flex-1 overflow-auto">
            {frequentlyRaised.map((item) => (
              <div
                key={item}
                className="bg-amber-50/60 border border-amber-100 rounded-xl px-4 py-3 flex items-start gap-3"
              >
                <Clock className="w-4 h-4 mt-0.5 text-amber-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="p-6 border-t border-amber-100 flex flex-wrap gap-3 justify-between items-center">
            <a
              href="/raise-issue"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-200 text-amber-700 bg-white hover:border-amber-400 text-sm font-semibold"
            >
              <Share2 className="w-4 h-4" />
              Open full page
            </a>
            <a
              href="/raise-issue"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow bg-linear-to-r from-amber-500 to-amber-600 text-white"
            >
              <Send className="w-4 h-4" />
              Start chat
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
