/**
 * Lazy Supabase client factories.
 *
 * Both helpers return `null` when their corresponding env vars are missing
 * so the rest of the app (build, dev server, marketing pages) keeps working
 * without a Supabase project attached.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { getEnv, hasPublicSupabaseConfig, hasServerSupabaseConfig } from "./config";

let cachedServerClient: SupabaseClient | null | undefined;
let cachedBrowserClient: SupabaseClient | null | undefined;

/**
 * Server-side client using the service-role key. Bypasses RLS — only call
 * from trusted server code (route handlers, server actions) and always
 * scope queries by `owner_user_id` yourself.
 *
 * Returns `null` when SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL
 * are not set.
 */
export function getServerSupabase(): SupabaseClient | null {
  if (cachedServerClient !== undefined) return cachedServerClient;

  if (!hasServerSupabaseConfig()) {
    cachedServerClient = null;
    return null;
  }

  const env = getEnv();
  // Import lazily so the module can be tree-shaken when Supabase is unused.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require("@supabase/supabase-js") as typeof import("@supabase/supabase-js");
  cachedServerClient = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL as string,
    env.SUPABASE_SERVICE_ROLE_KEY as string,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
  return cachedServerClient;
}

/**
 * Browser-safe client using the anon key. Subject to RLS.
 * Returns `null` when the public Supabase pair is not configured.
 */
export function getBrowserSupabase(): SupabaseClient | null {
  if (cachedBrowserClient !== undefined) return cachedBrowserClient;

  if (!hasPublicSupabaseConfig()) {
    cachedBrowserClient = null;
    return null;
  }

  const env = getEnv();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require("@supabase/supabase-js") as typeof import("@supabase/supabase-js");
  cachedBrowserClient = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL as string,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    },
  );
  return cachedBrowserClient;
}

/** Exposed for tests so caches don't leak between cases. */
export function __resetSupabaseClientsForTests(): void {
  cachedServerClient = undefined;
  cachedBrowserClient = undefined;
}
