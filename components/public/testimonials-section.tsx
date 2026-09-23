"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Sparkles, Star, ChevronLeft, ChevronRight, Award, CheckCircle2 } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  subClub: string;
  year: string;
  quote: string;
  highlight: string;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Mukesh G.",
    role: "Former President & Tech Lead",
    subClub: "Tech Club",
    year: "Batch 2024",
    quote:
      "Vistara Connect transformed how we coordinate 650+ active students across 7 distinct sub-clubs. The automated On-Duty verification alone saved our executive committee dozens of hours of manual paperwork each semester.",
    highlight: "Saved 40+ hours per semester with digital OD workflows",
    avatar: "MG",
  },
  {
    id: "test-2",
    name: "Dr. K. Senthil Nathan",
    role: "Faculty Coordinator & Club Advisor",
    subClub: "Student Affairs",
    year: "Faculty Council",
    quote:
      "The role-based transparency in Vistara Connect is exemplary. As faculty, approving event participation and validating attendance with cryptographic QR passes gives the administration complete confidence and accountability.",
    highlight: "100% verified attendance with zero paper overhead",
    avatar: "SN",
  },
  {
    id: "test-3",
    name: "Ananya R.",
    role: "Dance Club Secretary",
    subClub: "Dance Club",
    year: "3rd Year, AIDS",
    quote:
      "Selecting audition finalists and submitting national fest participants directly to the President within seconds has made our team infinitely faster. Our dancers won 4 national trophies this year!",
    highlight: "4 National Championships won with streamlined crew rosters",
    avatar: "AR",
  },
  {
    id: "test-4",
    name: "Karthik V.",
    role: "Band Lead & Vocalist",
    subClub: "Music Club",
    year: "4th Year, CSE",
    quote:
      "From acoustic open mics to collegiate battle of the bands, Vistara Connect keeps our musicians synchronized, our rehearsal slots booked, and our sound equipment logged seamlessly.",
    highlight: "Hosted 12 campus gigs with flawless equipment tracking",
    avatar: "KV",
  },
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = TESTIMONIALS[activeIndex];

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section className="py-20 md:py-28 relative border-t border-border/40 bg-gradient-to-b from-transparent via-[#5B50E5]/[0.02] to-transparent overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#5B50E5]/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B50E5]/10 text-[#5B50E5] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Voices</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Loved by Students &amp; Faculty
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Hear from club executives, student leaders, and faculty mentors who experience the impact of Vistara Connect every day.
          </p>
        </div>

        {/* Featured Testimonial Card */}
        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="p-8 sm:p-12 rounded-3xl border border-border/70 bg-card/80 backdrop-blur-md shadow-xl relative"
            >
              <Quote className="w-12 h-12 text-[#5B50E5]/20 absolute top-8 right-8 pointer-events-none" />

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-6">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{active.highlight}</span>
              </div>

              <blockquote className="text-lg sm:text-2xl font-medium text-foreground leading-relaxed">
                &ldquo;{active.quote}&rdquo;
              </blockquote>

              <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5B50E5] to-[#8B5CF6] text-white flex items-center justify-center font-bold text-sm shadow-md">
                    {active.avatar}
                  </div>
                  <div>
                    <div className="text-base font-bold text-foreground">{active.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {active.role} • <span className="text-[#5B50E5] font-medium">{active.subClub}</span> ({active.year})
                    </div>
                  </div>
                </div>

                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeIndex === idx ? "w-8 bg-[#5B50E5]" : "w-2 bg-border hover:bg-muted-foreground"
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevTestimonial}
                aria-label="Previous testimonial"
                className="w-10 h-10 rounded-full border border-border/80 bg-card hover:bg-muted flex items-center justify-center text-foreground transition-colors shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextTestimonial}
                aria-label="Next testimonial"
                className="w-10 h-10 rounded-full border border-border/80 bg-card hover:bg-muted flex items-center justify-center text-foreground transition-colors shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
