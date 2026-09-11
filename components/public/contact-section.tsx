"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MapPin,
  Send,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FAQS = [
  {
    q: "Who is eligible to join Vistara Student Club?",
    a: "All enrolled undergraduate and postgraduate students from any academic discipline are eligible to audition or apply for any of our 7 specialized wings.",
  },
  {
    q: "How does the digital On-Duty (OD) pass system work?",
    a: "When you participate in an official club event or external tournament, VSC Connect auto-generates official institutional OD request forms, mapped to your register number, approved digitally by faculty mentors.",
  },
  {
    q: "Can I participate in multiple sub-clubs?",
    a: "Yes! While you have one primary wing for attendance and administrative records, cross-collaboration (e.g. Media covering Music, or Tech building tools for Dance) is actively encouraged.",
  },
  {
    q: "How are external tournament contingents selected?",
    a: "Sub-club secretaries and faculty coordinators host internal auditions and mock performance rounds to curate the official college team.",
  },
];

export function ContactSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        setContactForm({ name: "", email: "", subject: "", message: "" });
      }, 3000);
    }, 1000);
  };

  return (
    <section id="contact" className="py-20 md:py-28 relative border-t border-border/40 bg-muted/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B50E5]/10 text-[#5B50E5] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3" />
            <span>Get in Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Contact & Inquiries
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Have questions regarding upcoming fests, sponsorship collaborations, or OD verification? Reach out to our executive council.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-6 p-7 sm:p-9 rounded-3xl border border-border/70 bg-card/80 backdrop-blur-md shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-1">Send a Direct Message</h3>
            <p className="text-xs text-muted-foreground mb-6">Our secretariat responds within 24–48 hours.</p>

            {sentSuccess ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-foreground">Message Dispatched!</h4>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Thank you for reaching out. The Vistara Secretarial desk has received your note.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cnt-name" className="text-xs font-semibold">Your Name</Label>
                    <Input
                      id="cnt-name"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="e.g. Priya Nair"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cnt-email" className="text-xs font-semibold">Email Address</Label>
                    <Input
                      id="cnt-email"
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="priya@domain.com"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="cnt-subj" className="text-xs font-semibold">Subject / Purpose</Label>
                  <Input
                    id="cnt-subj"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="Sponsorship / Fest Invitation / General Query"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="cnt-msg" className="text-xs font-semibold">Your Message</Label>
                  <textarea
                    id="cnt-msg"
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Please include all relevant context..."
                    className="mt-1 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSending}
                  className="w-full h-11 rounded-xl bg-[#5B50E5] hover:bg-[#4C40D4] text-white font-bold text-sm shadow-md"
                >
                  <Send className="w-4 h-4 mr-2" />
                  <span>{isSending ? "Dispatching..." : "Transmit Message"}</span>
                </Button>
              </form>
            )}
          </div>

          {/* Right Column: Details & FAQs */}
          <div className="lg:col-span-6 space-y-6">
            {/* Quick Contact Info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm">
                <Mail className="w-5 h-5 text-[#5B50E5] mb-2" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Official Email</h4>
                <p className="text-sm font-bold text-foreground mt-0.5">connect@vistara-club.edu</p>
              </div>
              <div className="p-5 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm">
                <MapPin className="w-5 h-5 text-[#5B50E5] mb-2" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Club Secretariat</h4>
                <p className="text-sm font-bold text-foreground mt-0.5">Student Activity Hub, Block C</p>
              </div>
            </div>

            {/* Accordion FAQs */}
            <div className="p-6 sm:p-7 rounded-3xl border border-border/60 bg-card/60 backdrop-blur-sm space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#5B50E5]" />
                <span>Frequently Asked Questions</span>
              </h4>

              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="border-b border-border/40 pb-3 last:border-0 last:pb-0">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left flex items-center justify-between gap-3 py-1 font-semibold text-xs sm:text-sm text-foreground hover:text-[#5B50E5] transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-[#5B50E5]" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-xs text-muted-foreground pt-2 leading-relaxed"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
