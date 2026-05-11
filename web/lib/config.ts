// Lightweight env-var helpers. Centralized here so that future expansion of
// validation logic (e.g. zod) has a single chokepoint. The existing chat
// route reads ANTHROPIC_API_KEY directly off `req.headers` because it uses
// BYOK; the deed-decode vision route, however, uses the operator-funded key
// under a small daily budget.

export function getOperatorAnthropicKey(): string | undefined {
  const k = process.env.ANTHROPIC_API_KEY;
  if (!k || k.trim() === "") return undefined;
  return k;
}

export function getDeedVisionDailyLimitCents(): number {
  const raw = process.env.DEED_VISION_DAILY_LIMIT_CENTS ?? "200";
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : 200;
}

export function getDeedVisionRateLimitPerHour(): number {
  const raw = process.env.DEED_VISION_RATE_LIMIT_PER_HOUR ?? "5";
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : 5;
}
