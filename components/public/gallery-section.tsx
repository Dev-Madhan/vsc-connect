"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Maximize2, X, Tag } from "lucide-react";

export interface GalleryPhoto {
  id: string;
  title: string;
  category: "Cultural" | "Technical" | "Fests" | "Behind the Scenes";
  event: string;
  date: string;
  gradient: string;
  aspect: "landscape" | "portrait";
}

const GALLERY_ITEMS: GalleryPhoto[] = [
  {
    id: "gal-1",
    title: "Battle of the Bands Grand Finale",
    category: "Cultural",
    event: "Acoustica 2025",
    date: "Nov 2025",
    gradient: "from-purple-900 via-indigo-900 to-black",
    aspect: "landscape",
  },
  {
    id: "gal-2",
    title: "Hackathon 24H Final Pitches",
    category: "Technical",
    event: "HackVistara '25",
    date: "Oct 2025",
    gradient: "from-blue-900 via-slate-900 to-black",
    aspect: "landscape",
  },
  {
    id: "gal-3",
    title: "Choreography Trophy Winning Routine",
    category: "Cultural",
    event: "National Fest Championship",
    date: "Dec 2025",
    gradient: "from-rose-900 via-purple-900 to-black",
    aspect: "portrait",
  },
  {
    id: "gal-4",
    title: "Annual Runway Showcase — Thematic Walk",
    category: "Cultural",
    event: "Vistara Fashion Week",
    date: "Jan 2026",
    gradient: "from-pink-900 via-red-950 to-black",
    aspect: "portrait",
  },
  {
    id: "gal-5",
    title: "Amphitheatre Crowd During Star Night",
    category: "Fests",
    event: "Winter Gala 2025",
    date: "Dec 2025",
    gradient: "from-amber-900 via-stone-900 to-black",
    aspect: "landscape",
  },
  {
    id: "gal-6",
    title: "Cinematography Crew in Action",
    category: "Behind the Scenes",
    event: "Aftermovie Shoots",
    date: "Jan 2026",
    gradient: "from-cyan-900 via-slate-900 to-black",
    aspect: "landscape",
  },
];

export function GallerySection() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [previewPhoto, setPreviewPhoto] = useState<GalleryPhoto | null>(null);

  const filtered = GALLERY_ITEMS.filter((item) => {
    if (activeCategory === "ALL") return true;
    return item.category === activeCategory;
  });

  return (
    <section id="gallery" className="py-20 md:py-28 relative border-t border-border/40 bg-muted/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B50E5]/10 text-[#5B50E5] text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3 h-3" />
              <span>Captured Moments</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              Life at Vistara
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              A visual glimpse into our fests, late-night hack marathons, and backstage energy.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-card border border-border/60 shrink-0">
            {["ALL", "Cultural", "Technical", "Fests", "Behind the Scenes"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-[#5B50E5] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat === "ALL" ? "All Moments" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Masonry / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((photo, idx) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.07 }}
              onClick={() => setPreviewPhoto(photo)}
              className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer border border-border/50 shadow-sm hover:shadow-xl transition-all"
            >
              {/* Aesthetic dynamic gradient canvas */}
              <div className={`absolute inset-0 bg-gradient-to-tr ${photo.gradient} group-hover:scale-105 transition-transform duration-500`} />

              {/* Texture overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Maximize Icon */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-black/40 backdrop-blur-md text-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4" />
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
                    {photo.category}
                  </span>
                  <span className="text-[11px] text-white/70">{photo.date}</span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-[#a78bfa] transition-colors line-clamp-1">
                  {photo.title}
                </h4>
                <p className="text-xs text-white/70 mt-0.5">{photo.event}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {previewPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-3xl border border-white/20 bg-[#0F172A] text-white p-6 sm:p-8 shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={() => setPreviewPhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className={`w-full h-80 rounded-2xl bg-gradient-to-tr ${previewPhoto.gradient} flex items-center justify-center relative shadow-inner mb-6`}>
                <div className="text-center p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 max-w-sm">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#a78bfa]">
                    {previewPhoto.event}
                  </span>
                  <h3 className="text-xl font-bold mt-1 text-white">{previewPhoto.title}</h3>
                  <p className="text-xs text-white/70 mt-1">{previewPhoto.date} &bull; Vistara Official Archive</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#a78bfa]" />
                  <span className="text-xs font-medium text-white/70">Category: {previewPhoto.category}</span>
                </div>
                <span className="text-xs text-white/50">Cloudflare R2 Encrypted Media Store</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
