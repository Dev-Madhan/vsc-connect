"use client";

import {
  Crown,
  Users,
  CalendarDays,
  Images,
  FileText,
  Globe,
  Bell,
  Settings,
  ArrowUpRight,
  Zap,
  Plus,
  Send,
  Megaphone,
  Newspaper,
  BadgeDollarSign,
  Phone,
  UserX,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminDashboardStats {
  totalMembers: number;
  activeMembers: number;
  suspendedMembers: number; // used as proxy for "removal requests"
  draftEvents: number;
  publishedEvents: number;
  upcomingEvents: number;
  totalNews: number;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  eventDate: string; // ISO string
  status: "DRAFT" | "PUBLISHED" | "ONGOING" | "COMPLETED" | "CANCELLED";
  location: string | null;
}

export interface RecentMember {
  id: string;
  firstName: string;
  lastName: string;
  membershipId: string;
  subClubName: string | null;
  createdAt: string; // ISO string
}

export interface AdminDashboardProps {
  stats: AdminDashboardStats;
  upcomingEvents: UpcomingEvent[];
  recentMembers: RecentMember[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const EVENT_STATUS_META: Record<
  UpcomingEvent["status"],
  { label: string; color: string; icon: React.ElementType }
> = {
  DRAFT:     { label: "Draft",     color: "text-amber-600 bg-amber-50 border-amber-200",   icon: Clock },
  PUBLISHED: { label: "Published", color: "text-emerald-600 bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
  ONGOING:   { label: "Ongoing",   color: "text-blue-600 bg-blue-50 border-blue-200",      icon: Zap },
  COMPLETED: { label: "Completed", color: "text-[#262626]/50 bg-[#FAFAFA] border-[#C7D2FE]/40", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", color: "text-red-500 bg-red-50 border-red-200",          icon: AlertTriangle },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminDashboard({
  stats,
  upcomingEvents,
  recentMembers,
}: AdminDashboardProps) {
  // ── Stat cards config ──────────────────────────────────────────────────────
  const STATS = [
    {
      label: "Total Members",
      value: stats.totalMembers,
      sub: `${stats.activeMembers} active`,
      icon: Users,
      href: "/dashboard/members",
      accent: false,
    },
    {
      label: "Upcoming Events",
      value: stats.upcomingEvents,
      sub: `${stats.draftEvents} draft`,
      icon: CalendarDays,
      href: "/dashboard/events",
      accent: false,
    },
    {
      label: "Published Events",
      value: stats.publishedEvents,
      sub: "live on website",
      icon: Send,
      href: "/dashboard/events",
      accent: false,
    },
    {
      label: "Removal Requests",
      value: stats.suspendedMembers,
      sub: "pending review",
      icon: UserX,
      href: "/dashboard/members?filter=suspended",
      accent: stats.suspendedMembers > 0,
    },
  ];

  // ── Primary quick actions ──────────────────────────────────────────────────
  const PRIMARY_ACTIONS = [
    {
      label: "Create Event",
      desc: "Draft a new event for the club.",
      icon: Plus,
      href: "/dashboard/events/new",
      solid: true,
    },
    {
      label: "Publish Draft Events",
      desc: `${stats.draftEvents} event${stats.draftEvents !== 1 ? "s" : ""} waiting to go live.`,
      icon: Send,
      href: "/dashboard/events?filter=draft",
      solid: false,
      badge: stats.draftEvents > 0 ? stats.draftEvents : null,
    },
    {
      label: "Manage Announcements",
      desc: "Send broadcast notifications to all members.",
      icon: Megaphone,
      href: "/dashboard/notifications",
      solid: false,
    },
    {
      label: "View All Members",
      desc: "Browse, edit, and manage member records.",
      icon: Users,
      href: "/dashboard/members",
      solid: false,
    },
  ];

  // ── Website content actions ─────────────────────────────────────────────────
  const WEBSITE_ACTIONS = [
    {
      label: "News & Announcements",
      desc: `${stats.totalNews} published articles`,
      icon: Newspaper,
      href: "/dashboard/website/news",
    },
    {
      label: "Sponsors",
      desc: "Manage sponsor logos and links.",
      icon: BadgeDollarSign,
      href: "/dashboard/website/sponsors",
    },
    {
      label: "Contact Information",
      desc: "Update public contact details.",
      icon: Phone,
      href: "/dashboard/website/contact",
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#5B50E5]/10 text-[#5B50E5] border border-[#C7D2FE] text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
            <Crown className="w-3 h-3" />
            President / Vice President
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#262626] tracking-tight leading-tight">
            Club Dashboard
          </h1>
          <p className="text-sm text-[#262626]/50 mt-1">
            Manage members, events, content, and club operations.
          </p>
        </div>

        {/* Removal requests alert chip — only shown when there are pending ones */}
        {stats.suspendedMembers > 0 && (
          <Link
            href="/dashboard/members?filter=suspended"
            className="inline-flex items-center gap-2 self-start px-4 py-2 bg-red-50 border border-red-200 rounded-full text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors whitespace-nowrap"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            {stats.suspendedMembers} removal request
            {stats.suspendedMembers !== 1 ? "s" : ""} pending
          </Link>
        )}
      </div>

      {/* ── Stat cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, sub, icon: Icon, href, accent }) => (
          <Link
            key={label}
            href={href}
            className={cn(
              "group rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200",
              accent
                ? "bg-red-50 border border-red-200 hover:border-red-400 hover:shadow-[0_4px_20px_rgba(239,68,68,0.10)]"
                : "bg-white border border-[#C7D2FE]/40 hover:border-[#5B50E5]/40 hover:shadow-[0_4px_20px_rgba(91,80,229,0.08)]"
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                accent ? "bg-red-100" : "bg-[#5B50E5]/8"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5",
                  accent ? "text-red-500" : "text-[#5B50E5]"
                )}
              />
            </div>
            <div>
              <p
                className={cn(
                  "text-2xl font-extrabold",
                  accent ? "text-red-600" : "text-[#262626]"
                )}
              >
                {value}
              </p>
              <p className="text-xs font-medium text-[#262626]/50 mt-0.5">
                {label}
              </p>
              <p
                className={cn(
                  "text-[10px] mt-0.5",
                  accent ? "text-red-400" : "text-[#262626]/35"
                )}
              >
                {sub}
              </p>
            </div>
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-semibold transition-colors",
                accent
                  ? "text-red-300 group-hover:text-red-500"
                  : "text-[#C7D2FE] group-hover:text-[#5B50E5]"
              )}
            >
              View all
              <ArrowUpRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>

      {/* ── Primary actions ─────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-4 h-4 text-[#5B50E5]" />
          <h2 className="text-xs font-bold tracking-[0.1em] text-[#262626]/40 uppercase">
            Quick Actions
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRIMARY_ACTIONS.map(({ label, desc, icon: Icon, href, solid, badge }) => (
            <Link
              key={label}
              href={href}
              className={cn(
                "group relative rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200",
                solid
                  ? "bg-[#5B50E5] text-white hover:bg-[#4a40d4] shadow-[0_4px_20px_rgba(91,80,229,0.25)]"
                  : "bg-white border border-[#C7D2FE]/40 text-[#262626] hover:border-[#5B50E5]/30 hover:shadow-[0_4px_14px_rgba(91,80,229,0.07)]"
              )}
            >
              {/* Badge for draft count */}
              {badge != null && (
                <span className="absolute top-3 right-3 min-w-[20px] h-5 px-1.5 rounded-full bg-amber-400 text-[#262626] text-[10px] font-bold flex items-center justify-center">
                  {badge}
                </span>
              )}

              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center",
                  solid ? "bg-white/15" : "bg-[#5B50E5]/8"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4",
                    solid ? "text-white" : "text-[#5B50E5]"
                  )}
                />
              </div>
              <div>
                <p
                  className={cn(
                    "text-sm font-bold leading-tight",
                    solid ? "text-white" : "text-[#262626]"
                  )}
                >
                  {label}
                </p>
                <p
                  className={cn(
                    "text-xs mt-0.5",
                    solid ? "text-white/70" : "text-[#262626]/50"
                  )}
                >
                  {desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Events + Members feed ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Upcoming / Draft Events */}
        <div className="bg-white border border-[#C7D2FE]/40 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#C7D2FE]/30">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-[#5B50E5]" />
              <h3 className="text-sm font-bold text-[#262626]">Events</h3>
            </div>
            <Link
              href="/dashboard/events"
              className="text-xs font-semibold text-[#5B50E5] hover:underline flex items-center gap-0.5"
            >
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center px-6">
              <CalendarDays className="w-8 h-8 text-[#C7D2FE] mb-3" />
              <p className="text-sm font-medium text-[#262626]/50">No events yet</p>
              <Link
                href="/dashboard/events/new"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#5B50E5] hover:underline"
              >
                <Plus className="w-3 h-3" />
                Create your first event
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-[#C7D2FE]/20">
              {upcomingEvents.slice(0, 5).map((event) => {
                const meta = EVENT_STATUS_META[event.status];
                const StatusIcon = meta.icon;
                return (
                  <li key={event.id}>
                    <Link
                      href={`/dashboard/events`}
                      className="flex items-start gap-3 px-5 py-3.5 hover:bg-[#5B50E5]/3 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#5B50E5]/8 flex items-center justify-center shrink-0 mt-0.5">
                        <CalendarDays className="w-3.5 h-3.5 text-[#5B50E5]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#262626] truncate leading-snug group-hover:text-[#5B50E5] transition-colors">
                          {event.title}
                        </p>
                        <p className="text-xs text-[#262626]/40 mt-0.5">
                          {formatDate(event.eventDate)}
                          {event.location && (
                            <> · {event.location}</>
                          )}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0",
                          meta.color
                        )}
                      >
                        <StatusIcon className="w-2.5 h-2.5" />
                        {meta.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Recent Members */}
        <div className="bg-white border border-[#C7D2FE]/40 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#C7D2FE]/30">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#5B50E5]" />
              <h3 className="text-sm font-bold text-[#262626]">Recent Members</h3>
            </div>
            <Link
              href="/dashboard/members"
              className="text-xs font-semibold text-[#5B50E5] hover:underline flex items-center gap-0.5"
            >
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {recentMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center px-6">
              <Users className="w-8 h-8 text-[#C7D2FE] mb-3" />
              <p className="text-sm font-medium text-[#262626]/50">No members yet</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#C7D2FE]/20">
              {recentMembers.slice(0, 5).map((member) => {
                const initials = `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();
                return (
                  <li key={member.id}>
                    <Link
                      href="/dashboard/members"
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#5B50E5]/3 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#5B50E5]/10 flex items-center justify-center shrink-0 text-xs font-bold text-[#5B50E5]">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#262626] truncate leading-snug group-hover:text-[#5B50E5] transition-colors">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-xs text-[#262626]/40 mt-0.5">
                          {member.membershipId}
                          {member.subClubName && (
                            <> · {member.subClubName}</>
                          )}
                        </p>
                      </div>
                      <p className="text-[10px] text-[#262626]/30 shrink-0">
                        {formatDate(member.createdAt)}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* ── Website content management ──────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#5B50E5]" />
            <h2 className="text-xs font-bold tracking-[0.1em] text-[#262626]/40 uppercase">
              Website Content
            </h2>
          </div>
          <Link
            href="/dashboard/website"
            className="text-xs font-semibold text-[#5B50E5] hover:underline flex items-center gap-0.5"
          >
            Manage all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {WEBSITE_ACTIONS.map(({ label, desc, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className={cn(
                "group bg-white border border-[#C7D2FE]/40 rounded-2xl p-5",
                "flex items-center gap-4",
                "hover:border-[#5B50E5]/30 hover:shadow-[0_4px_14px_rgba(91,80,229,0.07)]",
                "transition-all duration-200"
              )}
            >
              <div className="w-10 h-10 rounded-xl bg-[#5B50E5]/8 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-[#5B50E5]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#262626] leading-snug group-hover:text-[#5B50E5] transition-colors">
                  {label}
                </p>
                <p className="text-xs text-[#262626]/40 mt-0.5 truncate">{desc}</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#C7D2FE] group-hover:text-[#5B50E5] transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* ── Bottom nav row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-2">
        {[
          { label: "Gallery",       icon: Images,   href: "/dashboard/gallery" },
          { label: "OD Documents",  icon: FileText,  href: "/dashboard/od-documents" },
          { label: "Notifications", icon: Bell,      href: "/dashboard/notifications" },
          { label: "Settings",      icon: Settings,  href: "/dashboard/settings" },
        ].map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className={cn(
              "group flex items-center gap-3 px-4 py-3 rounded-xl",
              "bg-white border border-[#C7D2FE]/40 text-[#262626]",
              "hover:border-[#5B50E5]/30 hover:bg-[#5B50E5]/3",
              "transition-all duration-150 text-sm font-semibold"
            )}
          >
            <Icon className="w-4 h-4 text-[#5B50E5] shrink-0" />
            {label}
            <ChevronRight className="w-3 h-3 ml-auto text-[#C7D2FE] group-hover:text-[#5B50E5] transition-colors" />
          </Link>
        ))}
      </div>

    </div>
  );
}
