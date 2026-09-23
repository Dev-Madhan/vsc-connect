"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Search, SlidersHorizontal, Images, Film, Layers, Trophy } from "lucide-react";
import {
  CardsFolderGrid,
  DEFAULT_GALLERY_FOLDERS,
  type GalleryFolderItem,
} from "@/components/public/cards-folder";
import { GalleryAlbumLightbox } from "@/components/public/gallery-album-lightbox";

const CATEGORIES = [
  { id: "ALL", label: "All Archives", icon: Layers },
  { id: "Cultural", label: "Cultural & ProNites", icon: Sparkles },
  { id: "Technical", label: "Tech & Hackathons", icon: Trophy },
  { id: "Fests", label: "Annual Fests", icon: Film },
  { id: "Behind the Scenes", label: "Behind the Scenes", icon: Images },
];

export function GalleryArchiveView() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryFolderItem | null>(null);

  const filteredFolders = useMemo(() => {
    return DEFAULT_GALLERY_FOLDERS.filter((item) => {
      const matchesCategory =
        activeCategory === "ALL" || item.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.event.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.date.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen pb-24 bg-[#FAF9F6] dark:bg-[#0B0F17] text-foreground transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#5B50E5]/15 via-[#818cf8]/5 to-transparent blur-3xl opacity-60 dark:opacity-30" />
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/10 to-transparent blur-3xl opacity-50 dark:opacity-20" />
        <div className="absolute top-2/3 -right-40 w-[500px] h-[500px] bg-gradient-to-l from-indigo-500/10 to-transparent blur-3xl opacity-50 dark:opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14">
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5B50E5]/10 text-[#5B50E5] dark:text-[#A78BFA] text-xs font-semibold uppercase tracking-wider mb-4 border border-[#5B50E5]/20 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Media Archive & Vault</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="font-space-grotesk text-3xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight"
          >
            Life at <span className="bg-gradient-to-r from-[#5B50E5] via-[#818CF8] to-[#EC4899] bg-clip-text text-transparent">Vistara</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.16 }}
            className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            Hover each folder to reveal the signature 3D artwork and explore photographic archives of campus hackathons, cultural spectacles, and late-night backstage prep.
          </motion.p>

          {/* Quick Stats Banner */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22 }}
            className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 px-6 py-2.5 rounded-2xl bg-card/60 backdrop-blur-md border border-border/60 text-xs font-medium text-muted-foreground shadow-sm"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-foreground font-mono">6</span> Active Albums
            </div>
            <div className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-foreground font-mono">280+</span> High-Res Photos
            </div>
            <div className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#5B50E5]">4K</span> Original Vault
            </div>
          </motion.div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-border/50">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-card/80 backdrop-blur-md border border-border/60 shadow-sm">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#5B50E5] text-white shadow-sm shadow-[#5B50E5]/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search albums, events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-card/80 backdrop-blur-md border border-border/60 text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-[#5B50E5]/40 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground font-mono"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* The Signature Cards Folder Grid */}
        {filteredFolders.length > 0 ? (
          <CardsFolderGrid
            items={filteredFolders}
            onCardClick={(item) => setSelectedAlbum(item)}
          />
        ) : (
          <div className="text-center py-20 bg-card/40 rounded-3xl border border-dashed border-border/80">
            <SlidersHorizontal className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-foreground">No albums found</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your category filter or search query.
            </p>
            <button
              onClick={() => {
                setActiveCategory("ALL");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-1.5 rounded-full bg-[#5B50E5] text-white text-xs font-semibold hover:bg-[#5B50E5]/90 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      <GalleryAlbumLightbox
        album={selectedAlbum}
        onClose={() => setSelectedAlbum(null)}
      />
    </div>
  );
}
