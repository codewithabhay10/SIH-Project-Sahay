"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import IndiaMapHeatmap from "@/components/india-map-heatmap";
import TimeSeriesChart from "@/components/time-series-chart";
import DonutChart from "@/components/donut-chart";
import DashboardLayout from "@/components/dashboard-layout";
import router from "next/router";

interface TooltipProps {
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="ml-2 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-semibold transition-colors"
      >
        ?
      </button>
      {isVisible && (
        <div className="absolute z-50 left-0 top-7 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg">
          <div className="absolute -top-2 left-4 w-4 h-4 bg-gray-900 transform rotate-45"></div>
          <p className="relative z-10">{text}</p>
        </div>
      )}
    </div>
  );
};

export default function CentralDashboard() {
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [selectedState, setSelectedState] = useState("All States");
  const [schemeType, setSchemeType] = useState("All Scheme Types");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingCentral, setLoadingCentral] = useState(true);
  const [totalReleased, setTotalReleased] = useState<number | null>(null);
  const [unspentBalance, setUnspentBalance] = useState<number | null>(null);
  const [avgUtilization, setAvgUtilization] = useState<number>(0);
  const [language, setLanguage] = useState<"en" | "hi">("en");

  useEffect(() => {
    const storedLang = localStorage.getItem("selectedLanguage") as "en" | "hi" | null;
    if (storedLang) {
      setLanguage(storedLang);
    }
  }, []);

  const tooltips = {
    en: {
      totalReleased:
        "Total amount of funds released from the central government to various state nodal agencies for welfare schemes.",
      unspentBalance:
        "Remaining funds that have been allocated but not yet utilized by state agencies. This shows available balance for deployment.",
      avgUtilization:
        "Average percentage of released funds that have been actually utilized across all schemes and states. Higher percentage indicates better implementation.",
      fundFlow:
        "Interactive map showing state-wise distribution of funds. Darker shades indicate higher fund allocation. Click on states for detailed breakdown.",
      timeSeries:
        "Monthly trend of fund releases over time. Helps track disbursement patterns and seasonal variations in fund allocation.",
      schemeDistribution:
        "Breakdown of total funds allocated across different welfare schemes. Shows which schemes receive the most funding.",
      fundStream:
        "Live updates of fund transfers happening in real-time. Shows recent transactions between central government and state agencies.",
      quickActions:
        "Common administrative tasks that can be performed directly from the dashboard for faster workflow.",
      alerts:
        "Important notifications and warnings that require attention. Prioritized by urgency level - High, Medium, or Low.",
    },
    hi: {
      totalReleased:
        "केंद्र सरकार द्वारा विभिन्न राज्य नोडल एजेंसियों को कल्याणकारी योजनाओं के लिए जारी की गई कुल धनराशि।",
      unspentBalance:
        "शेष धनराशि जो आवंटित की गई है लेकिन अभी तक राज्य एजेंसियों द्वारा उपयोग नहीं की गई है। यह तैनाती के लिए उपलब्ध शेष राशि दिखाता है।",
      avgUtilization:
        "सभी योजनाओं और राज्यों में वास्तव में उपयोग की गई जारी धनराशि का औसत प्रतिशत। उच्च प्रतिशत बेहतर कार्यान्वयन को दर्शाता है।",
      fundFlow:
        "राज्यवार धन वितरण दिखाने वाला इंटरैक्टिव मानचित्र। गहरे रंग उच्च धन आवंटन को दर्शाते हैं। विस्तृत विवरण के लिए राज्यों पर क्लिक करें।",
      timeSeries:
        "समय के साथ धन जारी करने की मासिक प्रवृत्ति। वितरण पैटर्न और धन आवंटन में मौसमी बदलाव को ट्रैक करने में मदद करता है।",
      schemeDistribution:
        "विभिन्न कल्याणकारी योजनाओं में आवंटित कुल धन का विभाजन। दिखाता है कि किन योजनाओं को सबसे अधिक धन मिलता है।",
      fundStream:
        "वास्तविक समय में हो रहे धन हस्तांतरण के लाइव अपडेट। केंद्र सरकार और राज्य एजेंसियों के बीच हाल के लेनदेन दिखाता है।",
      quickActions:
        "सामान्य प्रशासनिक कार्य जो तेज़ वर्कफ़्लो के लिए सीधे डैशबोर्ड से किए जा सकते हैं।",
      alerts:
        "महत्वपूर्ण सूचनाएं और चेतावनियां जिन पर ध्यान देने की आवश्यकता है। तात्कालिकता स्तर के अनुसार प्राथमिकता - उच्च, मध्यम या निम्न।",
    },
  };

  useEffect(() => {
    const fetchCentral = async () => {
      try {
        setLoadingCentral(true);
        // use backend host/port used in development; change if needed in production
        const res = await fetch("http://localhost:1604/api/central");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();
        const central = body?.central || {};
        const released = Number(central.total_released || 0);
        const balance = Number(central.total_balance || 0);
        setTotalReleased(released);
        setUnspentBalance(balance);

        const pool = released + balance;
        const util = pool > 0 ? (released / pool) * 100 : 0;
        setAvgUtilization(Number(util.toFixed(1)));
      } catch (err) {
        console.error("Failed to load central data", err);
        setTotalReleased(null);
        setUnspentBalance(null);
        setAvgUtilization(0);
      } finally {
        setLoadingCentral(false);
      }
    };

    fetchCentral();
  }, []);

  const fmtINR = (v: number | null) => {
    if (v === null) return "—";
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(v);
    } catch {
      return `₹${v.toLocaleString()}`;
    }
  };

  return (
    <DashboardLayout>
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#2C3E50]">
                MoSJE Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Ministry of Social Justice and Empowerment Overview
              </p>
            </div>

            {/* Export Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => console.log("Export PDF")}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
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

              <button
                onClick={() => console.log("Export CSV")}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
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
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex items-center gap-4">
            {/* Date Range Filter */}
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EA9000] focus:border-transparent cursor-pointer"
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>This Year</option>
                <option>Custom Range</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="#4A4A4A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* State Filter */}
            <div className="relative">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EA9000] focus:border-transparent cursor-pointer"
              >
                <option>All States</option>
                <option>Maharashtra</option>
                <option>Karnataka</option>
                <option>Tamil Nadu</option>
                <option>Gujarat</option>
                <option>Uttar Pradesh</option>
                <option>West Bengal</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="#4A4A4A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Scheme Type Filter */}
            <div className="relative">
              <select
                value={schemeType}
                onChange={(e) => setSchemeType(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EA9000] focus:border-transparent cursor-pointer"
              >
                <option>All Scheme Types</option>
                <option>Education</option>
                <option>Healthcare</option>
                <option>Agriculture</option>
                <option>Infrastructure</option>
                <option>Skill Development</option>
                <option>Housing</option>
                <option>Water & Sanitation</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="#4A4A4A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search schemes, projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EA9000] focus:border-transparent w-64"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
                  stroke="#9CA3AF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 14L11.1 11.1"
                  stroke="#9CA3AF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8">
          {/* KPI Cards Row */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Total Funds Released */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Total Funds Released
                    </p>
                    <Tooltip text={tooltips[language].totalReleased} />
                  </div>
                  <p className="text-3xl font-bold text-[#2C3E50]">
                    {loadingCentral ? "Loading..." : fmtINR(totalReleased)}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                        avgUtilization >= 0 ? "bg-green-50" : "bg-gray-50"
                      }`}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M6 9V3M6 3L3 6M6 3L9 6"
                          stroke="#10B981"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-xs font-semibold text-green-600">
                        {loadingCentral ? "—" : `${avgUtilization}%`}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">utilization</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L2 7L12 12L22 7L12 2Z"
                      stroke="#3B82F6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 17L12 22L22 17"
                      stroke="#3B82F6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 12L12 17L22 12"
                      stroke="#3B82F6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Unspent Balance */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Unspent Balance
                    </p>
                    <Tooltip text={tooltips[language].unspentBalance} />
                  </div>
                  <p className="text-3xl font-bold text-[#2C3E50]">
                    {loadingCentral ? "Loading..." : fmtINR(unspentBalance)}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1 px-2 py-1 bg-red-50 rounded-full">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M6 3V9M6 9L3 6M6 9L9 6"
                          stroke="#EF4444"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-xs font-semibold text-red-600">
                        {loadingCentral
                          ? "—"
                          : `${(100 - avgUtilization).toFixed(1)}%`}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">remaining</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="#EA9000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 6V12L16 14"
                      stroke="#EA9000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Average Utilization */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Avg Utilization
                    </p>
                    <Tooltip text={tooltips[language].avgUtilization} />
                  </div>
                  <p className="text-3xl font-bold text-[#2C3E50]">
                    {loadingCentral ? "Loading..." : `${avgUtilization}%`}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M6 9V3M6 3L3 6M6 3L9 6"
                          stroke="#10B981"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-xs font-semibold text-green-600">
                        {loadingCentral ? "—" : "since start"}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">of total pool</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M23 6L13.5 15.5L8.5 10.5L1 18"
                      stroke="#8B5CF6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 6H23V12"
                      stroke="#8B5CF6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Map & Panels */}
            <div className="col-span-8 space-y-6">
              {/* India Map Heatmap */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-semibold text-[#2C3E50]">
                    Fund Flow by State
                  </h3>
                  <Tooltip text={tooltips[language].fundFlow} />
                </div>
                <div className="h-[500px] flex items-center justify-center">
                  <IndiaMapHeatmap />
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-2 gap-6">
                {/* Time Series Chart */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-semibold text-[#2C3E50]">
                      Funds Released Over Time
                    </h3>
                    <Tooltip text={tooltips[language].timeSeries} />
                  </div>
                  <TimeSeriesChart />
                </div>

                {/* Donut Chart */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-semibold text-[#2C3E50]">
                      Scheme Distribution
                    </h3>
                    <Tooltip text={tooltips[language].schemeDistribution} />
                  </div>
                  <DonutChart />
                </div>
              </div>
            </div>

            {/* Right Column - Panels */}
            <div className="col-span-4 space-y-6">
              {/* Fund Stream Panel */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold text-[#2C3E50]">
                      Real-time Fund Stream
                    </h3>
                    <Tooltip text={tooltips[language].fundStream} />
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500">Live</span>
                  </div>
                </div>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {/* Transaction 1 */}
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-900">
                        ₹2,50,00,000
                      </p>
                      <span className="text-xs text-gray-500">2 min ago</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      PMAY-U → Maharashtra SNA
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                        Released
                      </span>
                      <span className="text-xs text-gray-500">
                        1,250 beneficiaries
                      </span>
                    </div>
                  </div>

                  {/* Transaction 2 */}
                  <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-900">
                        ₹1,75,50,000
                      </p>
                      <span className="text-xs text-gray-500">5 min ago</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      NULM → Karnataka IA
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                        Disbursed
                      </span>
                      <span className="text-xs text-gray-500">
                        845 beneficiaries
                      </span>
                    </div>
                  </div>

                  {/* Transaction 3 */}
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-900">
                        ₹3,20,00,000
                      </p>
                      <span className="text-xs text-gray-500">8 min ago</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      DAY-NULM → Tamil Nadu SNA
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                        Pending
                      </span>
                      <span className="text-xs text-gray-500">
                        1,580 beneficiaries
                      </span>
                    </div>
                  </div>

                  {/* Transaction 4 */}
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-900">
                        ₹4,10,00,000
                      </p>
                      <span className="text-xs text-gray-500">12 min ago</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      PMAY-U → Gujarat SNA
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                        Released
                      </span>
                      <span className="text-xs text-gray-500">
                        2,030 beneficiaries
                      </span>
                    </div>
                  </div>

                  {/* Transaction 5 */}
                  <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-900">
                        ₹1,95,00,000
                      </p>
                      <span className="text-xs text-gray-500">15 min ago</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      AMRUT → Uttar Pradesh IA
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                        Disbursed
                      </span>
                      <span className="text-xs text-gray-500">
                        970 beneficiaries
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-semibold text-[#2C3E50]">
                    Quick Actions
                  </h3>
                  <Tooltip text={tooltips[language].quickActions} />
                </div>
                <div className="space-y-6">
                  <Link href="/funds/queue">
                    <button
                      className="w-full px-4 py-3 bg-[#EA9000] text-white rounded-lg font-medium hover:bg-[#d88000] transition-colors"
                      style={{ marginBottom: "1rem" }}
                    >
                      Release New Fund
                    </button>
                  </Link>
                  <Link href="/funds/queue">
                    <button
                      className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      style={{ marginBottom: "1rem" }}
                    >
                      Generate National Report
                    </button>
                  </Link>
                  <Link href="/funds/queue">
                    <button
                      className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      style={{ marginBottom: "1rem" }}
                    >
                      Issue Circular
                    </button>
                  </Link>
                </div>
              </div>

              {/* Recent Alerts */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-semibold text-[#2C3E50]">
                    Recent Alerts
                  </h3>
                  <Tooltip text={tooltips[language].alerts} />
                </div>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {/* Alert 1 - High Priority */}
                  <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                    <div className="flex items-start justify-between mb-1">
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                        High Priority
                      </span>
                      <span className="text-xs text-gray-500">1h ago</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mt-2">
                      Fund utilization below 50%
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Bihar PMAY-U project showing critically low utilization
                      rate
                    </p>
                  </div>

                  {/* Alert 2 - Medium Priority */}
                  <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
                    <div className="flex items-start justify-between mb-1">
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                        Medium
                      </span>
                      <span className="text-xs text-gray-500">3h ago</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mt-2">
                      Pending approval required
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Karnataka SNA has submitted new project proposal for
                      ₹5.2Cr
                    </p>
                  </div>

                  {/* Alert 3 - Low Priority */}
                  <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                    <div className="flex items-start justify-between mb-1">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                        Info
                      </span>
                      <span className="text-xs text-gray-500">5h ago</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mt-2">
                      Monthly report submitted
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Tamil Nadu has submitted October utilization report
                    </p>
                  </div>

                  {/* Alert 4 - High Priority */}
                  <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                    <div className="flex items-start justify-between mb-1">
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                        High Priority
                      </span>
                      <span className="text-xs text-gray-500">6h ago</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mt-2">
                      Deadline approaching
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Gujarat fund utilization deadline in 3 days
                    </p>
                  </div>

                  {/* Alert 5 - Medium Priority */}
                  <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
                    <div className="flex items-start justify-between mb-1">
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                        Medium
                      </span>
                      <span className="text-xs text-gray-500">1d ago</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mt-2">
                      Data discrepancy detected
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Mismatch in beneficiary count for Maharashtra NULM scheme
                    </p>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-[#EA9000] hover:bg-orange-50 rounded-lg transition-colors">
                  View All Alerts
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
