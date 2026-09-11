"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code, ExternalLink, Sparkles, FolderGit2 } from "lucide-react";

export interface ClubProject {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  repoUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}

const PROJECTS: ClubProject[] = [
  {
    id: "proj-1",
    title: "VSC Connect — Enterprise Club OS",
    category: "Full-Stack System",
    description: "The core platform powering Vistara Student Club: role-based dashboards, automated On-Duty letter PDF generator, member registries, and S3-compatible cloud media.",
    tags: ["Next.js 16", "PostgreSQL", "Prisma", "Better Auth", "TailwindCSS"],
    repoUrl: "https://github.com/Dev-Madhan/vsc-connect",
    liveUrl: "https://vsc-connect.vercel.app",
    featured: true,
  },
  {
    id: "proj-2",
    title: "FestPass QR Ticket Scanner",
    category: "Mobile & Security",
    description: "High-speed encrypted QR admission validation app used at college fest turnstiles to process 3,000+ entries with sub-second offline sync.",
    tags: ["React Native", "WebSockets", "Node.js", "Redis"],
    repoUrl: "https://github.com",
    liveUrl: "https://festpass.vsc.dev",
  },
  {
    id: "proj-3",
    title: "Acoustica Live Stage Visualizer",
    category: "Creative Tech & Audio",
    description: "Real-time FFT audio visualizer and projection mapping canvas responding dynamically to live stage band performances during annual cultural nights.",
    tags: ["Three.js", "WebAudio API", "GLSL Shaders", "Canvas"],
    repoUrl: "https://github.com",
  },
  {
    id: "proj-4",
    title: "Campus Pulse — Vistara AI Chatbot",
    category: "Artificial Intelligence",
    description: "RAG-powered conversational assistant helping students query upcoming auditions, club eligibility criteria, event venues, and faculty permissions.",
    tags: ["FastAPI", "LangChain", "Vector DB", "OpenAI"],
    liveUrl: "https://vsc.dev/bot",
  },
];

export function ProjectsSection() {
  return (
    <section id="projects" className="py-20 md:py-28 relative border-t border-border/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B50E5]/10 text-[#5B50E5] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3" />
            <span>Built by Students</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Featured Innovation Projects
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Our members build real-world software, hardware installations, and creative digital experiences.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROJECTS.map((proj, idx) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`p-7 rounded-3xl border transition-all duration-300 flex flex-col justify-between group ${
                proj.featured
                  ? "border-[#5B50E5]/60 bg-gradient-to-br from-card to-[#5B50E5]/5 shadow-md shadow-[#5B50E5]/10"
                  : "border-border/60 bg-card/70 hover:border-border backdrop-blur-sm"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[#5B50E5]/10 text-[#5B50E5] flex items-center justify-center">
                      <FolderGit2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B50E5]">
                        {proj.category}
                      </span>
                    </div>
                  </div>
                  {proj.featured && (
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#5B50E5] text-white">
                      Featured
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-foreground group-hover:text-[#5B50E5] transition-colors">
                  {proj.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {proj.description}
                </p>

                {/* Tech tags */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {proj.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-4">
                {proj.repoUrl && (
                  <a
                    href={proj.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground/80 hover:text-[#5B50E5] transition-colors"
                  >
                    <Code className="w-4 h-4" />
                    <span>View Repository</span>
                  </a>
                )}
                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5B50E5] hover:text-[#4C40D4] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Preview</span>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
