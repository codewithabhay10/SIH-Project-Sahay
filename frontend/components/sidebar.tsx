"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { UserRole } from "@/lib/auth";
import { useTranslationApi } from "@/lib/use-translation-api";

export default function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t, language, translateMultiple } = useTranslationApi();
  const [renderKey, setRenderKey] = useState(0);

  // Translatable texts
  const TEXTS = {
    // Ministry role
    portal: 'Portal',
    fundQueue: 'Fund Queue',
    pfmsMonitor: 'PFMS Monitor',
    allNGOs: 'All NGOs',
    allBeneficiaries: 'All Beneficiaries',
    
    // State role
    stateOverview: 'State Overview',
    submitProposal: 'Submit Proposal',
    snaReconciliation: 'SNA Reconciliation',
    
    // IA role
    iaDashboard: 'IA Dashboard',
    registerBeneficiary: 'Register Beneficiary',
    createFTO: 'Create FTO',
    projectDetails: 'Project Details',
    
    // PACC role
    paccDashboard: 'PACC Dashboard',
    meetingsScheduled: 'Meetings Scheduled',
    
    // SNA role
    snaDashboard: 'SNA Dashboard',
    verifyBeneficiaries: 'Verify Beneficiaries',
    
    // Beneficiary role
    myDashboard: 'My Dashboard',
    
    // Common
    logout: 'Logout',
  };

  // Translate texts when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      if (language !== 'en') {
        await translateMultiple(TEXTS);
        setRenderKey(prev => prev + 1);
      } else {
        setRenderKey(prev => prev + 1);
      }
    };
    loadTranslations();
  }, [language, translateMultiple]);

  // Try to get the dashboard layout context (if available)
  let setLayoutHovered: ((hovered: boolean) => void) | undefined;
  try {
    const { useDashboardLayout } = require("@/components/dashboard-layout");
    const layoutContext = useDashboardLayout();
    setLayoutHovered = layoutContext?.setIsSidebarHovered;
  } catch {
    // Context not available, that's fine
  }

  const handleHoverChange = (hovered: boolean) => {
    setIsHovered(hovered);
    if (setLayoutHovered) {
      setLayoutHovered(hovered);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Role-based menu items
  const getMenuItems = (role: UserRole | null) => {
    if (!role) return [];

    const menuItems = {
      ministry: [
        {
          title: TEXTS.portal,
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 2.5H2.5V7.5H7.5V2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.5 2.5H12.5V7.5H17.5V2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.5 12.5H12.5V17.5H17.5V12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.5 12.5H2.5V17.5H7.5V12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          href: "/dashboard/central",
        },
        {
          title: TEXTS.fundQueue,
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15.8333 3.33333H4.16667C3.24619 3.33333 2.5 4.07953 2.5 5V15C2.5 15.9205 3.24619 16.6667 4.16667 16.6667H15.8333C16.7538 16.6667 17.5 15.9205 17.5 15V5C17.5 4.07953 16.7538 3.33333 15.8333 3.33333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2.5 8.33333H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.3333 11.6667H13.3417" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 11.6667H10.0083" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          href: "/funds/queue",
        },
        {
          title: TEXTS.pfmsMonitor,
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3.33333 7.5C4.90416 5.83333 6.97133 4.91435 9.16824 4.91435C11.3652 4.91435 13.4323 5.83333 15.0032 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5.83333 10C6.90416 8.88889 8.42412 8.25291 10 8.25291C11.5759 8.25291 13.0958 8.88889 14.1667 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8.33333 12.5C8.97569 11.9444 9.77106 11.6667 10.5664 11.6667C11.3618 11.6667 12.1571 11.9444 12.7995 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="10" cy="15" r="1.25" fill="currentColor" />
            </svg>
          ),
          href: "/integrations/pfms",
        },
        {
          title: TEXTS.allNGOs,
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M14.1667 17.5V15.8333C14.1667 14.9493 13.8155 14.1014 13.1904 13.4763C12.5652 12.8512 11.7174 12.5 10.8333 12.5H4.16667C3.28261 12.5 2.43477 12.8512 1.80964 13.4763C1.18452 14.1014 0.833328 14.9493 0.833328 15.8333V17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.5 9.16667C9.34095 9.16667 10.8333 7.67428 10.8333 5.83333C10.8333 3.99238 9.34095 2.5 7.5 2.5C5.65905 2.5 4.16667 3.99238 4.16667 5.83333C4.16667 7.67428 5.65905 9.16667 7.5 9.16667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.1667 17.5V15.8333C19.1661 15.0948 18.9203 14.3773 18.4678 13.7936C18.0153 13.2099 17.3818 12.793 16.6667 12.6083" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.3333 2.60833C14.0503 2.79192 14.6858 3.20892 15.1396 3.79359C15.5935 4.37827 15.8398 5.09736 15.8398 5.8375C15.8398 6.57764 15.5935 7.29673 15.1396 7.88141C14.6858 8.46608 14.0503 8.88308 13.3333 9.06667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          href: "/dashboard/central/all-ngo",
        },
        {
          title: TEXTS.allBeneficiaries,
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M16.6667 17.5V15.8333C16.6667 14.9493 16.3155 14.1014 15.6904 13.4763C15.0652 12.8512 14.2174 12.5 13.3333 12.5H6.66667C5.78261 12.5 4.93477 12.8512 4.30964 13.4763C3.68452 14.1014 3.33333 14.9493 3.33333 15.8333V17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 9.16667C11.8409 9.16667 13.3333 7.67428 13.3333 5.83333C13.3333 3.99238 11.8409 2.5 10 2.5C8.15905 2.5 6.66667 3.99238 6.66667 5.83333C6.66667 7.67428 8.15905 9.16667 10 9.16667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          href: "/dashboard/central/all-beneficiary",
        },
      ],
      state: [
        {
          title: TEXTS.stateOverview,
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2.5 7.5L10 2.5L17.5 7.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.5 17.5V10H12.5V17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          href: `/dashboard/state/${user?.stateId || 'MH'}`,
        },
        {
          title: TEXTS.submitProposal,
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M11.6667 1.66667H5C4.55797 1.66667 4.13405 1.84226 3.82149 2.15482C3.50893 2.46738 3.33333 2.8913 3.33333 3.33333V16.6667C3.33333 17.1087 3.50893 17.5326 3.82149 17.8452C4.13405 18.1577 4.55797 18.3333 5 18.3333H15C15.442 18.3333 15.866 18.1577 16.1785 17.8452C16.4911 17.5326 16.6667 17.1087 16.6667 16.6667V6.66667L11.6667 1.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.6667 1.66667V6.66667H16.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 10.8333V14.1667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.33333 12.5H11.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          href: "/plans/submit",
        },
        {
          title: TEXTS.snaReconciliation,
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M17.5 5.83333L10 10.8333L2.5 5.83333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 18.3333V10.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.5 14.1667V5.83333L10 1.66667L2.5 5.83333V14.1667L10 18.3333L17.5 14.1667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2.5 5.83333L10 10.8333L17.5 5.83333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          href: "/funds/sna",
        },
      ],
      ia: [
        {
          title: TEXTS.iaDashboard,
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2.5 7.5L10 2.5L17.5 7.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.5 17.5V10H12.5V17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          href: `/dashboard/ia/${user?.iaId || 'IA001'}`,
        },
        {
          title: 'UC & Reports',
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M11.6667 1.66667H5C4.55797 1.66667 4.13405 1.84226 3.82149 2.15482C3.50893 2.46738 3.33333 2.8913 3.33333 3.33333V16.6667C3.33333 17.1087 3.50893 17.5326 3.82149 17.8452C4.13405 18.1577 4.55797 18.3333 5 18.3333H15C15.442 18.3333 15.866 18.1577 16.1785 17.8452C16.4911 17.5326 16.6667 17.1087 16.6667 16.6667V6.66667L11.6667 1.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.6667 1.66667V6.66667H16.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.3333 10.8333H6.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.3333 14.1667H6.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.33333 7.5H7.5H6.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          href: `/dashboard/ia/${user?.iaId || 'IA001'}/uc-reports`,
        },
        {
          title: TEXTS.registerBeneficiary,
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M16.6667 17.5V15.8333C16.6667 14.9493 16.3155 14.1014 15.6904 13.4763C15.0652 12.8512 14.2174 12.5 13.3333 12.5H6.66667C5.78261 12.5 4.93477 12.8512 4.30964 13.4763C3.68452 14.1014 3.33333 14.9493 3.33333 15.8333V17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 9.16667C11.8409 9.16667 13.3333 7.67428 13.3333 5.83333C13.3333 3.99238 11.8409 2.5 10 2.5C8.15905 2.5 6.66667 3.99238 6.66667 5.83333C6.66667 7.67428 8.15905 9.16667 10 9.16667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          href: "/beneficiary/register",
        },
        {
          title: TEXTS.createFTO,
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15.8333 3.33333H4.16667C3.24619 3.33333 2.5 4.07953 2.5 5V15C2.5 15.9205 3.24619 16.6667 4.16667 16.6667H15.8333C16.7538 16.6667 17.5 15.9205 17.5 15V5C17.5 4.07953 16.7538 3.33333 15.8333 3.33333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2.5 8.33333H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.3333 11.6667H13.3417" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 11.6667H10.0083" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          href: "/payments/fto",
        },
        {
          title: TEXTS.projectDetails,
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M11.6667 1.66667H5C4.55797 1.66667 4.13405 1.84226 3.82149 2.15482C3.50893 2.46738 3.33333 2.8913 3.33333 3.33333V16.6667C3.33333 17.1087 3.50893 17.5326 3.82149 17.8452C4.13405 18.1577 4.55797 18.3333 5 18.3333H15C15.442 18.3333 15.866 18.1577 16.1785 17.8452C16.4911 17.5326 16.6667 17.1087 16.6667 16.6667V6.66667L11.6667 1.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.6667 1.66667V6.66667H16.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.3333 10.8333H6.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.3333 14.1667H6.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.33333 7.5H7.5H6.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          href: "/projects/PROJ-001",
        },
      ],
      pacc: [
        {
          title: TEXTS.paccDashboard,
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M11.6667 1.66667H5C4.55797 1.66667 4.13405 1.84226 3.82149 2.15482C3.50893 2.46738 3.33333 2.8913 3.33333 3.33333V16.6667C3.33333 17.1087 3.50893 17.5326 3.82149 17.8452C4.13405 18.1577 4.55797 18.3333 5 18.3333H15C15.442 18.3333 15.866 18.1577 16.1785 17.8452C16.4911 17.5326 16.6667 17.1087 16.6667 16.6667V6.66667L11.6667 1.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.6667 1.66667V6.66667H16.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.3333 10.8333H6.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.3333 14.1667H6.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.33333 7.5H7.5H6.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          href: "/proposals",
        },
        {
          title: TEXTS.meetingsScheduled,
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 2.5H2.5V7.5H7.5V2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.5 2.5H12.5V7.5H17.5V2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.5 12.5H12.5V17.5H17.5V12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.5 12.5H2.5V17.5H7.5V12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          href: "/pacc",
        },
      ],
      sna: [
        {
          title: TEXTS.snaDashboard,
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 2.5H2.5V7.5H7.5V2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.5 2.5H12.5V7.5H17.5V2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.5 12.5H12.5V17.5H17.5V12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.5 12.5H2.5V17.5H7.5V12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          href: "/sna",
        },
        {
          title: TEXTS.verifyBeneficiaries,
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M16.6667 5L7.50001 14.1667L3.33334 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          href: "/beneficiary/verify",
        },
      ],
      beneficiary: [
        {
          title: TEXTS.myDashboard,
          icon: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 2.5H2.5V7.5H7.5V2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.5 2.5H12.5V7.5H17.5V2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.5 12.5H12.5V17.5H17.5V12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.5 12.5H2.5V17.5H7.5V12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          href: "/beneficiary",
        },
      ],
    };

    return menuItems[role] || [];
  };

  const menuItems = getMenuItems(user?.role || null);

  return (
    <div
      key={renderKey}
      onMouseEnter={() => handleHoverChange(true)}
      onMouseLeave={() => handleHoverChange(false)}
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-50 flex flex-col ${
        isHovered ? "w-64" : "w-20"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 bg-[#EA9000] rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">स</span>
          </div>
          {isHovered && (
            <span className="font-bold text-xl text-[#2C3E50] whitespace-nowrap">
              सहाय
            </span>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-6 overflow-y-auto scrollbar-hide">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => {
            // More precise active state detection
            // Only match exact path or children, but not parent paths
            const isExactMatch = pathname === item.href;
            const isChildMatch = pathname.startsWith(item.href + '/') && 
                                 !menuItems.some(otherItem => 
                                   otherItem.href !== item.href && 
                                   pathname === otherItem.href
                                 );
            const isActive = isExactMatch || isChildMatch;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-[#EA9000] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  } ${!isHovered ? "justify-center" : ""}`}
                  title={!isHovered ? t(item.title) : ""}
                >
                  <span className={isActive ? "text-white" : "text-gray-600"}>
                    {item.icon}
                  </span>
                  {isHovered && (
                    <span className="font-medium">{t(item.title)}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      {user && (
        <div className="border-t border-gray-200 p-4">
          <div className={`flex items-center gap-3 mb-3 ${!isHovered ? "justify-center" : ""}`}>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
              <span className="text-gray-600 font-semibold text-sm">{user.name.charAt(0)}</span>
            </div>
            {isHovered && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate capitalize">{user.role}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${!isHovered ? "justify-center" : ""}`}
            title={!isHovered ? t(TEXTS.logout) : ""}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.6667 11.3333L14 8L10.6667 4.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {isHovered && <span className="font-medium text-sm">{t(TEXTS.logout)}</span>}
          </button>
        </div>
      )}
    </div>
  );
}
