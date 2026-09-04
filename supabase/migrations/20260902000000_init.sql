-- EuroCV schema: CVs owned by Supabase Auth users. (The purchases table created here was dropped in a later migration.)

create table if not exists public.cvs (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  template_id text not null default 'classic',
  data jsonb not null,
  document jsonb,
  review jsonb,
  generated_at timestamptz,
  data_updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cvs_user_updated_idx on public.cvs (user_id, updated_at desc);

alter table public.cvs enable row level security;

drop policy if exists "cvs: owner access" on public.cvs;
create policy "cvs: owner access" on public.cvs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- One row per completed Paddle transaction. Written by the server with the
-- service role; users can only read their own.
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  email text not null,
  paddle_transaction_id text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists purchases_email_idx on public.purchases (lower(email));
create index if not exists purchases_user_idx on public.purchases (user_id);

alter table public.purchases enable row level security;

drop policy if exists "purchases: owner read" on public.purchases;
create policy "purchases: owner read" on public.purchases
  for select
  using (auth.uid() = user_id);
