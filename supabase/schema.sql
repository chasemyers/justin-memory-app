-- Enable required extensions
create extension if not exists vector;
create extension if not exists pgcrypto;

-- Memories table
create table if not exists memories (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('FACT','PREF','TASK','EVENT','INSIGHT')),
  title text not null,
  body text not null,
  importance int default 3,
  sticky boolean default false,
  sensitive boolean default false,
  embedding vector(1536),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Search with cosine similarity
create or replace function search_memories(query_embedding vector(1536), match_count int)
returns table (
  id uuid,
  type text,
  title text,
  body text,
  importance int,
  sticky boolean,
  sensitive boolean,
  created_at timestamptz,
  similarity float
)
language sql immutable as $$
  select
    m.id, m.type, m.title, m.body, m.importance, m.sticky, m.sensitive, m.created_at,
    1 - (m.embedding <=> query_embedding) as similarity
  from memories m
  where m.embedding is not null and m.sensitive = false
  order by m.embedding <=> query_embedding asc, m.created_at desc
  limit match_count;
$$;
