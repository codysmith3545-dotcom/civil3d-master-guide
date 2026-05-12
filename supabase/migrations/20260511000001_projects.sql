-- AI Project Companion — Phase 5B schema
-- Creates project / document / chunk / chat tables with row-level security
-- so that only the owner (auth.uid()) can read or write their own rows.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'document_processing_status') then
    create type document_processing_status as enum ('pending', 'processed', 'error');
  end if;
end$$;

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  slug text not null,
  project_bounds_geojson jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- A user can't have two projects with the same slug.
  unique (owner_user_id, slug)
);

create index if not exists projects_owner_user_id_idx
  on public.projects (owner_user_id);

create index if not exists projects_owner_created_at_idx
  on public.projects (owner_user_id, created_at desc);

-- Keep updated_at fresh on every UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- project_documents
-- ---------------------------------------------------------------------------
create table if not exists public.project_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  filename text not null,
  content_type text,
  bytes_size integer,
  sha256 text,
  uploaded_at timestamptz not null default now(),
  processed_at timestamptz,
  processing_status document_processing_status not null default 'pending'
);

create index if not exists project_documents_project_uploaded_idx
  on public.project_documents (project_id, uploaded_at desc);

create index if not exists project_documents_sha256_idx
  on public.project_documents (sha256);

-- ---------------------------------------------------------------------------
-- project_document_chunks
-- ---------------------------------------------------------------------------
-- NB: the `embedding vector(1536)` column is defined in the
-- 20260511000002_pgvector.sql migration so that this file can run
-- on a Postgres without the pgvector extension. If pgvector is not
-- present, the chunks table still works for full-text storage.
create table if not exists public.project_document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.project_documents (id) on delete cascade,
  chunk_index integer not null,
  text text not null,
  token_count integer,
  unique (document_id, chunk_index)
);

create index if not exists project_document_chunks_document_idx
  on public.project_document_chunks (document_id);

-- ---------------------------------------------------------------------------
-- project_chats
-- ---------------------------------------------------------------------------
create table if not exists public.project_chats (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  user_message text not null,
  assistant_message text,
  retrieved_chunks jsonb,
  created_at timestamptz not null default now()
);

create index if not exists project_chats_project_created_idx
  on public.project_chats (project_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.projects enable row level security;
alter table public.project_documents enable row level security;
alter table public.project_document_chunks enable row level security;
alter table public.project_chats enable row level security;

-- projects: owner can do everything to their own rows
drop policy if exists projects_owner_select on public.projects;
create policy projects_owner_select on public.projects
  for select using (auth.uid() = owner_user_id);

drop policy if exists projects_owner_insert on public.projects;
create policy projects_owner_insert on public.projects
  for insert with check (auth.uid() = owner_user_id);

drop policy if exists projects_owner_update on public.projects;
create policy projects_owner_update on public.projects
  for update using (auth.uid() = owner_user_id)
  with check (auth.uid() = owner_user_id);

drop policy if exists projects_owner_delete on public.projects;
create policy projects_owner_delete on public.projects
  for delete using (auth.uid() = owner_user_id);

-- project_documents: ownership flows through the parent project
drop policy if exists project_documents_owner_select on public.project_documents;
create policy project_documents_owner_select on public.project_documents
  for select using (
    exists (
      select 1 from public.projects p
      where p.id = project_documents.project_id
        and p.owner_user_id = auth.uid()
    )
  );

drop policy if exists project_documents_owner_insert on public.project_documents;
create policy project_documents_owner_insert on public.project_documents
  for insert with check (
    exists (
      select 1 from public.projects p
      where p.id = project_documents.project_id
        and p.owner_user_id = auth.uid()
    )
  );

drop policy if exists project_documents_owner_update on public.project_documents;
create policy project_documents_owner_update on public.project_documents
  for update using (
    exists (
      select 1 from public.projects p
      where p.id = project_documents.project_id
        and p.owner_user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.projects p
      where p.id = project_documents.project_id
        and p.owner_user_id = auth.uid()
    )
  );

drop policy if exists project_documents_owner_delete on public.project_documents;
create policy project_documents_owner_delete on public.project_documents
  for delete using (
    exists (
      select 1 from public.projects p
      where p.id = project_documents.project_id
        and p.owner_user_id = auth.uid()
    )
  );

-- project_document_chunks: ownership through document -> project
drop policy if exists project_document_chunks_owner_select on public.project_document_chunks;
create policy project_document_chunks_owner_select on public.project_document_chunks
  for select using (
    exists (
      select 1 from public.project_documents d
      join public.projects p on p.id = d.project_id
      where d.id = project_document_chunks.document_id
        and p.owner_user_id = auth.uid()
    )
  );

drop policy if exists project_document_chunks_owner_insert on public.project_document_chunks;
create policy project_document_chunks_owner_insert on public.project_document_chunks
  for insert with check (
    exists (
      select 1 from public.project_documents d
      join public.projects p on p.id = d.project_id
      where d.id = project_document_chunks.document_id
        and p.owner_user_id = auth.uid()
    )
  );

drop policy if exists project_document_chunks_owner_update on public.project_document_chunks;
create policy project_document_chunks_owner_update on public.project_document_chunks
  for update using (
    exists (
      select 1 from public.project_documents d
      join public.projects p on p.id = d.project_id
      where d.id = project_document_chunks.document_id
        and p.owner_user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.project_documents d
      join public.projects p on p.id = d.project_id
      where d.id = project_document_chunks.document_id
        and p.owner_user_id = auth.uid()
    )
  );

drop policy if exists project_document_chunks_owner_delete on public.project_document_chunks;
create policy project_document_chunks_owner_delete on public.project_document_chunks
  for delete using (
    exists (
      select 1 from public.project_documents d
      join public.projects p on p.id = d.project_id
      where d.id = project_document_chunks.document_id
        and p.owner_user_id = auth.uid()
    )
  );

-- project_chats: ownership through parent project
drop policy if exists project_chats_owner_select on public.project_chats;
create policy project_chats_owner_select on public.project_chats
  for select using (
    exists (
      select 1 from public.projects p
      where p.id = project_chats.project_id
        and p.owner_user_id = auth.uid()
    )
  );

drop policy if exists project_chats_owner_insert on public.project_chats;
create policy project_chats_owner_insert on public.project_chats
  for insert with check (
    exists (
      select 1 from public.projects p
      where p.id = project_chats.project_id
        and p.owner_user_id = auth.uid()
    )
  );

drop policy if exists project_chats_owner_update on public.project_chats;
create policy project_chats_owner_update on public.project_chats
  for update using (
    exists (
      select 1 from public.projects p
      where p.id = project_chats.project_id
        and p.owner_user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.projects p
      where p.id = project_chats.project_id
        and p.owner_user_id = auth.uid()
    )
  );

drop policy if exists project_chats_owner_delete on public.project_chats;
create policy project_chats_owner_delete on public.project_chats
  for delete using (
    exists (
      select 1 from public.projects p
      where p.id = project_chats.project_id
        and p.owner_user_id = auth.uid()
    )
  );
