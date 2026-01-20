"use client";

import React, { useState, useMemo, useCallback, memo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

// Memoized menu item component to prevent re-renders
const MenuItem = memo(function MenuItem({ 
  item, 
  isActive, 
  isHovered 
}: { 
  item: { title: string; icon: React.ReactNode; href: string }; 
  isActive: boolean; 
  isHovered: boolean;
}) {
  return (
    <li>
      <Link
        href={item.href}
        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
          isActive
            ? "bg-[#EA9000] text-white"
            : "text-gray-600 hover:bg-gray-100"
        } ${!isHovered ? "justify-center" : ""}`}
        title={!isHovered ? item.title : ""}
      >
        <span className={isActive ? "text-white" : "text-gray-600"}>
          {item.icon}
        </span>
        {isHovered && (
          <span className="font-medium">{item.title}</span>
        )}
      </Link>
    </li>
  );
});

// Menu items defined outside component to prevent recreation
const MENU_ITEMS = [
  {
    title: "Central Dashboard",
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
    title: "State Dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 2.5C10 2.5 13.75 6.25 13.75 10C13.75 13.75 10 17.5 10 17.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 2.5C10 2.5 6.25 6.25 6.25 10C6.25 13.75 10 17.5 10 17.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2.5 10H17.5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    href: "/dashboard/state/MH",
  },
  {
    title: "Proposal List",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M2.5 5H2.51" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M2.5 10H2.51" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M2.5 15H2.51" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M6.66667 5H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6.66667 10H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6.66667 15H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    href: "/proposals",
  },
  {
    title: "Submit Proposal",
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
    title: "PACC Portal",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M13.3333 10.8333L16.8522 13.1889C17.0482 13.3201 17.5 13.1667 17.5 12.9167V7.08333C17.5 6.83333 17.0482 6.67988 16.8522 6.81113L13.3333 9.16667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="1.66667" y="5" width="11.6667" height="10" rx="1.66667" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    href: "/pacc",
  },
  {
    title: "Fund Release Queue",
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
    title: "Register Beneficiary",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M13.3333 17.5V15.8333C13.3333 14.9493 12.9821 14.1014 12.357 13.4763C11.7319 12.8512 10.8841 12.5 10 12.5H5C4.11595 12.5 3.2681 12.8512 2.64298 13.4763C2.01786 14.1014 1.66667 14.9493 1.66667 15.8333V17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="7.5" cy="6.66667" r="3.33333" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M15.8333 6.66667V11.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M18.3333 9.16667H13.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    href: "/beneficiary/register",
  },
  {
    title: "Verify Beneficiaries",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M13.3333 17.5V15.8333C13.3333 14.9493 12.9821 14.1014 12.357 13.4763C11.7319 12.8512 10.8841 12.5 10 12.5H5C4.11595 12.5 3.2681 12.8512 2.64298 13.4763C2.01786 14.1014 1.66667 14.9493 1.66667 15.8333V17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="7.5" cy="6.66667" r="3.33333" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M13.3333 9.16667L15 10.8333L18.3333 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    href: "/beneficiary/verify",
  },
  {
    title: "All Beneficiaries",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M16.6667 17.5V15.8333C16.6667 14.9493 16.3155 14.1014 15.6904 13.4763C15.0652 12.8512 14.2174 12.5 13.3333 12.5H6.66667C5.78261 12.5 4.93477 12.8512 4.30964 13.4763C3.68452 14.1014 3.33333 14.9493 3.33333 15.8333V17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 9.16667C11.8409 9.16667 13.3333 7.67428 13.3333 5.83333C13.3333 3.99238 11.8409 2.5 10 2.5C8.15905 2.5 6.66667 3.99238 6.66667 5.83333C6.66667 7.67428 8.15905 9.16667 10 9.16667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    href: "/dashboard/central/all-beneficiary",
  },
  {
    title: "Projects",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3.33333 16.6667H16.6667C17.1269 16.6667 17.5 16.2936 17.5 15.8333V6.66667C17.5 6.20643 17.1269 5.83333 16.6667 5.83333H9.94281C9.76562 5.83333 9.59577 5.76326 9.47074 5.63824L8.19593 4.36343C8.07091 4.2384 7.90105 4.16833 7.72386 4.16833H3.33333C2.8731 4.16833 2.5 4.54143 2.5 5.00167V15.8333C2.5 16.2936 2.8731 16.6667 3.33333 16.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.66667 8.33333V13.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 10V13.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M13.3333 8.33333V13.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    href: "/projects/PROJ-001",
  },
  {
    title: "UC & Reports",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M11.6667 1.66667H5C4.55797 1.66667 4.13405 1.84226 3.82149 2.15482C3.50893 2.46738 3.33333 2.8913 3.33333 3.33333V16.6667C3.33333 17.1087 3.50893 17.5326 3.82149 17.8452C4.13405 18.1577 4.55797 18.3333 5 18.3333H15C15.442 18.3333 15.866 18.1577 16.1785 17.8452C16.4911 17.5326 16.6667 17.1087 16.6667 16.6667V6.66667L11.6667 1.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11.6667 1.66667V6.66667H16.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.5 12.5L9.16667 14.1667L12.5 10.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    href: "/reports/view",
  },
  {
    title: "Social Audit",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="5" y="1.66667" width="6.66667" height="3.33333" rx="0.833333" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M13.3333 3.33333H15C15.442 3.33333 15.866 3.50893 16.1785 3.82149C16.4911 4.13405 16.6667 4.55797 16.6667 5V16.6667C16.6667 17.1087 16.4911 17.5326 16.1785 17.8452C15.866 18.1577 15.442 18.3333 15 18.3333H5C4.55797 18.3333 4.13405 18.1577 3.82149 17.8452C3.50893 17.5326 3.33333 17.1087 3.33333 16.6667V5C3.33333 4.55797 3.50893 4.13405 3.82149 3.82149C4.13405 3.50893 4.55797 3.33333 5 3.33333H6.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.5 11.6667L9.16667 13.3333L12.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    href: "/reports/view",
  },
  {
    title: "All NGOs",
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
    title: "Raise Issue",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M17.5 5.83333L10 10.8333L2.5 5.83333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="2.5" y="3.33333" width="15" height="13.3333" rx="1.66667" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    href: "/raise-issue",
  },
];

function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // Get the layout context to sync hover state
  let setLayoutHovered: ((hovered: boolean) => void) | undefined;
  try {
    const { useDashboardLayout } = require("@/components/dashboard-layout");
    const layoutContext = useDashboardLayout();
    setLayoutHovered = layoutContext?.setIsSidebarHovered;
  } catch {
    // Context not available
  }

  const handleHover = useCallback((hovered: boolean) => {
    setIsHovered(hovered);
    if (setLayoutHovered) {
      setLayoutHovered(hovered);
    }
  }, [setLayoutHovered]);

  const handleLogout = useCallback(() => {
    logout();
    router.push('/login');
  }, [logout, router]);

  // Memoize active state checks
  const activeStates = useMemo(() => {
    return MENU_ITEMS.map(item => {
      const isExactMatch = pathname === item.href;
      const isChildMatch = pathname.startsWith(item.href + '/');
      return isExactMatch || isChildMatch;
    });
  }, [pathname]);

  return (
    <div
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
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
          {MENU_ITEMS.map((item, index) => (
            <MenuItem 
              key={item.href} 
              item={item} 
              isActive={activeStates[index]} 
              isHovered={isHovered} 
            />
          ))}
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
            title={!isHovered ? "Logout" : ""}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.6667 11.3333L14 8L10.6667 4.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {isHovered && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(Sidebar);
