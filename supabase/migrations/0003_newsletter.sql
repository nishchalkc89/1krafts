-- 1KRAFTS — newsletter subscribers.
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query → paste → Run).

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

alter table newsletter_subscribers enable row level security;

-- Anyone can subscribe; only the admin can see or manage the list.
create policy "public subscribe newsletter" on newsletter_subscribers for insert
  with check (true);
create policy "admin read newsletter" on newsletter_subscribers for select
  using (auth.role() = 'authenticated');
create policy "admin delete newsletter" on newsletter_subscribers for delete
  using (auth.role() = 'authenticated');
