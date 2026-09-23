import { Header } from "@/components/header";
import { Footer } from "@/components/public/footer";
import Link from "next/link";
import {
  ShieldCheck,
  Crown,
  Users,
  Code,
  Music,
  Camera,
  Sparkles,
  Mic2,
  Layers,
  Palette,
  Mail,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Executive Leadership & Team — Vistara Student Club",
  description: "Meet the executive committee, faculty advisors, and 7 sub-club secretaries leading the Vistara Student Club.",
};

const LEADERSHIP = [
  {
    role: "President",
    name: "Mukesh G.",
    department: "Computer Science & Business Systems",
    year: "Final Year",
    email: "president@vistaraconnect.internal",
    badge: "Executive Head",
    icon: Crown,
    color: "from-amber-500 to-orange-600",
    responsibilities: [
      "Oversees overall club operations & governance",
      "Creates and publishes major college fests & events",
      "Authorizes official On-Duty (OD) pass issuances",
      "Reviews sub-club member additions and removal requests",
    ],
  },
  {
    role: "Vice President",
    name: "Vimal Raj S.",
    department: "Artificial Intelligence & Data Science",
    year: "Final Year",
    email: "vicepresident@vistaraconnect.internal",
    badge: "Operations Head",
    icon: ShieldCheck,
    color: "from-[#5B50E5] to-[#8B5CF6]",
    responsibilities: [
      "Assists in event planning and logistics",
      "Manages campus news, blogs, and public editorial",
      "Oversees sponsor relations and industrial outreach",
      "Co-generates verified digital OD forms",
    ],
  },
  {
    role: "Faculty Advisor",
    name: "Dr. K. Senthil Nathan",
    department: "Dean of Student Affairs & Cultural Council",
    year: "Faculty Council",
    email: "faculty.advisor@vistaraconnect.internal",
    badge: "Institutional Patron",
    icon: Users,
    color: "from-emerald-500 to-teal-600",
    responsibilities: [
      "Institutional governance and academic liaison",
      "Validation of attendance waivers & OD approvals",
      "University administration sponsorship & budgeting",
    ],
  },
];

const SECRETARIES = [
  {
    club: "Tech Club",
    secretary: "Tech Secretary",
    slug: "tech",
    icon: Code,
    color: "from-blue-600 to-indigo-600",
    domain: "Engineering, AI Labs, Hackathons & Cloud Systems",
    email: "tech.secretary@vistaraconnect.internal",
  },
  {
    club: "Music Club",
    secretary: "Music Secretary",
    slug: "music",
    icon: Music,
    color: "from-purple-600 to-pink-600",
    domain: "Bands, Vocal Ensembles, Open Mics & Sound",
    email: "music.secretary@vistaraconnect.internal",
  },
  {
    club: "Dance Club",
    secretary: "Dance Secretary",
    slug: "dance",
    icon: Sparkles,
    color: "from-amber-500 to-rose-600",
    domain: "Hip-Hop, Classical, Fusion & National Competitions",
    email: "dance.secretary@vistaraconnect.internal",
  },
  {
    club: "Media Club",
    secretary: "Media Secretary",
    slug: "media",
    icon: Camera,
    color: "from-cyan-500 to-blue-600",
    domain: "Cinematography, Event Photo Coverage & Gallery Archives",
    email: "media.secretary@vistaraconnect.internal",
  },
  {
    club: "Compering Club",
    secretary: "Compering Secretary",
    slug: "compering",
    icon: Mic2,
    color: "from-emerald-500 to-teal-600",
    domain: "Stage Emcees, Public Oratory, MUNs & Protocols",
    email: "compering.secretary@vistaraconnect.internal",
  },
  {
    club: "Fashion Club",
    secretary: "Fashion Secretary",
    slug: "fashion",
    icon: Layers,
    color: "from-pink-500 to-rose-500",
    domain: "Runway Choreography, Costume Couture & Styling",
    email: "fashion.secretary@vistaraconnect.internal",
  },
  {
    club: "Art & Design Club",
    secretary: "Art Secretary",
    slug: "art",
    icon: Palette,
    color: "from-violet-500 to-indigo-500",
    domain: "Stage Installations, Digital Graphics, Sketching & Decor",
    email: "art.secretary@vistaraconnect.internal",
  },
];

export default function TeamPage() {
  return (
    <main className="flex min-h-screen flex-col pt-12">
      <Header />

      {/* Hero */}
      <section className="pt-16 pb-12 text-center max-w-4xl mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5B50E5]/10 text-[#5B50E5] text-xs font-semibold uppercase tracking-wider mb-4">
          <Crown className="w-3.5 h-3.5" />
          <span>Governance &amp; Leadership</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
          The Minds Behind Vistara
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Structured roles, transparent responsibilities, and dedicated student executives working alongside faculty mentors to empower 650+ club members.
        </p>
      </section>

      {/* Executive Council */}
      <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            Executive Council &amp; Mentorship
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Setting the vision, managing institutional approvals, and spearheading digital transformation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LEADERSHIP.map((lead) => {
            const Icon = lead.icon;
            return (
              <div
                key={lead.role}
                className="p-8 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-md shadow-md hover:shadow-xl hover:border-[#5B50E5]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${lead.color} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#5B50E5]/10 text-[#5B50E5]">
                      {lead.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground">{lead.name}</h3>
                  <div className="text-xs font-semibold text-[#5B50E5] mt-0.5">{lead.role}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {lead.department} • {lead.year}
                  </div>

                  <div className="mt-5 pt-4 border-t border-border/60">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Key Responsibilities
                    </div>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      {lead.responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#5B50E5] font-bold mt-0.5">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="w-3.5 h-3.5 text-[#5B50E5]" />
                  <span className="truncate font-mono text-[11px]">{lead.email}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sub-Club Secretaries (The 7 Wings) */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 w-full border-t border-border/40">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B50E5]/10 text-[#5B50E5] text-xs font-semibold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>The 7 Sub-Club Secretaries</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            Specialized Wing Heads
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Each secretary manages membership records, selects participants for events, and directs sub-club rehearsals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SECRETARIES.map((sec) => {
            const Icon = sec.icon;
            return (
              <div
                key={sec.club}
                className="p-6 rounded-2xl border border-border/70 bg-card/60 hover:bg-card hover:border-[#5B50E5]/50 transition-all flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${sec.color} text-white flex items-center justify-center shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      Secretary
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground">{sec.club}</h3>
                  <div className="text-xs font-semibold text-[#5B50E5] mt-0.5">{sec.secretary}</div>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {sec.domain}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between">
                  <Link
                    href={`/sub-clubs#${sec.slug}`}
                    className="text-[11px] font-bold text-[#5B50E5] hover:underline inline-flex items-center gap-1"
                  >
                    <span>View Wing</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                  <span className="text-[10px] text-muted-foreground font-mono">@{sec.slug}sec</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
