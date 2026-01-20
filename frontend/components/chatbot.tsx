"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Mic,
  Volume2,
  VolumeX,
  Play,
  Pause,
} from "lucide-react";
import { usePathname } from "next/navigation";

type Message = {
  role: "user" | "bot";
  text: string;
  time: string;
};

type UserRole = "beneficiary" | "official" | null;

type Language = {
  name: string;
  code: string;
  greeting: string;
  flag: string;
};

const API_BASE_URL = "http://127.0.0.1:8000";

// Languages supported
const LANGUAGES: Language[] = [
  {
    name: "English",
    code: "en-US",
    greeting: "Hello! Tap the mic to speak.",
    flag: "🇬🇧",
  },
  {
    name: "Hindi",
    code: "hi-IN",
    greeting: "नमस्ते! बात करने के लिए माइक दबाएं।",
    flag: "🇮🇳",
  },
  {
    name: "Punjabi",
    code: "pa-IN",
    greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮਾਈਕ ਦਬਾ ਕੇ ਬੋਲੋ।",
    flag: "🇮🇳",
  },
  {
    name: "Marathi",
    code: "mr-IN",
    greeting: "नमस्कार! बोलण्यासाठी माईक दाबा.",
    flag: "🇮🇳",
  },
  {
    name: "Gujarati",
    code: "gu-IN",
    greeting: "નમસ્તે! બોલવા માટે માઇક દબાવો.",
    flag: "🇮🇳",
  },
  {
    name: "Tamil",
    code: "ta-IN",
    greeting: "வணக்கம்! பேச மைக்கை தட்டவும்.",
    flag: "🇮🇳",
  },
  {
    name: "Telugu",
    code: "te-IN",
    greeting: "నమస్కారం! మాట్లాడటానికి మైక్ నొక్కండి.",
    flag: "🇮🇳",
  },
  {
    name: "Kannada",
    code: "kn-IN",
    greeting: "ನಮಸ್ಕಾರ! ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿರಿ.",
    flag: "🇮🇳",
  },
  {
    name: "Bengali",
    code: "bn-IN",
    greeting: "নমস্কার! কথা বলতে মাইক টিপুন।",
    flag: "🇮🇳",
  },
];

// Official toolkit options
const OFFICIAL_TOOLS = [
  {
    icon: "💰",
    label: "Check Subsidy Rules",
    query: "What is the maximum subsidy for E-Rickshaws?",
  },
  {
    icon: "📝",
    label: "Draft Rejection",
    query:
      "Draft a formal rejection letter for an applicant with income > 2.5L",
  },
  {
    icon: "📄",
    label: "Verify Docs",
    query: "What documents are required for a new applicant?",
  },
  {
    icon: "⚖️",
    label: "Compliance Rules",
    query: "Summarize the Grievance Redressal process",
  },
];

