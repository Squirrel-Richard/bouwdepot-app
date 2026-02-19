-- Bouwdepot Tracker — Supabase Schema
create extension if not exists "uuid-ossp";

create table depots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  naam text not null,
  bank text not null,
  totaal_bedrag integer not null,
  startdatum date not null,
  vervaldatum date not null,
  omschrijving text,
  created_at timestamptz default now()
);

create table facturen (
  id uuid primary key default gen_random_uuid(),
  depot_id uuid references depots(id) on delete cascade not null,
  aanvrager_naam text not null,
  bedrag integer not null,
  factuur_datum date not null,
  ingediend_op date,
  uitbetaald_op date,
  status text default 'nieuw' check (status in ('nieuw', 'ingediend', 'uitbetaald', 'afgewezen')),
  omschrijving text,
  pdf_url text,
  created_at timestamptz default now()
);

alter table depots enable row level security;
alter table facturen enable row level security;

create policy "Own depots" on depots for all using (user_id = auth.uid());
create policy "Own facturen" on facturen for all
  using (depot_id in (select id from depots where user_id = auth.uid()));
