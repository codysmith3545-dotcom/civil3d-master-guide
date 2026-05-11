"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

export type Choice = { id: string; text: string };
export type Question = {
  id: string;
  topic: string;
  objective?: string;
  difficulty: "easy" | "medium" | "hard";
  prompt: string;
  choices: Choice[];
  correct: string;
  rationale: string;
  source: string;
  pending_source?: boolean;
  tags?: string[];
};

type SrsCard = {
  id: string;
  /** SM-2 ease factor, starts at 2.5. */
  ef: number;
  /** Current interval in days. */
  interval: number;
  /** Number of consecutive successful recalls. */
  reps: number;
  /** When this card is next due (epoch ms). */
  dueAt: number;
  /** Last reviewed (epoch ms). 0 means never. */
  lastReviewed: number;
  /** Lifetime correct count. */
  correctCount: number;
  /** Lifetime incorrect count. */
  incorrectCount: number;
};

type StudyState = {
  cards: Record<string, SrsCard>;
  history: { id: string; ts: number; correct: boolean }[];
};

const STORAGE_KEY = "civil3d-master-guide:study:ps-indiana:v1";
const DAY_MS = 24 * 60 * 60 * 1000;

function makeInitialCard(id: string): SrsCard {
  return {
    id,
    ef: 2.5,
    interval: 0,
    reps: 0,
    dueAt: Date.now(),
    lastReviewed: 0,
    correctCount: 0,
    incorrectCount: 0,
  };
}

/**
 * Simplified SM-2 update. `quality` is 0..5; we map UI buttons to:
 *   wrong = 1, hard = 3, easy = 5.
 * Failed recall (quality < 3) resets the interval to 1 day.
 */
function applySm2(card: SrsCard, quality: number): SrsCard {
  const next = { ...card };
  if (quality < 3) {
    next.reps = 0;
    next.interval = 1;
  } else {
    if (next.reps === 0) next.interval = 1;
    else if (next.reps === 1) next.interval = 6;
    else next.interval = Math.round(next.interval * next.ef);
    next.reps += 1;
  }
  // EF update
  const q = quality;
  next.ef = Math.max(
    1.3,
    next.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)),
  );
  next.lastReviewed = Date.now();
  next.dueAt = Date.now() + next.interval * DAY_MS;
  return next;
}

function loadState(): StudyState {
  if (typeof window === "undefined") return { cards: {}, history: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { cards: {}, history: [] };
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return {
        cards: parsed.cards ?? {},
        history: Array.isArray(parsed.history) ? parsed.history : [],
      };
    }
  } catch {
    // ignore
  }
  return { cards: {}, history: [] };
}

function saveState(state: StudyState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore (quota or disabled storage)
  }
}

function sourceHref(slug: string): string {
  // bank.json source slugs are relative to content/exam-prep/ps-indiana
  return `/docs/exam-prep/ps-indiana/${slug}`;
}

