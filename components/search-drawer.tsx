"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowUpRight, Calendar, Users, FileText, Sparkles } from "lucide-react";
import Link from "next/link";

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  category: "Club" | "Event" | "Page" | "Feature";
  description: string;
  href: string;
}

const SEARCHABLE_ITEMS: SearchItem[] = [
  {
    id: "club-tech",
    title: "Tech Club",
    category: "Club",
    description: "Engineering, AI labs, hackathons, and full-stack software development.",
    href: "/#sub-clubs",
  },
  {
    id: "club-music",
    title: "Music Club",
    category: "Club",
    description: "Acoustic open mics, rock bands, vocal training, and studio audio.",
    href: "/#sub-clubs",
  },
  {
    id: "club-dance",
    title: "Dance Club",
    category: "Club",
    description: "Hip-Hop, classical choreography, national fests, and stage showcases.",
    href: "/#sub-clubs",
  },
  {
    id: "club-media",
    title: "Media Club",
    category: "Club",
    description: "Cinematography, campus photojournalism, editing, and live broadcast.",
    href: "/#sub-clubs",
  },
  {
    id: "event-hackvistara",
    title: "HackVistara 2026: 24H Full-Stack Sprint",
    category: "Event",
    description: "Flagship 24-hour hackathon with cash prizes & automated OD verification.",
    href: "/events",
  },
  {
    id: "event-soundwave",
    title: "SoundWave Acoustic Night",
    category: "Event",
    description: "Live vocal & instrumental performances by university bands.",
    href: "/events",
  },
  {
    id: "event-prism",
    title: "PRISM: Short Film & Visual Storytelling Festival",
    category: "Event",
    description: "Screenings of student indie short films and director Q&As.",
    href: "/events",
  },
  {
    id: "page-od",
    title: "On-Duty (OD) Pass Verification",
    category: "Feature",
    description: "Check attendance verification status and generate digital QR OD passes.",
    href: "/events",
  },
  {
    id: "page-recruitment",
    title: "Sub-Club Recruitment 2026",
    category: "Page",
    description: "Apply for leadership roles, core teams, and volunteer tracks.",
    href: "/recruitment",
  },
  {
    id: "page-projects",
    title: "Member Projects & Portfolios",
    category: "Page",
    description: "Discover verified open-source projects built by student developers.",
    href: "/projects",
  },
  {
    id: "page-gallery",
    title: "Media & Event Highlights Gallery",
    category: "Page",
    description: "High-resolution photo archives from annual festivals & showcases.",
    href: "/gallery",
  },
  {
    id: "page-news",
    title: "Club Announcements & Newsfeed",
    category: "Page",
    description: "Official circulars, competition wins, and schedule updates.",
    href: "/news",
  },
];

const SUGGESTED_QUERIES = [
  "HackVistara",
  "Tech Club",
  "OD Pass",
  "Music Club",
  "Recruitment",
  "Projects",
  "Gallery",
];

