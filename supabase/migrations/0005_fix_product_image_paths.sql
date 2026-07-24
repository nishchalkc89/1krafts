-- 1KRAFTS — fix product image paths (corrected).
-- Run this in the Supabase SQL editor after 0004.
--
-- 0004's product UPDATE never matched anything: it searched for the literal
-- text `"src":"/src/assets/` (no space), but Postgres's jsonb-to-text cast
-- renders it as `"src": "/src/assets/` (with a space after the colon), so
-- every row was silently skipped. Categories and journal_posts are plain
-- text columns (no JSON key wrapping) and updated correctly already — this
-- migration only needs to touch products.

update products
set images = replace(images::text, '/src/assets/', '/placeholder/')::jsonb
where images::text like '%/src/assets/%';

update products
set gallery = replace(gallery::text, '/src/assets/', '/placeholder/')::jsonb
where gallery::text like '%/src/assets/%';
