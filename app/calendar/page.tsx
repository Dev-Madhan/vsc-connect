"use client";

import React, { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/public/footer";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Sparkles,
  Users,
  ShieldCheck,
  ArrowRight,
  Filter,
} from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  subClub: string;
  category: "Technical" | "Cultural" | "Media" | "Workshop";
  color: string;
  badgeBg: string;
  badgeText: string;
  description: string;
}

const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: "cal-1",
    title: "HackVistara 2026: 24H Full-Stack Sprint",
    date: "2026-03-28",
    time: "09:00 AM - Next Day 09:00 AM",
    location: "Campus Tech Arena (Lab 4)",
    subClub: "Tech Club",
    category: "Technical",
    color: "bg-blue-600",
    badgeBg: "bg-blue-100 dark:bg-blue-950",
    badgeText: "text-blue-700 dark:text-blue-300",
    description: "24-hour sprint to develop cloud utilities, AI agents, and digital campus tools. Cash prizes and automated OD attendance passes.",
  },
  {
    id: "cal-2",
    title: "SoundWave Acoustic & Vocal Auditions",
    date: "2026-04-05",
    time: "04:30 PM - 07:30 PM",
    location: "Open Air Amphitheatre",
    subClub: "Music Club",
    category: "Cultural",
    color: "bg-purple-600",
    badgeBg: "bg-purple-100 dark:bg-purple-950",
    badgeText: "text-purple-700 dark:text-purple-300",
    description: "Vocal and instrumental talent hunt for collegiate music battle teams and acoustic festival performances.",
  },
  {
    id: "cal-3",
    title: "PRISM: Short Film & Visual Showcase",
    date: "2026-04-12",
    time: "02:00 PM - 06:00 PM",
    location: "Central Auditorium (Hall B)",
    subClub: "Media Club",
    category: "Media",
    color: "bg-cyan-600",
    badgeBg: "bg-cyan-100 dark:bg-cyan-950",
    badgeText: "text-cyan-700 dark:text-cyan-300",
    description: "Screening of student-directed indie short films, cinematic aftermovies, and camera equipment clinics.",
  },
  {
    id: "cal-4",
    title: "ChoreoBattle: Intra-College Dance Clash",
    date: "2026-04-18",
    time: "05:00 PM - 08:30 PM",
    location: "Main University Grounds",
    subClub: "Dance Club",
    category: "Cultural",
    color: "bg-amber-600",
    badgeBg: "bg-amber-100 dark:bg-amber-950",
    badgeText: "text-amber-700 dark:text-amber-300",
    description: "Hip-Hop, classical contemporary, and freestyle solo & crew battles representing sub-club teams.",
  },
  {
    id: "cal-5",
    title: "AI & Full-Stack Deployment Workshop",
    date: "2026-04-24",
    time: "10:00 AM - 01:00 PM",
    location: "Systems Engineering Block",
    subClub: "Tech Club",
    category: "Workshop",
    color: "bg-[#5B50E5]",
    badgeBg: "bg-[#5B50E5]/10",
    badgeText: "text-[#5B50E5]",
    description: "Hands-on bootcamp on Docker, Next.js server actions, and deploying production apps to cloud clusters.",
  },
  {
    id: "cal-6",
    title: "Couture Walk & Fashion Styling Clinic",
    date: "2026-05-02",
    time: "03:30 PM - 06:00 PM",
    location: "Cultural Activity Center",
    subClub: "Fashion Club",
    category: "Cultural",
    color: "bg-pink-600",
    badgeBg: "bg-pink-100 dark:bg-pink-950",
    badgeText: "text-pink-700 dark:text-pink-300",
    description: "Runway posture masterclass, costume theme drafting, and model choreography for national pageants.",
  },
];

