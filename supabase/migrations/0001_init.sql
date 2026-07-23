-- 1KRAFTS — initial schema, RLS policies, and storage bucket.
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query → paste → Run).

-- ============================================================
-- Tables
-- ============================================================

create table if not exists categories (
  slug text primary key,
  name text not null,
  tagline text not null,
  description text not null,
  image text not null,
  featured boolean not null default false,
  "order" int not null default 0
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  sku text unique not null,
  category_slug text not null references categories(slug),
  subcategory text,
  brand text not null default '1KRAFTS Atelier',
  description text not null,
  story text,
  specifications jsonb not null default '[]',
  images jsonb not null default '[]',
  gallery jsonb not null default '[]',
  price numeric not null,
  currency text not null default 'NPR' check (currency in ('NPR', 'USD', 'INR')),
  discount numeric default 0,
  stock int not null default 0,
  material text not null default '',
  occasion text not null default '',
  weight text,
  dimensions text,
  color text not null default '',
  fabric text not null default '',
  tags text[] not null default '{}',
  badges text[] not null default '{}',
  seo_title text not null default '',
  seo_description text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists products_category_slug_idx on products(category_slug);

create table if not exists journal_posts (
  slug text primary key,
  title text not null,
  excerpt text not null,
  category text not null,
  cover text not null,
  author text not null default '1KRAFTS',
  published_at timestamptz not null default now(),
  body text not null
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,
  quote text not null,
  product_ref text,
  rating int not null default 5 check (rating between 1 and 5)
);

create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  message text not null,
  product_slug text,
  product_name text,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);
create index if not exists enquiries_status_idx on enquiries(status);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table categories enable row level security;
alter table products enable row level security;
alter table journal_posts enable row level security;
alter table testimonials enable row level security;
alter table enquiries enable row level security;

-- Public (storefront) read access — anyone, logged in or not.
create policy "public read categories" on categories for select using (true);
create policy "public read products" on products for select using (true);
create policy "public read journal_posts" on journal_posts for select using (true);
create policy "public read testimonials" on testimonials for select using (true);

-- Only the authenticated admin may write.
create policy "admin write categories" on categories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write products" on products for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write journal_posts" on journal_posts for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write testimonials" on testimonials for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Enquiries: anyone can submit, nobody but the admin can read/manage them.
create policy "public submit enquiries" on enquiries for insert
  with check (true);
create policy "admin manage enquiries" on enquiries for select using (auth.role() = 'authenticated');
create policy "admin update enquiries" on enquiries for update
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin delete enquiries" on enquiries for delete using (auth.role() = 'authenticated');

-- ============================================================
-- Storage — public "media" bucket for product/category/journal images
-- ============================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media" on storage.objects for select
  using (bucket_id = 'media');
create policy "admin write media" on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "admin update media" on storage.objects for update
  using (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "admin delete media" on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');
