"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#FAFAFA] font-sans select-none">
      {/* Desktop sidebar */}
      <DashboardNav className="hidden md:flex" />

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-[#262626]/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <DashboardNav
            className="relative z-10 flex w-72"
            onCloseMobile={() => setMobileOpen(false)}
          />
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-[#C7D2FE]/40">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            className="p-2 rounded-xl text-[#5B50E5] hover:bg-[#C7D2FE]/30 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-base font-bold text-[#5B50E5] tracking-tight">
            VSC Connect
          </span>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
