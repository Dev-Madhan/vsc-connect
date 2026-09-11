"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  X,
  Loader2,
  Tag,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface PublicEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  eventDate: string;
  time: string;
  location: string;
  subClub: string;
  status: "UPCOMING" | "ONGOING" | "COMPLETED";
  capacity: string;
  category: "Technical" | "Cultural" | "Media" | "Workshop";
}

const EVENTS_DATA: PublicEvent[] = [
  {
    id: "evt-1",
    title: "HackVistara 2026: 24H Full-Stack Sprint",
    slug: "hackvistara-2026",
    description: "Build next-generation web platforms, AI agents, and cloud utilities. Open to all students with mentorship from industry architects and cash prizes.",
    eventDate: "March 28, 2026",
    time: "09:00 AM - Next Day 09:00 AM",
    location: "Campus Innovation Labs, 3rd Floor",
    subClub: "Tech Club",
    status: "UPCOMING",
    capacity: "45 / 60 Teams Registered",
    category: "Technical",
  },
  {
    id: "evt-2",
    title: "Acoustica — Annual Unplugged Music Fest",
    slug: "acoustica-annual-music",
    description: "An enchanting evening featuring acoustic solos, choral harmonies, collegiate western bands, and fusion melodies under the starlight.",
    eventDate: "April 04, 2026",
    time: "05:30 PM - 09:30 PM",
    location: "Main Open-Air Amphitheatre",
    subClub: "Music Club",
    status: "UPCOMING",
    capacity: "400+ Seats Available",
    category: "Cultural",
  },
  {
    id: "evt-3",
    title: "Rhythm Clash: Inter-Collegiate Dance Arena",
    slug: "rhythm-clash-2026",
    description: "The ultimate showdown of hip-hop crews and classical fusion ensembles battling for the prestigious Vistara Rolling Trophy.",
    eventDate: "April 18, 2026",
    time: "02:00 PM - 08:00 PM",
    location: "University Auditorium",
    subClub: "Dance Club",
    status: "UPCOMING",
    capacity: "12 Finalist Crews",
    category: "Cultural",
  },
  {
    id: "evt-4",
    title: "LensCraft: Cinematography & Drone Workshop",
    slug: "lenscraft-cinematography-workshop",
    description: "Master manual camera exposure, gimbal movements, drone flight legalities, and DaVinci Resolve color grading techniques.",
    eventDate: "May 02, 2026",
    time: "10:00 AM - 03:00 PM",
    location: "Media Studio B & Quadrangle",
    subClub: "Media Club",
    status: "UPCOMING",
    capacity: "35 Seats Only",
    category: "Media",
  },
  {
    id: "evt-5",
    title: "Vistara Winter Fest 2025 (Highlights)",
    slug: "vistara-winter-fest-2025",
    description: "Our landmark multi-day cultural and tech festival featuring 3000+ attendees, 18 competitions, and national celebrity night.",
    eventDate: "December 14, 2025",
    time: "Full Weekend",
    location: "University Main Campus",
    subClub: "All Sub-Clubs",
    status: "COMPLETED",
    capacity: "3,200 Attendees",
    category: "Cultural",
  },
];

export function EventsSection() {
  const [activeFilter, setActiveFilter] = useState<"ALL" | "UPCOMING" | "COMPLETED">("ALL");
  const [selectedEvent, setSelectedEvent] = useState<PublicEvent | null>(null);
  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    registerNumber: "",
    department: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filteredEvents = EVENTS_DATA.filter((e) => {
    if (activeFilter === "ALL") return true;
    return e.status === activeFilter;
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSelectedEvent(null);
        setRegForm({ name: "", email: "", registerNumber: "", department: "", phone: "" });
      }, 2500);
    }, 1000);
  };

  return (
    <section id="events" className="py-20 md:py-28 relative border-t border-border/40 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B50E5]/10 text-[#5B50E5] text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3 h-3" />
              <span>Campus Calendar</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              Featured Events & Workshops
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Register online, secure your seat, and get automated On-Duty verification.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-card border border-border/60 shrink-0 self-start">
            {(["ALL", "UPCOMING", "COMPLETED"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === filter
                    ? "bg-[#5B50E5] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter === "ALL" ? "All Events" : filter === "UPCOMING" ? "Upcoming" : "Past Highlights"}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt, idx) => {
            const isCompleted = evt.status === "COMPLETED";
            return (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="flex flex-col justify-between p-6 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm hover:border-[#5B50E5]/50 transition-all shadow-sm hover:shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#5B50E5]/10 text-[#5B50E5] uppercase tracking-wider">
                      {evt.subClub}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        isCompleted
                          ? "bg-muted text-muted-foreground"
                          : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {evt.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground group-hover:text-[#5B50E5] transition-colors line-clamp-2">
                    {evt.title}
                  </h3>

                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {evt.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-border/50 space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#5B50E5]" />
                      <span>{evt.eventDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#5B50E5]" />
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#5B50E5]" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3">
                  {isCompleted ? (
                    <div className="w-full py-2.5 text-center text-xs font-semibold text-muted-foreground bg-muted/50 rounded-xl">
                      Event Concluded
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedEvent(evt)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#5B50E5] hover:bg-[#4C40D4] text-white text-xs font-bold transition-all shadow-md shadow-[#5B50E5]/20"
                    >
                      <span>Register Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Registration Modal Dialog */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Registration Successful!</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Your seat for <span className="font-semibold text-foreground">{selectedEvent.title}</span> has been confirmed. Confirmation email sent.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#5B50E5]/10 text-[#5B50E5] text-[11px] font-bold uppercase mb-2">
                      <Tag className="w-3 h-3" />
                      <span>{selectedEvent.subClub}</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{selectedEvent.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedEvent.eventDate} &bull; {selectedEvent.location}
                    </p>
                  </div>

                  <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="reg-name" className="text-xs font-semibold">Full Name</Label>
                        <Input
                          id="reg-name"
                          required
                          value={regForm.name}
                          onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                          placeholder="e.g. Rahul Sharma"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="reg-roll" className="text-xs font-semibold">Register Number</Label>
                        <Input
                          id="reg-roll"
                          required
                          value={regForm.registerNumber}
                          onChange={(e) => setRegForm({ ...regForm, registerNumber: e.target.value })}
                          placeholder="e.g. 717822P101"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="reg-email" className="text-xs font-semibold">College Email</Label>
                        <Input
                          id="reg-email"
                          type="email"
                          required
                          value={regForm.email}
                          onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                          placeholder="student@college.edu"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="reg-dept" className="text-xs font-semibold">Department & Year</Label>
                        <Input
                          id="reg-dept"
                          required
                          value={regForm.department}
                          onChange={(e) => setRegForm({ ...regForm, department: e.target.value })}
                          placeholder="CSE - 3rd Year"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="reg-phone" className="text-xs font-semibold">WhatsApp Contact</Label>
                      <Input
                        id="reg-phone"
                        required
                        value={regForm.phone}
                        onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="mt-1"
                      />
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-11 rounded-xl bg-[#5B50E5] hover:bg-[#4C40D4] text-white font-bold text-sm shadow-md"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Submitting Pass Request...</span>
                          </div>
                        ) : (
                          "Confirm Registration & OD Request"
                        )}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
