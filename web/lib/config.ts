/**
 * Centralised, lazy-validated environment-variable accessor.
 *
 * We deliberately avoid `zod` here so the web app stays dependency-light and
 * the build never crashes during static analysis when env vars are missing.
 * Every getter is lazy: it inspects `process.env` at call time and returns
 * `null`/`undefined` when a value is absent. The rest of the app must handle
 * that gracefully (the Supabase helpers, for example, fall back to `null`).
 */

export type AppEnv = {
  /** Server-side Anthropic key. BYOK fallback handled in the chat route. */
  ANTHROPIC_API_KEY?: string;
  /** Required for minting / verifying invite-link JWTs. */
  INVITE_SECRET?: string;

  /** Public Supabase URL — safe to expose in the browser. */
  NEXT_PUBLIC_SUPABASE_URL?: string;
  /** Public Supabase anon key — safe to expose in the browser. */
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  /** Server-only Supabase service-role key. NEVER ship this to a client. */
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

function readString(key: keyof AppEnv): string | undefined {
  const raw = process.env[key as string];
  if (raw === undefined) return undefined;
  const trimmed = raw.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/** Returns the validated env object. Unknown / blank values become undefined. */
export function getEnv(): AppEnv {
  const supabaseUrl = readString("NEXT_PUBLIC_SUPABASE_URL");
  return {
    ANTHROPIC_API_KEY: readString("ANTHROPIC_API_KEY"),
    INVITE_SECRET: readString("INVITE_SECRET"),
    NEXT_PUBLIC_SUPABASE_URL:
      supabaseUrl && isHttpUrl(supabaseUrl) ? supabaseUrl : undefined,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: readString("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    SUPABASE_SERVICE_ROLE_KEY: readString("SUPABASE_SERVICE_ROLE_KEY"),
  };
}

/** True when the public Supabase pair is configured (for browser clients). */
export function hasPublicSupabaseConfig(): boolean {
  const env = getEnv();
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/** True when the server-side service-role key is configured. */
export function hasServerSupabaseConfig(): boolean {
  const env = getEnv();
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}
