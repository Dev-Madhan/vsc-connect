"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users, Calendar, Award, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATS = [
  { label: "Active Members", value: "650+", icon: Users, change: "+18% this semester" },
  { label: "Sub-Clubs", value: "7", icon: Award, change: "Creative & Technical" },
  { label: "Annual Events", value: "48+", icon: Calendar, change: "Fests, hackathons, shows" },
  { label: "Verified ODs", value: "100%", icon: ShieldCheck, change: "Fully digital workflow" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Background ambient decorative glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] md:w-[850px] md:h-[450px] bg-gradient-to-tr from-[#5B50E5]/20 via-[#3B82F6]/15 to-[#EC4899]/10 blur-[130px] -z-10 pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#5B50E5]/30 bg-[#5B50E5]/10 text-[#5B50E5] text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-sm"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#5B50E5]" />
          <span>The Official Digital Platform of Vistara Student Club</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.08]"
        >
          Where Creativity Meets{" "}
          <span className="bg-gradient-to-r from-[#5B50E5] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
            Digital Precision.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Unifying student leadership, 7 creative sub-clubs, event operations, automated On-Duty (OD) passes, and member portfolios into one seamless ecosystem.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            size="lg"
            render={<Link href="#events" />}
            nativeButton={false}
            className="h-12 px-7 rounded-xl bg-[#5B50E5] hover:bg-[#4C40D4] text-white shadow-lg shadow-[#5B50E5]/25 font-semibold text-sm transition-all hover:scale-[1.02]"
          >
            <span>Explore Events</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            render={<Link href="#recruitment" />}
            nativeButton={false}
            className="h-12 px-7 rounded-xl border-border/80 bg-background/60 hover:bg-accent backdrop-blur font-semibold text-sm transition-all"
          >
            <span>Join Vistara Club</span>
          </Button>

          <Button
            size="lg"
            variant="ghost"
            render={<Link href="/login" />}
            nativeButton={false}
            className="h-12 px-6 rounded-xl text-muted-foreground hover:text-foreground font-semibold text-sm"
          >
            <span>Officer Portal &rarr;</span>
          </Button>
        </motion.div>

        {/* Dynamic Metric Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left"
        >
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="group relative p-5 rounded-2xl border border-border/50 bg-card/60 hover:bg-card/90 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-sans">
                    {stat.value}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#5B50E5]/10 flex items-center justify-center text-[#5B50E5] group-hover:bg-[#5B50E5] group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-foreground/80">
                  {stat.label}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                  {stat.change}
                </p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
