/**
 * Typed CRUD helpers for the `projects` table.
 *
 * These run against the server-side Supabase client (service role) and
 * therefore must filter by `owner_user_id` themselves to honour the same
 * boundary that RLS would enforce for anon callers.
 */

import { getServerSupabase } from "./supabase";

export type Project = {
  id: string;
  owner_user_id: string;
  name: string;
  slug: string;
  project_bounds_geojson: unknown | null;
  created_at: string;
  updated_at: string;
};

const TABLE = "projects";

function client() {
  const c = getServerSupabase();
  if (!c) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to use project storage.",
    );
  }
  return c;
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export async function listProjects(userId: string): Promise<Project[]> {
  const { data, error } = await client()
    .from(TABLE)
    .select("*")
    .eq("owner_user_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    throw new Error(`listProjects failed: ${error.message}`);
  }
  return (data ?? []) as Project[];
}

export async function createProject(
  userId: string,
  input: { name: string; slug: string },
): Promise<Project> {
  const name = input.name.trim();
  const slug = input.slug.trim();
  if (!name) throw new Error("createProject: name is required");
  if (!slug) throw new Error("createProject: slug is required");
  if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(slug)) {
    throw new Error(
      "createProject: slug must be lowercase alphanumerics or hyphens",
    );
  }

  const { data, error } = await client()
    .from(TABLE)
    .insert({ owner_user_id: userId, name, slug })
    .select("*")
    .single();
  if (error || !data) {
    throw new Error(
      `createProject failed: ${error?.message ?? "no row returned"}`,
    );
  }
  return data as Project;
}

export async function getProject(
  userId: string,
  slugOrId: string,
): Promise<Project | null> {
  const column = isUuid(slugOrId) ? "id" : "slug";
  const { data, error } = await client()
    .from(TABLE)
    .select("*")
    .eq("owner_user_id", userId)
    .eq(column, slugOrId)
    .maybeSingle();
  if (error) {
    throw new Error(`getProject failed: ${error.message}`);
  }
  return (data as Project | null) ?? null;
}

export async function deleteProject(
  userId: string,
  id: string,
): Promise<void> {
  if (!isUuid(id)) {
    throw new Error("deleteProject: id must be a UUID");
  }
  const { error } = await client()
    .from(TABLE)
    .delete()
    .eq("owner_user_id", userId)
    .eq("id", id);
  if (error) {
    throw new Error(`deleteProject failed: ${error.message}`);
  }
}
