"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  Music,
  Camera,
  Mic2,
  Sparkles,
  Palette,
  Layers,
  ArrowRight,
  Users,
  CheckCircle2,
} from "lucide-react";

export const SUB_CLUBS = [
  {
    slug: "tech",
    name: "Tech Club",
    icon: Code,
    color: "from-blue-600 to-indigo-600",
    badge: "Engineering & AI",
    members: "115+ Members",
    tagline: "Software, Hackathons, AI Labs & Systems",
    description: "Driving the digital engine of the club. From building full-stack platforms like VSC Connect to hosting 24-hour hackathons, cyber security bootcamps, and cloud computing labs.",
    activities: ["Full-Stack App Development", "Hackathons & Code Sprints", "AI / Cloud Workshops", "Automated Club Tooling"],
    coordinator: "Jeevith V. & Madhan S.",
  },
  {
    slug: "music",
    name: "Music Club",
    icon: Music,
    color: "from-purple-600 to-pink-600",
    badge: "Melody & Sound",
    members: "90+ Members",
    tagline: "Vocalists, Instrumentalists, Acoustic & Rock Bands",
    description: "The rhythmic heartbeat of campus life. Comprising western bands, Indian classical ensembles, beatboxers, and digital music producers competing at national collegiate battles.",
    activities: ["Acoustic Open Mics", "Battle of the Bands", "Vocal Training Camps", "Studio Audio Recording"],
    coordinator: "Harizith R. & Music Secretary",
  },
  {
    slug: "dance",
    name: "Dance Club",
    icon: Sparkles,
    color: "from-amber-500 to-rose-600",
    badge: "Choreography",
    members: "120+ Members",
    tagline: "Hip-Hop, Classical, Contemporary & Fusion",
    description: "High-octane choreography teams that represent the university at premier national cultural fests, winning prestigious championships and organizing flash mobs and stage showcases.",
    activities: ["National Fest Representations", "Thematic Dance Productions", "Hip-Hop / Classical Bootcamps", "Annual Fest Mega Show"],
    coordinator: "Dance Club Secretary",
  },
  {
    slug: "media",
    name: "Media Club",
    icon: Camera,
    color: "from-cyan-500 to-blue-600",
    badge: "Visual Arts",
    members: "75+ Members",
    tagline: "Photography, Cinematography & Content Creation",
    description: "The lens capturing every memory. Responsible for professional photo coverage, cinematic aftermovies, social media creative reels, drone cinematography, and official PR.",
    activities: ["Event Photo & Video Coverage", "Cinematic Aftermovie Production", "Reels & Social Media PR", "Photography Exhibitions"],
    coordinator: "Vimal Raj",
  },
  {
    slug: "compering",
    name: "Compering Club",
    icon: Mic2,
    color: "from-emerald-500 to-teal-600",
    badge: "Oratory & Stage",
    members: "55+ Members",
    tagline: "Stage Anchors, Public Speaking, MUNs & Debates",
    description: "The masters of ceremonies who command the microphone. Our emcees bring charm, wit, bilingual fluency, and professionalism to inaugurations, fests, conferences, and celebrity nights.",
    activities: ["Stage Anchoring & Protocol", "Model United Nations (MUN)", "Impromptu Speaking & Debates", "Guest Interview Pods"],
    coordinator: "Compering Secretary",
  },
  {
    slug: "fashion",
    name: "Fashion Club",
    icon: Layers,
    color: "from-pink-500 to-rose-500",
    badge: "Runway & Style",
    members: "65+ Members",
    tagline: "Costume Design, Runway Choreography & Styling",
    description: "Exploring couture, sustainable fashion, thematic stage walks, and high-fashion runways with original garment styling that dazzles festival judges across the circuit.",
    activities: ["Thematic Fashion Shows", "Sustainable Design Sprints", "Runway Posture & Walk Clinics", "Inter-college Pageants"],
    coordinator: "Fashion Club Secretary",
  },
  {
    slug: "art",
    name: "Art & Design Club",
    icon: Palette,
    color: "from-violet-500 to-indigo-500",
    badge: "Fine Arts & Design",
    members: "80+ Members",
    tagline: "Digital Design, Installations, Sketching & Stage Decor",
    description: "Bringing spaces to life with vibrant backdrops, mega installations, digital UI graphics, calligraphy, and fine arts that set the aesthetic tone for every campus event.",
    activities: ["Stage Backdrops & Installations", "Digital Poster & Branding Design", "Live Painting Competitions", "Clay & Craft Sculpting"],
    coordinator: "Art Secretary",
  },
];

export function SubClubsSection() {
  const [selectedSlug, setSelectedSlug] = useState<string>("tech");
  const activeClub = SUB_CLUBS.find((c) => c.slug === selectedSlug) ?? SUB_CLUBS[0];
  const ActiveIcon = activeClub.icon;

  return (
    <section id="sub-clubs" className="py-20 md:py-28 relative border-t border-border/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B50E5]/10 text-[#5B50E5] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3" />
            <span>Specialized Wings</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            The 7 Pillars of Vistara
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Every member finds their home in one of our seven specialized sub-clubs, working together under the Vistara banner.
          </p>
        </div>

        {/* Desktop & Mobile Interactive Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {SUB_CLUBS.map((club) => {
            const Icon = club.icon;
            const isSelected = selectedSlug === club.slug;
            return (
              <button
                key={club.slug}
                onClick={() => setSelectedSlug(club.slug)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isSelected
                    ? "bg-[#5B50E5] text-white border-[#5B50E5] shadow-md shadow-[#5B50E5]/20 scale-105"
                    : "bg-card/60 text-muted-foreground border-border/60 hover:text-foreground hover:bg-card"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{club.name}</span>
              </button>
            );
          })}
        </div>

        {/* Detailed Wing Spotlight Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeClub.slug}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="p-8 sm:p-12 rounded-3xl border border-border/70 bg-card/80 backdrop-blur-md shadow-lg relative overflow-hidden"
          >
            {/* Top gradient stripe */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${activeClub.color}`} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${activeClub.color} text-white flex items-center justify-center shadow-md`}>
                    <ActiveIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                      {activeClub.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#5B50E5]">{activeClub.tagline}</p>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {activeClub.description}
                </p>

                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/80 mb-3">
                    Core Activities & Focus:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeClub.activities.map((act, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-background/60 border border-border/60 rounded-2xl p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <span className="text-xs text-muted-foreground font-medium">Domain Classification</span>
                  <span className="text-xs font-bold text-foreground px-2.5 py-0.5 rounded-full bg-muted">
                    {activeClub.badge}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <span className="text-xs text-muted-foreground font-medium">Wing Strength</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <Users className="w-3.5 h-3.5 text-[#5B50E5]" />
                    <span>{activeClub.members}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <span className="text-xs text-muted-foreground font-medium">Coordinators</span>
                  <span className="text-xs font-semibold text-foreground text-right">{activeClub.coordinator}</span>
                </div>

                <div className="pt-2">
                  <a
                    href="#recruitment"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#5B50E5] hover:bg-[#4C40D4] text-white text-xs font-bold transition-all shadow-md shadow-[#5B50E5]/20"
                  >
                    <span>Apply for {activeClub.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
