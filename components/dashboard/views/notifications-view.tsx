"use client";

import React, { useState } from "react";
import {
  Bell,
  Send,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  Loader2,
} from "lucide-react";
import { broadcastNotificationAction, deleteNotificationAction } from "@/app/dashboard/notifications/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { NotificationType } from "@prisma/client";

export interface DashboardNotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
}

interface NotificationsViewProps {
  notifications: DashboardNotificationItem[];
}

export function NotificationsView({ notifications: initialNotifs }: NotificationsViewProps) {
  const [notifications, setNotifications] = useState<DashboardNotificationItem[]>(initialNotifs);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>("GENERAL");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await broadcastNotificationAction({ title, message, type });
    setIsSubmitting(false);

    if (res.ok) {
      setNotifications([
        {
          id: res.data.id,
          title,
          message,
          type,
          createdAt: new Date().toISOString(),
        },
        ...notifications,
      ]);
      setTitle("");
      setMessage("");
      setStatusMsg("Notification dispatched successfully to all club members!");
      setTimeout(() => setStatusMsg(null), 3500);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteNotificationAction(id);
    if (res.ok) {
      setNotifications(notifications.filter((n) => n.id !== id));
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Communications & Broadcasts</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Push system-wide announcements, event reminders, and emergency alerts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Create Broadcast */}
        <div className="lg:col-span-5 p-6 rounded-3xl border border-border/70 bg-white shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#5B50E5]/10 text-[#5B50E5] flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">New Broadcast</h3>
              <p className="text-[11px] text-muted-foreground">Dispatches in-app and email digests</p>
            </div>
          </div>

          {statusMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <Label htmlFor="notif-title" className="text-xs font-semibold">Title</Label>
              <Input
                id="notif-title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mandatory Contingent Meeting"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="notif-type" className="text-xs font-semibold">Notification Type</Label>
              <select
                id="notif-type"
                value={type}
                onChange={(e) => setType(e.target.value as NotificationType)}
                className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm"
              >
                <option value="GENERAL">General Notice</option>
                <option value="EVENT">Event Alert</option>
                <option value="SYSTEM">System Broadcast</option>
              </select>
            </div>

            <div>
              <Label htmlFor="notif-msg" className="text-xs font-semibold">Message Body</Label>
              <textarea
                id="notif-msg"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Specify venue, timing, or required action items..."
                className="mt-1 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 rounded-xl bg-[#5B50E5] hover:bg-[#4C40D4] text-white font-bold text-xs shadow-md"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Dispatching...</span>
                </div>
              ) : (
                "Transmit Broadcast"
              )}
            </Button>
          </form>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Broadcast History ({notifications.length})
          </h3>

          {notifications.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-white space-y-2">
              <Bell className="w-10 h-10 text-muted-foreground/40 mx-auto" />
              <p className="text-xs text-muted-foreground">No recent notifications dispatched.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => {
                const isAlert = n.type === "SYSTEM";
                const isEvent = n.type === "EVENT";
                return (
                  <div
                    key={n.id}
                    className="p-5 rounded-2xl border border-border/70 bg-white shadow-sm flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isAlert
                            ? "bg-rose-100 text-rose-600"
                            : isEvent
                            ? "bg-blue-100 text-blue-600"
                            : "bg-purple-100 text-purple-600"
                        }`}
                      >
                        {isAlert ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : isEvent ? (
                          <Sparkles className="w-4 h-4" />
                        ) : (
                          <Info className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-foreground">{n.title}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted uppercase text-muted-foreground">
                            {n.type}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
                        <span className="text-[10px] text-muted-foreground/70 mt-2 block">
                          {new Date(n.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(n.id)}
                      className="p-1.5 text-muted-foreground hover:text-red-500 rounded-lg transition-colors"
                      title="Delete notice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
