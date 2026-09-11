"use client";

import React, { useState } from "react";
import {
  Calendar,
  Plus,
  Search,
  MapPin,
  Users,
  Trash2,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { createEventAction, updateEventStatusAction, deleteEventAction } from "@/app/dashboard/events/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EventStatus } from "@prisma/client";

export interface DashboardEventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  eventDate: string;
  location: string | null;
  status: EventStatus;
  clubName: string | null;
  participantsCount: number;
}

interface EventsViewProps {
  events: DashboardEventItem[];
  subClubs: { id: string; name: string }[];
  isScoped?: boolean;
}

export function EventsView({ events: initialEvents, subClubs }: EventsViewProps) {
  const [events, setEvents] = useState<DashboardEventItem[]>(initialEvents);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    eventDate: "",
    location: "",
    clubId: subClubs[0]?.id ?? "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(search.toLowerCase()) ||
      (evt.location && evt.location.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "ALL" || evt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const generatedSlug = form.slug.trim() || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    const res = await createEventAction({
      ...form,
      slug: generatedSlug,
    });

    setIsSubmitting(false);

    if (res.ok) {
      setEvents((prev) => [
        {
          id: res.data.id,
          title: form.title,
          slug: generatedSlug,
          description: form.description,
          eventDate: new Date(form.eventDate).toISOString(),
          location: form.location || null,
          status: "DRAFT",
          clubName: subClubs.find((c) => c.id === form.clubId)?.name ?? null,
          participantsCount: 0,
        },
        ...prev,
      ]);
      setIsCreateOpen(false);
      setForm({ title: "", slug: "", description: "", eventDate: "", location: "", clubId: subClubs[0]?.id ?? "" });
    } else {
      setError(res.error);
    }
  };

  const handleStatusChange = async (eventId: string, newStatus: EventStatus) => {
    const res = await updateEventStatusAction(eventId, newStatus);
    if (res.ok) {
      setEvents((prev) =>
        prev.map((evt) => (evt.id === eventId ? { ...evt, status: newStatus } : evt))
      );
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    const res = await deleteEventAction(eventId);
    if (res.ok) {
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Event Operations</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Plan, publish, and track attendance for Vistara club events & workshops.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="h-10 px-5 rounded-xl bg-[#5B50E5] hover:bg-[#4C40D4] text-white font-bold text-xs shadow-md"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>New Event</span>
        </Button>
      </div>

      {/* Controls: Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title or venue..."
            className="pl-9 h-10 rounded-xl bg-white border-border/70 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(["ALL", "DRAFT", "PUBLISHED", "ONGOING", "COMPLETED", "CANCELLED"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                statusFilter === status
                  ? "bg-[#5B50E5] text-white shadow-sm"
                  : "bg-white text-muted-foreground border border-border/60 hover:text-foreground"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Events Table / Cards */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-white space-y-3">
          <Calendar className="w-10 h-10 text-muted-foreground/40 mx-auto" />
          <h3 className="text-sm font-bold text-foreground">No events found</h3>
          <p className="text-xs text-muted-foreground">Try adjusting your filters or click &ldquo;New Event&rdquo; to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((evt) => (
            <div
              key={evt.id}
              className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm flex flex-col justify-between hover:border-[#5B50E5]/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#5B50E5]/10 text-[#5B50E5]">
                    {evt.clubName ?? "General"}
                  </span>
                  <select
                    value={evt.status}
                    onChange={(e) => handleStatusChange(evt.id, e.target.value as EventStatus)}
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full border border-border bg-muted/40 cursor-pointer focus:outline-none"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="ONGOING">ONGOING</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <h3 className="text-base font-bold text-foreground line-clamp-1">{evt.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{evt.description}</p>

                <div className="mt-4 pt-3 border-t border-border/40 space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#5B50E5]" />
                    <span>{new Date(evt.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                  {evt.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#5B50E5]" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#5B50E5]" />
                    <span>{evt.participantsCount} Registered Participants</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground font-mono">/{evt.slug}</span>
                <button
                  onClick={() => handleDelete(evt.id)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Event Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-white p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-foreground">Create New Event</h3>
            <p className="text-xs text-muted-foreground mt-0.5 mb-5">Draft will be visible in the calendar once published.</p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <Label htmlFor="evt-title" className="text-xs font-semibold">Event Title</Label>
                <Input
                  id="evt-title"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Annual Unplugged Music Night"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="evt-date" className="text-xs font-semibold">Event Date & Time</Label>
                  <Input
                    id="evt-date"
                    type="datetime-local"
                    required
                    value={form.eventDate}
                    onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="evt-club" className="text-xs font-semibold">Organizing Sub-Club</Label>
                  <select
                    id="evt-club"
                    value={form.clubId}
                    onChange={(e) => setForm({ ...form, clubId: e.target.value })}
                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus-visible:outline-none"
                  >
                    {subClubs.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="evt-loc" className="text-xs font-semibold">Location / Venue</Label>
                <Input
                  id="evt-loc"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Open Air Amphitheatre"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="evt-desc" className="text-xs font-semibold">Description</Label>
                <textarea
                  id="evt-desc"
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Outline activities, schedule, and participation guidelines..."
                  className="mt-1 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-sm focus-visible:outline-none"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-xl bg-[#5B50E5] hover:bg-[#4C40D4] text-white font-bold text-xs shadow-md"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Event...</span>
                    </div>
                  ) : (
                    "Save & Create Draft"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
