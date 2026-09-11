"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TIMELINE = [
  { step: "01", title: "Online Application", desc: "Submit your basic profile and sub-club interest via this portal." },
  { step: "02", title: "Skill Screening", desc: "Auditions / live coding tests / design tasks evaluated by secretaries." },
  { step: "03", title: "Council Interview", desc: "Interactive session with Faculty Coordinators and Executive Board." },
  { step: "04", title: "Induction & ID", desc: "Welcome orientation, personalized Membership Card, and active projects." },
];

export function RecruitmentSection() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    registerNumber: "",
    department: "",
    year: "FIRST",
    subClub: "tech",
    portfolioUrl: "",
    statement: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsOpenModal(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          registerNumber: "",
          department: "",
          year: "FIRST",
          subClub: "tech",
          portfolioUrl: "",
          statement: "",
        });
      }, 2500);
    }, 1200);
  };

  return (
    <section id="recruitment" className="py-20 md:py-28 relative border-t border-border/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Banner Card */}
        <div className="rounded-3xl border border-[#5B50E5]/40 bg-gradient-to-br from-[#5B50E5]/10 via-card to-card p-8 sm:p-14 relative overflow-hidden shadow-lg">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B50E5]/15 text-[#5B50E5] text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recruitments 2026 Open</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-tight">
              Ready to Shape the Future of Campus Culture?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Whether you are an aspiring stage emcee, guitarist, backend engineer, classical dancer, or videographer, Vistara provides the launchpad to hone your skills and build your collegiate network.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => setIsOpenModal(true)}
                className="h-12 px-8 rounded-xl bg-[#5B50E5] hover:bg-[#4C40D4] text-white font-bold text-sm shadow-lg shadow-[#5B50E5]/25"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                <span>Submit Candidate Application</span>
              </Button>
            </div>
          </div>

          {/* Timeline steps */}
          <div className="mt-14 pt-10 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIMELINE.map((item, i) => (
              <div key={i} className="space-y-2">
                <span className="text-xl font-black text-[#5B50E5]/80 font-mono">{item.step}</span>
                <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recruitment Modal */}
      <AnimatePresence>
        {isOpenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl my-8 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl relative"
            >
              {isSuccess ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Application Received!</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Thank you, {formData.firstName}. Your audition docket has been generated. The recruitment committee will email your scheduled interview slot.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/50">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Vistara Membership Application</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Academic Cohort 2026</p>
                    </div>
                    <button
                      onClick={() => setIsOpenModal(false)}
                      className="text-xs font-bold text-muted-foreground hover:text-foreground"
                    >
                      Close
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="rec-fn" className="text-xs font-semibold">First Name</Label>
                        <Input
                          id="rec-fn"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          placeholder="John"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rec-ln" className="text-xs font-semibold">Last Name</Label>
                        <Input
                          id="rec-ln"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          placeholder="Doe"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="rec-email" className="text-xs font-semibold">College Email</Label>
                        <Input
                          id="rec-email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john.d@college.edu"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rec-phone" className="text-xs font-semibold">Phone Number</Label>
                        <Input
                          id="rec-phone"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="rec-reg" className="text-xs font-semibold">Register Number</Label>
                        <Input
                          id="rec-reg"
                          required
                          value={formData.registerNumber}
                          onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
                          placeholder="717822P102"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rec-subclub" className="text-xs font-semibold">Preferred Sub-Club</Label>
                        <select
                          id="rec-subclub"
                          value={formData.subClub}
                          onChange={(e) => setFormData({ ...formData, subClub: e.target.value })}
                          className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          <option value="tech">Tech Club</option>
                          <option value="music">Music Club</option>
                          <option value="dance">Dance Club</option>
                          <option value="media">Media Club</option>
                          <option value="compering">Compering Club</option>
                          <option value="fashion">Fashion Club</option>
                          <option value="art">Art & Design Club</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="rec-dept" className="text-xs font-semibold">Department</Label>
                        <Input
                          id="rec-dept"
                          required
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          placeholder="e.g. CSE / IT / ECE"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rec-year" className="text-xs font-semibold">Current Year</Label>
                        <select
                          id="rec-year"
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                          className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          <option value="FIRST">First Year</option>
                          <option value="SECOND">Second Year</option>
                          <option value="THIRD">Third Year</option>
                          <option value="FOURTH">Fourth Year</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="rec-port" className="text-xs font-semibold">Portfolio / Drive / GitHub Link (Optional)</Label>
                      <Input
                        id="rec-port"
                        value={formData.portfolioUrl}
                        onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                        placeholder="https://..."
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="rec-stmt" className="text-xs font-semibold">Why do you want to join Vistara?</Label>
                      <textarea
                        id="rec-stmt"
                        required
                        rows={3}
                        value={formData.statement}
                        onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                        placeholder="Tell us about your background, previous stage/project experience, and what you hope to achieve..."
                        className="mt-1 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
                            <span>Processing Candidacy...</span>
                          </div>
                        ) : (
                          "Submit Candidacy Application"
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
