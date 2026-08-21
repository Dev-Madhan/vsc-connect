"use client";

import { useState, useEffect } from "react";
import { X, UserPlus, Pencil, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MockMember,
  Gender,
  Year,
  MemberStatus,
  YEAR_LABELS,
  SUB_CLUBS,
} from "@/lib/members-data";

interface MemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: MockMember) => void;
  editMember?: MockMember | null;
}

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  registerNumber: string;
  gender: Gender;
  year: Year;
  status: MemberStatus;
  subClub: string;
};

const EMPTY_FORM: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  registerNumber: "",
  gender: "MALE",
  year: "FIRST",
  status: "ACTIVE",
  subClub: "",
};

function generateMembershipId(existingCount: number) {
  const year = new Date().getFullYear();
  const seq = String(existingCount + 1).padStart(4, "0");
  return `VSC-${year}-${seq}`;
}

function uuid() {
  return `mem-${Math.random().toString(36).slice(2, 9)}`;
}

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

const STATUS_OPTIONS: { value: MemberStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspended" },
];

export function MemberFormModal({
  isOpen,
  onClose,
  onSave,
  editMember,
}: MemberFormModalProps) {
  const isEdit = !!editMember;
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [saving, setSaving] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editMember) {
      setForm({
        firstName: editMember.firstName,
        lastName: editMember.lastName,
        email: editMember.email,
        phoneNumber: editMember.phoneNumber ?? "",
        registerNumber: editMember.registerNumber,
        gender: editMember.gender,
        year: editMember.year,
        status: editMember.status,
        subClub: editMember.subClub ?? "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [editMember, isOpen]);

  if (!isOpen) return null;

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Enter a valid email address";
    }
    if (!form.registerNumber.trim()) errs.registerNumber = "Register number is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    // Simulate async save (replace with real service call)
    await new Promise((r) => setTimeout(r, 600));

    const saved: MockMember = editMember
      ? {
          ...editMember,
          ...form,
          phoneNumber: form.phoneNumber || null,
          subClub: form.subClub || null,
        }
      : {
          id: uuid(),
          membershipId: generateMembershipId(Math.floor(Math.random() * 50 + 12)),
          registerNumber: form.registerNumber,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phoneNumber: form.phoneNumber || null,
          gender: form.gender,
          year: form.year,
          status: form.status,
          subClub: form.subClub || null,
          createdAt: new Date().toISOString().slice(0, 10),
        };

    setSaving(false);
    onSave(saved);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              {isEdit ? (
                <Pencil className="w-4 h-4 text-[#1c64ec]" />
              ) : (
                <UserPlus className="w-4 h-4 text-[#1c64ec]" />
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {isEdit ? "Edit Member" : "Add New Member"}
              </h2>
              <p className="text-xs text-gray-400">
                {isEdit
                  ? `Editing ${editMember?.firstName} ${editMember?.lastName}`
                  : "Fill in the details to register a new member"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="First Name"
                required
                error={errors.firstName}
              >
                <input
                  type="text"
                  value={form.firstName}
                  onChange={set("firstName")}
                  placeholder="e.g. Arjun"
                  className={inputClass(!!errors.firstName)}
                />
              </Field>
              <Field label="Last Name" required error={errors.lastName}>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={set("lastName")}
                  placeholder="e.g. Mehta"
                  className={inputClass(!!errors.lastName)}
                />
              </Field>
            </div>

            {/* Email */}
            <Field label="Email Address" required error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="e.g. arjun@vistara.io"
                className={inputClass(!!errors.email)}
              />
            </Field>

            {/* Register no + phone */}
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Register Number"
                required
                error={errors.registerNumber}
              >
                <input
                  type="text"
                  value={form.registerNumber}
                  onChange={set("registerNumber")}
                  placeholder="e.g. 22CS001"
                  className={inputClass(!!errors.registerNumber)}
                />
              </Field>
              <Field label="Phone Number">
                <input
                  type="tel"
                  value={form.phoneNumber}
                  onChange={set("phoneNumber")}
                  placeholder="+91 98400 00000"
                  className={inputClass(false)}
                />
              </Field>
            </div>

            {/* Gender + Year */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Gender">
                <select
                  value={form.gender}
                  onChange={set("gender")}
                  className={selectClass}
                >
                  {GENDER_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Year">
                <select
                  value={form.year}
                  onChange={set("year")}
                  className={selectClass}
                >
                  {(Object.keys(YEAR_LABELS) as Year[]).map((y) => (
                    <option key={y} value={y}>
                      {YEAR_LABELS[y]}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Sub-club + Status */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Sub-club">
                <select
                  value={form.subClub}
                  onChange={set("subClub")}
                  className={selectClass}
                >
                  <option value="">None</option>
                  {SUB_CLUBS.map((sc) => (
                    <option key={sc} value={sc}>
                      {sc}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Status">
                <select
                  value={form.status}
                  onChange={set("status")}
                  className={selectClass}
                >
                  {STATUS_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-[#1c64ec] hover:bg-blue-700 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-600">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
    </div>
  );
}

const inputClass = (hasError: boolean) =>
  cn(
    "w-full text-sm px-3 py-2 rounded-xl border outline-none transition-all",
    "placeholder-gray-300 text-gray-800",
    hasError
      ? "border-red-300 bg-red-50/30 focus:ring-2 focus:ring-red-400/30"
      : "border-gray-200 bg-[#f8fafd] hover:border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
  );

const selectClass = cn(
  "w-full text-sm px-3 py-2 rounded-xl border border-gray-200 bg-[#f8fafd]",
  "hover:border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20",
  "outline-none transition-all text-gray-800 cursor-pointer appearance-none"
);
