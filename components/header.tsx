"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { MegaMenu } from "@/components/mega-menu";

export const navLinks = [
  { label: "Home", href: "/", hasMega: false },
  { label: "Clubs", href: "/sub-clubs", hasMega: true },
  { label: "Gallery", href: "/gallery", hasMega: false },
  { label: "Recruitment", href: "/recruitment", hasMega: false },
];

function BrandCrest({ className = "h-7 sm:h-8 w-auto" }: { className?: string }) {
  return (
    <img
      src="/vsc-mask.png"
      alt="VSC"
      className={`object-contain dark:invert select-none ${className}`}
    />
  );
}

function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="w-4 h-3.5 relative flex flex-col justify-between items-center cursor-pointer">
      <span
        className={`w-4 h-[1.5px] bg-[#121212] dark:bg-white transition-all duration-300 ease-in-out ${isOpen ? "rotate-45 translate-y-[6px]" : ""
          }`}
      />
      <span
        className={`w-4 h-[1.5px] bg-[#121212] dark:bg-white transition-all duration-200 ease-in-out ${isOpen ? "opacity-0 scale-x-0" : "opacity-100"
          }`}
      />
      <span
        className={`w-4 h-[1.5px] bg-[#121212] dark:bg-white transition-all duration-300 ease-in-out ${isOpen ? "-rotate-45 -translate-y-[6px]" : ""
          }`}
      />
    </div>
  );
}

