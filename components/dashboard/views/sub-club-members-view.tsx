"use client";

import { useState, useTransition, useMemo } from "react";
import {
  Users,
  UserPlus,
  Search,
  X,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  UserCog,
  Info,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  IdCard,
  Hash,
  BookOpen,
  Calendar,
  Building2,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  addMemberAction,
  editMemberAction,
  removeMemberAction,
} from "@/app/dashboard/members/actions";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MemberRow {
  id: string;
  membershipId: string;
  registerNumber: string;
  vmNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  department: string;
  gender: string;
  year: string;
  status: string;
  subClubId: string | null;
  subClubName: string | null;
  createdAt: string;
}

export interface SubClubOption {
  id: string;
  name: string;
  slug: string;
}

interface SubClubMembersViewProps {
  subClubId: string;
  subClubName: string;
  members: MemberRow[];
  allSubClubs?: SubClubOption[];
  isScoped: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const YEAR_LABELS: Record<string, string> = {
  FIRST: "1st Year",
  SECOND: "2nd Year",
  THIRD: "3rd Year",
  FOURTH: "4th Year",
  ALUMNI: "Alumni",
};

const STATUS_META: Record<string, { label: string; dot: string; chip: string }> = {
  ACTIVE:    { label: "Active",    dot: "bg-emerald-500", chip: "bg-emerald-100 text-emerald-700" },
  INACTIVE:  { label: "Inactive",  dot: "bg-amber-500",   chip: "bg-amber-100 text-amber-700" },
  SUSPENDED: { label: "Suspended", dot: "bg-red-500",     chip: "bg-red-100 text-red-600" },
};

const YEAR_OPTIONS = ["FIRST", "SECOND", "THIRD", "FOURTH", "ALUMNI"];
const GENDER_OPTIONS = ["MALE", "FEMALE", "OTHER"];
const STATUS_OPTIONS = ["ACTIVE", "INACTIVE", "SUSPENDED"];
type SortField = "membershipId" | "name" | "vmNumber" | "department" | "year" | "status";
type SortDir = "asc" | "desc";

// ─── Empty form state ─────────────────────────────────────────────────────────

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  registerNumber: string;
  vmNumber: string;
  department: string;
  gender: string;
  year: string;
  status: string;
  subClubId: string;
};

const EMPTY_FORM: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  registerNumber: "",
  vmNumber: "",
  department: "",
  gender: "MALE",
  year: "FIRST",
  status: "ACTIVE",
  subClubId: "",
};

// ─── Main component ───────────────────────────────────────────────────────────

