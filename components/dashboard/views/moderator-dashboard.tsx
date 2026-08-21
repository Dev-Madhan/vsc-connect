"use client";

import {
  UserCog,
  Users,
  CalendarDays,
  Images,
  FileText,
  ArrowUpRight,
  Info,
  Zap,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ModeratorDashboardStats {
  totalMembers: number;
  activeMembers: number;
}

export interface ModeratorDashboardProps {
  subClubName: string;
  subClubSlug: string | null;
  stats?: ModeratorDashboardStats;
}

// ─── Quick actions ────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: "Sub-Club Members", desc: "View and manage members of your sub-club.",  icon: Users,        href: "/dashboard/members",      solid: true },
  { label: "Add Member",       desc: "Register a new member to your sub-club.",    icon: UserPlus,     href: "/dashboard/members",      solid: false },
  { label: "Events",           desc: "Create and manage sub-club events.",         icon: CalendarDays,  href: "/dashboard/events",       solid: false },
  { label: "Gallery",          desc: "Upload and manage sub-club photos.",         icon: Images,        href: "/dashboard/gallery",      solid: false },
  { label: "OD Documents",     desc: "Issue On-Duty letters for your members.",    icon: FileText,      href: "/dashboard/od-documents", solid: false },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function ModeratorDashboard({ subClubName, stats }: ModeratorDashboardProps) {
  const statCards = [
    {
      label: "Sub-Club Members",
      value: stats?.totalMembers ?? "—",
      sub: stats ? `${stats.activeMembers} active` : undefined,
      icon: Users,
      href: "/dashboard/members",
    },
    {
      label: "Events",
      value: "—",
      icon: CalendarDays,
      href: "/dashboard/events",
    },
    {
      label: "Gallery Albums",
      value: "—",
      icon: Images,
      href: "/dashboard/gallery",
    },
    {
      label: "OD Documents",
      value: "—",
      icon: FileText,
      href: "/dashboard/od-documents",
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div>
        <div className="inline-flex items-center gap-1.5 bg-[#5B50E5]/10 text-[#5B50E5] border border-[#C7D2FE] text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
          <UserCog className="w-3 h-3" />
          Sub-Club Secretary
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#262626] tracking-tight leading-tight">
          {subClubName}
        </h1>
        <p className="text-sm text-[#262626]/50 mt-1">
          Manage your sub-club members, events, gallery, and OD documents.
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, sub, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className={cn(
              "group bg-white border border-[#C7D2FE]/40 rounded-2xl p-5",
              "flex flex-col gap-4",
              "hover:border-[#5B50E5]/40 hover:shadow-[0_4px_20px_rgba(91,80,229,0.08)]",
              "transition-all duration-200"
            )}
          >
            <div className="w-10 h-10 rounded-xl bg-[#5B50E5]/8 flex items-center justify-center">
              <Icon className="w-5 h-5 text-[#5B50E5]" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#262626]">{value}</p>
              <p className="text-xs font-medium text-[#262626]/50 mt-0.5">{label}</p>
              {sub && <p className="text-[10px] text-[#262626]/35 mt-0.5">{sub}</p>}
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-[#C7D2FE] group-hover:text-[#5B50E5] transition-colors">
              View all
              <ArrowUpRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>

      {/* ── Scoped access banner ── */}
      <div className="flex items-start gap-3 px-5 py-4 bg-[#5B50E5]/5 border border-[#C7D2FE] rounded-2xl">
        <Info className="w-4 h-4 mt-0.5 shrink-0 text-[#5B50E5]" />
        <p className="text-sm text-[#262626]/70">
          <span className="font-semibold text-[#262626]">Scoped access active.</span>{" "}
          You can only view and manage data belonging to{" "}
          <span className="font-semibold text-[#5B50E5]">{subClubName}</span>.
          Contact the President or VP for cross-club operations.
        </p>
      </div>

      {/* ── Quick actions ── */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-4 h-4 text-[#5B50E5]" />
          <h2 className="text-xs font-bold tracking-[0.1em] text-[#262626]/40 uppercase">
            Quick Actions
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map(({ label, desc, icon: Icon, href, solid }) => (
            <Link
              key={label}
              href={href}
              className={cn(
                "group rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200",
                solid
                  ? "bg-[#5B50E5] text-white hover:bg-[#4a40d4] shadow-[0_4px_20px_rgba(91,80,229,0.25)]"
                  : "bg-white border border-[#C7D2FE]/40 text-[#262626] hover:border-[#5B50E5]/30 hover:shadow-[0_4px_14px_rgba(91,80,229,0.07)]"
              )}
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center",
                  solid ? "bg-white/15" : "bg-[#5B50E5]/8"
                )}
              >
                <Icon className={cn("w-4 h-4", solid ? "text-white" : "text-[#5B50E5]")} />
              </div>
              <div>
                <p className={cn("text-sm font-bold leading-tight", solid ? "text-white" : "text-[#262626]")}>
                  {label}
                </p>
                <p className={cn("text-xs mt-0.5", solid ? "text-white/70" : "text-[#262626]/50")}>
                  {desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
