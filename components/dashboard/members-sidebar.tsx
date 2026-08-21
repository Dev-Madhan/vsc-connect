"use client";

import {
  Users,
  LayoutDashboard,
  CalendarDays,
  Images,
  FileText,
  Settings,
  UserPlus,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type MembersNavSection =
  | "all"
  | "active"
  | "inactive"
  | "suspended"
  | "alumni";

interface MembersSidebarProps {
  activeSection: MembersNavSection;
  onSelectSection: (section: MembersNavSection) => void;
  onAddMember: () => void;
  totalCounts: Record<MembersNavSection, number>;
  className?: string;
  onCloseMobile?: () => void;
}

const TOP_NAV = [
  { label: "Dashboard", icon: LayoutDashboard, href: "#" },
  { label: "Events", icon: CalendarDays, href: "#" },
  { label: "Gallery", icon: Images, href: "#" },
  { label: "OD Documents", icon: FileText, href: "#" },
  { label: "Settings", icon: Settings, href: "#" },
];

const MEMBER_FILTERS: { id: MembersNavSection; label: string; color: string }[] = [
  { id: "all", label: "All Members", color: "bg-white/20" },
  { id: "active", label: "Active", color: "bg-emerald-400/20" },
  { id: "inactive", label: "Inactive", color: "bg-amber-400/20" },
  { id: "suspended", label: "Suspended", color: "bg-red-400/20" },
  { id: "alumni", label: "Alumni", color: "bg-purple-400/20" },
];

export function MembersSidebar({
  activeSection,
  onSelectSection,
  onAddMember,
  totalCounts,
  className = "",
  onCloseMobile,
}: MembersSidebarProps) {
  const handleSelect = (section: MembersNavSection) => {
    onSelectSection(section);
    onCloseMobile?.();
  };

  return (
    <aside
      className={cn(
        "w-60 lg:w-64 shrink-0 bg-[#2264e5] text-white flex flex-col justify-between p-6 select-none rounded-tr-[36px] md:rounded-tr-[40px] shadow-sm",
        className
      )}
    >
      {/* Top Section */}
      <div className="flex flex-col gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3 pt-1">
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">President</p>
            <p className="text-[10px] text-blue-200 font-medium">Dashboard</p>
          </div>
        </div>

        {/* Add Member Button */}
        <button
          onClick={onAddMember}
          type="button"
          className="w-full bg-white hover:bg-blue-50 text-[#2264e5] font-semibold text-sm py-3 px-5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group active:scale-[0.98] cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-[#2264e5] group-hover:scale-110 transition-transform duration-200" />
          <span>Add Member</span>
        </button>

        {/* Members Filter Nav */}
        <nav className="flex flex-col gap-1">
          <p className="text-[10px] font-bold tracking-widest text-blue-200/70 uppercase px-3 mb-1">
            Members
          </p>
          {MEMBER_FILTERS.map(({ id, label, color }) => {
            const isActive = activeSection === id;
            const count = totalCounts[id];
            return (
              <button
                key={id}
                onClick={() => handleSelect(id)}
                type="button"
                className={cn(
                  "flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer",
                  isActive
                    ? "bg-white/20 text-white font-semibold shadow-inner"
                    : "text-blue-100/85 hover:bg-white/10 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <Users className={cn("w-4 h-4", isActive ? "text-white" : "text-blue-200")} />
                  <span>{label}</span>
                </div>
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center",
                    isActive ? "bg-white text-[#2264e5]" : "bg-white/15 text-blue-100"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Other Nav Links */}
        <nav className="flex flex-col gap-1">
          <p className="text-[10px] font-bold tracking-widest text-blue-200/70 uppercase px-3 mb-1">
            Navigation
          </p>
          {TOP_NAV.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-100/85 hover:bg-white/10 hover:text-white transition-colors text-left cursor-pointer group"
            >
              <Icon className="w-4 h-4 text-blue-200" />
              <span>{label}</span>
              <ChevronRight className="w-3 h-3 ml-auto text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Sign Out */}
      <div className="pt-6 border-t border-white/15">
        <button
          type="button"
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-blue-100/85 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-blue-200" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
