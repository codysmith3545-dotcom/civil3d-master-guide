import { SignJWT, jwtVerify } from "jose";

const ALG = "HS256";

/**
 * Known-bad placeholder values. If `INVITE_SECRET` ends up set to any of
 * these (typically because the deployment used the .env.example value as-is),
 * we throw at first use rather than silently issuing tokens with a guessable
 * secret. Throw is intentional — a misconfigured INVITE_SECRET is a security
 * incident, not a soft warning.
 */
const PLACEHOLDER_SECRETS = new Set([
  "change-me-to-a-random-secret-min-16-chars",
  "change-me",
  "changeme",
  "secret",
  "your-secret-here",
  "replace-me",
  "todo",
  "xxx",
]);

const MIN_SECRET_LEN = 16;

let validatedSecret: Uint8Array | null = null;

function validateAndEncodeSecret(raw: string): Uint8Array {
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();
  if (PLACEHOLDER_SECRETS.has(lower)) {
    throw new Error(
      "INVITE_SECRET is set to a known placeholder value. " +
        "Generate a real random secret (e.g. `openssl rand -hex 32`) and set it before issuing invite tokens.",
    );
  }
  if (trimmed.length < MIN_SECRET_LEN) {
    throw new Error(
      `INVITE_SECRET must be at least ${MIN_SECRET_LEN} characters. ` +
        "Generate one with `openssl rand -hex 32`.",
    );
  }
  return new TextEncoder().encode(trimmed);
}

function getSecret(): Uint8Array {
  if (validatedSecret) return validatedSecret;
  const raw = process.env.INVITE_SECRET;
  if (!raw) {
    throw new Error(
      "INVITE_SECRET is not set. Generate one and put it in .env.local before issuing invite tokens.",
    );
  }
  validatedSecret = validateAndEncodeSecret(raw);
  return validatedSecret;
}

/**
 * Eagerly validate `INVITE_SECRET` at module init time when it is present.
 * This means a deployment with a placeholder secret fails fast on boot rather
 * than failing on the first invite request. We skip this only when the
 * variable is absent (tests, build-only environments).
 */
if (typeof process !== "undefined" && process.env?.INVITE_SECRET) {
  try {
    validatedSecret = validateAndEncodeSecret(process.env.INVITE_SECRET);
  } catch (err) {
    // Re-throw immediately — a bad secret should crash the process at start.
    throw err;
  }
}

/** Reset the cached validated secret. Intended for tests. */
export function _resetInviteSecretCache(): void {
  validatedSecret = null;
}

export type InvitePayload = {
  /** Subject — usually the invite recipient's email or a free-form label. */
  sub: string;
  /** Optional notes shown to the operator (not the invitee). */
  note?: string;
};

export async function mintToken(
  payload: InvitePayload,
  ttlSeconds = 60 * 60 * 24 * 30,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return await new SignJWT({ note: payload.note ?? "" })
    .setProtectedHeader({ alg: ALG })
    .setSubject(payload.sub)
    .setIssuedAt(now)
    .setExpirationTime(now + ttlSeconds)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<InvitePayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: [ALG],
    });
    if (typeof payload.sub !== "string") return null;
    return { sub: payload.sub, note: (payload.note as string) ?? "" };
  } catch {
    return null;
  }
}
