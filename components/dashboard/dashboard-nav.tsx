"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Images,
  FileText,
  Settings,
  LogOut,
  ShieldCheck,
  Crown,
  UserCog,
  Globe,
  Database,
  Bell,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSessionUser } from "@/lib/session-context";
import { authClient } from "@/lib/auth-client";
import type { RoleEnum } from "@prisma/client";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles?: RoleEnum[];
}

// ─── Nav config ───────────────────────────────────────────────────────────────
const NAV_SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Manage",
    items: [
      {
        label: "Members",
        href: "/dashboard/members",
        icon: Users,
        roles: ["SUPER_ADMIN", "ADMIN", "MODERATOR"],
      },
      {
        label: "Events",
        href: "/dashboard/events",
        icon: CalendarDays,
        roles: ["SUPER_ADMIN", "ADMIN", "MODERATOR"],
      },
      {
        label: "Gallery",
        href: "/dashboard/gallery",
        icon: Images,
        roles: ["SUPER_ADMIN", "ADMIN", "MODERATOR"],
      },
      {
        label: "OD Documents",
        href: "/dashboard/od-documents",
        icon: FileText,
        roles: ["SUPER_ADMIN", "ADMIN", "MODERATOR"],
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        label: "Public Website",
        href: "/dashboard/website",
        icon: Globe,
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        label: "Notifications",
        href: "/dashboard/notifications",
        icon: Bell,
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        label: "System Data",
        href: "/dashboard/system",
        icon: Database,
        roles: ["SUPER_ADMIN"],
      },
      {
        label: "User Accounts",
        href: "/dashboard/accounts",
        icon: UserCog,
        roles: ["SUPER_ADMIN"],
      },
      {
        label: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },
];

// ─── Role pill ────────────────────────────────────────────────────────────────
const ROLE_META: Record<RoleEnum, { icon: React.ElementType; label: string }> = {
  SUPER_ADMIN: { icon: ShieldCheck, label: "Super Admin" },
  ADMIN:       { icon: Crown,       label: "President / VP" },
  MODERATOR:   { icon: UserCog,     label: "Secretary" },
  USER:        { icon: Users,       label: "Member" },
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface DashboardNavProps {
  className?: string;
  onCloseMobile?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function DashboardNav({ className, onCloseMobile }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useSessionUser();

  const meta = ROLE_META[user.role];
  const RoleIcon = meta.icon;

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <aside
      className={cn(
        // Base: primary colour bg, white text, full height, constrained width
        "w-60 lg:w-64 shrink-0 flex flex-col justify-between",
        "bg-[#5B50E5] text-white",
        "px-4 py-5",
        // Rounded right edge on desktop only
        "md:rounded-r-[2.5rem]",
        className
      )}
    >
      {/* ── Top ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6 min-h-0">

        {/* Brand row */}
        <div className="flex items-center justify-between px-1 pt-1">
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 ring-1 ring-white/20">
              <RoleIcon className="w-4.5 h-4.5 text-[#C7D2FE]" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-snug tracking-tight">
                {user.role === "MODERATOR" && user.subClubName
                  ? user.subClubName
                  : "VSC Connect"}
              </p>
              {/* Role pill */}
              <span className="inline-flex items-center gap-1 mt-0.5 text-[10px] font-semibold tracking-wide text-[#5B50E5] bg-[#C7D2FE] px-2 py-0.5 rounded-full leading-none">
                {meta.label}
              </span>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              aria-label="Close navigation"
              className="p-1.5 rounded-lg text-[#C7D2FE] hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mx-1" />

        {/* Nav sections */}
        <nav className="flex flex-col gap-5 overflow-y-hidden">
          {NAV_SECTIONS.map((section) => {
            const visible = section.items.filter(
              (item) => !item.roles || item.roles.includes(user.role)
            );
            if (visible.length === 0) return null;

            return (
              <div key={section.title} className="flex flex-col gap-0.5">
                <p className="text-[10px] font-bold tracking-[0.12em] text-[#C7D2FE]/60 uppercase px-3 mb-1">
                  {section.title}
                </p>

                {visible.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onCloseMobile}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                        active
                          ? "bg-white text-[#5B50E5] shadow-sm font-semibold"
                          : "text-[#C7D2FE]/80 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0 transition-colors",
                          active ? "text-[#5B50E5]" : "text-[#C7D2FE]/70 group-hover:text-white"
                        )}
                      />
                      <span className="flex-1">{item.label}</span>
                      {!active && (
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </div>

      {/* ── Bottom: profile + sign out ───────────────────────────────────── */}
      <div className="flex flex-col gap-1 pt-4 border-t border-white/10">
        {/* User row */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#C7D2FE]/40 shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#C7D2FE]/20 ring-1 ring-[#C7D2FE]/30 flex items-center justify-center shrink-0 text-xs font-bold text-[#C7D2FE]">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate leading-tight">
              {user.name}
            </p>
            <p className="text-[10px] text-[#C7D2FE]/70 truncate">{user.email}</p>
          </div>
        </div>

        {/* Sign out */}
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[#C7D2FE]/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
