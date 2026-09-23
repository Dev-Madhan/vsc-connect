"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, X, ArrowRight, Trash2, Calendar, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SavedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedCount?: number;
  onUpdateCount?: (count: number) => void;
}

interface SavedItem {
  id: string;
  title: string;
  type: "Event" | "Club";
  dateOrMembers: string;
  locationOrCategory: string;
  href: string;
}

const INITIAL_SAVED_ITEMS: SavedItem[] = [
  {
    id: "saved-1",
    title: "HackVistara 2026: 24H Full-Stack Sprint",
    type: "Event",
    dateOrMembers: "March 28, 2026",
    locationOrCategory: "Campus Tech Arena",
    href: "/events",
  },
  {
    id: "saved-2",
    title: "Tech Club: Software & AI",
    type: "Club",
    dateOrMembers: "115+ Members",
    locationOrCategory: "Engineering & Systems",
    href: "/#sub-clubs",
  },
  {
    id: "saved-3",
    title: "SoundWave Acoustic Night",
    type: "Event",
    dateOrMembers: "April 12, 2026",
    locationOrCategory: "Open Air Amphitheater",
    href: "/events",
  },
];

export function SavedDrawer({ isOpen, onClose, onUpdateCount }: SavedDrawerProps) {
  const [savedItems, setSavedItems] = useState<SavedItem[]>(INITIAL_SAVED_ITEMS);

  useEffect(() => {
    onUpdateCount?.(savedItems.length);
  }, [savedItems, onUpdateCount]);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const removeItem = (id: string) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 top-[52px] z-40 bg-black/40 backdrop-blur-[2px]"
          />

          {/* Slide-over Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[52px] right-0 bottom-0 z-50 w-full sm:w-[460px] bg-[#FDFCFB] dark:bg-[#111317] border-l border-[#231F20]/10 dark:border-white/10 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#231F20]/10 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#231F20]/70 dark:text-white/70">
                  Saved Bookmarks
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#231F20]/10 dark:bg-white/10 font-medium">
                  {savedItems.length}
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close saved drawer"
                className="p-1 text-[#231F20] dark:text-white hover:opacity-60 transition-opacity"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#231F20]/5 dark:divide-white/5">
              {savedItems.length === 0 ? (
                <div className="py-20 text-center">
                  <Bookmark className="w-8 h-8 mx-auto text-[#231F20]/30 dark:text-white/30 stroke-[1.2] mb-3" />
                  <p className="text-[14px] text-[#231F20]/70 dark:text-white/70 font-medium">
                    No saved items yet
                  </p>
                  <p className="text-[12px] text-[#231F20]/50 dark:text-white/50 mt-1 max-w-[240px] mx-auto">
                    Save events and sub-clubs to follow upcoming dates and verify your OD passes.
                  </p>
                  <Link
                    href="/events"
                    onClick={onClose}
                    className="inline-block mt-5 text-[12px] font-semibold uppercase tracking-wider text-[#5B50E5] hover:underline"
                  >
                    Browse Events →
                  </Link>
                </div>
              ) : (
                savedItems.map((item) => (
                  <div key={item.id} className="py-4 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5B50E5] dark:text-[#8B5CF6] block mb-1">
                        {item.type}
                      </span>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="text-[14px] font-medium text-[#231F20] dark:text-white hover:underline line-clamp-1"
                      >
                        {item.title}
                      </Link>
                      <div className="flex items-center gap-3 text-[12px] text-[#231F20]/60 dark:text-white/60 mt-1">
                        <span>{item.dateOrMembers}</span>
                        <span>•</span>
                        <span>{item.locationOrCategory}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove saved item"
                      className="p-1.5 text-[#231F20]/40 hover:text-red-600 dark:text-white/40 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 stroke-[1.5]" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Actions */}
            {savedItems.length > 0 && (
              <div className="p-6 border-t border-[#231F20]/10 dark:border-white/10 space-y-3">
                <Link
                  href="/events"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#231F20] text-[#FDFCFB] dark:bg-white dark:text-[#231F20] text-[12px] font-semibold uppercase tracking-[0.15em] hover:opacity-90 transition-opacity"
                >
                  <span>Explore All Events</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
