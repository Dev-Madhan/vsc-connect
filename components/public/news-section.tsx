"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Sparkles, X, ArrowRight, User } from "lucide-react";

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  date: string;
  author: string;
  category: string;
  snippet: string;
  content: string;
}

const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "news-1",
    title: "Vistara Connect Platform Officially Launched for Spring 2026",
    slug: "vsc-connect-launch-2026",
    date: "March 10, 2026",
    author: "Madhan S. (President)",
    category: "Club Announcement",
    snippet: "Replacing manual paperwork with unified member databases, instant On-Duty generation, and automated role-based portals.",
    content: "The executive committee is thrilled to announce the official deployment of VSC Connect. Designed and developed from the ground up by the Tech Club and Executive Council, the platform centralizes member rosters across all seven sub-clubs, automates official OD document generation with faculty signatures, and tracks attendance seamlessly across internal workshops and inter-collegiate events.",
  },
  {
    id: "news-2",
    title: "Choreography Wing Clinches Overall Championship at National Fest",
    slug: "dance-championship-national-fest",
    date: "February 24, 2026",
    author: "Harizith R. (Secretary)",
    category: "Achievement",
    snippet: "Competing against 28 premier universities, the 24-member dance contingent brought home the trophy and ₹50,000 cash prize.",
    content: "The Vistara Dance Club delivered a breathtaking 12-minute fusion choreography piece blending Indian semi-classical mudras with aggressive urban hip-hop beats, securing a unanimous first place from festival judges. Hearty congratulations to the performers and choreographers who put in over 150 hours of intensive rehearsal.",
  },
  {
    id: "news-3",
    title: "Auditions Announced: Spring Recruitment for 7 Sub-Clubs",
    slug: "spring-auditions-announcement-2026",
    date: "March 02, 2026",
    author: "Mukesh K. (Vice President)",
    category: "Recruitment",
    snippet: "Open auditions across Technical, Music, Dance, Media, Compering, Fashion, and Fine Arts departments. Apply online today.",
    content: "Are you ready to showcase your passion and build leadership skills? Vistara Student Club is opening recruitments for first, second, and third-year students. Auditions will be hosted in dedicated slots across three days. Apply through the online portal on this website to receive your audition docket and venue details.",
  },
];

export function NewsSection() {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  return (
    <section id="news" className="py-20 md:py-28 relative border-t border-border/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B50E5]/10 text-[#5B50E5] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3" />
            <span>Club Dispatches</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Latest News & Bulletins
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Stay updated with achievements, upcoming audition calls, and event announcements.
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NEWS_ARTICLES.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-7 rounded-3xl border border-border/60 bg-card/70 hover:border-[#5B50E5]/50 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3 text-xs text-muted-foreground">
                  <span className="font-bold px-2.5 py-0.5 rounded-full bg-[#5B50E5]/10 text-[#5B50E5] uppercase text-[10px]">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    <span>{article.date}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-foreground group-hover:text-[#5B50E5] transition-colors line-clamp-2">
                  {article.title}
                </h3>

                <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {article.snippet}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <User className="w-3.5 h-3.5 text-[#5B50E5]" />
                  <span className="truncate max-w-[140px]">{article.author}</span>
                </div>
                <button
                  onClick={() => setSelectedArticle(article)}
                  className="text-xs font-bold text-[#5B50E5] hover:text-[#4C40D4] inline-flex items-center gap-1"
                >
                  <span>Read Story</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Read Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#5B50E5]/10 text-[#5B50E5]">
                  {selectedArticle.category}
                </span>
                <h3 className="text-2xl font-bold text-foreground mt-2">{selectedArticle.title}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                  <span>By {selectedArticle.author}</span>
                  <span>&bull;</span>
                  <span>{selectedArticle.date}</span>
                </div>
              </div>

              <div className="prose prose-sm dark:prose-invert mt-6 pt-4 border-t border-border/50 text-sm leading-relaxed text-muted-foreground">
                <p>{selectedArticle.content}</p>
              </div>

              <div className="mt-8 pt-4 border-t border-border/50 flex justify-end">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2 rounded-xl bg-muted text-foreground text-xs font-bold hover:bg-muted/80 transition-colors"
                >
                  Close Article
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
