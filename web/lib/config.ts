/**
 * Centralized config helpers. All process.env access funnels through here so
 * other modules don't sprout direct `process.env.X` references.
 *
 * Each helper returns sensible defaults when the env is missing so the build
 * still succeeds in unconfigured environments.
 */

function num(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

function str(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

/**
 * Per-document vision budget. Used by the project-upload pipeline to cap
 * spend when extracting text from PDFs and images. Separate counter from
 * the deed-decode budget.
 */
export const PROJECT_DOC_VISION_DAILY_LIMIT_CENTS = num(
  "PROJECT_DOC_VISION_DAILY_LIMIT_CENTS",
  500,
);

/** Maximum upload size for project documents. Default 25 MB. */
export const PROJECT_DOC_MAX_BYTES = num("PROJECT_DOC_MAX_BYTES", 25_000_000);

/** Daily budget for the deed-decode endpoint (separate counter). */
export const DEED_DECODE_DAILY_LIMIT_CENTS = num(
  "DEED_DECODE_DAILY_LIMIT_CENTS",
  500,
);

/** Anthropic model used for vision extraction. */
export const VISION_MODEL = str("VISION_MODEL", "claude-opus-4-7");

/** Anthropic API key — server-side fallback (BYOK preferred elsewhere). */
export function getServerAnthropicKey(): string | null {
  return process.env.ANTHROPIC_API_KEY || null;
}

/**
 * MIME types accepted by the project-document upload route.
 */
export const PROJECT_DOC_ACCEPTED_MIME = new Set<string>([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "text/plain",
  "text/markdown",
]);
