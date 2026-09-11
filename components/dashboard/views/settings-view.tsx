"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Save,
  CheckCircle2,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SettingsView() {
  const [clubName, setClubName] = useState("Vistara Student Club");
  const [clubEmail, setClubEmail] = useState("connect@vistara-club.edu");
  const [tagline, setTagline] = useState("Where Creativity Meets Digital Precision");
  const [academicYear, setAcademicYear] = useState("2025–2026");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Platform Configuration</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          General club metadata, institutional signatures, and role-based permissions.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Configuration saved successfully.</span>
        </div>
      )}

      {/* Form: Club Identity */}
      <form onSubmit={handleSave} className="p-7 rounded-3xl border border-border/70 bg-white shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-border/50">
          <Building className="w-5 h-5 text-[#5B50E5]" />
          <h3 className="text-base font-bold text-foreground">Club Identity & Institutional Branding</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="st-name" className="text-xs font-semibold">Official Club Name</Label>
            <Input id="st-name" value={clubName} onChange={(e) => setClubName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="st-email" className="text-xs font-semibold">Secretariat Email</Label>
            <Input id="st-email" type="email" value={clubEmail} onChange={(e) => setClubEmail(e.target.value)} className="mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="st-tag" className="text-xs font-semibold">Motto / Tagline</Label>
            <Input id="st-tag" value={tagline} onChange={(e) => setTagline(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="st-yr" className="text-xs font-semibold">Current Academic Cohort</Label>
            <Input id="st-yr" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} className="mt-1" />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" className="h-10 px-6 rounded-xl bg-[#5B50E5] hover:bg-[#4C40D4] text-white font-bold text-xs shadow-md">
            <Save className="w-4 h-4 mr-1.5" />
            <span>Save Changes</span>
          </Button>
        </div>
      </form>

      {/* Role-Based Access Control Matrix */}
      <div className="p-7 rounded-3xl border border-border/70 bg-white shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-border/50">
          <ShieldCheck className="w-5 h-5 text-[#5B50E5]" />
          <div>
            <h3 className="text-base font-bold text-foreground">Role-Based Access Control (RBAC) Matrix</h3>
            <p className="text-xs text-muted-foreground">Permission grants enforced at middleware and database service layer.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Scope</th>
                <th className="py-2.5 px-3">Member Roster</th>
                <th className="py-2.5 px-3">Event Operations</th>
                <th className="py-2.5 px-3">OD Generation</th>
                <th className="py-2.5 px-3">System Logs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <tr>
                <td className="py-3 px-3 font-bold text-[#5B50E5]">SUPER_ADMIN</td>
                <td className="py-3 px-3">Entire University</td>
                <td className="py-3 px-3 font-semibold text-emerald-600">Full CRUD</td>
                <td className="py-3 px-3 font-semibold text-emerald-600">Full CRUD</td>
                <td className="py-3 px-3 font-semibold text-emerald-600">All Sub-Clubs</td>
                <td className="py-3 px-3 font-semibold text-emerald-600">Full Access</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-foreground">ADMIN (President / VP)</td>
                <td className="py-3 px-3">Club Operations</td>
                <td className="py-3 px-3 font-semibold text-emerald-600">Full CRUD</td>
                <td className="py-3 px-3 font-semibold text-emerald-600">Full CRUD</td>
                <td className="py-3 px-3 font-semibold text-emerald-600">All Sub-Clubs</td>
                <td className="py-3 px-3 font-semibold text-emerald-600">View Only</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-foreground">MODERATOR (Tech Wing)</td>
                <td className="py-3 px-3">Tech & OD Desk</td>
                <td className="py-3 px-3">Own Wing</td>
                <td className="py-3 px-3">Own Wing</td>
                <td className="py-3 px-3 font-semibold text-emerald-600">All Sub-Clubs</td>
                <td className="py-3 px-3 text-muted-foreground">—</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-foreground">MODERATOR (Secretaries)</td>
                <td className="py-3 px-3">Specific Sub-Club</td>
                <td className="py-3 px-3">Own Wing</td>
                <td className="py-3 px-3">Own Wing</td>
                <td className="py-3 px-3">Own Wing Only</td>
                <td className="py-3 px-3 text-muted-foreground">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
