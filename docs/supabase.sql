-- Run this once in Supabase SQL Editor after creating a private Storage bucket named municipal-documents.
create table if not exists public.municipal_documents (
  id bigint primary key,
  project_id bigint,
  file_name text not null,
  file_hash text not null,
  file_size bigint not null,
  mime_type text,
  storage_key text not null,
  updated_at timestamptz not null default now()
);

-- The backend uses the service-role key. Do not put that key in the frontend.