function startOfTodayMs(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export default function StudyClient({ questions }: { questions: Question[] }) {
  const params = useMemo(() => {
    if (typeof window === "undefined") return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);

  const [state, setState] = useState<StudyState>({ cards: {}, history: [] });
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [pickedChoice, setPickedChoice] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage, then pick a card.
  useEffect(() => {
    const loaded = loadState();
    // Ensure every question has a card row.
    const cards = { ...loaded.cards };
    for (const q of questions) {
      if (!cards[q.id]) cards[q.id] = makeInitialCard(q.id);
    }
    const initial: StudyState = { cards, history: loaded.history };
    setState(initial);

    const requested = params.get("question");
    if (requested && questions.some((q) => q.id === requested)) {
      setCurrentId(requested);
    } else {
      setCurrentId(pickDueCard(initial, questions));
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const current = useMemo(
    () => questions.find((q) => q.id === currentId) ?? null,
    [questions, currentId],
  );

  const stats = useMemo(() => {
    const now = Date.now();
    const todayStart = startOfTodayMs();
    let reviewedToday = 0;
    let correctToday = 0;
    for (const h of state.history) {
      if (h.ts >= todayStart) {
        reviewedToday += 1;
        if (h.correct) correctToday += 1;
      }
    }
    let dueSoon = 0;
    let newCards = 0;
    for (const q of questions) {
      const c = state.cards[q.id];
      if (!c || c.lastReviewed === 0) {
        newCards += 1;
        continue;
      }
      if (c.dueAt <= now + DAY_MS) dueSoon += 1;
    }
    const accuracy =
      reviewedToday > 0 ? Math.round((correctToday / reviewedToday) * 100) : 0;
    return { reviewedToday, accuracy, dueSoon, newCards };
  }, [state, questions]);

  const handleReveal = useCallback(
    (choiceId: string) => {
      if (revealed || !current) return;
      setPickedChoice(choiceId);
      setRevealed(true);
      const correct = choiceId === current.correct;
      setState((prev) => {
        const card = prev.cards[current.id] ?? makeInitialCard(current.id);
        const updated: SrsCard = {
          ...card,
          correctCount: card.correctCount + (correct ? 1 : 0),
          incorrectCount: card.incorrectCount + (correct ? 0 : 1),
        };
        return {
          cards: { ...prev.cards, [current.id]: updated },
          history: [
            ...prev.history,
            { id: current.id, ts: Date.now(), correct },
          ].slice(-500),
        };
      });
    },
    [current, revealed],
  );

  const handleRate = useCallback(
    (quality: number) => {
      if (!current) return;
      setState((prev) => {
        const card = prev.cards[current.id] ?? makeInitialCard(current.id);
        const updated = applySm2(card, quality);
        return { ...prev, cards: { ...prev.cards, [current.id]: updated } };
      });
      // Advance to next card.
      setPickedChoice(null);
      setRevealed(false);
      setCurrentId((prevId) => {
        const draftState: StudyState = {
          ...state,
          cards: {
            ...state.cards,
            [current.id]: applySm2(
              state.cards[current.id] ?? makeInitialCard(current.id),
              quality,
            ),
          },
        };
        const next = pickDueCard(draftState, questions, prevId ?? undefined);
        return next;
      });
    },
    [current, state, questions],
  );

  const handleSkip = useCallback(() => {
    if (!current) return;
    // Skip pushes the card one day out without altering EF.
    setState((prev) => {
      const card = prev.cards[current.id] ?? makeInitialCard(current.id);
      const updated: SrsCard = {
        ...card,
        dueAt: Date.now() + DAY_MS,
      };
      return { ...prev, cards: { ...prev.cards, [current.id]: updated } };
    });
    setPickedChoice(null);
    setRevealed(false);
    setCurrentId((prevId) => pickDueCard(state, questions, prevId ?? undefined));
  }, [current, state, questions]);

  if (!hydrated) {
    return (
      <div className="rounded-lg border border-ink-100 p-8 text-center text-ink-500">
        Loading study session...
      </div>
    );
  }

  return (
    <div>
      <StatsPanel stats={stats} />
      {current ? (
        <CardView
          question={current}
          pickedChoice={pickedChoice}
          revealed={revealed}
          onPick={handleReveal}
          onRate={handleRate}
          onSkip={handleSkip}
        />
      ) : (
        <div className="rounded-lg border border-ink-100 p-8 text-center text-ink-700">
          No cards available. (This is unusual — try reloading.)
        </div>
      )}
    </div>
  );
}

function pickDueCard(
  state: StudyState,
  questions: Question[],
  avoidId?: string,
): string | null {
  const now = Date.now();
  // First, due-now cards in order of how overdue.
  const due: { id: string; dueAt: number }[] = [];
  // New cards (never reviewed) act like due now but go after explicit-due cards.
  const fresh: { id: string }[] = [];
  // Future cards as a fallback.
  const future: { id: string; dueAt: number }[] = [];

  for (const q of questions) {
    if (q.id === avoidId) continue;
    const card = state.cards[q.id];
    if (!card || card.lastReviewed === 0) {
      fresh.push({ id: q.id });
      continue;
    }
    if (card.dueAt <= now) {
      due.push({ id: q.id, dueAt: card.dueAt });
    } else {
      future.push({ id: q.id, dueAt: card.dueAt });
    }
  }
  due.sort((a, b) => a.dueAt - b.dueAt);
  future.sort((a, b) => a.dueAt - b.dueAt);

  if (due.length > 0) return due[0].id;
  if (fresh.length > 0) {
    return fresh[Math.floor(Math.random() * fresh.length)].id;
  }
  if (future.length > 0) return future[0].id;
  // No cards at all (shouldn't happen): pick anything but the avoided.
  const fallback = questions.find((q) => q.id !== avoidId);
  return fallback?.id ?? null;
}

function StatsPanel({
  stats,
}: {
  stats: {
    reviewedToday: number;
    accuracy: number;
    dueSoon: number;
    newCards: number;
  };
}) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatTile label="Reviewed today" value={String(stats.reviewedToday)} />
      <StatTile label="Accuracy today" value={`${stats.accuracy}%`} />
      <StatTile label="Due within 24h" value={String(stats.dueSoon)} />
      <StatTile label="New cards" value={String(stats.newCards)} />
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-ink-100 p-3 text-center">
      <div className="text-xs uppercase tracking-wider text-ink-500">
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold text-ink-900">{value}</div>
    </div>
  );
}

function CardView({
  question,
  pickedChoice,
  revealed,
  onPick,
  onRate,
  onSkip,
}: {
  question: Question;
  pickedChoice: string | null;
  revealed: boolean;
  onPick: (choiceId: string) => void;
  onRate: (quality: number) => void;
  onSkip: () => void;
}) {
  return (
    <article className="rounded-lg border border-ink-200 bg-white p-6 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-ink-500">
        <span>{question.id}</span>
        <span aria-hidden>|</span>
        <span>{question.topic}</span>
        <span aria-hidden>|</span>
        <span>{question.difficulty}</span>
      </div>
      <h2 className="text-lg font-medium text-ink-900">{question.prompt}</h2>
      <ul className="mt-4 space-y-2">
        {question.choices.map((c) => {
          const isPicked = pickedChoice === c.id;
          const isCorrect = c.id === question.correct;
          let cls =
            "block w-full rounded-md border border-ink-200 px-3 py-2 text-left transition hover:border-ink-400";
          if (revealed) {
            if (isCorrect)
              cls =
                "block w-full rounded-md border border-emerald-400 bg-emerald-50 px-3 py-2 text-left";
            else if (isPicked)
              cls =
                "block w-full rounded-md border border-rose-400 bg-rose-50 px-3 py-2 text-left";
            else cls = "block w-full rounded-md border border-ink-100 px-3 py-2 text-left text-ink-600";
          }
          return (
            <li key={c.id}>
              <button
                type="button"
                className={cls}
                onClick={() => onPick(c.id)}
                disabled={revealed}
              >
                <span className="font-medium text-ink-500 mr-2">
                  {c.id.toUpperCase()}.
                </span>
                {c.text}
              </button>
            </li>
          );
        })}
      </ul>

      {revealed && (
        <div className="mt-5 rounded-md bg-ink-50 p-4 text-sm text-ink-800">
          <div className="font-semibold">
            {pickedChoice === question.correct ? "Correct." : "Not quite."}
          </div>
          <div className="mt-1">{question.rationale}</div>
          <div className="mt-2 text-xs text-ink-500">
            Source:{" "}
            <Link
              href={sourceHref(question.source)}
              className="underline hover:text-ink-700"
            >
              {question.source}
            </Link>
            {question.pending_source ? " (page pending)" : null}
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {revealed ? (
          <>
            <span className="text-xs uppercase tracking-wider text-ink-500">
              Rate recall:
            </span>
            <button
              type="button"
              onClick={() => onRate(5)}
              className="rounded-md border border-emerald-400 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800 hover:bg-emerald-100"
            >
              Easy
            </button>
            <button
              type="button"
              onClick={() => onRate(3)}
              className="rounded-md border border-amber-400 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-800 hover:bg-amber-100"
            >
              Hard
            </button>
            <button
              type="button"
              onClick={() => onRate(1)}
              className="rounded-md border border-rose-400 bg-rose-50 px-3 py-1 text-sm font-medium text-rose-800 hover:bg-rose-100"
            >
              Again
            </button>
            <button
              type="button"
              onClick={onSkip}
              className="ml-auto rounded-md border border-ink-200 px-3 py-1 text-sm text-ink-700 hover:border-ink-400"
            >
              Skip
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onSkip}
            className="ml-auto rounded-md border border-ink-200 px-3 py-1 text-sm text-ink-700 hover:border-ink-400"
          >
            Skip
          </button>
        )}
      </div>
    </article>
  );
}
