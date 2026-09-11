"use client";

import React, { useState } from "react";
import {
  Database,
  ShieldCheck,
  Search,
  Activity,
  Users,
  CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export interface AuditLogItem {
  id: string;
  userId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  ipAddress: string | null;
  createdAt: string;
}

export interface SystemStats {
  totalUsers: number;
  totalMembers: number;
  totalEvents: number;
  totalODDocuments: number;
  totalAuditLogs: number;
  dbStatus: "Healthy" | "Degraded";
}

interface SystemAuditViewProps {
  stats: SystemStats;
  logs: AuditLogItem[];
}

export function SystemAuditView({ stats, logs }: SystemAuditViewProps) {
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState<string>("ALL");

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.entity.toLowerCase().includes(search.toLowerCase()) ||
      (l.details && l.details.toLowerCase().includes(search.toLowerCase()));
    const matchesEntity = entityFilter === "ALL" || l.entity === entityFilter;
    return matchesSearch && matchesEntity;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">System Health & Audit Logs</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Real-time diagnostics, database ledger, and immutable security audit logs.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-border/70 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Database Engine</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-foreground mt-2 font-sans">Neon Postgres</p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 mt-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Connection {stats.dbStatus}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border/70 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">OD Passes Issued</span>
            <div className="w-8 h-8 rounded-xl bg-[#5B50E5]/10 text-[#5B50E5] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-foreground mt-2 font-sans">{stats.totalODDocuments}</p>
          <span className="text-[11px] text-muted-foreground mt-1 block">Digitally Signed PDFs</span>
        </div>

        <div className="p-5 rounded-2xl border border-border/70 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Registered Roster</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-foreground mt-2 font-sans">{stats.totalMembers}</p>
          <span className="text-[11px] text-muted-foreground mt-1 block">{stats.totalUsers} Council Accounts</span>
        </div>

        <div className="p-5 rounded-2xl border border-border/70 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Audit Trail Entries</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-foreground mt-2 font-sans">{stats.totalAuditLogs}</p>
          <span className="text-[11px] text-muted-foreground mt-1 block">Immutable Records</span>
        </div>
      </div>

      {/* Audit Log Table Section */}
      <div className="p-6 rounded-3xl border border-border/70 bg-white shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-foreground">Security Audit Trail</h3>
            <p className="text-xs text-muted-foreground">Tracks member alterations, permission grants, and OD dispatches.</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="h-9 px-3 text-xs rounded-xl border border-border bg-white"
            >
              <option value="ALL">All Entities</option>
              <option value="Member">Member</option>
              <option value="Event">Event</option>
              <option value="ODDocument">ODDocument</option>
              <option value="User">User</option>
            </select>
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search audit trail..."
                className="pl-8 h-9 text-xs rounded-xl bg-muted/40"
              />
            </div>
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-border">
            <p className="text-xs text-muted-foreground">No matching audit records recorded.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Entity</th>
                  <th className="py-2.5 px-3">Details</th>
                  <th className="py-2.5 px-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 px-3 text-muted-foreground font-mono text-[11px] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-foreground px-2 py-0.5 rounded bg-muted text-[11px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#5B50E5]">{log.entity}</td>
                    <td className="py-2.5 px-3 text-muted-foreground max-w-xs truncate font-mono text-[11px]">
                      {log.details ?? "—"}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground font-mono text-[11px]">
                      {log.ipAddress ?? "Internal"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