// Page-specific guidance
const pageGuidance: Record<string, { welcome: string; tips: string[] }> = {
  "/dashboard": {
    welcome: "Welcome to your Dashboard! I'm here to help you navigate.",
    tips: [
      "View your key metrics and statistics at the top",
      "Access recent activities in the timeline",
      "Use the sidebar to navigate to different sections",
      "Click on any card to see detailed information",
    ],
  },
  "/dashboard/ia": {
    welcome:
      "Welcome to the IA Dashboard! This is where you manage Implementation Agencies.",
    tips: [
      "View all registered IAs in the table",
      "Click on an IA to see detailed information",
      "Use filters to find specific agencies",
      "Check IA performance metrics in the stats cards",
    ],
  },
  "/pacc": {
    welcome: "Welcome to PACC (Public Account Committee Convergence)!",
    tips: [
      "Monitor convergence metrics across schemes",
      "View department-wise fund allocation",
      "Track utilization percentages",
      "Download reports for offline analysis",
    ],
  },
  "/proposals": {
    welcome: "Welcome to Proposals! Manage project proposals here.",
    tips: [
      "View all pending and approved proposals",
      "Filter proposals by status, date, or department",
      "Click on a proposal to review details",
      "Use action buttons to approve or request changes",
    ],
  },
  "/projects": {
    welcome: "Welcome to Projects! Track ongoing initiatives here.",
    tips: [
      "Monitor project progress and milestones",
      "View project timelines and deadlines",
      "Check budget utilization",
      "Access project documents and reports",
    ],
  },
  "/funds": {
    welcome: "Welcome to Fund Management!",
    tips: [
      "Track fund releases and utilization",
      "View pending fund requests",
      "Monitor scheme-wise allocation",
      "Generate financial reports",
    ],
  },
  "/beneficiary": {
    welcome: "Welcome to Beneficiary Management!",
    tips: [
      "Search and verify beneficiaries",
      "View beneficiary details and history",
      "Track benefit delivery status",
      "Export beneficiary data for reports",
    ],
  },
  "/reports": {
    welcome: "Welcome to Reports & Analytics!",
    tips: [
      "View annual and quarterly reports",
      "Raise issues or concerns about reports",
      "Share reports with stakeholders",
      "Access historical data and trends",
    ],
  },
  "/payments": {
    welcome: "Welcome to Payments!",
    tips: [
      "Process pending payments",
      "View payment history",
      "Track payment status",
      "Download payment receipts",
    ],
  },
  "/sna": {
    welcome: "Welcome to SNA (State Nodal Agency) Management!",
    tips: [
      "Manage SNA accounts",
      "Monitor fund transfers",
      "View account balances",
      "Track transaction history",
    ],
  },
};

const commonQuestions = [
  "How do I navigate this page?",
  "What can I do here?",
  "Show me key features",
  "Help me get started",
];

