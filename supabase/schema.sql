-- Prophetic Journal cloud sync schema
-- Run against a Supabase (Postgres) project. Every table is scoped to
-- auth.uid() via Row Level Security, so one user can never read, modify, or
-- enumerate another user's journal, dreams, or discernment map. Content is
-- stored as a single `payload` JSON document matching the client-side
-- TypeScript models in src/types/models.ts, keeping the client the single
-- source of truth for schema evolution without repeated migrations.

create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'Friend',
  biometric_lock_enabled boolean not null default false,
  ai_processing_consent boolean,
  theme_preference text not null default 'dark',
  created_at timestamptz not null default now()
);

create table if not exists journal_entries (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists dream_entries (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists activation_progress (
  activation_id text not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (activation_id, user_id)
);

create table if not exists discernment_nodes (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists discernment_connections (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table journal_entries enable row level security;
alter table dream_entries enable row level security;
alter table activation_progress enable row level security;
alter table discernment_nodes enable row level security;
alter table discernment_connections enable row level security;

create policy "profiles: owner full access" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "journal_entries: owner full access" on journal_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "dream_entries: owner full access" on dream_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "activation_progress: owner full access" on activation_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "discernment_nodes: owner full access" on discernment_nodes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "discernment_connections: owner full access" on discernment_connections
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', 'Friend'));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
