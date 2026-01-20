"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
];

export default function LanguageSelector() {
  const pathname = usePathname();
  const [selectedLang, setSelectedLang] = useState("en");
  const [isOpen, setIsOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  // Hide language selector in PACC dashboard
  const isPaccDashboard = pathname?.includes("/pacc");
  const isProposalDashboard = pathname?.includes("/proposals");

  useEffect(() => {
    // Load language from local storage on mount
    const savedLang = localStorage.getItem("selectedLanguage");
    if (savedLang) {
      setSelectedLang(savedLang);
      setShowPrompt(false);
    } else {
      // First time visitor - show prompt
      setShowPrompt(true);
    }
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setSelectedLang(langCode);
    localStorage.setItem("selectedLanguage", langCode);
    setIsOpen(false);
    setShowPrompt(false);
    // You can dispatch a custom event here if you want to notify other components
    window.dispatchEvent(
      new CustomEvent("languageChange", { detail: langCode })
    );
  };

  const currentLanguage =
    languages.find((lang) => lang.code === selectedLang) || languages[0];

  // Don't render in PACC dashboard
  if (isPaccDashboard || isProposalDashboard) {
    return null;
  }

  return (
    <>
      {/* Blur backdrop overlay */}
      {showPrompt && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/30 z-40" />
      )}

      <div className="absolute top-10 right-10 z-100">
        {/* First-time visitor prompt */}
        {showPrompt && (
          <div className="absolute -left-64 top-0 flex items-center gap-3 animate-bounce-subtle">
            <div className="bg-[#ff9900] text-white px-4 py-3 rounded-lg shadow-lg max-w-xs">
              <div className="font-semibold text-sm">
                Select Language / भाषा चुनें
              </div>
            </div>
            <svg
              className="w-8 h-8 text-[#ff9900] animate-bounce"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFAE00] focus:border-transparent ${
              showPrompt
                ? "ring-4 ring-[#FFAE00] ring-opacity-50 animate-pulse"
                : ""
            }`}
          >
            <Globe className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-700">
              {currentLanguage.native}
            </span>
            <svg
              className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
              <div className="py-1 max-h-96 overflow-y-auto">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-4 py-2.5 hover:bg-[#FFAE00]/10 transition-colors duration-150 flex items-center justify-between ${
                      selectedLang === lang.code
                        ? "bg-[#FFAE00]/20 text-[#FFAE00]"
                        : "text-gray-700"
                    }`}
                  >
                    <div>
                      <div className="font-medium">{lang.native}</div>
                      <div className="text-sm text-gray-500">{lang.name}</div>
                    </div>
                    {selectedLang === lang.code && (
                      <svg
                        className="w-5 h-5 text-[#FFAE00]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Backdrop to close dropdown when clicking outside */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </>
  );
}
