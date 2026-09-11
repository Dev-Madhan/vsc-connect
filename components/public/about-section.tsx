"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, Compass, BookOpen, Sparkles, CheckCircle2 } from "lucide-react";

const PILLARS = [
  {
    title: "Our Vision",
    icon: Compass,
    description: "To cultivate a premier collegiate ecosystem where creative arts, technical innovation, and leadership empower students to impact the world.",
  },
  {
    title: "Our Mission",
    icon: Target,
    description: "Provide hands-on platforms, workshops, and nationwide inter-collegiate representations that foster excellence across performing and digital domains.",
  },
  {
    title: "Operational Rigor",
    icon: BookOpen,
    description: "Pioneering paperless digital workflows, transparent attendance audits, and instant On-Duty approvals for active club performers.",
  },
];

const LEADERS = [
  { name: "Dr. K. Senthil Kumar", role: "Faculty Coordinator", dept: "Academic Council", tag: "Mentor" },
  { name: "Madhan S.", role: "Club President", dept: "Computer Science & Engg", tag: "Executive" },
  { name: "Mukesh K.", role: "Vice President", dept: "Information Technology", tag: "Executive" },
  { name: "Jeevith V.", role: "Tech & Operations Lead", dept: "Computer Science & Engg", tag: "Tech Lead" },
  { name: "Harizith R.", role: "Secretary — Cultural & Arts", dept: "Mechanical Engg", tag: "Cultural" },
  { name: "Vimal Raj", role: "Media & Branding Secretary", dept: "Electronics & Comm.", tag: "Media" },
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28 relative border-t border-border/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B50E5]/10 text-[#5B50E5] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3" />
            <span>About Vistara Connect</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Nurturing Talent. Inspiring Greatness.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Founded with the ambition to bridge classroom education and real-world stagecraft, Vistara Student Club is home to hundreds of passionate performers, coders, writers, and designers.
          </p>
        </div>

        {/* Pillars / Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm hover:border-[#5B50E5]/40 transition-all shadow-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-[#5B50E5]/10 text-[#5B50E5] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Club Leadership Box */}
        <div className="p-8 sm:p-10 rounded-3xl border border-border/60 bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-md shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#5B50E5]">Leadership Council</span>
              <h3 className="text-2xl font-bold text-foreground mt-1">Executive Committee & Mentors</h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Academic Year 2025–2026 Board</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {LEADERS.map((leader, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-background transition-colors flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#5B50E5] to-[#8B5CF6] text-white font-bold flex items-center justify-center shrink-0 text-sm shadow-sm">
                  {leader.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-foreground truncate">{leader.name}</p>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground uppercase">
                      {leader.tag}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-[#5B50E5] mt-0.5">{leader.role}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{leader.dept}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
