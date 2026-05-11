// Minimal operator-funded daily budget guard for AI vision usage.
//
// This is intentionally simple: an in-memory counter, reset at UTC midnight.
// It is good enough for a single-replica deployment of the Next.js app. A
// future revision should persist to Redis or a database row if the app runs
// horizontally scaled.
//
// Phase 3 Agent 5 was expected to land a shared `operator-budget.ts`; this
// file is the stub fallback. If/when the shared helper lands, callers can
// migrate to it — the API surface here is intentionally tiny.

import { getDeedVisionDailyLimitCents } from "./config";

type BudgetState = {
  utcDay: string; // ISO date string (YYYY-MM-DD)
  spentCents: number;
  requests: number;
};

const STATE: Record<string, BudgetState> = Object.create(null);

function utcDay(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function getOrInit(bucket: string): BudgetState {
  const today = utcDay();
  const s = STATE[bucket];
  if (!s || s.utcDay !== today) {
    const fresh: BudgetState = { utcDay: today, spentCents: 0, requests: 0 };
    STATE[bucket] = fresh;
    return fresh;
  }
  return s;
}

export interface BudgetCheck {
  ok: boolean;
  spentCents: number;
  limitCents: number;
  resetAtUtc: string;
}

/**
 * Check that today's spend is still under the configured cap. Returns
 * `ok: false` if the cap is already exceeded.
 */
export function checkDeedVisionBudget(): BudgetCheck {
  const limit = getDeedVisionDailyLimitCents();
  const s = getOrInit("deed-vision");
  const ok = s.spentCents < limit;
  // Reset is the start of the next UTC day.
  const next = new Date();
  next.setUTCHours(24, 0, 0, 0);
  return {
    ok,
    spentCents: s.spentCents,
    limitCents: limit,
    resetAtUtc: next.toISOString(),
  };
}

/**
 * Record actual spend (in cents) for a completed deed-vision request.
 * Callers should derive the cents value from the Anthropic usage report.
 */
export function recordDeedVisionSpend(cents: number): void {
  if (!Number.isFinite(cents) || cents <= 0) return;
  const s = getOrInit("deed-vision");
  s.spentCents += cents;
  s.requests += 1;
}

/**
 * Approximate per-million-token pricing for Claude Opus 4.7. Used only as a
 * coarse budget governor — the real billing source of truth is Anthropic.
 * Values in cents per 1M tokens.
 */
const OPUS_INPUT_CENTS_PER_MTOK = 1500; // $15.00 / Mtok
const OPUS_OUTPUT_CENTS_PER_MTOK = 7500; // $75.00 / Mtok

export function estimateOpusCostCents(
  inputTokens: number,
  outputTokens: number,
): number {
  return Math.ceil(
    (inputTokens / 1_000_000) * OPUS_INPUT_CENTS_PER_MTOK +
      (outputTokens / 1_000_000) * OPUS_OUTPUT_CENTS_PER_MTOK,
  );
}
