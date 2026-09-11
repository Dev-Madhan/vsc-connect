"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  X,
  Newspaper,
  FolderGit2,
  Building,
  ExternalLink,
  Code,
} from "lucide-react";
import {
  createNewsAction,
  deleteNewsAction,
  createProjectAction,
  deleteProjectAction,
  createSponsorAction,
  deleteSponsorAction,
} from "@/app/dashboard/website/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface CMSNewsItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
}

export interface CMSProjectItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  repoUrl: string | null;
  liveUrl: string | null;
}

export interface CMSSponsorItem {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string | null;
  tier: string | null;
}

interface WebsiteCMSViewProps {
  news: CMSNewsItem[];
  projects: CMSProjectItem[];
  sponsors: CMSSponsorItem[];
}

export function WebsiteCMSView({
  news: initialNews,
  projects: initialProjects,
  sponsors: initialSponsors,
}: WebsiteCMSViewProps) {
  const [activeTab, setActiveTab] = useState<"news" | "projects" | "sponsors">("news");
  const [news, setNews] = useState<CMSNewsItem[]>(initialNews);
  const [projects, setProjects] = useState<CMSProjectItem[]>(initialProjects);
  const [sponsors, setSponsors] = useState<CMSSponsorItem[]>(initialSponsors);

  // Modals
  const [isNewsModal, setIsNewsModal] = useState(false);
  const [isProjectModal, setIsProjectModal] = useState(false);
  const [isSponsorModal, setIsSponsorModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forms
  const [newsForm, setNewsForm] = useState({ title: "", content: "" });
  const [projForm, setProjForm] = useState({ title: "", description: "", repoUrl: "", liveUrl: "" });
  const [sponForm, setSponForm] = useState({ name: "", logoUrl: "", websiteUrl: "", tier: "Gold Partner" });

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const slug = newsForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const res = await createNewsAction({ ...newsForm, slug });
    setIsSubmitting(false);
    if (res.ok) {
      setNews([{ id: res.data.id, title: newsForm.title, slug, content: newsForm.content, createdAt: new Date().toISOString() }, ...news]);
      setIsNewsModal(false);
      setNewsForm({ title: "", content: "" });
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm("Delete this bulletin?")) return;
    const res = await deleteNewsAction(id);
    if (res.ok) setNews(news.filter((n) => n.id !== id));
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const slug = projForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const res = await createProjectAction({ ...projForm, slug });
    setIsSubmitting(false);
    if (res.ok) {
      setProjects([{ id: res.data.id, title: projForm.title, slug, description: projForm.description, repoUrl: projForm.repoUrl || null, liveUrl: projForm.liveUrl || null }, ...projects]);
      setIsProjectModal(false);
      setProjForm({ title: "", description: "", repoUrl: "", liveUrl: "" });
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const res = await deleteProjectAction(id);
    if (res.ok) setProjects(projects.filter((p) => p.id !== id));
  };

  const handleCreateSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await createSponsorAction(sponForm);
    setIsSubmitting(false);
    if (res.ok) {
      setSponsors([{ id: res.data.id, name: sponForm.name, logoUrl: sponForm.logoUrl, websiteUrl: sponForm.websiteUrl || null, tier: sponForm.tier }, ...sponsors]);
      setIsSponsorModal(false);
      setSponForm({ name: "", logoUrl: "", websiteUrl: "", tier: "Gold Partner" });
    }
  };

  const handleDeleteSponsor = async (id: string) => {
    if (!confirm("Remove this sponsor?")) return;
    const res = await deleteSponsorAction(id);
    if (res.ok) setSponsors(sponsors.filter((s) => s.id !== id));
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Website Content CMS</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage live public website bulletins, student project listings, and partner logos.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === "news" && (
            <Button onClick={() => setIsNewsModal(true)} className="h-10 px-4 rounded-xl bg-[#5B50E5] hover:bg-[#4C40D4] text-white text-xs font-bold shadow-md">
              <Plus className="w-4 h-4 mr-1.5" />
              <span>New Story</span>
            </Button>
          )}
          {activeTab === "projects" && (
            <Button onClick={() => setIsProjectModal(true)} className="h-10 px-4 rounded-xl bg-[#5B50E5] hover:bg-[#4C40D4] text-white text-xs font-bold shadow-md">
              <Plus className="w-4 h-4 mr-1.5" />
              <span>New Project</span>
            </Button>
          )}
          {activeTab === "sponsors" && (
            <Button onClick={() => setIsSponsorModal(true)} className="h-10 px-4 rounded-xl bg-[#5B50E5] hover:bg-[#4C40D4] text-white text-xs font-bold shadow-md">
              <Plus className="w-4 h-4 mr-1.5" />
              <span>New Sponsor</span>
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        {[
          { id: "news", label: "News & Bulletins", icon: Newspaper, count: news.length },
          { id: "projects", label: "Showcase Projects", icon: FolderGit2, count: projects.length },
          { id: "sponsors", label: "Partners & Sponsors", icon: Building, count: sponsors.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "news" | "projects" | "sponsors")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isSelected
                  ? "bg-[#5B50E5] text-white shadow-sm"
                  : "bg-white text-muted-foreground border border-border/60 hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="text-[10px] opacity-80 font-normal">({tab.count})</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: News */}
      {activeTab === "news" && (
        <div className="space-y-4">
          {news.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-white">
              <p className="text-xs text-muted-foreground">No news articles published. Click &ldquo;New Story&rdquo; to draft one.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {news.map((item) => (
                <div key={item.id} className="p-5 rounded-2xl border border-border/70 bg-white shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#5B50E5] uppercase">Bulletin</span>
                    <h3 className="text-base font-bold text-foreground mt-1 line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{item.content}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</span>
                    <button onClick={() => handleDeleteNews(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Projects */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-white">
              <p className="text-xs text-muted-foreground">No projects listed. Click &ldquo;New Project&rdquo; to showcase one.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((item) => (
                <div key={item.id} className="p-5 rounded-2xl border border-border/70 bg-white shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {item.repoUrl && (
                        <a href={item.repoUrl} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                          <Code className="w-3.5 h-3.5" />
                          <span>Code</span>
                        </a>
                      )}
                      {item.liveUrl && (
                        <a href={item.liveUrl} target="_blank" rel="noreferrer" className="text-xs text-[#5B50E5] hover:text-[#4C40D4] flex items-center gap-1">
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </a>
                      )}
                    </div>
                    <button onClick={() => handleDeleteProject(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Sponsors */}
      {activeTab === "sponsors" && (
        <div className="space-y-4">
          {sponsors.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-white">
              <p className="text-xs text-muted-foreground">No sponsors listed. Click &ldquo;New Sponsor&rdquo; to add a partner.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {sponsors.map((item) => (
                <div key={item.id} className="p-5 rounded-2xl border border-border/70 bg-white shadow-sm flex flex-col items-center text-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-sm mb-2 text-foreground">
                    {item.name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{item.name}</h4>
                    <span className="text-[10px] font-semibold text-[#5B50E5]">{item.tier ?? "Partner"}</span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/40 w-full flex items-center justify-between">
                    {item.websiteUrl ? (
                      <a href={item.websiteUrl} target="_blank" rel="noreferrer" className="text-[11px] text-muted-foreground hover:text-foreground">
                        Website
                      </a>
                    ) : <span />}
                    <button onClick={() => handleDeleteSponsor(item.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* News Modal */}
      {isNewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-border bg-white p-6 shadow-2xl relative">
            <button onClick={() => setIsNewsModal(false)} className="absolute top-5 right-5 p-2 rounded-full hover:bg-muted text-muted-foreground">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-foreground">Draft News Story</h3>
            <form onSubmit={handleCreateNews} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="nw-title" className="text-xs font-semibold">Title</Label>
                <Input id="nw-title" required value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} placeholder="Headline..." className="mt-1" />
              </div>
              <div>
                <Label htmlFor="nw-cnt" className="text-xs font-semibold">Content</Label>
                <textarea id="nw-cnt" required rows={4} value={newsForm.content} onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })} placeholder="Write article body..." className="mt-1 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs" />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full h-10 rounded-xl bg-[#5B50E5] hover:bg-[#4C40D4] text-white font-bold text-xs">
                {isSubmitting ? "Publishing..." : "Publish Bulletin"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {isProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-border bg-white p-6 shadow-2xl relative">
            <button onClick={() => setIsProjectModal(false)} className="absolute top-5 right-5 p-2 rounded-full hover:bg-muted text-muted-foreground">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-foreground">Add Student Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="pj-title" className="text-xs font-semibold">Project Title</Label>
                <Input id="pj-title" required value={projForm.title} onChange={(e) => setProjForm({ ...projForm, title: e.target.value })} placeholder="e.g. Stage Visualizer" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="pj-desc" className="text-xs font-semibold">Description</Label>
                <textarea id="pj-desc" required rows={3} value={projForm.description} onChange={(e) => setProjForm({ ...projForm, description: e.target.value })} placeholder="Brief summary of technology & purpose..." className="mt-1 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs" />
              </div>
              <div>
                <Label htmlFor="pj-repo" className="text-xs font-semibold">GitHub Repo (Optional)</Label>
                <Input id="pj-repo" value={projForm.repoUrl} onChange={(e) => setProjForm({ ...projForm, repoUrl: e.target.value })} placeholder="https://github.com/..." className="mt-1" />
              </div>
              <div>
                <Label htmlFor="pj-live" className="text-xs font-semibold">Live Preview URL (Optional)</Label>
                <Input id="pj-live" value={projForm.liveUrl} onChange={(e) => setProjForm({ ...projForm, liveUrl: e.target.value })} placeholder="https://..." className="mt-1" />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full h-10 rounded-xl bg-[#5B50E5] hover:bg-[#4C40D4] text-white font-bold text-xs">
                {isSubmitting ? "Saving..." : "Save Project"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Sponsor Modal */}
      {isSponsorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-border bg-white p-6 shadow-2xl relative">
            <button onClick={() => setIsSponsorModal(false)} className="absolute top-5 right-5 p-2 rounded-full hover:bg-muted text-muted-foreground">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-foreground">Add Partner / Sponsor</h3>
            <form onSubmit={handleCreateSponsor} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="sp-name" className="text-xs font-semibold">Partner Name</Label>
                <Input id="sp-name" required value={sponForm.name} onChange={(e) => setSponForm({ ...sponForm, name: e.target.value })} placeholder="e.g. Neon Postgres" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="sp-tier" className="text-xs font-semibold">Sponsorship Tier</Label>
                <select id="sp-tier" value={sponForm.tier} onChange={(e) => setSponForm({ ...sponForm, tier: e.target.value })} className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm">
                  <option value="Gold Partner">Gold Partner</option>
                  <option value="Silver Partner">Silver Partner</option>
                  <option value="Community Partner">Community Partner</option>
                </select>
              </div>
              <div>
                <Label htmlFor="sp-logo" className="text-xs font-semibold">Logo URL</Label>
                <Input id="sp-logo" required value={sponForm.logoUrl} onChange={(e) => setSponForm({ ...sponForm, logoUrl: e.target.value })} placeholder="https://..." className="mt-1" />
              </div>
              <div>
                <Label htmlFor="sp-site" className="text-xs font-semibold">Website URL (Optional)</Label>
                <Input id="sp-site" value={sponForm.websiteUrl} onChange={(e) => setSponForm({ ...sponForm, websiteUrl: e.target.value })} placeholder="https://..." className="mt-1" />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full h-10 rounded-xl bg-[#5B50E5] hover:bg-[#4C40D4] text-white font-bold text-xs">
                {isSubmitting ? "Adding..." : "Add Partner"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
