"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp, Sparkles } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border/50 bg-card/60 backdrop-blur-md pt-16 pb-12 text-muted-foreground text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-border/40">
          {/* Col 1 & 2: Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-foreground font-black text-lg tracking-tight">
              <span className="w-8 h-8 rounded-xl bg-[#5B50E5] text-white flex items-center justify-center text-sm shadow-md shadow-[#5B50E5]/20 font-sans">
                V
              </span>
              <span className="font-space-grotesk tracking-widest uppercase">Vistara Connect</span>
            </div>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              The official centralized operating platform of Vistara Student Club. Managing members, events, automated On-Duty letters, and creative wings with enterprise precision.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#5B50E5] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Digital Transformation in Student Governance</span>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Navigation</h4>
            <ul className="space-y-2 font-medium">
              <li><Link href="#about" className="hover:text-foreground transition-colors">About Vistara</Link></li>
              <li><Link href="#sub-clubs" className="hover:text-foreground transition-colors">7 Sub-Clubs</Link></li>
              <li><Link href="#events" className="hover:text-foreground transition-colors">Event Calendar</Link></li>
              <li><Link href="#projects" className="hover:text-foreground transition-colors">Student Projects</Link></li>
              <li><Link href="#gallery" className="hover:text-foreground transition-colors">Media Gallery</Link></li>
              <li><Link href="#news" className="hover:text-foreground transition-colors">Latest News</Link></li>
            </ul>
          </div>

          {/* Col 4: Sub-Clubs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Sub-Clubs</h4>
            <ul className="space-y-2 font-medium">
              <li><Link href="#sub-clubs" className="hover:text-foreground transition-colors">Tech Club</Link></li>
              <li><Link href="#sub-clubs" className="hover:text-foreground transition-colors">Music Club</Link></li>
              <li><Link href="#sub-clubs" className="hover:text-foreground transition-colors">Dance Club</Link></li>
              <li><Link href="#sub-clubs" className="hover:text-foreground transition-colors">Media Club</Link></li>
              <li><Link href="#sub-clubs" className="hover:text-foreground transition-colors">Compering Club</Link></li>
              <li><Link href="#sub-clubs" className="hover:text-foreground transition-colors">Fashion & Art</Link></li>
            </ul>
          </div>

          {/* Col 5: Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Portals</h4>
            <ul className="space-y-2 font-medium">
              <li><Link href="/login" className="hover:text-foreground text-[#5B50E5] font-bold transition-colors">Council Login &rarr;</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Executive Dashboard</Link></li>
              <li><Link href="/dashboard/od-documents" className="hover:text-foreground transition-colors">OD PDF Generator</Link></li>
              <li><Link href="#recruitment" className="hover:text-foreground transition-colors">Candidate Applications</Link></li>
              <li><Link href="#contact" className="hover:text-foreground transition-colors">Help & Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-muted-foreground">
            &copy; {new Date().getFullYear()} Vistara Student Club. Designed & Engineered with precision by VSC Tech Wing.
          </p>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/70 hover:bg-muted text-foreground text-[11px] font-semibold transition-colors"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
}
