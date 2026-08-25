-- Kodungallur Temple form database schema
-- Run this entire file in Supabase Dashboard -> SQL Editor.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.pooja_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (btrim(name) <> '' and char_length(name) <= 150 and name !~ '[0-9]'),
  star text not null check (btrim(star) <> '' and char_length(star) <= 100 and star !~ '[0-9]'),
  phone text not null check (phone ~ '^[0-9]+$' and char_length(phone) <= 20),
  email text not null check (char_length(email) <= 254 and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  offering text not null check (offering in ('nakshatra', 'guruthy', 'archana', 'rektha', 'other')),
  preferred_date date not null,
  persons integer not null default 1 check (persons >= 1),
  notes text check (notes is null or char_length(notes) <= 2000),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.donation_pledges (
  id uuid primary key default gen_random_uuid(),
  name text not null check (btrim(name) <> '' and char_length(name) <= 150 and name !~ '[0-9]'),
  phone text not null check (phone ~ '^[0-9]+$' and char_length(phone) <= 20),
  email text check (email is null or email = '' or (char_length(email) <= 254 and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')),
  cause text not null check (cause in ('annadanam', 'charity', 'renovation')),
  amount bigint not null check (amount >= 100),
  note text check (note is null or char_length(note) <= 2000),
  status text not null default 'pending' check (status in ('pending', 'contacted', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (btrim(name) <> '' and char_length(name) <= 150 and name !~ '[0-9]'),
  email text not null check (char_length(email) <= 254 and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  phone text check (phone is null or phone = '' or (phone ~ '^[0-9]+$' and char_length(phone) <= 20)),
  message text not null check (btrim(message) <> '' and char_length(message) <= 5000),
  status text not null default 'pending' check (status in ('pending', 'replied', 'closed')),
  created_at timestamptz not null default now()
);

create index if not exists pooja_requests_status_created_idx
  on public.pooja_requests (status, created_at desc);
create index if not exists donation_pledges_status_created_idx
  on public.donation_pledges (status, created_at desc);
create index if not exists inquiries_status_created_idx
  on public.inquiries (status, created_at desc);

-- The website writes through the serverless API using a server-only secret key.
-- Browser roles receive no direct access to devotees' personal information.
alter table public.pooja_requests enable row level security;
alter table public.donation_pledges enable row level security;
alter table public.inquiries enable row level security;

revoke all on table public.pooja_requests from anon, authenticated;
revoke all on table public.donation_pledges from anon, authenticated;
revoke all on table public.inquiries from anon, authenticated;

grant select, insert, update, delete on table public.pooja_requests to service_role;
grant select, insert, update, delete on table public.donation_pledges to service_role;
grant select, insert, update, delete on table public.inquiries to service_role;

-- These tables contain personal information. Set and document a retention period
-- before production, then delete expired rows with a scheduled server-side job.
