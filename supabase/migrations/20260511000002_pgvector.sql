-- pgvector setup for AI Project Companion retrieval.
-- Idempotent: safe to run on a fresh DB or one that already has pgvector.
-- If pgvector is unavailable (e.g. a bare Postgres without the extension
-- package), running this migration will fail loudly — that's the signal
-- that retrieval will fall back to non-vector storage and the rest of
-- the app should not depend on the `embedding` column existing.

create extension if not exists vector;

-- Add the embedding column. 1536 dims matches text-embedding-3-small and
-- voyage-3-lite. Adjust upstream if the chosen model changes.
alter table public.project_document_chunks
  add column if not exists embedding vector(1536);

-- HNSW index with cosine ops. m=16 / ef_construction=64 are pgvector
-- defaults that work well for moderately sized corpora.
do $$
begin
  if not exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and indexname = 'project_document_chunks_embedding_hnsw_idx'
  ) then
    execute 'create index project_document_chunks_embedding_hnsw_idx '
         || 'on public.project_document_chunks '
         || 'using hnsw (embedding vector_cosine_ops) '
         || 'with (m = 16, ef_construction = 64)';
  end if;
end$$;
