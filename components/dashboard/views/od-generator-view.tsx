'use client';

/**
 * OD Generator View — two-step form
 *
 * Step 1 — Letter details
 * Step 2 — Club sections:
 *   • Visual pill grid shows all 7 clubs (Dance·Music·Media·Tech·Compering·Fashion·Art)
 *   • Click a club pill to add that club's section; click again to remove it
 *   • Each active section shows its student rows grouped under the club header
 *   • Scoped MODERATOR has their club pre-selected and locked
 */

import { useState, useTransition, useCallback, useMemo } from 'react';
import {
  FileText, Trash2, Loader2, AlertTriangle, CheckCircle2,
  ChevronRight, ChevronLeft, UserPlus, Users, Info,
  ArrowDownToLine, ClipboardList, LayoutList, Building2,
  ChevronDown, ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GenerateODInput, ODStudentRow } from '@/lib/validations/document.schema';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SubClubOption {
  id:   string;
  name: string;
  slug: string;
}

interface ODGeneratorViewProps {
  subClubs:         SubClubOption[];   // already in canonical order from the page
  defaultSubClubId?: string;
  isScoped:         boolean;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const YEAR_OPTIONS = [
  { value: 'I',      label: '1st Year (I)'   },
  { value: 'II',     label: '2nd Year (II)'  },
  { value: 'III',    label: '3rd Year (III)' },
  { value: 'IV',     label: '4th Year (IV)'  },
  { value: 'Alumni', label: 'Alumni'         },
];

const DEPT_SUGGESTIONS = ['AIDS', 'CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'BME'];

// ── Colour palette (one per canonical club slot, cycles if more are added) ────
const PALETTE = [
  // Dance
  { pill: 'bg-pink-100 text-pink-700 border-pink-200',    active: 'bg-pink-600',   header: 'bg-pink-600',   headerText: 'text-white', light: 'bg-pink-50',   accent: 'text-pink-700',   badge: 'bg-pink-100 text-pink-700',   border: 'border-pink-200'   },
  // Music
  { pill: 'bg-violet-100 text-violet-700 border-violet-200', active: 'bg-violet-600', header: 'bg-violet-600', headerText: 'text-white', light: 'bg-violet-50', accent: 'text-violet-700', badge: 'bg-violet-100 text-violet-700', border: 'border-violet-200' },
  // Media
  { pill: 'bg-sky-100 text-sky-700 border-sky-200',       active: 'bg-sky-600',    header: 'bg-sky-600',    headerText: 'text-white', light: 'bg-sky-50',    accent: 'text-sky-700',    badge: 'bg-sky-100 text-sky-700',    border: 'border-sky-200'    },
  // Tech
  { pill: 'bg-[#5B50E5]/10 text-[#5B50E5] border-[#C7D2FE]', active: 'bg-[#5B50E5]', header: 'bg-[#5B50E5]', headerText: 'text-white', light: 'bg-[#5B50E5]/8', accent: 'text-[#5B50E5]', badge: 'bg-[#5B50E5]/15 text-[#5B50E5]', border: 'border-[#C7D2FE]' },
  // Compering
  { pill: 'bg-amber-100 text-amber-700 border-amber-200', active: 'bg-amber-500',  header: 'bg-amber-500',  headerText: 'text-white', light: 'bg-amber-50',  accent: 'text-amber-700',  badge: 'bg-amber-100 text-amber-700',  border: 'border-amber-200'  },
  // Fashion
  { pill: 'bg-rose-100 text-rose-700 border-rose-200',    active: 'bg-rose-600',   header: 'bg-rose-600',   headerText: 'text-white', light: 'bg-rose-50',   accent: 'text-rose-700',   badge: 'bg-rose-100 text-rose-700',   border: 'border-rose-200'   },
  // Art
  { pill: 'bg-emerald-100 text-emerald-700 border-emerald-200', active: 'bg-emerald-600', header: 'bg-emerald-600', headerText: 'text-white', light: 'bg-emerald-50', accent: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200' },
] as const;

// ── Club emoji icons (visual cue in pills) ────────────────────────────────────
const CLUB_ICONS: Record<string, string> = {
  dance:     '💃',
  music:     '🎵',
  media:     '📸',
  tech:      '💻',
  compering: '🎤',
  fashion:   '👗',
  art:       '🎨',
};

// ── Form types ────────────────────────────────────────────────────────────────

type LetterForm = {
  fromName: string; subject: string; description: string;
  dateFrom: string; dateTo:  string;
};

const EMPTY_LETTER: LetterForm = {
  fromName: '', subject: '', description: '', dateFrom: '', dateTo: '',
};

type StudentForm = ODStudentRow & { _id: string };

interface ClubSection {
  _sectionId: string;
  subClubId:  string;
  collapsed:  boolean;
  students:   StudentForm[];
}

function makeStudentRow(subClubId: string): StudentForm {
  return { _id: crypto.randomUUID(), name: '', vmNumber: '', department: '', year: 'III', subClubId };
}
function makeSection(subClubId: string): ClubSection {
  return { _sectionId: crypto.randomUUID(), subClubId, collapsed: false, students: [makeStudentRow(subClubId)] };
}

// ── Micro-components ──────────────────────────────────────────────────────────

function Field({ label, required, error, hint, children }: {
  label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-[#262626]/70">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[10px] text-[#262626]/35">{hint}</p>}
      {error && (
        <p className="text-[10px] text-red-500 flex items-center gap-1">
          <AlertTriangle className="w-2.5 h-2.5 shrink-0" />{error}
        </p>
      )}
    </div>
  );
}

const iCls = (e: boolean) => cn(
  'w-full px-3 py-2 rounded-xl text-xs border outline-none transition-all bg-[#FAFAFA] placeholder-[#262626]/25 text-[#262626]',
  e ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
    : 'border-[#C7D2FE]/50 focus:border-[#5B50E5]/50 focus:ring-2 focus:ring-[#5B50E5]/10',
);
const taCls = (e: boolean) => cn(
  'w-full px-3 py-2.5 rounded-xl text-xs border outline-none transition-all resize-none bg-[#FAFAFA] placeholder-[#262626]/25 text-[#262626]',
  e ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
    : 'border-[#C7D2FE]/50 focus:border-[#5B50E5]/50 focus:ring-2 focus:ring-[#5B50E5]/10',
);
const selCls = (e: boolean) => cn(
  'w-full px-3 py-2 rounded-xl text-xs border outline-none transition-all appearance-none bg-[#FAFAFA] text-[#262626]',
  e ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
    : 'border-[#C7D2FE]/50 focus:border-[#5B50E5]/50 focus:ring-2 focus:ring-[#5B50E5]/10',
);

// ── Step indicator ────────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      {([1, 2] as const).map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div className={cn(
            'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
            step === s ? 'bg-[#5B50E5] text-white shadow-[0_2px_8px_rgba(91,80,229,0.35)]'
                       : step > s ? 'bg-emerald-500 text-white' : 'bg-[#C7D2FE]/30 text-[#262626]/30',
          )}>
            {step > s ? <CheckCircle2 className="w-3.5 h-3.5" /> : s}
          </div>
          <span className={cn('text-xs font-semibold',
            step === s ? 'text-[#5B50E5]' : step > s ? 'text-emerald-600' : 'text-[#262626]/30',
          )}>
            {s === 1 ? 'Letter Details' : 'Student List'}
          </span>
          {s < 2 && <ChevronRight className="w-3.5 h-3.5 text-[#C7D2FE] mx-1" />}
        </div>
      ))}
    </div>
  );
}