export function Header() {
  const pathname = usePathname();

  // State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveMegaMenu(null);
  }, [pathname]);

  const handleLinkMouseEnter = (label: string, hasMega: boolean) => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
    }
    setHoveredLink(label);
    if (hasMega) {
      setActiveMegaMenu(label);
    } else {
      setActiveMegaMenu(null);
    }
  };

  const handleNavMouseLeave = () => {
    setHoveredLink(null);
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 150);
  };

  return (
    <div className="fixed top-4 sm:top-5 left-0 right-0 z-50 flex flex-col items-center pointer-events-none px-3 sm:px-4">
      {/* ================= CoolDock FLOATING PILL CAPSULE ================= */}
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 26 }}
        onMouseLeave={handleNavMouseLeave}
        className="pointer-events-auto relative w-full max-w-[690px] h-[52px] rounded-full px-3.5 sm:px-4 flex items-center justify-between bg-gradient-to-b from-white/85 via-[#f6f7f9]/70 to-[#e5e8ed]/65 dark:from-white/[0.14] dark:via-[#141720]/65 dark:to-[#0c0e14]/80 backdrop-blur-2xl backdrop-saturate-[190%] border border-white/80 dark:border-white/[0.14] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.95),inset_0_0_14px_0_rgba(255,255,255,0.35),inset_0_-1.5px_2px_0_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.06),0_12px_32px_-4px_rgba(0,0,0,0.12),0_3px_8px_-1px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.35),inset_0_0_14px_0_rgba(255,255,255,0.05),inset_0_-1.5px_2px_0_rgba(0,0,0,0.6),0_0_0_1px_rgba(0,0,0,0.4),0_16px_36px_-6px_rgba(0,0,0,0.55)] transition-all duration-300"
      >
        {/* LEFT: BRAND LOGO */}
        <Link
          href="/"
          className="flex items-center group pl-1.5 sm:pl-2.5 shrink-0"
          aria-label="VSC Connect Home"
        >
          <BrandCrest className="h-6 sm:h-[28px] w-auto max-h-[30px] group-hover:scale-105 transition-transform duration-200" />
        </Link>

        {/* CENTER: DESKTOP NAV LINKS WITH SPRING PILL HIGHLIGHT */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <div
                key={link.label}
                onMouseEnter={() => handleLinkMouseEnter(link.label, !!link.hasMega)}
                className="relative"
              >
                <Link
                  href={link.href}
                  className={`relative flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[13px] font-medium tracking-tight transition-colors duration-200 z-10 ${isActive
                    ? "text-[#121212] dark:text-white font-semibold"
                    : "text-[#121212]/75 dark:text-white/75 hover:text-[#121212] dark:hover:text-white"
                    }`}
                >
                  <span>{link.label}</span>
                  {link.hasMega && (
                    <ChevronDown
                      className={`w-3 h-3 opacity-60 transition-transform duration-200 ${activeMegaMenu === link.label ? "rotate-180 opacity-100" : ""
                        }`}
                    />
                  )}
                </Link>

                {/* Animated active/hover indicator pill */}
                {isActive && (
                  <motion.div
                    layoutId="cooldock-active-pill"
                    className="absolute inset-0 bg-black/[0.05] dark:bg-white/[0.1] rounded-full z-0 pointer-events-none"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT: CTA BUTTON & MOBILE TOGGLE */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="px-5 py-2 rounded-full text-[12px] font-semibold tracking-tight transition-all duration-200 bg-gradient-to-b from-[#1c1d22] to-[#090a0d] text-white hover:from-[#2a2c34] hover:to-[#111317] dark:bg-white dark:text-black dark:hover:bg-white/90 shadow-[0_2px_10px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
          >
            Login
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="md:hidden p-2 rounded-full bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] transition-colors"
          >
            <HamburgerIcon isOpen={isMobileMenuOpen} />
          </button>
        </div>
      </motion.nav>

      {/* ================= FLOATING MEGA MENU CARD (DESKTOP) ================= */}
      <AnimatePresence>
        {activeMegaMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            onMouseEnter={() => {
              if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
            }}
            onMouseLeave={() => {
              megaMenuTimeoutRef.current = setTimeout(() => {
                setActiveMegaMenu(null);
              }, 150);
            }}
            className="pointer-events-auto mt-2 w-full max-w-[690px] rounded-[26px] bg-white/90 dark:bg-[#12161F]/90 backdrop-blur-2xl border border-white/80 dark:border-white/[0.14] p-5 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.95),0_20px_50px_-10px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.2),0_20px_50px_-10px_rgba(0,0,0,0.6)] z-40"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Left Column: Sub-Clubs Wings */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block px-2">
                  Sub-Club Wings
                </span>
                <div className="space-y-1">
                  {[
                    { title: "Tech Club", desc: "AI, Full-Stack & Robotics", href: "/sub-clubs#tech" },
                    { title: "Music Club", desc: "Acoustics, Vocals & Live Bands", href: "/sub-clubs#music" },
                    { title: "Dance Club", desc: "Choreography & National Fests", href: "/sub-clubs#dance" },
                    { title: "Media Club", desc: "Cinematography & Aftermovies", href: "/sub-clubs#media" },
                  ].map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={() => setActiveMegaMenu(null)}
                      className="group flex items-center justify-between p-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                    >
                      <div>
                        <div className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-muted-foreground">{item.desc}</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-primary" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right Column: Quick Links & Spotlight */}
              <div className="space-y-2 sm:border-l sm:border-black/[0.06] sm:dark:border-white/[0.08] sm:pl-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block px-2">
                  Club Portals
                </span>
                <div className="space-y-1">
                  <Link
                    href="/gallery"
                    onClick={() => setActiveMegaMenu(null)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors group"
                  >
                    <div>
                      <div className="text-[13px] font-semibold text-foreground flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#5B50E5]" />
                        <span>Media Vault (Cards Folder)</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">Browse all 6 photo albums</div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>

                  <Link
                    href="/recruitment"
                    onClick={() => setActiveMegaMenu(null)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors group"
                  >
                    <div>
                      <div className="text-[13px] font-semibold text-foreground">
                        2026 Core Recruitments
                      </div>
                      <div className="text-[11px] text-muted-foreground">Join wings & technical committees</div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>

                  <Link
                    href="/team"
                    onClick={() => setActiveMegaMenu(null)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors group"
                  >
                    <div>
                      <div className="text-[13px] font-semibold text-foreground">
                        Executive Council
                      </div>
                      <div className="text-[11px] text-muted-foreground">Club leadership directory</div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MOBILE FLOATING DRAWER ================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="pointer-events-auto md:hidden mt-2 w-full max-w-[690px] rounded-[26px] bg-white/90 dark:bg-[#12161F]/90 backdrop-blur-2xl border border-white/80 dark:border-white/[0.14] p-4 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.95),0_20px_50px_-10px_rgba(0,0,0,0.2)] dark:shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.2),0_20px_50px_-10px_rgba(0,0,0,0.7)] z-40"
          >
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive
                      ? "bg-black/[0.06] dark:bg-white/[0.1] text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"
                      }`}
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </Link>
                );
              })}

              <div className="pt-2 mt-2 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between gap-2 px-1">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-full bg-gradient-to-b from-[#1c1d22] to-[#090a0d] text-white dark:bg-white dark:text-black text-center text-xs font-bold tracking-tight shadow-md"
                >
                  Member Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
