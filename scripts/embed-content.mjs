#!/usr/bin/env node
// Placeholder for the embedding pipeline. The real implementation lands in Phase 1B.

console.log(
  'Embedding pipeline placeholder. Reads SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from env. ' +
    'Will chunk content/ at heading boundaries, embed via @xenova/transformers (bge-small) locally, ' +
    'upsert into pgvector. Implementation in Phase 1B.',
);
process.exit(0);
