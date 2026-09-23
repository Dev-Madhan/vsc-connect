"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowRight, ShieldCheck } from "lucide-react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRIMARY_LINKS = [
  { label: "Home", href: "/", sub: "VSC Connect Portal" },
  { label: "Clubs", href: "/sub-clubs", sub: "Explore All 7 Sub-Clubs" },
  { label: "Gallery", href: "/gallery", sub: "Event Highlights & Photo Archives" },
  { label: "Recruitment", href: "/recruitment", sub: "Join Core Teams & Wings" },
];

const SUB_CLUBS_QUICK = [
  { label: "Tech Club", href: "/sub-clubs#tech" },
  { label: "Music Club", href: "/sub-clubs#music" },
  { label: "Dance Club", href: "/sub-clubs#dance" },
  { label: "Media Club", href: "/sub-clubs#media" },
  { label: "Compering Club", href: "/sub-clubs#compering" },
  { label: "Fashion Club", href: "/sub-clubs#fashion" },
  { label: "Art Club", href: "/sub-clubs#art" },
];

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 top-[52px] z-40 bg-black/40 backdrop-blur-[2px] md:hidden"
          />

          {/* Full Screen Drawer beneath 52px top bar */}
          <motion.nav
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-[52px] bottom-0 z-50 bg-[#FDFCFB] dark:bg-[#111317] flex flex-col md:hidden overflow-y-auto border-t border-[#231F20]/10 dark:border-white/10"
          >
            {/* Primary Navigation Links */}
            <div className="px-6 py-4 divide-y divide-[#231F20]/5 dark:divide-white/5">
              {PRIMARY_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between py-4 group hover:opacity-75 transition-opacity"
                >
                  <div>
                    <div className="text-[16px] font-semibold text-[#231F20] dark:text-white">
                      {item.label}
                    </div>
                    <div className="text-[12px] text-[#231F20]/50 dark:text-white/50">
                      {item.sub}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#231F20]/30 dark:text-white/30 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </div>

            {/* Quick Sub-Clubs Directory */}
            <div className="px-6 py-4 bg-[#231F20]/[0.02] dark:bg-white/[0.02] border-t border-b border-[#231F20]/5 dark:border-white/5">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#231F20]/50 dark:text-white/50 block mb-3">
                Sub-Club Wings
              </span>
              <div className="flex flex-wrap gap-2">
                {SUB_CLUBS_QUICK.map((sc) => (
                  <Link
                    key={sc.label}
                    href={sc.href}
                    onClick={onClose}
                    className="px-3 py-1 rounded-full border border-[#231F20]/15 dark:border-white/15 text-[12px] text-[#231F20] dark:text-white hover:border-[#231F20] transition-colors"
                  >
                    {sc.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 mt-auto space-y-3">
              <Link
                href="/login"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#231F20] text-[#FDFCFB] dark:bg-white dark:text-[#231F20] text-[12px] font-semibold uppercase tracking-[0.15em] hover:opacity-90 transition-opacity"
              >
                <span>Sign In / Member Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
