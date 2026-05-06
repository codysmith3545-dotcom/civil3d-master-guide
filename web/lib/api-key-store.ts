// Browser-only encrypted store for the user's Anthropic API key.
//
// Threat model: an XSS payload in *another* tab cannot read this key, because
// the AES-GCM key is derived from a session-scoped UUID held in
// sessionStorage. The same XSS in *this* tab can still call `loadKey()` —
// that is unavoidable for any in-browser secret. The encryption guards
// against:
//   - extensions / shared devices skimming localStorage at rest
//   - log shipping that snapshots localStorage to disk
//   - accidental leakage via the React devtools store inspector
//
// Storage format under `c3d_api_key_v2`:
//   { v: 2, iv: <base64 12-byte IV>, ct: <base64 ciphertext> }

const STORAGE_KEY = "c3d_api_key_v2";
const LEGACY_KEY = "c3d_api_key";
const SESSION_ID_KEY = "c3d_session_id";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof crypto !== "undefined";
}

function b64encode(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]!);
  return btoa(s);
}

function b64decode(s: string): Uint8Array {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function getOrCreateSessionId(): string {
  let id = sessionStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
}

async function deriveKey(): Promise<CryptoKey> {
  const sessionId = getOrCreateSessionId();
  const material = new TextEncoder().encode(sessionId);
  const baseKey = await crypto.subtle.importKey(
    "raw",
    material,
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );
  // Fixed salt is fine here — the secret is the per-tab session UUID, not the
  // salt. PBKDF2 just stretches the UUID into a 256-bit AES key.
  const salt = new TextEncoder().encode("c3d-api-key-store-v2");
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

type Envelope = { v: 2; iv: string; ct: string };

export async function saveKey(plaintext: string): Promise<void> {
  if (!isBrowser()) return;
  const trimmed = plaintext.trim();
  if (!trimmed) {
    clearKey();
    return;
  }
  const key = await deriveKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(trimmed),
  );
  const envelope: Envelope = {
    v: 2,
    iv: b64encode(iv),
    ct: b64encode(ct),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
}

async function migrateLegacy(): Promise<string | null> {
  const legacy = localStorage.getItem(LEGACY_KEY);
  if (!legacy) return null;
  try {
    await saveKey(legacy);
  } finally {
    localStorage.removeItem(LEGACY_KEY);
  }
  return legacy.trim() || null;
}

export async function loadKey(): Promise<string | null> {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return await migrateLegacy();
  }
  let env: Envelope;
  try {
    env = JSON.parse(raw) as Envelope;
  } catch {
    return null;
  }
  if (env?.v !== 2 || !env.iv || !env.ct) return null;
  try {
    const key = await deriveKey();
    const iv = b64decode(env.iv);
    const ct = b64decode(env.ct);
    const pt = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv as BufferSource },
      key,
      ct as BufferSource,
    );
    return new TextDecoder().decode(pt);
  } catch {
    // Most likely the session UUID was lost (tab closed) — caller should
    // prompt the user to re-enter the key.
    return null;
  }
}

export function clearKey(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_KEY);
}