// ── Club pill grid ────────────────────────────────────────────────────────────

function ClubPillGrid({
  subClubs,
  activeIds,
  onToggle,
  onSelectAll,
  onDeselectAll,
  locked,
}: {
  subClubs:     SubClubOption[];
  activeIds:    Set<string>;
  onToggle:     (id: string) => void;
  onSelectAll:  () => void;
  onDeselectAll: () => void;
  locked:       boolean;               // scoped MODERATOR — can't change
}) {
  const allSelected = subClubs.length > 0 && subClubs.every((sc) => activeIds.has(sc.id));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {subClubs.map((sc, i) => {
          const pal      = PALETTE[i % PALETTE.length];
          const isActive = activeIds.has(sc.id);
          const icon     = CLUB_ICONS[sc.slug] ?? '🏷';

          return (
            <button
              key={sc.id}
              type="button"
              disabled={locked}
              onClick={() => onToggle(sc.id)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-bold transition-all select-none',
                isActive
                  ? `${pal.active} text-white border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.15)]`
                  : `${pal.pill} hover:scale-105 active:scale-95`,
                locked && 'cursor-default opacity-80',
              )}
              title={isActive ? `Remove ${sc.name}` : `Add ${sc.name}`}
            >
              <span>{icon}</span>
              <span>{sc.name}</span>
              {isActive && (
                <span className="ml-0.5 w-3.5 h-3.5 rounded-full bg-white/25 flex items-center justify-center text-[9px] font-black">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {!locked && (
        <button
          type="button"
          onClick={allSelected ? onDeselectAll : onSelectAll}
          className={cn(
            'self-start flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all border',
            allSelected
              ? 'bg-[#5B50E5]/8 text-[#5B50E5] border-[#C7D2FE] hover:bg-[#5B50E5]/15'
              : 'bg-white text-[#262626]/50 border-[#C7D2FE]/50 hover:text-[#5B50E5] hover:border-[#C7D2FE] hover:bg-[#5B50E5]/5',
          )}
        >
          {allSelected ? (
            <>
              <span className="text-[10px]">✕</span> Deselect All
            </>
          ) : (
            <>
              <span className="text-[10px]">✦</span> Select All
            </>
          )}
        </button>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ODGeneratorView({ subClubs, defaultSubClubId = '', isScoped }: ODGeneratorViewProps) {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1
  const [letter, setLetter]             = useState<LetterForm>(EMPTY_LETTER);
  const [letterErrors, setLetterErrors] = useState<Partial<Record<keyof LetterForm, string>>>({});

  // Step 2 — sections ordered by canonical club order (subClubs array order)
  const [sections, setSections] = useState<ClubSection[]>(
    defaultSubClubId ? [makeSection(defaultSubClubId)] : [],
  );

  type SectionErrs = Record<number, Record<number, Partial<Record<keyof ODStudentRow, string>>>>;
  const [sectionErrors, setSectionErrors] = useState<SectionErrs>({});

  const [isPending,       startTransition]   = useTransition();
  const [serverError,     setServerError]    = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Stable set of active club IDs
  const activeIds = useMemo(() => new Set(sections.map((s) => s.subClubId)), [sections]);

  // Total students
  const totalStudents = useMemo(() => sections.reduce((n, s) => n + s.students.length, 0), [sections]);

  // Helpers
  const clubName     = (id: string) => subClubs.find((sc) => sc.id === id)?.name ?? id;
  const paletteFor   = (subClubId: string) => {
    const idx = subClubs.findIndex((sc) => sc.id === subClubId);
    return PALETTE[(idx >= 0 ? idx : 0) % PALETTE.length];
  };

  // ── Select / deselect all clubs ───────────────────────────────────────────
  const selectAllClubs = useCallback(() => {
    setSections(() => {
      return subClubs.map((sc) => makeSection(sc.id));
    });
    setSectionErrors({});
  }, [subClubs]);

  const deselectAllClubs = useCallback(() => {
    setSections([]);
    setSectionErrors({});
  }, []);

  // ── Toggle club pill ──────────────────────────────────────────────────────
  const toggleClub = useCallback((subClubId: string) => {
    setSections((prev) => {
      const exists = prev.find((s) => s.subClubId === subClubId);
      if (exists) {
        // Remove this club's section
        return prev.filter((s) => s.subClubId !== subClubId);
      }
      // Add a new section, inserted in canonical subClubs order
      const newSec   = makeSection(subClubId);
      const combined = [...prev, newSec];
      // Re-sort by canonical index
      combined.sort((a, b) => {
        const ai = subClubs.findIndex((sc) => sc.id === a.subClubId);
        const bi = subClubs.findIndex((sc) => sc.id === b.subClubId);
        return ai - bi;
      });
      return combined;
    });
    setSectionErrors({});
  }, [subClubs]);

  // ── Section helpers ───────────────────────────────────────────────────────
  const removeSection    = useCallback((sid: string) => {
    setSections((p) => p.filter((s) => s._sectionId !== sid));
    setSectionErrors({});
  }, []);
  const toggleCollapse   = useCallback((sid: string) => {
    setSections((p) => p.map((s) => s._sectionId === sid ? { ...s, collapsed: !s.collapsed } : s));
  }, []);

  // ── Student helpers ───────────────────────────────────────────────────────
  const addStudentToSection = useCallback((sid: string, subClubId: string) => {
    setSections((p) => p.map((s) => s._sectionId === sid
      ? { ...s, students: [...s.students, makeStudentRow(subClubId)] }
      : s));
  }, []);
  const removeStudentFromSection = useCallback((sid: string, stId: string) => {
    setSections((p) => p.map((s) => s._sectionId === sid
      ? { ...s, students: s.students.filter((st) => st._id !== stId) }
      : s));
    setSectionErrors({});
  }, []);
  const updateStudentInSection = useCallback(
    (sid: string, stId: string, field: keyof ODStudentRow, value: string) => {
      setSections((p) => p.map((s) => s._sectionId !== sid ? s : {
        ...s,
        students: s.students.map((st) => st._id === stId ? { ...st, [field]: value } : st),
      }));
    }, [],
  );

  // ── Validation ────────────────────────────────────────────────────────────
  function validateLetter(): boolean {
    const e: Partial<Record<keyof LetterForm, string>> = {};
    if (!letter.fromName.trim())           e.fromName    = 'From name is required';
    if (!letter.subject.trim())            e.subject     = 'Subject is required';
    else if (letter.subject.length < 5)    e.subject     = 'Subject is too short';
    if (!letter.description.trim())        e.description = 'Description is required';
    else if (letter.description.length<10) e.description = 'Too short';
    if (!letter.dateFrom)                  e.dateFrom    = 'Start date is required';
    if (!letter.dateTo)                    e.dateTo      = 'End date is required';
    else if (letter.dateFrom && letter.dateTo && letter.dateTo < letter.dateFrom)
      e.dateTo = 'Must be after start date';
    setLetterErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateSections(): boolean {
    if (sections.length === 0) return false;
    const errs: SectionErrs = {};
    sections.forEach((sec, si) => {
      sec.students.forEach((st, ti) => {
        const r: Partial<Record<keyof ODStudentRow, string>> = {};
        if (!st.name.trim())       r.name       = 'Required';
        if (!st.vmNumber.trim())   r.vmNumber   = 'Required';
        if (!st.department.trim()) r.department = 'Required';
        if (!st.year)              r.year       = 'Required';
        if (Object.keys(r).length) { if (!errs[si]) errs[si] = {}; errs[si][ti] = r; }
      });
    });
    setSectionErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  function goToStep2() { if (validateLetter()) setStep(2); }
  function goToStep1() { setStep(1); setServerError(null); }

  // ── Generate & download ───────────────────────────────────────────────────
  function handleGenerate() {
    if (!validateSections()) return;
    setServerError(null);
    setDownloadSuccess(false);

    const payload: GenerateODInput = {
      fromName:    letter.fromName,
      subject:     letter.subject,
      description: letter.description,
      dateFrom:    letter.dateFrom,
      dateTo:      letter.dateTo,
      students:    sections.flatMap((sec) =>
        sec.students.map(({ _id, ...rest }) => ({
          name: rest.name,
          vmNumber: rest.vmNumber,
          department: rest.department,
          year: rest.year,
          subClubId: rest.subClubId,
        }))
      ),
    };

    startTransition(async () => {
      try {
        const res = await fetch('/api/od-pdf', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          setServerError((d as { error?: string }).error ?? 'PDF generation failed');
          return;
        }
        const blob = await res.blob();
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = res.headers.get('Content-Disposition')?.match(/filename="([^"]+)"/)?.[1]
          ?? `OD_Letter_${new Date().toISOString().slice(0, 10)}.pdf`;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a); URL.revokeObjectURL(url);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 4000);
      } catch {
        setServerError('Network error — please try again');
      }
    });
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-full flex-col overflow-hidden">

      {/* Page header */}
      <div className="px-6 pt-6 pb-4 border-b border-[#C7D2FE]/30 bg-white shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#5B50E5]/10 text-[#5B50E5] border border-[#C7D2FE] text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-2">
              <FileText className="w-3 h-3" />OD Documents
            </div>
            <h1 className="text-xl font-extrabold text-[#262626] tracking-tight">
              Generate OD Request Letter
            </h1>
            <p className="text-xs text-[#262626]/40 mt-0.5">
              Page 1 — letter · Pages 2+ — one club table per page
            </p>
          </div>
          {isScoped && (
            <div className="flex items-center gap-2 px-3 py-2 bg-[#5B50E5]/5 border border-[#C7D2FE] rounded-xl text-xs text-[#262626]/60">
              <Info className="w-3.5 h-3.5 text-[#5B50E5] shrink-0" />Scoped to your sub-club
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-[#F8F9FF]">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <StepIndicator step={step} />

          {/* ══ STEP 1 ════════════════════════════════════════════════════ */}
          {step === 1 && (
            <div className="bg-white rounded-3xl shadow-[0_2px_20px_rgba(91,80,229,0.06)] border border-[#C7D2FE]/30 overflow-hidden">
              <div className="px-6 py-5 border-b border-[#C7D2FE]/20 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#5B50E5]/10 flex items-center justify-center">
                  <ClipboardList className="w-4.5 h-4.5 text-[#5B50E5]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#262626]">Letter Details</h2>
                  <p className="text-xs text-[#262626]/40">Sender info, subject and body — appears on Page 1 of the PDF</p>
                </div>
              </div>
              <div className="px-6 py-6 space-y-5">
                <Field label="From (Sender Name & Title)" required error={letterErrors.fromName}
                  hint="Appears in the FROM block and Yours faithfully signature. Press Enter to add role / club name on a new line.">
                  <textarea value={letter.fromName} rows={4}
                    onChange={(e) => setLetter((f) => ({ ...f, fromName: e.target.value }))}
                    placeholder={"Manikandan K,\nStudent President,\nVistara Student Council,\nVel Tech Multi Tech Dr. Rangarajan Dr. Sakunthala Engineering College,\nAvadi, Chennai."}
                    className={taCls(!!letterErrors.fromName)} />
                </Field>
                <Field label="Subject" required error={letterErrors.subject}>
                  <input value={letter.subject}
                    onChange={(e) => setLetter((f) => ({ ...f, subject: e.target.value }))}
                    placeholder="e.g. Request for On Duty (OD) Permission for Induction Day Preparations"
                    className={iCls(!!letterErrors.subject)} />
                </Field>
                <Field label="Letter Body" required error={letterErrors.description}
                  hint="The date-range sentence is automatically appended after this paragraph.">
                  <textarea value={letter.description} rows={5}
                    onChange={(e) => setLetter((f) => ({ ...f, description: e.target.value }))}
                    placeholder="We kindly request you to grant On Duty (OD) permission to the participating students of the Vistara Student Council to carry out the planning and preparation for The Induction Day…"
                    className={taCls(!!letterErrors.description)} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="OD Start Date" required error={letterErrors.dateFrom}>
                    <input type="date" value={letter.dateFrom}
                      onChange={(e) => setLetter((f) => ({ ...f, dateFrom: e.target.value }))}
                      className={iCls(!!letterErrors.dateFrom)} />
                  </Field>
                  <Field label="OD End Date" required error={letterErrors.dateTo}>
                    <input type="date" value={letter.dateTo}
                      onChange={(e) => setLetter((f) => ({ ...f, dateTo: e.target.value }))}
                      className={iCls(!!letterErrors.dateTo)} />
                  </Field>
                </div>
                <div className="pt-2 flex justify-end">
                  <button onClick={goToStep2}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5B50E5] text-white text-sm font-semibold hover:bg-[#4a40d4] shadow-[0_2px_12px_rgba(91,80,229,0.3)] transition-all">
                    Next: Add Students<ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══ STEP 2 ════════════════════════════════════════════════════ */}
          {step === 2 && (
            <div className="flex gap-6">

              {/* Left — sections */}
              <div className="flex-1 min-w-0 space-y-4">

                {/* Club picker card */}
                <div className="bg-white rounded-2xl border border-[#C7D2FE]/30 overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#C7D2FE]/15 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#5B50E5]/10 flex items-center justify-center shrink-0">
                      <Users className="w-4.5 h-4.5 text-[#5B50E5]" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-sm font-bold text-[#262626]">Select Participating Clubs</h2>
                      <p className="text-xs text-[#262626]/40">
                        Click a club to add its section · click again to remove it
                      </p>
                    </div>
                    {totalStudents > 0 && (
                      <span className="text-xs font-bold text-[#5B50E5] bg-[#5B50E5]/10 px-3 py-1 rounded-full shrink-0">
                        {totalStudents} student{totalStudents !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="px-5 py-4">
                    <ClubPillGrid
                      subClubs={subClubs}
                      activeIds={activeIds}
                      onToggle={toggleClub}
                      onSelectAll={selectAllClubs}
                      onDeselectAll={deselectAllClubs}
                      locked={isScoped}
                    />
                    {isScoped && (
                      <p className="mt-3 text-[10px] text-[#262626]/35 flex items-center gap-1">
                        <Info className="w-3 h-3 text-[#5B50E5]" />
                        Club is fixed to your sub-club as a secretary
                      </p>
                    )}
                  </div>
                </div>

                {/* Empty state */}
                {sections.length === 0 && (
                  <div className="bg-white rounded-2xl border-2 border-dashed border-[#C7D2FE]/50 px-6 py-10 flex flex-col items-center gap-3 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#5B50E5]/8 flex items-center justify-center text-2xl">🏷</div>
                    <p className="text-sm font-semibold text-[#262626]/50">No clubs selected yet</p>
                    <p className="text-xs text-[#262626]/30">
                      Click the club pills above to add their student sections
                    </p>
                  </div>
                )}

                {/* Club sections */}
                {sections.map((sec, si) => {
                  const pal       = paletteFor(sec.subClubId);
                  const secErrs   = sectionErrors[si] ?? {};
                  const name      = clubName(sec.subClubId);
                  const clubIdx   = subClubs.findIndex((sc) => sc.id === sec.subClubId);
                  const icon      = CLUB_ICONS[subClubs[clubIdx]?.slug ?? ''] ?? '🏷';
                  const hasErrors = Object.keys(secErrs).length > 0;

                  return (
                    <div key={sec._sectionId} className={cn(
                      'bg-white rounded-2xl border overflow-hidden',
                      hasErrors ? 'border-red-300' : 'border-[#C7D2FE]/30',
                    )}>
                      {/* Section header */}
                      <div className={cn('px-5 py-3.5 flex items-center gap-3', pal.header)}>
                        <span className="text-lg leading-none shrink-0">{icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-sm font-bold leading-tight', pal.headerText)}>{name}</p>
                          <p className={cn('text-[10px] opacity-75', pal.headerText)}>
                            {sec.students.length} student{sec.students.length !== 1 ? 's' : ''} · Page {si + 2} in PDF
                          </p>
                        </div>
                        <button type="button" onClick={() => toggleCollapse(sec._sectionId)}
                          className={cn('p-1.5 rounded-lg opacity-80 hover:opacity-100 hover:bg-white/15 transition-colors', pal.headerText)}
                          aria-label={sec.collapsed ? 'Expand' : 'Collapse'}>
                          {sec.collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                        </button>
                        {/* Only allow remove for non-scoped users */}
                        {!isScoped && (
                          <button type="button"
                            onClick={() => { removeSection(sec._sectionId); toggleClub(sec.subClubId); }}
                            className={cn('p-1.5 rounded-lg opacity-80 hover:opacity-100 hover:bg-white/15 transition-colors', pal.headerText)}
                            aria-label="Remove club section">
                            <Building2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {!sec.collapsed && (
                        <>
                          {sec.students.length === 0 ? (
                            <div className="px-5 py-8 flex flex-col items-center gap-2 text-center">
                              <Users className={cn('w-6 h-6 opacity-30', pal.accent)} />
                              <p className="text-xs text-[#262626]/40">No students yet</p>
                            </div>
                          ) : (
                            <div className="divide-y divide-[#C7D2FE]/10">
                              {sec.students.map((st, ti) => {
                                const rowErr = secErrs[ti] ?? {};
                                return (
                                  <div key={st._id} className="px-5 py-4">
                                    <div className="flex items-center gap-2 mb-3">
                                      <span className={cn('w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0', pal.badge)}>
                                        {ti + 1}
                                      </span>
                                      <span className="text-[11px] font-semibold text-[#262626]/50">Student #{ti + 1}</span>
                                      {sec.students.length > 1 && (
                                        <button type="button"
                                          onClick={() => removeStudentFromSection(sec._sectionId, st._id)}
                                          className="ml-auto p-1.5 rounded-lg text-[#262626]/25 hover:text-red-500 hover:bg-red-50 transition-colors"
                                          aria-label="Remove student">
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                      <div className="col-span-2">
                                        <Field label="Full Name" required error={rowErr.name}>
                                          <input value={st.name}
                                            onChange={(e) => updateStudentInSection(sec._sectionId, st._id, 'name', e.target.value)}
                                            placeholder="e.g. Mohammed Rehaan S"
                                            className={iCls(!!rowErr.name)} />
                                        </Field>
                                      </div>
                                      <Field label="VM No." required error={rowErr.vmNumber}>
                                        <input value={st.vmNumber}
                                          onChange={(e) => updateStudentInSection(sec._sectionId, st._id, 'vmNumber', e.target.value)}
                                          placeholder="e.g. 16293"
                                          className={iCls(!!rowErr.vmNumber)} />
                                      </Field>
                                      <Field label="Year" required error={rowErr.year}>
                                        <select value={st.year}
                                          onChange={(e) => updateStudentInSection(sec._sectionId, st._id, 'year', e.target.value)}
                                          className={selCls(!!rowErr.year)}>
                                          <option value="">— Select —</option>
                                          {YEAR_OPTIONS.map((y) => (
                                            <option key={y.value} value={y.value}>{y.label}</option>
                                          ))}
                                        </select>
                                      </Field>
                                      <div className="col-span-2 lg:col-span-4">
                                        <Field label="Department" required error={rowErr.department}>
                                          <input value={st.department}
                                            onChange={(e) => updateStudentInSection(sec._sectionId, st._id, 'department', e.target.value)}
                                            placeholder="AIDS / CSE / ECE / EEE / MECH…"
                                            list={`dept-${st._id}`}
                                            className={iCls(!!rowErr.department)} />
                                          <datalist id={`dept-${st._id}`}>
                                            {DEPT_SUGGESTIONS.map((d) => <option key={d} value={d} />)}
                                          </datalist>
                                        </Field>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Add student */}
                          <div className="px-5 py-3 border-t border-[#C7D2FE]/10">
                            <button type="button"
                              onClick={() => addStudentToSection(sec._sectionId, sec.subClubId)}
                              className={cn(
                                'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all',
                                pal.light, pal.accent, 'hover:opacity-80',
                              )}>
                              <UserPlus className="w-3.5 h-3.5" />
                              Add Student to {name}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}

                {/* Warnings & feedback */}
                {sections.length === 0 && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-medium text-amber-700">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    Select at least one club above before generating the PDF
                  </div>
                )}
                {serverError && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-600">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />{serverError}
                  </div>
                )}
                {downloadSuccess && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />PDF downloaded successfully!
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-2">
                  <button onClick={goToStep1} disabled={isPending}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#C7D2FE]/50 text-sm font-semibold text-[#262626]/60 hover:text-[#262626] hover:bg-white transition-all disabled:opacity-50">
                    <ChevronLeft className="w-4 h-4" />Back
                  </button>
                  <button onClick={handleGenerate} disabled={isPending || sections.length === 0}
                    className={cn(
                      'flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all',
                      'bg-[#5B50E5] text-white hover:bg-[#4a40d4] shadow-[0_2px_16px_rgba(91,80,229,0.35)]',
                      'disabled:opacity-60 disabled:cursor-not-allowed',
                    )}>
                    {isPending
                      ? <><Loader2 className="w-4 h-4 animate-spin" />Generating PDF…</>
                      : <><ArrowDownToLine className="w-4 h-4" />Generate &amp; Download PDF</>}
                  </button>
                </div>
              </div>

              {/* Right — PDF structure preview */}
              <div className="w-64 shrink-0 hidden lg:flex flex-col gap-3">
                <div className="bg-white rounded-2xl border border-[#C7D2FE]/30 overflow-hidden sticky top-6">
                  <div className="px-4 py-3 border-b border-[#C7D2FE]/20 flex items-center gap-2">
                    <LayoutList className="w-3.5 h-3.5 text-[#5B50E5]" />
                    <p className="text-[11px] font-bold text-[#262626]/50 uppercase tracking-wider">PDF Structure</p>
                  </div>
                  <div className="px-4 py-3 space-y-3">

                    {/* Page 1 — Request Letter */}
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 w-5 h-5 rounded-md bg-[#5B50E5] text-white text-[9px] font-bold flex items-center justify-center shrink-0">1</span>
                      <div>
                        <p className="text-[11px] font-semibold text-[#262626]">Request Letter</p>
                        <p className="text-[10px] text-[#262626]/40">Letterhead · body · signature</p>
                      </div>
                    </div>

                    {/* Page 2 — All club tables on one page */}
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 w-5 h-5 rounded-md bg-[#5B50E5]/15 text-[#5B50E5] text-[9px] font-bold flex items-center justify-center shrink-0">2</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold text-[#262626]">Student Tables</p>
                        <p className="text-[10px] text-[#262626]/40 mb-2">All club tables flow sequentially</p>

                        {sections.length === 0 ? (
                          <p className="text-[10px] text-[#262626]/25 italic">Select clubs above</p>
                        ) : (
                          <div className="space-y-2">
                            {sections.map((sec) => {
                              const pal    = paletteFor(sec.subClubId);
                              const name   = clubName(sec.subClubId);
                              const clubI  = subClubs.findIndex((sc) => sc.id === sec.subClubId);
                              const icon   = CLUB_ICONS[subClubs[clubI]?.slug ?? ''] ?? '🏷';
                              const filled = sec.students.filter((s) => s.name.trim()).length;
                              return (
                                <div key={sec._sectionId} className={cn('rounded-lg px-2.5 py-2 border', pal.border, pal.light)}>
                                  <p className={cn('text-[11px] font-semibold flex items-center gap-1 mb-1', pal.accent)}>
                                    <span>{icon}</span>{name}
                                  </p>
                                  <p className="text-[10px] text-[#262626]/40 mb-1.5">
                                    {filled}/{sec.students.length} student{sec.students.length !== 1 ? 's' : ''} filled
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {sec.students.map((st) => (
                                      <span key={st._id} className={cn('text-[9px] px-1.5 py-0.5 rounded font-medium', pal.badge)}>
                                        {st.name || '…'}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#C7D2FE]/15">
                      <p className="text-[10px] text-[#262626]/35">
                        Total pages: <span className="font-bold text-[#5B50E5]">2</span>
                        {sections.length > 0 && (
                          <span className="text-[#262626]/25"> · {totalStudents} student{totalStudents !== 1 ? 's' : ''}</span>
                        )}
                      </p>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