export function SearchDrawer({ isOpen, onClose }: SearchDrawerProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
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

  const filteredItems = query.trim()
    ? SEARCHABLE_ITEMS.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

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
            className="fixed top-[52px] right-0 bottom-0 z-50 w-full sm:w-[480px] bg-[#FDFCFB] dark:bg-[#111317] border-l border-[#231F20]/10 dark:border-white/10 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#231F20]/10 dark:border-white/10">
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#231F20]/70 dark:text-white/70">
                Search
              </span>
              <button
                onClick={onClose}
                aria-label="Close search"
                className="p-1 text-[#231F20] dark:text-white hover:opacity-60 transition-opacity"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Input Box */}
            <div className="px-6 pt-5 pb-4 border-b border-[#231F20]/10 dark:border-white/10">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 absolute left-0 text-[#231F20]/40 dark:text-white/40 stroke-[1.5]" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What are you looking for?"
                  className="w-full pl-7 pr-8 py-2 text-[15px] bg-transparent text-[#231F20] dark:text-white placeholder-[#231F20]/40 dark:placeholder-white/40 focus:outline-none border-b border-[#231F20]/20 dark:border-white/20 focus:border-[#231F20] dark:focus:border-white transition-colors"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-0 text-xs uppercase tracking-wider text-[#231F20]/50 dark:text-white/50 hover:text-[#231F20] dark:hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Suggestions */}
              {!query && (
                <div className="mt-5">
                  <span className="text-[11px] uppercase tracking-[0.15em] font-semibold text-[#231F20]/50 dark:text-white/50 block mb-2.5">
                    Popular Searches
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_QUERIES.map((item) => (
                      <button
                        key={item}
                        onClick={() => setQuery(item)}
                        className="text-[12px] px-3 py-1 rounded-full border border-[#231F20]/15 dark:border-white/15 text-[#231F20]/80 dark:text-white/80 hover:border-[#231F20] dark:hover:border-white hover:text-[#231F20] dark:hover:text-white transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#231F20]/5 dark:divide-white/5">
              {query && filteredItems.length === 0 && (
                <div className="py-12 text-center text-[#231F20]/50 dark:text-white/50 text-[14px]">
                  No results found for &ldquo;{query}&rdquo;
                </div>
              )}

              {filteredItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  className="group block py-3.5 hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5B50E5] dark:text-[#8B5CF6]">
                      {item.category}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#231F20]/40 dark:text-white/40 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <h4 className="text-[14px] font-medium text-[#231F20] dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-[12px] text-[#231F20]/60 dark:text-white/60 line-clamp-1 mt-0.5">
                    {item.description}
                  </p>
                </Link>
              ))}

              {!query && (
                <div className="pt-4 space-y-4">
                  <span className="text-[11px] uppercase tracking-[0.15em] font-semibold text-[#231F20]/50 dark:text-white/50 block">
                    Quick Navigation
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/#sub-clubs"
                      onClick={onClose}
                      className="p-3 border border-[#231F20]/10 dark:border-white/10 rounded-sm hover:border-[#231F20]/40 dark:hover:border-white/40 transition-colors"
                    >
                      <Users className="w-4 h-4 mb-2 text-[#231F20]/70 dark:text-white/70" />
                      <div className="text-[13px] font-medium text-[#231F20] dark:text-white">Explore Clubs</div>
                      <div className="text-[11px] text-[#231F20]/50 dark:text-white/50">7 Active Wings</div>
                    </Link>
                    <Link
                      href="/events"
                      onClick={onClose}
                      className="p-3 border border-[#231F20]/10 dark:border-white/10 rounded-sm hover:border-[#231F20]/40 dark:hover:border-white/40 transition-colors"
                    >
                      <Calendar className="w-4 h-4 mb-2 text-[#231F20]/70 dark:text-white/70" />
                      <div className="text-[13px] font-medium text-[#231F20] dark:text-white">Upcoming Events</div>
                      <div className="text-[11px] text-[#231F20]/50 dark:text-white/50">Fests & Talks</div>
                    </Link>
                    <Link
                      href="/projects"
                      onClick={onClose}
                      className="p-3 border border-[#231F20]/10 dark:border-white/10 rounded-sm hover:border-[#231F20]/40 dark:hover:border-white/40 transition-colors"
                    >
                      <FileText className="w-4 h-4 mb-2 text-[#231F20]/70 dark:text-white/70" />
                      <div className="text-[13px] font-medium text-[#231F20] dark:text-white">Showcase Projects</div>
                      <div className="text-[11px] text-[#231F20]/50 dark:text-white/50">Student Portfolios</div>
                    </Link>
                    <Link
                      href="/recruitment"
                      onClick={onClose}
                      className="p-3 border border-[#231F20]/10 dark:border-white/10 rounded-sm hover:border-[#231F20]/40 dark:hover:border-white/40 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 mb-2 text-[#231F20]/70 dark:text-white/70" />
                      <div className="text-[13px] font-medium text-[#231F20] dark:text-white">Join the Club</div>
                      <div className="text-[11px] text-[#231F20]/50 dark:text-white/50">Applications Open</div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-[#231F20]/10 dark:border-white/10 text-[11px] text-[#231F20]/50 dark:text-white/50 flex justify-between items-center">
              <span>Press ESC to close</span>
              <span>VSC Connect</span>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