export default function EventCalendarPage() {
  const [currentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(3); // 3 = April (0-indexed: 2=March, 3=April)
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [selectedDate, setSelectedDate] = useState<string>("2026-04-05");

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    if (currentMonth > 0) setCurrentMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth < 11) setCurrentMonth((m) => m + 1);
  };

  const filteredEvents = CALENDAR_EVENTS.filter((e) => {
    if (categoryFilter !== "ALL" && e.category !== categoryFilter) return false;
    return true;
  });

  const selectedDateEvents = filteredEvents.filter((e) => e.date === selectedDate);

  return (
    <main className="flex min-h-screen flex-col pt-12">
      <Header />

      {/* Hero Header */}
      <section className="pt-16 pb-8 text-center max-w-4xl mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5B50E5]/10 text-[#5B50E5] text-xs font-semibold uppercase tracking-wider mb-4">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>Interactive Schedule</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
          Vistara Event Calendar
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Track college fests, 24-hour hackathons, acoustic music nights, and register online for automated On-Duty (OD) passes.
        </p>
      </section>

      {/* Calendar Controls & Filters */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* Month Navigator */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl border border-border/70 hover:bg-muted text-foreground transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl sm:text-2xl font-black text-foreground min-w-[180px] text-center">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl border border-border/70 hover:bg-muted text-foreground transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {(["ALL", "Technical", "Cultural", "Media", "Workshop"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  categoryFilter === cat
                    ? "bg-[#5B50E5] text-white shadow-sm"
                    : "bg-card text-muted-foreground border border-border/60 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Calendar Matrix (Left 8 cols) */}
          <div className="lg:col-span-8 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-md p-6 sm:p-8 shadow-sm">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Day Cells */}
            <div className="grid grid-cols-7 gap-2">
              {/* Blank leading cells */}
              {[...Array(firstDayOfMonth)].map((_, i) => (
                <div key={`blank-${i}`} className="min-h-[70px] sm:min-h-[85px] rounded-xl bg-muted/20 border border-transparent" />
              ))}

              {/* Month day cells */}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const isSelected = selectedDate === formattedDate;
                const dayEvents = filteredEvents.filter((e) => e.date === formattedDate);

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(formattedDate)}
                    className={`min-h-[70px] sm:min-h-[85px] p-2 rounded-xl text-left border flex flex-col justify-between transition-all ${
                      isSelected
                        ? "border-[#5B50E5] bg-[#5B50E5]/10 shadow-sm"
                        : "border-border/50 hover:border-border hover:bg-card/90"
                    }`}
                  >
                    <span className={`text-xs font-bold ${isSelected ? "text-[#5B50E5]" : "text-foreground"}`}>
                      {day}
                    </span>

                    {/* Event indicators */}
                    <div className="space-y-1 mt-1 w-full">
                      {dayEvents.slice(0, 2).map((evt) => (
                        <div
                          key={evt.id}
                          className={`text-[9px] font-semibold truncate px-1.5 py-0.5 rounded ${evt.badgeBg} ${evt.badgeText}`}
                        >
                          {evt.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[8px] text-muted-foreground font-bold">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Details (Right 4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-md shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Events on Selected Date
                </span>
                <span className="text-xs font-mono text-[#5B50E5] font-bold">
                  {new Date(selectedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>

              {selectedDateEvents.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground text-xs space-y-2">
                  <CalendarIcon className="w-8 h-8 mx-auto text-muted-foreground/40" />
                  <p>No club events scheduled for this day.</p>
                  <p className="text-[11px] text-muted-foreground/70">Click on any date with an event pill to inspect details.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDateEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-4 rounded-2xl border border-border/70 bg-card hover:border-[#5B50E5]/40 transition-colors space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${evt.badgeBg} ${evt.badgeText}`}>
                          {evt.subClub}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-semibold">
                          {evt.category}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-foreground leading-snug">
                        {evt.title}
                      </h4>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {evt.description}
                      </p>

                      <div className="space-y-1 text-xs text-muted-foreground pt-1">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#5B50E5]" />
                          <span>{evt.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#5B50E5]" />
                          <span className="truncate">{evt.location}</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Link
                          href="/events"
                          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#5B50E5] text-white text-xs font-bold hover:bg-[#4C40D4] transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Register for OD Pass</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Link Card */}
            <div className="p-5 rounded-2xl border border-[#5B50E5]/20 bg-[#5B50E5]/5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5B50E5]">
                <ShieldCheck className="w-4 h-4" />
                <span>On-Duty (OD) Automated Clearance</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Registered participants automatically receive digital QR verification documents signed off by the President and Faculty Council.
              </p>
              <Link
                href="/events"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#5B50E5] hover:underline pt-1"
              >
                <span>Verify Attendance Pass</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
