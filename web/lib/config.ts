import { z } from "zod";

// Validated environment configuration.
//
// Every value the app reads from `process.env` should be funneled through
// here so that:
//   1. Typos in env-var names blow up at boot, not at first request.
//   2. Type information flows through to call sites instead of `any`.
//
// Two surfaces are exported: `serverEnv` (Node-only secrets) and
// `publicEnv` (anything safe to expose to the browser, i.e. NEXT_PUBLIC_*).

const serverSchema = z.object({
  // Operator-funded fallback Anthropic key. When set, anonymous users get a
  // small per-IP daily quota on /api/chat backed by this key.
  ANTHROPIC_API_KEY: z.string().min(1).optional(),

  // HMAC secret for signing invite-link JWTs. Required when invite auth is
  // exercised (see lib/invites.ts). Validated lazily there to allow boots
  // without invites configured.
  INVITE_SECRET: z.string().min(16).optional(),

  // Per-IP daily cap for the operator-funded chat fallback. Counts only
  // requests where the user did NOT bring their own key.
  OPERATOR_CHAT_DAILY_LIMIT: z.coerce.number().int().positive().default(10),

  // Override for where markdown content lives. Useful in tests.
  CIVIL3D_CONTENT_ROOT: z.string().optional(),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const publicSchema = z.object({
  // Canonical public URL of the deployment. Used for absolute links in
  // metadata. Defaults to localhost in dev.
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url()
    .default("http://localhost:3000"),

  // Optional Supabase config (Phase 2).
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
});

function parseOrThrow<T extends z.ZodTypeAny>(
  schema: T,
  input: Record<string, unknown>,
  label: string,
): z.infer<T> {
  const result = schema.safeParse(input);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(
      `Invalid ${label} environment configuration:\n${issues}\n\n` +
        `Check your .env.local against .env.example.`,
    );
  }
  return result.data;
}

// Lazy-evaluate so unit tests can override `process.env` before import-time
// surprise. `globalThis` cache keeps it cheap on subsequent calls.
const CACHE_KEY = "__civil3d_env_cache__";
type EnvCache = {
  server?: z.infer<typeof serverSchema>;
  public?: z.infer<typeof publicSchema>;
};
function cache(): EnvCache {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = globalThis as any;
  if (!g[CACHE_KEY]) g[CACHE_KEY] = {} as EnvCache;
  return g[CACHE_KEY] as EnvCache;
}

export function getServerEnv() {
  const c = cache();
  if (!c.server) {
    c.server = parseOrThrow(serverSchema, process.env, "server");
  }
  return c.server;
}

export function getPublicEnv() {
  const c = cache();
  if (!c.public) {
    c.public = parseOrThrow(publicSchema, process.env, "public");
  }
  return c.public;
}

// Eagerly resolved exports for ergonomic call sites in server-only modules.
// Importing these from a client component will fail at build time because
// `serverEnv` references server-only vars; that is intentional.
export const serverEnv = getServerEnv();
export const publicEnv = getPublicEnv();
