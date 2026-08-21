"use client";

import {
  ShieldCheck,
  Users,
  CalendarDays,
  Images,
  FileText,
  Settings,
  Database,
  UserCog,
  Globe,
  Bell,
  ArrowUpRight,
  AlertCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ─── Palette tokens ───────────────────────────────────────────────────────────
// primary   #5B50E5
// secondary #C7D2FE
// accent    #262626
// neutral   #FAFAFA

// ─── Stats ────────────────────────────────────────────────────────────────────
const STATS = [
  { label: "Total Members",  value: "—", icon: Users,       href: "/dashboard/members" },
  { label: "Active Events",  value: "—", icon: CalendarDays, href: "/dashboard/events" },
  { label: "Gallery Albums", value: "—", icon: Images,       href: "/dashboard/gallery" },
  { label: "OD Documents",   value: "—", icon: FileText,     href: "/dashboard/od-documents" },
];

// ─── Quick actions ────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  {
    label: "Manage Members",
    desc:  "Add, edit, or suspend members across all sub-clubs.",
    icon:  Users,
    href:  "/dashboard/members",
  },
  {
    label: "User Accounts",
    desc:  "Manage login accounts and role assignments.",
    icon:  UserCog,
    href:  "/dashboard/accounts",
  },
  {
    label: "System Data",
    desc:  "View audit logs, settings, and platform health.",
    icon:  Database,
    href:  "/dashboard/system",
  },
  {
    label: "Events",
    desc:  "Create and publish events for all members.",
    icon:  CalendarDays,
    href:  "/dashboard/events",
  },
  {
    label: "Public Website",
    desc:  "Manage news, projects, and public content.",
    icon:  Globe,
    href:  "/dashboard/website",
  },
  {
    label: "Notifications",
    desc:  "Send broadcast or targeted notifications.",
    icon:  Bell,
    href:  "/dashboard/notifications",
  },
  {
    label: "Gallery",
    desc:  "Upload and organise club photo albums.",
    icon:  Images,
    href:  "/dashboard/gallery",
  },
  {
    label: "Settings",
    desc:  "Configure platform-wide club settings.",
    icon:  Settings,
    href:  "/dashboard/settings",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function SuperAdminDashboard() {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          {/* Role badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#5B50E5]/10 text-[#5B50E5] border border-[#C7D2FE] text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
            <ShieldCheck className="w-3 h-3" />
            Super Admin
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#262626] tracking-tight leading-tight">
            System Overview
          </h1>
          <p className="text-sm text-[#262626]/50 mt-1">
            Full platform access — manage all club operations and system settings.
          </p>
        </div>

        {/* Status chip */}
        <div className="inline-flex items-center gap-2 self-start px-4 py-2 bg-white border border-[#C7D2FE] rounded-full text-xs font-semibold text-[#5B50E5] shadow-sm whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5B50E5] animate-pulse" />
          System Online
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, href }) => (
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
            {/* Icon */}
            <div className="w-10 h-10 rounded-xl bg-[#5B50E5]/8 flex items-center justify-center">
              <Icon className="w-5 h-5 text-[#5B50E5]" />
            </div>
            {/* Value */}
            <div>
              <p className="text-2xl font-extrabold text-[#262626]">{value}</p>
              <p className="text-xs font-medium text-[#262626]/50 mt-0.5">{label}</p>
            </div>
            {/* CTA */}
            <div className="flex items-center gap-1 text-xs font-semibold text-[#C7D2FE] group-hover:text-[#5B50E5] transition-colors">
              View all
              <ArrowUpRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>

      {/* ── Info banner ── */}
      <div className="flex items-start gap-3 px-5 py-4 bg-[#5B50E5]/5 border border-[#C7D2FE] rounded-2xl">
        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#5B50E5]" />
        <p className="text-sm text-[#262626]/70">
          <span className="font-semibold text-[#262626]">Live data coming soon.</span>{" "}
          Stats will populate once service calls are wired to each module.
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(({ label, desc, icon: Icon, href }, i) => {
            // Alternate between solid-primary and secondary-tinted cards
            const isPrimary = i === 0;
            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  "group rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200",
                  isPrimary
                    ? "bg-[#5B50E5] text-white hover:bg-[#4a40d4] shadow-[0_4px_20px_rgba(91,80,229,0.25)]"
                    : "bg-white border border-[#C7D2FE]/40 text-[#262626] hover:border-[#5B50E5]/30 hover:shadow-[0_4px_14px_rgba(91,80,229,0.07)]"
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center",
                    isPrimary ? "bg-white/15" : "bg-[#5B50E5]/8"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      isPrimary ? "text-white" : "text-[#5B50E5]"
                    )}
                  />
                </div>
                <div>
                  <p
                    className={cn(
                      "text-sm font-bold leading-tight",
                      isPrimary ? "text-white" : "text-[#262626]"
                    )}
                  >
                    {label}
                  </p>
                  <p
                    className={cn(
                      "text-xs mt-0.5",
                      isPrimary ? "text-white/70" : "text-[#262626]/50"
                    )}
                  >
                    {desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
