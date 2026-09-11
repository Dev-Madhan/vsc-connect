"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Sponsor {
  name: string;
  category: "Gold Partner" | "Silver Partner" | "Community Partner";
  desc: string;
}

const SPONSORS: Sponsor[] = [
  { name: "Neon Cloud Postgres", category: "Gold Partner", desc: "Serverless Database & Cloud Infrastructure Partner" },
  { name: "Cloudflare Developer Platform", category: "Gold Partner", desc: "Global Edge Network & R2 Media Storage" },
  { name: "Resend Email Suite", category: "Silver Partner", desc: "High-deliverability Transactional Notifications" },
  { name: "Vercel Platform", category: "Silver Partner", desc: "Next.js Edge Deployment & Analytics" },
  { name: "Red Bull Energy", category: "Community Partner", desc: "Official Collegiate Energy & Stage Partner" },
  { name: "Zebronics Audio", category: "Community Partner", desc: "Sound Gear & Fest Stage Acoustics Sponsor" },
];

export function SponsorsSection() {
  return (
    <section className="py-16 md:py-24 border-t border-border/40 bg-muted/20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B50E5]/10 text-[#5B50E5] text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3 h-3" />
          <span>Industry & Campus Partners</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Supported by Visionary Organizations
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
          Our annual workshops, hackathons, and cultural tours are powered by generous corporate and community partners.
        </p>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {SPONSORS.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="p-5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm flex flex-col items-center justify-center text-center group hover:border-[#5B50E5]/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-muted text-foreground flex items-center justify-center font-bold text-xs mb-3 group-hover:bg-[#5B50E5] group-hover:text-white transition-colors">
                {s.name[0]}
              </div>
              <h4 className="text-xs font-bold text-foreground line-clamp-1">{s.name}</h4>
              <span className="text-[10px] font-semibold text-[#5B50E5] mt-1">{s.category}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
