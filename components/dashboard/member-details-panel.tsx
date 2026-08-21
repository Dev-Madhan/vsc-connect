"use client";

import { X, Mail, Phone, IdCard, Calendar, Users, Tag, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { MockMember, YEAR_LABELS, MemberStatus } from "@/lib/members-data";

interface MemberDetailsPanelProps {
  member: MockMember | null;
  isOpen: boolean;
  onClose: () => void;
}

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

export function MemberDetailsPanel({ member, isOpen, onClose }: MemberDetailsPanelProps) {
  return (
    <aside
      className={cn(
        "shrink-0 bg-white border-l border-gray-100 flex flex-col transition-all duration-300 overflow-hidden",
        isOpen ? "w-72 lg:w-80" : "w-0"
      )}
    >
      {member && isOpen && (
        <div className="flex flex-col h-full p-5 overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Member Details
            </p>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Avatar & Name */}
          <div className="flex flex-col items-center text-center gap-3 mb-6">
            {member.avatarUrl ? (
              <img
                src={member.avatarUrl}
                alt={`${member.firstName} ${member.lastName}`}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-50"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#1c64ec] text-white flex items-center justify-center text-2xl font-bold ring-4 ring-blue-50">
                {member.firstName[0]}{member.lastName[0]}
              </div>
            )}
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {member.firstName} {member.lastName}
              </h2>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold",
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
            </div>
          </div>

          {/* Details List */}
          <div className="space-y-3">
            <DetailRow
              icon={<IdCard className="w-3.5 h-3.5 text-[#1c64ec]" />}
              label="Membership ID"
              value={
                <span className="font-mono text-[11px] text-[#1c64ec] font-semibold bg-blue-50 px-1.5 py-0.5 rounded">
                  {member.membershipId}
                </span>
              }
            />
            <DetailRow
              icon={<Tag className="w-3.5 h-3.5 text-gray-400" />}
              label="Register No."
              value={member.registerNumber}
            />
            <DetailRow
              icon={<Mail className="w-3.5 h-3.5 text-gray-400" />}
              label="Email"
              value={
                <a
                  href={`mailto:${member.email}`}
                  className="text-[#1c64ec] hover:underline truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  {member.email}
                </a>
              }
            />
            {member.phoneNumber && (
              <DetailRow
                icon={<Phone className="w-3.5 h-3.5 text-gray-400" />}
                label="Phone"
                value={member.phoneNumber}
              />
            )}
            <DetailRow
              icon={<Calendar className="w-3.5 h-3.5 text-gray-400" />}
              label="Year"
              value={YEAR_LABELS[member.year]}
            />
            {member.subClub && (
              <DetailRow
                icon={<Users className="w-3.5 h-3.5 text-gray-400" />}
                label="Sub-club"
                value={member.subClub}
              />
            )}
            <DetailRow
              icon={<Calendar className="w-3.5 h-3.5 text-gray-400" />}
              label="Joined"
              value={new Date(member.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-5 border-t border-gray-100 space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
              Quick Actions
            </p>
            <button
              type="button"
              onClick={() => alert(`Generating membership card for ${member.firstName}…`)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#f1f4f9] hover:bg-blue-50 text-sm font-medium text-gray-700 hover:text-[#1c64ec] transition-colors"
            >
              <IdCard className="w-4 h-4" />
              Generate Membership Card
            </button>
            <button
              type="button"
              onClick={() => alert(`Generating OD document for ${member.firstName}…`)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#f1f4f9] hover:bg-blue-50 text-sm font-medium text-gray-700 hover:text-[#1c64ec] transition-colors"
            >
              <FileText className="w-4 h-4" />
              Generate OD Document
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <div className="text-xs text-gray-800 font-medium break-words">{value}</div>
      </div>
    </div>
  );
}