export default function Chatbot() {
  // UI State
  const [isOpen, setIsOpen] = useState(false);
  const [screen, setScreen] = useState<"login" | "language" | "chat">("login");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);

  // Auth & Language
  const [role, setRole] = useState<UserRole>(null);
  const [adminKey, setAdminKey] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    LANGUAGES[0]
  );

  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Audio State
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioState, setAudioState] = useState<
    "playing" | "paused" | "stopped"
  >("stopped");

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const pathname = usePathname();

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.interimResults = true;
        recognitionRef.current.continuous = false;

        recognitionRef.current.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          setInput(transcript);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = (e: any) => {
          console.error("Speech recognition error:", e.error);
          setIsListening(false);
          if (e.error === "not-allowed") {
            alert("Please allow microphone permission!");
          }
        };
      }

      // Load voices for speech synthesis
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize chat when entering chat screen
  useEffect(() => {
    if (screen === "chat" && messages.length === 0) {
      initializeChat();
    }
  }, [screen]);

  // === AUTHENTICATION FUNCTIONS ===
  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === "official") {
      // Stay on login screen to show admin key input
    } else {
      setScreen("language");
    }
  };

  const handleOfficialLogin = () => {
    if (adminKey !== "hackathon123") {
      alert("Wrong Key");
      return;
    }
    setScreen("chat");
    setShowSidebar(true);
    addMessage("bot", "Welcome, Officer. Ready to assist.");
  };

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    setScreen("chat");
    addMessage("bot", language.greeting);
    speak(language.greeting);
  };

  // === CHAT FUNCTIONS ===
  const initializeChat = () => {
    const currentPage =
      Object.keys(pageGuidance).find(
        (path) => pathname === path || pathname.startsWith(path + "/")
      ) || "/dashboard";

    const guidance = pageGuidance[currentPage] || pageGuidance["/dashboard"];
    const greeting =
      role === "official"
        ? "Welcome, Officer. Ready to assist."
        : selectedLanguage.greeting;

    addMessage("bot", greeting);
  };

  const addMessage = (role: "user" | "bot", text: string) => {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [...prev, { role, text, time }]);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    addMessage("user", userMessage);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: role || "beneficiary",
          user_id: role === "beneficiary" ? "Guest" : null,
          message: `[Spoken in ${selectedLanguage.name}] ${userMessage}`,
        }),
      });

      const data = await response.json();
      addMessage("bot", data.answer);
      speak(data.answer);
    } catch (error) {
      console.error("Chat error:", error);
      addMessage("bot", "Server Error. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => handleSubmit(), 100);
  };

  const autoAsk = (query: string) => {
    setInput(query);
    setTimeout(() => handleSubmit(), 100);
  };

  // === SPEECH FUNCTIONS ===
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in your browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.abort();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = selectedLanguage.code;
        recognitionRef.current.start();
        setIsListening(true);
        setInput("");
      } catch (error) {
        console.error("Recognition error:", error);
      }
    }
  };

  const speak = (text: string) => {
    if (isMuted) return;

    window.speechSynthesis.cancel();

    // Clean text for better speech
    const cleanText = text
      .replace(/[*#_`]/g, "")
      .replace(/https?:\/\/\S+/g, "the website")
      .replace(/[:|]/g, " ")
      .replace(/\n/g, ". ");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = selectedLanguage.code;

    // Find best voice
    const voices = window.speechSynthesis.getVoices();
    let bestVoice = voices.find(
      (v) =>
        v.lang === selectedLanguage.code &&
        (v.name.includes("Google") || v.name.includes("Neural"))
    );
    if (!bestVoice) {
      bestVoice = voices.find((v) => v.lang === selectedLanguage.code);
    }
    if (bestVoice) utterance.voice = bestVoice;

    utterance.rate = selectedLanguage.code === "en-US" ? 1.0 : 0.9;

    utterance.onstart = () => setAudioState("playing");
    utterance.onend = () => setAudioState("stopped");

    window.speechSynthesis.speak(utterance);
  };

  const toggleAudio = () => {
    if (window.speechSynthesis.speaking) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setAudioState("playing");
      } else {
        window.speechSynthesis.pause();
        setAudioState("paused");
      }
    } else {
      setIsMuted(!isMuted);
      if (!isMuted) {
        window.speechSynthesis.cancel();
      }
    }
  };

  // === AUDIT FUNCTIONS ===
  const fetchAuditLogs = async () => {
    setShowAuditModal(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/audit/logs?admin_key=${adminKey}`
      );
      const logs = await response.json();
      console.log("Audit logs:", logs);
    } catch (error) {
      console.error("Audit error:", error);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-50"
          title="PM-AJAY Sahayak"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>
      )}

      {/* Main Chat Container */}
      {isOpen && (
        <>
          {/* LOGIN SCREEN */}
          {screen === "login" && (
            <div className="fixed inset-0 bg-gradient-to-br from-slate-800 to-slate-900 bg-opacity-98 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">
                  🔐 Login / प्रवेश
                </h2>
                <div className="flex justify-center gap-4 mb-4">
                  <button
                    onClick={() => handleRoleSelect("beneficiary")}
                    className="flex flex-col items-center gap-2 p-6 border-2 border-gray-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all w-36"
                  >
                    <User className="w-12 h-12 text-amber-600" />
                    <span className="font-semibold">Beneficiary</span>
                    <span className="text-xs text-gray-500">लाभार्थी</span>
                  </button>
                  <button
                    onClick={() => handleRoleSelect("official")}
                    className="flex flex-col items-center gap-2 p-6 border-2 border-gray-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all w-36"
                  >
                    <Bot className="w-12 h-12 text-amber-600" />
                    <span className="font-semibold">Official</span>
                    <span className="text-xs text-gray-500">अधिकारी</span>
                  </button>
                </div>

                {role === "official" && (
                  <div className="mt-6 space-y-3">
                    <input
                      type="password"
                      value={adminKey}
                      onChange={(e) => setAdminKey(e.target.value)}
                      placeholder="Enter Key (hackathon123)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleOfficialLogin()
                      }
                    />
                    <button
                      onClick={handleOfficialLogin}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Access Dashboard
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LANGUAGE SCREEN */}
          {screen === "language" && (
            <div className="fixed inset-0 bg-gradient-to-br from-slate-800 to-slate-900 bg-opacity-98 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">
                  🗣️ Select Language
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang)}
                      className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all"
                    >
                      <span className="text-4xl">{lang.flag}</span>
                      <span className="font-semibold">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CHAT SCREEN */}
          {screen === "chat" && (
            <div className="fixed inset-0 z-50 flex flex-col bg-white">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-4 py-3 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <Bot className="w-8 h-8" />
                  <div>
                    <h3 className="font-semibold">PM-AJAY Sahayak</h3>
                    <p className="text-xs text-gray-300">
                      {role === "official"
                        ? "Official Mode"
                        : selectedLanguage.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleAudio}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    title="Audio Control"
                  >
                    {audioState === "playing" ? (
                      <Pause className="w-5 h-5" />
                    ) : audioState === "paused" ? (
                      <Play className="w-5 h-5" />
                    ) : isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  {role === "official" && (
                    <button
                      onClick={() => setShowSidebar(!showSidebar)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      ☰
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setScreen("login");
                      setMessages([]);
                      setRole(null);
                    }}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Exit
                  </button>
                </div>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Official Sidebar */}
                {role === "official" && showSidebar && (
                  <div className="w-72 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
                    <h3 className="font-bold text-lg mb-4 text-slate-800">
                      🛠️ Admin Toolkit
                    </h3>
                    {OFFICIAL_TOOLS.map((tool, idx) => (
                      <button
                        key={idx}
                        onClick={() => autoAsk(tool.query)}
                        className="w-full text-left p-3 mb-2 bg-white hover:bg-amber-50 border border-gray-200 hover:border-amber-500 rounded-lg transition-all flex items-center gap-3"
                      >
                        <span className="text-2xl">{tool.icon}</span>
                        <span className="text-sm font-medium">
                          {tool.label}
                        </span>
                      </button>
                    ))}
                    <hr className="my-4 border-gray-300" />
                    <button
                      onClick={fetchAuditLogs}
                      className="w-full p-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-all flex items-center gap-3"
                    >
                      <span className="text-2xl">📜</span>
                      <span className="text-sm font-medium">
                        View Transparency Logs
                      </span>
                    </button>
                  </div>
                )}

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-gradient-to-b from-amber-50 to-white">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-2 ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {msg.role === "bot" && (
                          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                            msg.role === "user"
                              ? "bg-blue-500 text-white rounded-br-none"
                              : "bg-white text-gray-800 rounded-bl-none shadow-md border border-gray-100"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">
                            {msg.text.replace(/\*\*(.*?)\*\*/g, "$1")}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.role === "user"
                                ? "text-blue-100"
                                : "text-gray-400"
                            }`}
                          >
                            {msg.time}
                          </p>
                        </div>
                        {msg.role === "user" && (
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex gap-2 justify-start">
                        <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                          <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-md">
                          <div className="flex gap-1">
                            <span
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></span>
                            <span
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            ></span>
                            <span
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></span>
                          </div>
                        </div>
                      </div>
                    )}

                    {messages.length <= 1 && !isTyping && (
                      <div className="space-y-2 pt-2">
                        <p className="text-xs text-gray-500 font-semibold">
                          Quick questions:
                        </p>
                        {commonQuestions.map((question, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickQuestion(question)}
                            className="w-full text-left text-sm px-3 py-2 bg-white hover:bg-amber-50 border border-amber-200 rounded-lg transition-colors"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="p-4 bg-gray-100 border-t border-gray-200">
                    <form
                      onSubmit={handleSubmit}
                      className="flex gap-2 items-center"
                    >
                      <button
                        type="button"
                        onClick={toggleListening}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          isListening
                            ? "bg-red-500 text-white animate-pulse"
                            : "bg-white text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <Mic className="w-6 h-6" />
                      </button>
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={
                          isListening ? "Listening..." : "Type or speak..."
                        }
                        className="flex-1 px-4 py-3 rounded-full border-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                        disabled={isTyping}
                      />
                      <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Audit Modal */}
          {showAuditModal && (
            <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[80vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">📜 Transparency Logs</h3>
                <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm">
                  <p>Loading audit logs...</p>
                </div>
                <button
                  onClick={() => setShowAuditModal(false)}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
