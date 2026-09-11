"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface UserAccountItem {
  id: string;
  name: string;
  email: string;
  username: string | null;
  role: string;
  subClubName: string | null;
  createdAt: string;
}

interface AccountsViewProps {
  accounts: UserAccountItem[];
}

export function AccountsView({ accounts }: AccountsViewProps) {
  const [search, setSearch] = useState("");

  const filtered = accounts.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      (a.username && a.username.toLowerCase().includes(search.toLowerCase())) ||
      (a.subClubName && a.subClubName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Council & Staff Accounts</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Super Administrator directory of all active officer accounts and assigned wings.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search accounts by name or email..."
            className="pl-9 h-10 rounded-xl bg-white border-border/70 text-xs"
          />
        </div>
      </div>

      <div className="p-6 rounded-3xl border border-border/70 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-border">
            <p className="text-xs text-muted-foreground">No accounts found matching search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="py-2.5 px-3">Council Member</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Assigned Role</th>
                  <th className="py-2.5 px-3">Sub-Club Assignment</th>
                  <th className="py-2.5 px-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filtered.map((acc) => (
                  <tr key={acc.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#5B50E5]/10 text-[#5B50E5] font-bold flex items-center justify-center text-xs">
                          {acc.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{acc.name}</p>
                          {acc.username && (
                            <span className="text-[10px] text-muted-foreground font-mono">@{acc.username}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{acc.email}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#5B50E5]/10 text-[#5B50E5]">
                        {acc.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-foreground">
                      {acc.subClubName ?? "All Wings (Central Council)"}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">
                      {new Date(acc.createdAt).toLocaleDateString()}
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
