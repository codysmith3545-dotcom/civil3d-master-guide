# Supabase migrations

This directory holds the SQL migrations that back the AI Project Companion (Phase 5B) of the Civil 3D Master Guide.

## What the migrations do

`20260511000001_projects.sql`
- Creates four tables in the `public` schema:
  - `projects` — one row per user-owned project (name, slug, optional GeoJSON bounds).
  - `project_documents` — uploaded files (filename, content type, byte size, sha256 dedupe key, processing status).
  - `project_document_chunks` — text chunks extracted from each document, ready for embedding.
  - `project_chats` — chat history scoped to a project, including the retrieved chunk IDs for each turn.
- Adds the `document_processing_status` enum (`pending` / `processed` / `error`).
- Adds the indexes the app needs: owner lookups, project-scoped uploads ordered by `uploaded_at desc`, sha256 dedupe.
- Enables Row Level Security on every table and adds owner-only policies that key off `auth.uid()`. Documents, chunks and chats inherit ownership through their parent project.
- Adds an `updated_at` trigger on `projects` so timestamps stay honest.

`20260511000002_pgvector.sql`
- `create extension if not exists vector` (idempotent).
- Adds the `embedding vector(1536)` column to `project_document_chunks`.
- Adds an HNSW index using `vector_cosine_ops` (`m = 16`, `ef_construction = 64`).
- The whole file is idempotent: re-running it on a DB that already has the extension and index is a no-op.

If `pgvector` is unavailable in the target environment, skip the second migration. The rest of the schema still works for non-vector storage; retrieval will need a fallback (e.g. full-text search via `tsvector`).

## How to apply

### Option A — Supabase CLI (recommended for local + CI)

```bash
# Link the project once (interactive)
supabase link --project-ref <YOUR_REF>

# Push the migrations to the linked remote DB
supabase db push
```

### Option B — Dashboard SQL editor

1. Open the project in the Supabase dashboard.
2. Go to **SQL editor → New query**.
3. Paste the contents of `20260511000001_projects.sql`, run it.
4. Repeat with `20260511000002_pgvector.sql`.

Run them in numeric order — the second file depends on the chunks table created by the first.

## Environment variables

Set these in your hosting environment (Vercel, Fly, etc.) and locally in `.env.local`:

| Var | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | for project features | Public; safe to expose in the browser. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | for browser reads | Public anon key. |
| `SUPABASE_SERVICE_ROLE_KEY` | server-only | **Never** ship to a client bundle. Bypasses RLS — used by `getServerSupabase()`. |

All three are optional from the build's perspective: the web app boots without them, and `getServerSupabase()` / `getBrowserSupabase()` return `null` so consumers can degrade gracefully.

## Fallback behaviour when not configured

- `web/lib/supabase.ts` returns `null` from both factories when env vars are missing.
- `web/lib/projects.ts` throws a clear "Supabase is not configured" error if it's called without env vars set. UI surfaces should check for the configuration first or hide project features altogether.
