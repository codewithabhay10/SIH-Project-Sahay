"use client";

import React, { useState, createContext, useContext, ReactNode } from 'react';
import Sidebar from '@/components/sidebar';

interface DashboardLayoutContextType {
  isSidebarHovered: boolean;
  setIsSidebarHovered: (hovered: boolean) => void;
}

const DashboardLayoutContext = createContext<DashboardLayoutContextType | undefined>(undefined);

export function useDashboardLayout() {
  const context = useContext(DashboardLayoutContext);
  if (!context) {
    throw new Error('useDashboardLayout must be used within DashboardLayout');
  }
  return context;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  return (
    <DashboardLayoutContext.Provider value={{ isSidebarHovered, setIsSidebarHovered }}>
      <div className="flex min-h-screen bg-[#F5F7FA]">
        <Sidebar />
        <main 
          className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${
            isSidebarHovered ? 'ml-64' : 'ml-20'
          }`}
        >
          {children}
        </main>
      </div>
    </DashboardLayoutContext.Provider>
  );
}
