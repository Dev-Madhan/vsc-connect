"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Archive,
  IdCard,
  FileText,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MockMember, MemberStatus, YEAR_LABELS } from "@/lib/members-data";

interface MembersTableProps {
  members: MockMember[];
  onView: (member: MockMember) => void;
  onEdit: (member: MockMember) => void;
  onArchive: (memberId: string) => void;
}

type SortField = "membershipId" | "name" | "year" | "status" | "subClub" | "createdAt";
type SortDir = "asc" | "desc";

const STATUS_STYLES: Record<MemberStatus, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  INACTIVE: "bg-amber-100 text-amber-700",
  SUSPENDED: "bg-red-100 text-red-600",
};

const STATUS_LABELS: Record<MemberStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  SUSPENDED: "Suspended",
};

export function MembersTable({ members, onView, onEdit, onArchive }: MembersTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("membershipId");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sorted = [...members].sort((a, b) => {
    let aVal = "";
    let bVal = "";
    switch (sortField) {
      case "membershipId":
        aVal = a.membershipId;
        bVal = b.membershipId;
        break;
      case "name":
        aVal = `${a.firstName} ${a.lastName}`;
        bVal = `${b.firstName} ${b.lastName}`;
        break;
      case "year":
        aVal = a.year;
        bVal = b.year;
        break;
      case "status":
        aVal = a.status;
        bVal = b.status;
        break;
      case "subClub":
        aVal = a.subClub ?? "";
        bVal = b.subClub ?? "";
        break;
      case "createdAt":
        aVal = a.createdAt;
        bVal = b.createdAt;
        break;
    }
    const cmp = aVal.localeCompare(bVal);
    return sortDir === "asc" ? cmp : -cmp;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown className="w-3 h-3 ml-1 text-gray-300" />;
    return sortDir === "asc"
      ? <ChevronUp className="w-3 h-3 ml-1 text-[#1c64ec]" />
      : <ChevronDown className="w-3 h-3 ml-1 text-[#1c64ec]" />;
  };

  const thClass =
    "py-2.5 px-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 cursor-pointer hover:text-gray-700 select-none";

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <IdCard className="w-12 h-12 mb-3 text-gray-200" />
        <p className="text-sm font-semibold text-gray-500">No members found</p>
        <p className="text-xs mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto select-none">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100">
            <th className={thClass} onClick={() => handleSort("membershipId")}>
              <span className="flex items-center">
                ID <SortIcon field="membershipId" />
              </span>
            </th>
            <th className={thClass} onClick={() => handleSort("name")}>
              <span className="flex items-center">
                Member <SortIcon field="name" />
              </span>
            </th>
            <th className={thClass} onClick={() => handleSort("year")}>
              <span className="flex items-center">
                Year <SortIcon field="year" />
              </span>
            </th>
            <th className={thClass} onClick={() => handleSort("subClub")}>
              <span className="flex items-center">
                Sub-club <SortIcon field="subClub" />
              </span>
            </th>
            <th className={thClass} onClick={() => handleSort("status")}>
              <span className="flex items-center">
                Status <SortIcon field="status" />
              </span>
            </th>
            <th className={thClass} onClick={() => handleSort("createdAt")}>
              <span className="flex items-center">
                Joined <SortIcon field="createdAt" />
              </span>
            </th>
            <th className="py-2.5 px-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100/70 text-xs">
          {sorted.map((member) => {
            const fullName = `${member.firstName} ${member.lastName}`;
            const initials = `${member.firstName[0]}${member.lastName[0]}`;

            return (
              <tr
                key={member.id}
                onClick={() => onView(member)}
                className="group hover:bg-[#f8fafd] transition-colors cursor-pointer"
              >
                {/* Membership ID */}
                <td className="py-3 px-3">
                  <span className="font-mono text-[11px] text-[#1c64ec] font-semibold bg-blue-50 px-2 py-0.5 rounded-md">
                    {member.membershipId}
                  </span>
                </td>

                {/* Member Name + Avatar */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2.5">
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={fullName}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-100 shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#1c64ec] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {initials}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{fullName}</p>
                      <p className="text-gray-400 text-[10px]">{member.email}</p>
                    </div>
                  </div>
                </td>

                {/* Year */}
                <td className="py-3 px-3 text-gray-600 font-normal">
                  {YEAR_LABELS[member.year]}
                </td>

                {/* Sub-club */}
                <td className="py-3 px-3">
                  {member.subClub ? (
                    <span className="text-gray-700 font-normal">{member.subClub}</span>
                  ) : (
                    <span className="text-gray-300 italic">—</span>
                  )}
                </td>

                {/* Status Badge */}
                <td className="py-3 px-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold",
                      STATUS_STYLES[member.status]
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        member.status === "ACTIVE" && "bg-emerald-500",
                        member.status === "INACTIVE" && "bg-amber-500",
                        member.status === "SUSPENDED" && "bg-red-500"
                      )}
                    />
                    {STATUS_LABELS[member.status]}
                  </span>
                </td>

                {/* Joined Date */}
                <td className="py-3 px-3 text-gray-500 font-normal">
                  {new Date(member.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                {/* Actions */}
                <td className="py-3 px-3 text-right relative">
                  <div
                    className="relative inline-block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setActiveMenuId(activeMenuId === member.id ? null : member.id)
                      }
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                      title="Actions"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {activeMenuId === member.id && (
                      <div className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 text-xs text-gray-700 animate-in fade-in zoom-in-95 duration-100">
                        <button
                          onClick={() => { onView(member); setActiveMenuId(null); }}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-left"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-500" />
                          View Profile
                        </button>
                        <button
                          onClick={() => { onEdit(member); setActiveMenuId(null); }}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-left"
                        >
                          <Pencil className="w-3.5 h-3.5 text-gray-500" />
                          Edit Member
                        </button>
                        <button
                          onClick={() => alert(`Generating membership card for ${fullName}…`)}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-left"
                        >
                          <IdCard className="w-3.5 h-3.5 text-emerald-500" />
                          Generate Card
                        </button>
                        <button
                          onClick={() => alert(`Generating OD document for ${fullName}…`)}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-left"
                        >
                          <FileText className="w-3.5 h-3.5 text-purple-500" />
                          OD Document
                        </button>
                        <div className="h-px bg-gray-100 my-1" />
                        <button
                          onClick={() => { onArchive(member.id); setActiveMenuId(null); }}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 text-left"
                        >
                          <Archive className="w-3.5 h-3.5 text-red-500" />
                          Archive Member
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