export function SubClubMembersView({
  subClubId,
  subClubName,
  members: initialMembers,
  allSubClubs = [],
  isScoped,
}: SubClubMembersViewProps) {
  // Local state mirrors DB until revalidation
  const [members, setMembers] = useState<MemberRow[]>(initialMembers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortField, setSortField] = useState<SortField>("membershipId");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // Modal / panel state
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<MemberRow | null>(null);
  const [viewTarget, setViewTarget] = useState<MemberRow | null>(null);
  const [removeTarget, setRemoveTarget] = useState<MemberRow | null>(null);

  // Form state
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  // ── Derived ─────────────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    let list = members;
    if (statusFilter !== "ALL") list = list.filter((m) => m.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
          m.membershipId.toLowerCase().includes(q) ||
          m.vmNumber.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.department.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      const val = (m: MemberRow): string => {
        switch (sortField) {
          case "membershipId": return m.membershipId;
          case "name":         return `${m.firstName} ${m.lastName}`;
          case "vmNumber":     return m.vmNumber;
          case "department":   return m.department;
          case "year":         return m.year;
          case "status":       return m.status;
        }
      };
      const cmp = val(a).localeCompare(val(b));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [members, search, statusFilter, sortField, sortDir]);

  const counts = useMemo(() => ({
    ALL:       members.length,
    ACTIVE:    members.filter((m) => m.status === "ACTIVE").length,
    INACTIVE:  members.filter((m) => m.status === "INACTIVE").length,
    SUSPENDED: members.filter((m) => m.status === "SUSPENDED").length,
  }), [members]);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  function flash(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  }

  function openAdd() {
    setEditTarget(null);
    setForm({ ...EMPTY_FORM, subClubId: isScoped ? subClubId : "" });
    setFormErrors({});
    setServerError(null);
    setModalOpen(true);
  }

  function openEdit(m: MemberRow) {
    setEditTarget(m);
    setForm({
      firstName:      m.firstName,
      lastName:       m.lastName,
      email:          m.email,
      phoneNumber:    m.phoneNumber ?? "",
      registerNumber: m.registerNumber,
      vmNumber:       m.vmNumber,
      department:     m.department,
      gender:         m.gender,
      year:           m.year,
      status:         m.status,
      subClubId:      m.subClubId ?? "",
    });
    setFormErrors({});
    setServerError(null);
    setViewTarget(null);
    setModalOpen(true);
  }

  function validateForm(): boolean {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.firstName.trim())      errs.firstName      = "First name is required";
    if (!form.lastName.trim())       errs.lastName       = "Last name is required";
    if (!form.email.trim())          errs.email          = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email";
    if (!form.registerNumber.trim()) errs.registerNumber = "Register number is required";
    if (!form.vmNumber.trim())       errs.vmNumber       = "VM number is required";
    if (!form.department.trim())     errs.department     = "Department is required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validateForm()) return;
    setServerError(null);

    startTransition(async () => {
      if (editTarget) {
        // ── Edit ──
        const result = await editMemberAction({
          id:             editTarget.id,
          firstName:      form.firstName,
          lastName:       form.lastName,
          email:          form.email,
          phoneNumber:    form.phoneNumber || undefined,
          registerNumber: form.registerNumber,
          vmNumber:       form.vmNumber,
          department:     form.department,
          gender:         form.gender as never,
          year:           form.year as never,
          status:         form.status as never,
          subClubId:      form.subClubId || undefined,
        });
        if (!result.ok) { setServerError(result.error); return; }
        setMembers((prev) =>
          prev.map((m) =>
            m.id === editTarget.id
              ? {
                  ...m,
                  ...form,
                  phoneNumber: form.phoneNumber || null,
                  subClubId:   form.subClubId || null,
                  subClubName: allSubClubs.find((sc) => sc.id === form.subClubId)?.name ?? m.subClubName,
                }
              : m
          )
        );
        flash(`${form.firstName} ${form.lastName} updated.`);
      } else {
        // ── Add ──
        const result = await addMemberAction({
          firstName:      form.firstName,
          lastName:       form.lastName,
          email:          form.email,
          phoneNumber:    form.phoneNumber || undefined,
          registerNumber: form.registerNumber,
          vmNumber:       form.vmNumber,
          department:     form.department,
          gender:         form.gender as never,
          year:           form.year as never,
          subClubId:      form.subClubId || undefined,
        });
        if (!result.ok) { setServerError(result.error); return; }
        // Optimistically add to local list
        const scName = allSubClubs.find((sc) => sc.id === form.subClubId)?.name ?? subClubName;
        setMembers((prev) => [
          ...prev,
          {
            id:             result.data.id,
            membershipId:   result.data.membershipId,
            registerNumber: form.registerNumber,
            vmNumber:       form.vmNumber,
            firstName:      form.firstName,
            lastName:       form.lastName,
            email:          form.email,
            phoneNumber:    form.phoneNumber || null,
            department:     form.department,
            gender:         form.gender,
            year:           form.year,
            status:         "ACTIVE",
            subClubId:      form.subClubId || null,
            subClubName:    scName,
            createdAt:      new Date().toISOString(),
          },
        ]);
        flash(`${form.firstName} ${form.lastName} added (${result.data.membershipId}).`);
      }
      setModalOpen(false);
    });
  }

  function handleRemove() {
    if (!removeTarget) return;
    startTransition(async () => {
      const result = await removeMemberAction(removeTarget.id);
      if (!result.ok) { setServerError(result.error); return; }
      setMembers((prev) => prev.filter((m) => m.id !== removeTarget.id));
      if (viewTarget?.id === removeTarget.id) setViewTarget(null);
      flash(`${removeTarget.firstName} ${removeTarget.lastName} removed.`);
      setRemoveTarget(null);
    });
  }

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-full">
      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#C7D2FE]/30 bg-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#5B50E5]/10 text-[#5B50E5] border border-[#C7D2FE] text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-2">
                <UserCog className="w-3 h-3" />
                {isScoped ? "Sub-Club Secretary" : "Member Management"}
              </div>
              <h1 className="text-xl font-extrabold text-[#262626] tracking-tight">
                {subClubName} — Members
              </h1>
              <p className="text-xs text-[#262626]/40 mt-0.5">
                {members.length} member{members.length !== 1 ? "s" : ""} registered
              </p>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B50E5] text-white text-sm font-semibold hover:bg-[#4a40d4] shadow-[0_2px_12px_rgba(91,80,229,0.3)] transition-all shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              Add Member
            </button>
          </div>

          {/* Scoped banner */}
          {isScoped && (
            <div className="flex items-center gap-2 mt-4 px-4 py-2.5 bg-[#5B50E5]/5 border border-[#C7D2FE] rounded-xl">
              <Info className="w-3.5 h-3.5 text-[#5B50E5] shrink-0" />
              <p className="text-xs text-[#262626]/60">
                <span className="font-semibold text-[#262626]">Scoped access.</span>{" "}
                You can only manage members of{" "}
                <span className="font-semibold text-[#5B50E5]">{subClubName}</span>.
              </p>
            </div>
          )}
        </div>

        {/* Filters row */}
        <div className="px-6 py-3 bg-white border-b border-[#C7D2FE]/20 flex flex-wrap items-center gap-3">
          {/* Status tabs */}
          <div className="flex items-center gap-1 bg-[#FAFAFA] border border-[#C7D2FE]/40 rounded-xl p-1">
            {(["ALL", "ACTIVE", "INACTIVE", "SUSPENDED"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  statusFilter === s
                    ? "bg-[#5B50E5] text-white shadow-sm"
                    : "text-[#262626]/50 hover:text-[#262626]"
                )}
              >
                {s === "ALL" ? "All" : STATUS_META[s]?.label ?? s}
                <span className="ml-1.5 opacity-70">{counts[s as keyof typeof counts] ?? 0}</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#262626]/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, VM no, department…"
              className="pl-9 pr-8 py-2 text-xs rounded-xl border border-[#C7D2FE]/40 bg-[#FAFAFA] focus:border-[#5B50E5]/50 focus:ring-2 focus:ring-[#5B50E5]/10 outline-none w-64 placeholder-[#262626]/25 text-[#262626]"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                <X className="w-3 h-3 text-[#262626]/30 hover:text-[#262626]" />
              </button>
            )}
          </div>
        </div>

        {/* Toast */}
        {successMsg && (
          <div className="mx-6 mt-3 flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            {successMsg}
          </div>
        )}

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <Users className="w-10 h-10 text-[#C7D2FE] mb-3" />
              <p className="text-sm font-semibold text-[#262626]/50">No members found</p>
              <p className="text-xs text-[#262626]/30 mt-1">
                {search ? "Try a different search term" : "Add your first member to get started"}
              </p>
              {!search && (
                <button
                  onClick={openAdd}
                  className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#5B50E5] hover:underline"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Add Member
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-[#C7D2FE]/30">
                  <Th field="membershipId" current={sortField} dir={sortDir} onSort={toggleSort}>ID</Th>
                  <Th field="name"         current={sortField} dir={sortDir} onSort={toggleSort}>Member</Th>
                  <Th field="vmNumber"     current={sortField} dir={sortDir} onSort={toggleSort}>VM No.</Th>
                  <Th field="department"   current={sortField} dir={sortDir} onSort={toggleSort}>Department</Th>
                  <Th field="year"         current={sortField} dir={sortDir} onSort={toggleSort}>Year</Th>
                  {!isScoped && (
                    <th className="py-2.5 px-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#262626]/35">
                      Sub-Club
                    </th>
                  )}
                  <Th field="status"       current={sortField} dir={sortDir} onSort={toggleSort}>Status</Th>
                  <th className="py-2.5 px-3 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C7D2FE]/15 text-xs">
                {filtered.map((m) => {
                  const st = STATUS_META[m.status] ?? STATUS_META.INACTIVE;
                  const initials = `${m.firstName[0]}${m.lastName[0]}`.toUpperCase();
                  return (
                    <tr
                      key={m.id}
                      onClick={() => setViewTarget(m)}
                      className={cn(
                        "cursor-pointer transition-colors hover:bg-[#5B50E5]/3",
                        viewTarget?.id === m.id && "bg-[#5B50E5]/5"
                      )}
                    >
                      <td className="py-3 px-3">
                        <span className="font-mono text-[11px] text-[#5B50E5] font-semibold bg-[#5B50E5]/8 px-2 py-0.5 rounded-md">
                          {m.membershipId}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#5B50E5]/10 flex items-center justify-center text-[10px] font-bold text-[#5B50E5] shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-[#262626]">{m.firstName} {m.lastName}</p>
                            <p className="text-[10px] text-[#262626]/40">{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[#262626]/70">{m.vmNumber}</td>
                      <td className="py-3 px-3 text-[#262626]/70">{m.department}</td>
                      <td className="py-3 px-3 text-[#262626]/60">{YEAR_LABELS[m.year] ?? m.year}</td>
                      {!isScoped && (
                        <td className="py-3 px-3 text-[#262626]/60">{m.subClubName ?? "—"}</td>
                      )}
                      <td className="py-3 px-3">
                        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold", st.chip)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", st.dot)} />
                          {st.label}
                        </span>
                      </td>
                      <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                        <RowMenu
                          onView={() => setViewTarget(m)}
                          onEdit={() => openEdit(m)}
                          onRemove={() => setRemoveTarget(m)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Details panel ── */}
      {viewTarget && (
        <aside className="w-72 shrink-0 border-l border-[#C7D2FE]/30 bg-white flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#C7D2FE]/20">
            <p className="text-[10px] font-bold text-[#262626]/40 uppercase tracking-wider">Member Details</p>
            <button
              onClick={() => setViewTarget(null)}
              className="p-1.5 rounded-lg text-[#262626]/30 hover:text-[#262626] hover:bg-[#FAFAFA] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-5">
            {/* Avatar + name */}
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-16 h-16 rounded-full bg-[#5B50E5]/10 flex items-center justify-center text-xl font-extrabold text-[#5B50E5] ring-4 ring-[#5B50E5]/10">
                {viewTarget.firstName[0]}{viewTarget.lastName[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-[#262626]">
                  {viewTarget.firstName} {viewTarget.lastName}
                </p>
                <span className={cn(
                  "inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full",
                  (STATUS_META[viewTarget.status] ?? STATUS_META.INACTIVE).chip
                )}>
                  <span className={cn("w-1.5 h-1.5 rounded-full", (STATUS_META[viewTarget.status] ?? STATUS_META.INACTIVE).dot)} />
                  {(STATUS_META[viewTarget.status] ?? STATUS_META.INACTIVE).label}
                </span>
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-3">
              <Detail icon={<IdCard   className="w-3.5 h-3.5 text-[#5B50E5]" />} label="Membership ID">
                <span className="font-mono text-[11px] text-[#5B50E5] font-bold bg-[#5B50E5]/8 px-1.5 py-0.5 rounded">
                  {viewTarget.membershipId}
                </span>
              </Detail>
              <Detail icon={<Hash     className="w-3.5 h-3.5 text-[#262626]/40" />} label="VM Number">
                <span className="font-mono">{viewTarget.vmNumber}</span>
              </Detail>
              <Detail icon={<Hash     className="w-3.5 h-3.5 text-[#262626]/40" />} label="Register No.">
                {viewTarget.registerNumber}
              </Detail>
              <Detail icon={<Mail     className="w-3.5 h-3.5 text-[#262626]/40" />} label="Email">
                <a href={`mailto:${viewTarget.email}`} className="text-[#5B50E5] hover:underline truncate">
                  {viewTarget.email}
                </a>
              </Detail>
              {viewTarget.phoneNumber && (
                <Detail icon={<Phone className="w-3.5 h-3.5 text-[#262626]/40" />} label="Phone">
                  {viewTarget.phoneNumber}
                </Detail>
              )}
              <Detail icon={<BookOpen className="w-3.5 h-3.5 text-[#262626]/40" />} label="Department">
                {viewTarget.department}
              </Detail>
              <Detail icon={<Calendar className="w-3.5 h-3.5 text-[#262626]/40" />} label="Year">
                {YEAR_LABELS[viewTarget.year] ?? viewTarget.year}
              </Detail>
              <Detail icon={<Building2 className="w-3.5 h-3.5 text-[#262626]/40" />} label="Club Represented">
                {viewTarget.subClubName ?? "—"}
              </Detail>
              <Detail icon={<Calendar className="w-3.5 h-3.5 text-[#262626]/40" />} label="Joined">
                {new Date(viewTarget.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </Detail>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#C7D2FE]/20 space-y-2">
              <button
                onClick={() => openEdit(viewTarget)}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#5B50E5]/8 hover:bg-[#5B50E5]/15 text-sm font-semibold text-[#5B50E5] transition-colors"
              >
                <Pencil className="w-4 h-4" /> Edit Member
              </button>
              <button
                onClick={() => setRemoveTarget(viewTarget)}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-sm font-semibold text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Remove Member
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* ── Add / Edit modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isPending && setModalOpen(false)} />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#C7D2FE]/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#5B50E5]/10 flex items-center justify-center">
                  {editTarget ? <Pencil className="w-4 h-4 text-[#5B50E5]" /> : <UserPlus className="w-4 h-4 text-[#5B50E5]" />}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#262626]">
                    {editTarget ? "Edit Member" : "Add New Member"}
                  </h2>
                  <p className="text-xs text-[#262626]/40">
                    {editTarget
                      ? `Editing ${editTarget.firstName} ${editTarget.lastName}`
                      : `Adding to ${subClubName}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => !isPending && setModalOpen(false)}
                className="p-2 rounded-xl text-[#262626]/30 hover:text-[#262626] hover:bg-[#FAFAFA] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
              {serverError && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  {serverError}
                </div>
              )}

              {/* Name */}
              <div className="grid grid-cols-2 gap-3">
                <FormField label="First Name" required error={formErrors.firstName}>
                  <input value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    placeholder="e.g. Priya" className={iCls(!!formErrors.firstName)} />
                </FormField>
                <FormField label="Last Name" required error={formErrors.lastName}>
                  <input value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    placeholder="e.g. Nair" className={iCls(!!formErrors.lastName)} />
                </FormField>
              </div>

              {/* Email */}
              <FormField label="Email Address" required error={formErrors.email}>
                <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="e.g. priya@college.edu" className={iCls(!!formErrors.email)} />
              </FormField>

              {/* VM No + Register No */}
              <div className="grid grid-cols-2 gap-3">
                <FormField label="VM Number" required error={formErrors.vmNumber}>
                  <input value={form.vmNumber} onChange={(e) => setForm((f) => ({ ...f, vmNumber: e.target.value }))}
                    placeholder="e.g. 23VM001" className={iCls(!!formErrors.vmNumber)} />
                </FormField>
                <FormField label="Register Number" required error={formErrors.registerNumber}>
                  <input value={form.registerNumber} onChange={(e) => setForm((f) => ({ ...f, registerNumber: e.target.value }))}
                    placeholder="e.g. 23CS001" className={iCls(!!formErrors.registerNumber)} />
                </FormField>
              </div>

              {/* Department + Phone */}
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Department" required error={formErrors.department}>
                  <input value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                    placeholder="e.g. Computer Science" className={iCls(!!formErrors.department)} />
                </FormField>
                <FormField label="Phone Number">
                  <input type="tel" value={form.phoneNumber} onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
                    placeholder="+91 98400 00000" className={iCls(false)} />
                </FormField>
              </div>

              {/* Gender + Year */}
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Gender">
                  <select value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))} className={sCls}>
                    {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g[0] + g.slice(1).toLowerCase()}</option>)}
                  </select>
                </FormField>
                <FormField label="Year of Study">
                  <select value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))} className={sCls}>
                    {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{YEAR_LABELS[y]}</option>)}
                  </select>
                </FormField>
              </div>

              {/* Sub-club (locked for secretaries) + Status */}
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Club Represented">
                  {isScoped ? (
                    <div className={cn(iCls(false), "flex items-center gap-2 text-[#262626]/50 cursor-not-allowed")}>
                      <Building2 className="w-3.5 h-3.5 text-[#5B50E5]" />
                      {subClubName}
                    </div>
                  ) : (
                    <select value={form.subClubId} onChange={(e) => setForm((f) => ({ ...f, subClubId: e.target.value }))} className={sCls}>
                      <option value="">None</option>
                      {allSubClubs.map((sc) => <option key={sc.id} value={sc.id}>{sc.name}</option>)}
                    </select>
                  )}
                </FormField>
                {editTarget && (
                  <FormField label="Status">
                    <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className={sCls}>
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_META[s]?.label ?? s}</option>)}
                    </select>
                  </FormField>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#C7D2FE]/20 bg-[#FAFAFA]">
              <button onClick={() => !isPending && setModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-[#262626]/60 hover:bg-[#C7D2FE]/20 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isPending}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-[#5B50E5] hover:bg-[#4a40d4] text-white shadow-sm transition-colors disabled:opacity-60"
              >
                {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {isPending ? "Saving…" : editTarget ? "Save Changes" : "Add Member"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Remove confirm dialog ── */}
      {removeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isPending && setRemoveTarget(null)} />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-center">
              <h2 className="text-base font-bold text-[#262626]">Remove Member?</h2>
              <p className="text-sm text-[#262626]/50 mt-1">
                <span className="font-semibold text-[#262626]">
                  {removeTarget.firstName} {removeTarget.lastName}
                </span>{" "}
                will be soft-deleted. This can be reversed by an admin.
              </p>
            </div>
            {serverError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{serverError}</p>
            )}
            <div className="flex gap-3">
              <button onClick={() => setRemoveTarget(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-[#262626]/60 hover:bg-[#FAFAFA] border border-[#C7D2FE]/40 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleRemove}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-60"
              >
                {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {isPending ? "Removing…" : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Th({
  field, current, dir, onSort, children,
}: {
  field: SortField; current: SortField; dir: SortDir;
  onSort: (f: SortField) => void; children: React.ReactNode;
}) {
  const active = field === current;
  return (
    <th
      onClick={() => onSort(field)}
      className="py-2.5 px-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#262626]/35 cursor-pointer hover:text-[#262626]/60 select-none transition-colors"
    >
      <span className="flex items-center gap-1">
        {children}
        {active
          ? dir === "asc"
            ? <ChevronUp className="w-3 h-3 text-[#5B50E5]" />
            : <ChevronDown className="w-3 h-3 text-[#5B50E5]" />
          : <ChevronsUpDown className="w-3 h-3 text-[#262626]/20" />}
      </span>
    </th>
  );
}

function RowMenu({ onView, onEdit, onRemove }: { onView: () => void; onEdit: () => void; onRemove: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-1.5 rounded-lg text-[#262626]/30 hover:text-[#262626] hover:bg-[#FAFAFA] transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-7 w-40 bg-white rounded-xl shadow-xl border border-[#C7D2FE]/40 py-1 z-40 text-xs text-[#262626]">
            <button onClick={() => { onView(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#FAFAFA] text-left">
              <Eye className="w-3.5 h-3.5 text-[#5B50E5]" /> View Profile
            </button>
            <button onClick={() => { onEdit(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#FAFAFA] text-left">
              <Pencil className="w-3.5 h-3.5 text-[#262626]/50" /> Edit Member
            </button>
            <div className="h-px bg-[#C7D2FE]/30 my-1" />
            <button onClick={() => { onRemove(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 text-left">
              <Trash2 className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function FormField({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[#262626]/60">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
    </div>
  );
}

function Detail({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] text-[#262626]/35 font-medium uppercase tracking-wider mb-0.5">{label}</p>
        <div className="text-xs text-[#262626]/80 font-medium break-words">{children}</div>
      </div>
    </div>
  );
}

const iCls = (err: boolean) =>
  cn(
    "w-full text-sm px-3 py-2 rounded-xl border outline-none transition-all placeholder-[#262626]/20 text-[#262626]",
    err
      ? "border-red-300 bg-red-50/30 focus:ring-2 focus:ring-red-400/30"
      : "border-[#C7D2FE]/40 bg-[#FAFAFA] hover:border-[#C7D2FE] focus:border-[#5B50E5]/50 focus:ring-2 focus:ring-[#5B50E5]/10"
  );

const sCls = cn(
  "w-full text-sm px-3 py-2 rounded-xl border border-[#C7D2FE]/40 bg-[#FAFAFA]",
  "hover:border-[#C7D2FE] focus:border-[#5B50E5]/50 focus:ring-2 focus:ring-[#5B50E5]/10",
  "outline-none text-[#262626] cursor-pointer appearance-none transition-all"
);
