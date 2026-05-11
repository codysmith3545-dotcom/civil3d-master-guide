"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Module = {
  id: string;
  order: number;
  title: string;
  href: string;
  hours: number;
  category: "professional-practice" | "technical" | "ethics";
  approval_status: "pending" | "approved" | "expired";
};

// Static module list. Keep in sync with content/ceu/*.md frontmatter.
const MODULES: Module[] = [
  {
    id: "module-01-boundary-law-fundamentals",
    order: 1,
    title: "Boundary Law Fundamentals",
    href: "/docs/ceu/module-01-boundary-law-fundamentals",
    hours: 1.0,
    category: "professional-practice",
    approval_status: "pending",
  },
  {
    id: "module-02-coordinate-systems-and-datums",
    order: 2,
    title: "Coordinate Systems and Datums",
    href: "/docs/ceu/module-02-coordinate-systems-and-datums",
    hours: 1.0,
    category: "technical",
    approval_status: "pending",
  },
  {
    id: "module-03-modern-rtk-gnss-best-practices",
    order: 3,
    title: "Modern RTK GNSS Best Practices",
    href: "/docs/ceu/module-03-modern-rtk-gnss-best-practices",
    hours: 1.0,
    category: "technical",
    approval_status: "pending",
  },
  {
    id: "module-04-deed-research-and-record-search",
    order: 4,
    title: "Deed Research and Record Search",
    href: "/docs/ceu/module-04-deed-research-and-record-search",
    hours: 1.0,
    category: "professional-practice",
    approval_status: "pending",
  },
  {
    id: "module-05-plss-corner-restoration",
    order: 5,
    title: "PLSS Corner Restoration",
    href: "/docs/ceu/module-05-plss-corner-restoration",
    hours: 1.0,
    category: "professional-practice",
    approval_status: "pending",
  },
  {
    id: "module-06-alta-nsps-survey-deep-dive",
    order: 6,
    title: "ALTA/NSPS Survey Deep Dive",
    href: "/docs/ceu/module-06-alta-nsps-survey-deep-dive",
    hours: 1.0,
    category: "professional-practice",
    approval_status: "pending",
  },
  {
    id: "module-07-construction-staking-quality",
    order: 7,
    title: "Construction Staking Quality",
    href: "/docs/ceu/module-07-construction-staking-quality",
    hours: 1.0,
    category: "technical",
    approval_status: "pending",
  },
];

type CompletionRecord = {
  moduleId: string;
  completedAt: string; // ISO datetime
};

const STORAGE_KEY = "civil3d-master-guide.ceu.completions.v1";

function loadCompletions(): CompletionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (r) =>
        r &&
        typeof r.moduleId === "string" &&
        typeof r.completedAt === "string",
    );
  } catch {
    return [];
  }
}

function saveCompletions(records: CompletionRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function CeuTrackerPage() {
  const [completions, setCompletions] = useState<CompletionRecord[]>([]);
  const [mode, setMode] = useState<"tracker" | "report">("tracker");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCompletions(loadCompletions());
    setHydrated(true);
  }, []);

  const completionByModule = useMemo(() => {
    const map = new Map<string, CompletionRecord>();
    for (const c of completions) map.set(c.moduleId, c);
    return map;
  }, [completions]);

  const completedHours = useMemo(() => {
    let total = 0;
    for (const m of MODULES) {
      if (completionByModule.has(m.id)) total += m.hours;
    }
    return total;
  }, [completionByModule]);

  const totalHours = useMemo(
    () => MODULES.reduce((sum, m) => sum + m.hours, 0),
    [],
  );

  function markComplete(moduleId: string) {
    const now = new Date().toISOString();
    const next = [
      ...completions.filter((c) => c.moduleId !== moduleId),
      { moduleId, completedAt: now },
    ];
    setCompletions(next);
    saveCompletions(next);
  }

  function clearComplete(moduleId: string) {
    const next = completions.filter((c) => c.moduleId !== moduleId);
    setCompletions(next);
    saveCompletions(next);
  }

  function resetAll() {
    if (
      typeof window !== "undefined" &&
      window.confirm("Clear all locally-tracked CEU completions?")
    ) {
      setCompletions([]);
      saveCompletions([]);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 print:py-4">
      <header className="mb-6 print:mb-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          CEU module tracker
        </h1>
        <p className="mt-2 max-w-2xl text-ink-600 print:text-sm">
          A self-study CEU framework for Indiana licensed surveyors. Mark
          modules complete as you finish each one. Completion is stored in your
          browser&apos;s local storage; nothing is sent to a server.
        </p>
      </header>

      <div className="mb-6 rounded border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 print:border-ink-300 print:bg-white">
        <strong>Disclaimer.</strong> Until the Indiana State Board of
        Registration for Surveyors approves this curriculum, the hours
        documented here are <em>self-tracked only</em> and are not officially
        credentialed CEU. Do not submit this report as a substitute for
        Board-approved continuing education.
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3 print:hidden">
        <button
          type="button"
          className={
            "btn " + (mode === "tracker" ? "btn-primary" : "")
          }
          onClick={() => setMode("tracker")}
        >
          Tracker
        </button>
        <button
          type="button"
          className={"btn " + (mode === "report" ? "btn-primary" : "")}
          onClick={() => setMode("report")}
        >
          Completion report
        </button>
        {mode === "report" ? (
          <button
            type="button"
            className="btn"
            onClick={() => window.print()}
          >
            Print report
          </button>
        ) : null}
        <button
          type="button"
          className="btn ml-auto"
          onClick={resetAll}
        >
          Reset all
        </button>
      </div>

      <section className="mb-6 rounded border border-ink-100 p-4">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-500">
              Documented hours completed
            </div>
            <div className="mt-1 text-3xl font-semibold text-ink-900">
              {hydrated ? completedHours.toFixed(1) : "0.0"} PDH
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-ink-500">
              Available in this framework
            </div>
            <div className="mt-1 text-3xl font-semibold text-ink-700">
              {totalHours.toFixed(1)} PDH
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-ink-600">
          Indiana requires 24 PDH per 2-year renewal cycle, including at least 2
          PDH in Indiana standards of practice (865 IAC 1-12). This framework,
          when complete, provides {totalHours.toFixed(1)} PDH toward that total
          (pending Board approval).
        </p>
      </section>

      {mode === "tracker" ? (
        <TrackerView
          hydrated={hydrated}
          completionByModule={completionByModule}
          markComplete={markComplete}
          clearComplete={clearComplete}
        />
      ) : (
        <ReportView
          hydrated={hydrated}
          completionByModule={completionByModule}
          completedHours={completedHours}
        />
      )}
    </div>
  );
}

