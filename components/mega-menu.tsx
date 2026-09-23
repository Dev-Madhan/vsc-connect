"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code, Music, Sparkles, Camera, Award, ShieldCheck, Calendar, ArrowUpRight } from "lucide-react";

interface MegaMenuProps {
  activeMenu: string | null;
  onClose: () => void;
}

export function MegaMenu({ activeMenu, onClose }: MegaMenuProps) {
  return (
    <AnimatePresence>
      {activeMenu && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onMouseLeave={onClose}
          className="absolute left-0 right-0 top-[52px] w-full bg-[#FDFCFB] dark:bg-[#111317] border-b border-[#231F20]/10 dark:border-white/10 shadow-[0_20px_35px_-10px_rgba(0,0,0,0.06)] z-40"
        >
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8">
            {activeMenu === "Clubs" && (
              <div className="grid grid-cols-12 gap-10">
                {/* Column 1: Sub-Clubs Directory */}
                <div className="col-span-4 space-y-4">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#231F20]/50 dark:text-white/50 block">
                    Sub-Club Wings
                  </span>
                  <div className="space-y-2.5">
                    <Link
                      href="/#sub-clubs"
                      onClick={onClose}
                      className="group flex items-center justify-between text-[14px] text-[#231F20] dark:text-white hover:opacity-70 transition-opacity"
                    >
                      <span className="font-medium">Tech Club</span>
                      <span className="text-[11px] text-[#231F20]/50 dark:text-white/50">Engineering & AI</span>
                    </Link>
                    <Link
                      href="/#sub-clubs"
                      onClick={onClose}
                      className="group flex items-center justify-between text-[14px] text-[#231F20] dark:text-white hover:opacity-70 transition-opacity"
                    >
                      <span className="font-medium">Music Club</span>
                      <span className="text-[11px] text-[#231F20]/50 dark:text-white/50">Bands & Vocals</span>
                    </Link>
                    <Link
                      href="/#sub-clubs"
                      onClick={onClose}
                      className="group flex items-center justify-between text-[14px] text-[#231F20] dark:text-white hover:opacity-70 transition-opacity"
                    >
                      <span className="font-medium">Dance Club</span>
                      <span className="text-[11px] text-[#231F20]/50 dark:text-white/50">Choreography & Fests</span>
                    </Link>
                    <Link
                      href="/sub-clubs"
                      onClick={onClose}
                      className="group flex items-center justify-between text-[14px] text-[#231F20] dark:text-white hover:opacity-70 transition-opacity"
                    >
                      <span className="font-medium">Media Club</span>
                      <span className="text-[11px] text-[#231F20]/50 dark:text-white/50">Cinematography & Broadcast</span>
                    </Link>
                  </div>
                  <Link
                    href="/sub-clubs"
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-[#5B50E5] hover:underline pt-2"
                  >
                    <span>View all 7 Sub-Clubs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Column 2: Club Resources & Portals */}
                <div className="col-span-4 space-y-4 border-l border-[#231F20]/10 dark:border-white/10 pl-10">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#231F20]/50 dark:text-white/50 block">
                    Leadership & Operations
                  </span>
                  <div className="space-y-3">
                    <Link
                      href="/team"
                      onClick={onClose}
                      className="block p-3 rounded-sm border border-[#231F20]/10 dark:border-white/10 hover:border-[#231F20]/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-[#231F20] dark:text-white">Executive Team & Council</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#231F20]/40 dark:text-white/40" />
                      </div>
                      <p className="text-[11px] text-[#231F20]/60 dark:text-white/60 mt-0.5">
                        President, Vice President, Faculty Advisor, and 7 Sub-Club Secretaries.
                      </p>
                    </Link>
                    <Link
                      href="/recruitment"
                      onClick={onClose}
                      className="block p-3 rounded-sm border border-[#231F20]/10 dark:border-white/10 hover:border-[#231F20]/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-[#231F20] dark:text-white">Sub-Club Recruitment</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#231F20]/40 dark:text-white/40" />
                      </div>
                      <p className="text-[11px] text-[#231F20]/60 dark:text-white/60 mt-0.5">
                        Apply for core committees, technical leads, and coordinators.
                      </p>
                    </Link>
                    <Link
                      href="/projects"
                      onClick={onClose}
                      className="block p-3 rounded-sm border border-[#231F20]/10 dark:border-white/10 hover:border-[#231F20]/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-[#231F20] dark:text-white">Showcase Projects</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#231F20]/40 dark:text-white/40" />
                      </div>
                      <p className="text-[11px] text-[#231F20]/60 dark:text-white/60 mt-0.5">
                        Open-source tools and student-built production applications.
                      </p>
                    </Link>
                  </div>
                </div>

                {/* Column 3: Featured Spotlight */}
                <div className="col-span-4 border-l border-[#231F20]/10 dark:border-white/10 pl-10">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#231F20]/50 dark:text-white/50 block mb-4">
                    Spotlight
                  </span>
                  <div className="p-5 bg-[#231F20]/[0.03] dark:bg-white/[0.03] border border-[#231F20]/10 dark:border-white/10 rounded-sm">
                    <div className="inline-block px-2.5 py-0.5 bg-[#5B50E5]/10 text-[#5B50E5] text-[10px] font-bold uppercase tracking-wider rounded-sm mb-3">
                      Featured Sub-Club
                    </div>
                    <h4 className="text-[15px] font-bold text-[#231F20] dark:text-white">
                      Tech Club: Full-Stack Labs
                    </h4>
                    <p className="text-[12px] text-[#231F20]/60 dark:text-white/60 mt-1 line-clamp-2">
                      Join 115+ student software engineers building scalable infrastructure, AI agents, and web applications for university operations.
                    </p>
                    <Link
                      href="/sub-clubs#tech"
                      onClick={onClose}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#231F20] dark:text-white hover:underline mt-4"
                    >
                      <span>Explore Tech Club</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeMenu === "Events" && (
              <div className="grid grid-cols-12 gap-10">
                {/* Column 1: Event Categories */}
                <div className="col-span-4 space-y-4">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#231F20]/50 dark:text-white/50 block">
                    Campus Gatherings
                  </span>
                  <div className="space-y-2.5">
                    <Link
                      href="/events"
                      onClick={onClose}
                      className="group flex items-center justify-between text-[14px] text-[#231F20] dark:text-white hover:opacity-70 transition-opacity"
                    >
                      <span className="font-medium">Upcoming Events</span>
                      <span className="text-[11px] text-[#231F20]/50 dark:text-white/50">Next 30 Days</span>
                    </Link>
                    <Link
                      href="/calendar"
                      onClick={onClose}
                      className="group flex items-center justify-between text-[14px] text-[#231F20] dark:text-white hover:opacity-70 transition-opacity"
                    >
                      <span className="font-medium">Event Calendar</span>
                      <span className="text-[11px] text-[#5B50E5] font-bold">Interactive</span>
                    </Link>
                    <Link
                      href="/events"
                      onClick={onClose}
                      className="group flex items-center justify-between text-[14px] text-[#231F20] dark:text-white hover:opacity-70 transition-opacity"
                    >
                      <span className="font-medium">Hackathons & Sprints</span>
                      <span className="text-[11px] text-[#231F20]/50 dark:text-white/50">24H Competitions</span>
                    </Link>
                    <Link
                      href="/events"
                      onClick={onClose}
                      className="group flex items-center justify-between text-[14px] text-[#231F20] dark:text-white hover:opacity-70 transition-opacity"
                    >
                      <span className="font-medium">Live Music & Open Mics</span>
                      <span className="text-[11px] text-[#231F20]/50 dark:text-white/50">Acoustic Stages</span>
                    </Link>
                    <Link
                      href="/gallery"
                      onClick={onClose}
                      className="group flex items-center justify-between text-[14px] text-[#231F20] dark:text-white hover:opacity-70 transition-opacity"
                    >
                      <span className="font-medium">Past Highlights Gallery</span>
                      <span className="text-[11px] text-[#231F20]/50 dark:text-white/50">Photo Archives</span>
                    </Link>
                  </div>
                </div>

                {/* Column 2: Digital Pass & OD Attendance */}
                <div className="col-span-4 space-y-4 border-l border-[#231F20]/10 dark:border-white/10 pl-10">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#231F20]/50 dark:text-white/50 block">
                    Passes & Verification
                  </span>
                  <div className="p-4 bg-[#231F20]/[0.02] border border-[#231F20]/10 dark:border-white/10 rounded-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-[13px] font-semibold text-[#231F20] dark:text-white">
                        Digital OD Pass Verification
                      </span>
                    </div>
                    <p className="text-[11px] text-[#231F20]/60 dark:text-white/60">
                      All registered participants receive tamper-proof cryptographic QR codes for instant college faculty On-Duty sign-off.
                    </p>
                    <Link
                      href="/events"
                      onClick={onClose}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#5B50E5] hover:underline mt-3"
                    >
                      <span>Check Pass Status →</span>
                    </Link>
                  </div>
                </div>

                {/* Column 3: Flagship Event Card */}
                <div className="col-span-4 border-l border-[#231F20]/10 dark:border-white/10 pl-10">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#231F20]/50 dark:text-white/50 block mb-4">
                    Next Flagship Event
                  </span>
                  <div className="p-5 border border-[#231F20]/15 dark:border-white/15 rounded-sm bg-gradient-to-br from-[#5B50E5]/5 to-transparent">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#5B50E5] mb-2">
                      March 28, 2026 • Campus Tech Arena
                    </div>
                    <h4 className="text-[15px] font-bold text-[#231F20] dark:text-white">
                      HackVistara 2026: 24H Sprint
                    </h4>
                    <p className="text-[12px] text-[#231F20]/60 dark:text-white/60 mt-1">
                      Full-stack engineering marathon with cash prizes, mentor pods, and automated OD clearance.
                    </p>
                    <Link
                      href="/events"
                      onClick={onClose}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#231F20] dark:text-white hover:underline mt-4"
                    >
                      <span>Register for Event</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
