-- 1KRAFTS — fix placeholder image paths.
-- Run this in the Supabase SQL editor after 0001-0003.
--
-- The original seed data (0002_seed.sql) referenced images at /src/assets/...
-- — a path that only resolves while running `npm run dev` locally. The
-- deployed/production build fingerprints and moves those files elsewhere, so
-- every category, product, and journal cover image seeded that way is broken
-- on the live site. The same files have been copied into public/placeholder/,
-- which Vite serves at the same absolute path in both dev and production.
-- This migration repoints every existing row at the new working path.
--
-- This is still placeholder photography, not final product shots — swap
-- these out for real photos any time via the admin panel.

update categories
set image = replace(image, '/src/assets/', '/placeholder/')
where image like '/src/assets/%';

update products
set images = replace(images::text, '"src":"/src/assets/', '"src":"/placeholder/')::jsonb
where images::text like '%"src":"/src/assets/%';

update products
set gallery = replace(gallery::text, '"src":"/src/assets/', '"src":"/placeholder/')::jsonb
where gallery::text like '%"src":"/src/assets/%';

update journal_posts
set cover = replace(cover, '/src/assets/', '/placeholder/')
where cover like '/src/assets/%';