function TrackerView({
  hydrated,
  completionByModule,
  markComplete,
  clearComplete,
}: {
  hydrated: boolean;
  completionByModule: Map<string, CompletionRecord>;
  markComplete: (id: string) => void;
  clearComplete: (id: string) => void;
}) {
  return (
    <ul className="space-y-3">
      {MODULES.map((m) => {
        const c = completionByModule.get(m.id);
        return (
          <li
            key={m.id}
            className="rounded border border-ink-100 p-4 transition hover:border-ink-300"
          >
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="text-xs uppercase tracking-wider text-ink-500">
                  Module {m.order} - {m.category} - {m.hours.toFixed(1)} PDH
                </div>
                <Link
                  href={m.href}
                  className="mt-1 block text-lg font-medium text-ink-900 hover:underline"
                >
                  {m.title}
                </Link>
                {c ? (
                  <div className="mt-1 text-sm text-ink-600">
                    Completed {formatDate(c.completedAt)}
                  </div>
                ) : (
                  <div className="mt-1 text-sm text-ink-500">Not yet completed</div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {c ? (
                  <button
                    type="button"
                    className="btn"
                    onClick={() => clearComplete(m.id)}
                    disabled={!hydrated}
                  >
                    Clear
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => markComplete(m.id)}
                    disabled={!hydrated}
                  >
                    Mark complete
                  </button>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function ReportView({
  hydrated,
  completionByModule,
  completedHours,
}: {
  hydrated: boolean;
  completionByModule: Map<string, CompletionRecord>;
  completedHours: number;
}) {
  const completed = MODULES.filter((m) => completionByModule.has(m.id));
  return (
    <section className="rounded border border-ink-200 p-6 print:border-0 print:p-0">
      <h2 className="text-xl font-semibold">CEU completion report</h2>
      <div className="mt-2 text-sm text-ink-600">
        Generated {new Date().toLocaleDateString()} - self-tracked, pending
        Indiana State Board approval of this curriculum.
      </div>

      {!hydrated ? (
        <p className="mt-6 text-sm text-ink-500">Loading...</p>
      ) : completed.length === 0 ? (
        <p className="mt-6 text-sm text-ink-600">
          No modules marked complete yet. Switch to the tracker view to log
          completions.
        </p>
      ) : (
        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-ink-200 text-left">
              <th className="py-2 pr-3 font-medium">Module</th>
              <th className="py-2 pr-3 font-medium">Category</th>
              <th className="py-2 pr-3 font-medium">PDH</th>
              <th className="py-2 pr-3 font-medium">Completed</th>
            </tr>
          </thead>
          <tbody>
            {completed.map((m) => {
              const c = completionByModule.get(m.id)!;
              return (
                <tr key={m.id} className="border-b border-ink-100">
                  <td className="py-2 pr-3">
                    Module {m.order} - {m.title}
                  </td>
                  <td className="py-2 pr-3">{m.category}</td>
                  <td className="py-2 pr-3">{m.hours.toFixed(1)}</td>
                  <td className="py-2 pr-3">{formatDate(c.completedAt)}</td>
                </tr>
              );
            })}
            <tr className="border-t border-ink-300 font-medium">
              <td className="py-2 pr-3">Total</td>
              <td className="py-2 pr-3"></td>
              <td className="py-2 pr-3">{completedHours.toFixed(1)} PDH</td>
              <td className="py-2 pr-3"></td>
            </tr>
          </tbody>
        </table>
      )}

      <div className="mt-6 border-t border-ink-200 pt-4 text-xs text-ink-600">
        <p>
          Licensee: __________________________________ License No.:
          ______________
        </p>
        <p className="mt-3">
          Signature: __________________________________ Date:
          ______________
        </p>
        <p className="mt-4">
          This report records self-study completions. Until the Indiana State
          Board of Registration for Surveyors approves the curriculum, hours
          shown are not officially credentialed CEU.
        </p>
      </div>
    </section>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}
