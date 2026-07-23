-- 1KRAFTS — seed data, ported from the original static src/data/*.ts files.
-- Run this AFTER 0001_init.sql, in the same SQL editor.
-- Image paths point at /src/assets/... which only resolves while running
-- `npm run dev` locally — this is placeholder data for verifying the backend
-- wiring works, not final product photography. Real products/photos come in
-- later through the admin panel's bulk CSV/Excel + image upload.

insert into categories (slug, name, tagline, description, image, featured, "order") values
('sarees', 'Sarees', 'Draped in heritage', 'Hand-loomed silks and cottons finished with woven Dhaka borders.', '/src/assets/cat-saree-nepali.png', true, 1),
('women-kurtis', 'Women Kurtis', 'Everyday elegance', 'Featherlight kurtis embroidered by hand for modern living.', '/src/assets/cat-kurti.jpg', true, 2),
('jewellery', 'Jewellery', 'For her, kept close', 'Newari filigree, kundan and antique gold set by hand.', '/src/assets/cat-jewellery.jpg', true, 3),
('men-kurtas', 'Men Kurtas', 'Ceremony, refined', 'Hand-finished kurtas in mountain-loomed cotton and silk.', '/src/assets/cat-traditional.jpg', true, 4),
('men-shirts', 'Men Shirts', 'Considered every day', 'Tailored shirts in soft cottons and heritage weaves.', '/src/assets/cat-men-shirts.jpg', true, 5),
('men-tshirts', 'Men T-Shirts', 'Quiet essentials', 'Heavy-cotton tees finished with subtle heritage marks.', '/src/assets/cat-men-tshirts.jpg', true, 6),
('men-bottoms', 'Men Bottom Wear', 'The base note', 'Trousers, suruwals and drawstring bottoms cut to sit clean.', '/src/assets/cat-men-bottoms.jpg', false, 7)
on conflict (slug) do nothing;

insert into products
(slug, name, sku, category_slug, brand, description, story, specifications, images, gallery, price, currency, discount, stock, material, occasion, weight, dimensions, color, fabric, tags, badges, seo_title, seo_description, created_at)
values
('rakta-banaras-silk-saree', 'Rakta — Banaras Silk Saree', '1K-SAR-0001', 'sarees', '1KRAFTS Atelier',
 'A deep vermilion silk hand-woven in the Kathmandu valley, finished with an antique gold zari border and a floral pallu inspired by temple relief carvings.',
 'Rakta is the colour of first light on the Boudhanath stupa. Our master weaver Krishna took forty-two days to complete this piece on the traditional pit loom.',
 '[{"label":"Fabric","value":"Katan silk"},{"label":"Length","value":"6.3 metres"},{"label":"Blouse piece","value":"0.8 metres unstitched"},{"label":"Care","value":"Dry clean only"}]'::jsonb,
 '[{"src":"/src/assets/product-saree-red.jpg","alt":"Rakta Banaras silk saree"},{"src":"/src/assets/craft-embroidery.jpg","alt":"Embroidery detail"}]'::jsonb,
 '[{"src":"/src/assets/product-saree-red.jpg","alt":"Full drape"},{"src":"/src/assets/craft-embroidery.jpg","alt":"Border detail"},{"src":"/src/assets/product-saree-red.jpg","alt":"Pallu"}]'::jsonb,
 68000, 'NPR', 0, 3, 'Pure silk', 'Bridal', '820 g', '6.3m x 1.15m', 'Vermilion', 'Katan silk',
 ARRAY['saree','bridal','silk','wedding'], ARRAY['bestseller','wedding'],
 'Rakta — Handwoven Banaras Silk Saree', 'Vermilion Katan silk with antique gold zari border.', '2026-07-01'),

('nila-indigo-cotton-saree', 'Nila — Indigo Cotton Saree', '1K-SAR-0002', 'sarees', '1KRAFTS Atelier',
 'A hand-loomed indigo cotton saree with a fine gold zari border — light enough for everyday, considered enough for occasion.',
 null,
 '[{"label":"Fabric","value":"Handloom cotton"},{"label":"Length","value":"5.5 metres"},{"label":"Border","value":"Fine gold zari"}]'::jsonb,
 '[{"src":"/src/assets/product-saree-indigo.jpg","alt":"Indigo cotton saree"}]'::jsonb,
 '[{"src":"/src/assets/product-saree-indigo.jpg","alt":"Full drape"},{"src":"/src/assets/craft-embroidery.jpg","alt":"Border"},{"src":"/src/assets/product-saree-indigo.jpg","alt":"Detail"}]'::jsonb,
 24500, 'NPR', 0, 8, 'Handloom cotton', 'Everyday', null, null, 'Indigo', 'Cotton',
 ARRAY['saree','cotton','indigo'], ARRAY['bestseller'],
 'Nila — Indigo Cotton Saree', 'Handloom indigo cotton saree with gold zari border.', '2026-07-02'),

('aakash-charcoal-kurta', 'Aakash — Charcoal Cotton Kurta', '1K-MEN-0003', 'men-kurtas', '1KRAFTS Atelier',
 'A long-line kurta in a deep charcoal handloom cotton, cut with a mandarin collar and mother-of-pearl buttons.',
 null,
 '[{"label":"Fabric","value":"Handloom cotton"},{"label":"Collar","value":"Mandarin"},{"label":"Fit","value":"Tailored"}]'::jsonb,
 '[{"src":"/src/assets/product-kurta-charcoal.jpg","alt":"Charcoal kurta"}]'::jsonb,
 '[{"src":"/src/assets/product-kurta-charcoal.jpg","alt":"Front"},{"src":"/src/assets/product-kurta-charcoal.jpg","alt":"Back"},{"src":"/src/assets/product-kurta-charcoal.jpg","alt":"Detail"}]'::jsonb,
 14500, 'NPR', 0, 5, 'Cotton', 'Ceremony', null, null, 'Charcoal', 'Cotton',
 ARRAY['men','kurta','ceremony'], ARRAY['new'],
 'Aakash — Charcoal Cotton Kurta', 'A long-line charcoal handloom cotton kurta.', '2026-07-03'),

('mrittika-hand-embroidered-kurti', 'Mrittika — Hand-embroidered Kurti', '1K-WOM-0004', 'women-kurtis', '1KRAFTS Atelier',
 'A featherlight cream kurti in Chanderi cotton, hand-embroidered along the placket with fine chikan and zardozi.',
 null,
 '[{"label":"Fabric","value":"Chanderi cotton"},{"label":"Work","value":"Chikan + zardozi, hand"},{"label":"Length","value":"44 in"}]'::jsonb,
 '[{"src":"/src/assets/product-kurti-cream.jpg","alt":"Cream kurti"}]'::jsonb,
 '[{"src":"/src/assets/product-kurti-cream.jpg","alt":"Front"},{"src":"/src/assets/product-kurti-cream.jpg","alt":"Back"},{"src":"/src/assets/craft-embroidery.jpg","alt":"Detail"}]'::jsonb,
 18500, 'NPR', 0, 12, 'Chanderi cotton', 'Everyday', null, null, 'Cream', 'Cotton',
 ARRAY['kurti','cotton','everyday'], ARRAY['new','bestseller'],
 'Mrittika — Hand-embroidered Cream Kurti', 'A hand-embroidered Chanderi cotton kurti.', '2026-07-04'),

('surya-antique-gold-necklace', 'Surya — Antique Gold Necklace', '1K-JEW-0005', 'jewellery', 'Newari Atelier',
 'A single-stone necklace in antique-finished gold with Newari filigree work and a garnet cabochon. Numbered edition of twelve.',
 null,
 '[{"label":"Metal","value":"22k gold, antique finish"},{"label":"Stone","value":"Natural garnet"},{"label":"Edition","value":"12"}]'::jsonb,
 '[{"src":"/src/assets/product-necklace-gold.jpg","alt":"Surya necklace"}]'::jsonb,
 '[{"src":"/src/assets/product-necklace-gold.jpg","alt":"Front"},{"src":"/src/assets/product-necklace-gold.jpg","alt":"Detail"},{"src":"/src/assets/product-necklace-gold.jpg","alt":"Side"}]'::jsonb,
 210000, 'NPR', 0, 2, '22k gold', 'Bridal', null, null, 'Gold', 'Metal',
 ARRAY['jewellery','gold','bridal','limited'], ARRAY['limited','wedding'],
 'Surya — Antique Gold Necklace', 'Newari-filigree antique gold necklace with garnet.', '2026-07-05'),

('prithvi-linen-shirt', 'Prithvi — Ivory Linen Shirt', '1K-MEN-0006', 'men-shirts', '1KRAFTS Atelier',
 'A relaxed-cut ivory linen shirt with a soft point collar and horn buttons — cut in the Kathmandu atelier.',
 null,
 '[{"label":"Fabric","value":"European linen"},{"label":"Fit","value":"Relaxed"},{"label":"Buttons","value":"Horn"}]'::jsonb,
 '[{"src":"/src/assets/product-shirt-linen.jpg","alt":"Ivory linen shirt"}]'::jsonb,
 '[{"src":"/src/assets/product-shirt-linen.jpg","alt":"Front"},{"src":"/src/assets/product-shirt-linen.jpg","alt":"Back"},{"src":"/src/assets/product-shirt-linen.jpg","alt":"Detail"}]'::jsonb,
 8900, 'NPR', 0, 20, 'Linen', 'Everyday', null, null, 'Ivory', 'Linen',
 ARRAY['men','shirt','linen'], ARRAY['new'],
 'Prithvi — Ivory Linen Shirt', 'Relaxed-cut ivory linen shirt with horn buttons.', '2026-07-06'),

('chandra-heavy-cotton-tee', 'Chandra — Heavy Cotton Tee', '1K-MEN-0007', 'men-tshirts', '1KRAFTS Atelier',
 'A quiet, heavy-cotton t-shirt in soft ecru with a hand-embroidered house mark at the hem.',
 null,
 '[{"label":"Fabric","value":"260 gsm cotton"},{"label":"Detail","value":"Hand-embroidered hem mark"}]'::jsonb,
 '[{"src":"/src/assets/product-tee-ecru.jpg","alt":"Heavy cotton tee"}]'::jsonb,
 '[{"src":"/src/assets/product-tee-ecru.jpg","alt":"Front"},{"src":"/src/assets/product-tee-ecru.jpg","alt":"Back"},{"src":"/src/assets/product-tee-ecru.jpg","alt":"Detail"}]'::jsonb,
 3800, 'NPR', 0, 30, 'Cotton', 'Everyday', null, null, 'Ecru', 'Cotton',
 ARRAY['men','tshirt','cotton'], ARRAY['new'],
 'Chandra — Heavy Cotton Tee', 'A heavy-cotton t-shirt with hand-embroidered hem mark.', '2026-07-07'),

('sagar-drawstring-trouser', 'Sagar — Drawstring Trouser', '1K-MEN-0008', 'men-bottoms', '1KRAFTS Atelier',
 'A soft cotton drawstring trouser in walnut, cut with a straight leg and a fine turned hem.',
 null,
 '[{"label":"Fabric","value":"Handloom cotton"},{"label":"Leg","value":"Straight"},{"label":"Waist","value":"Drawstring"}]'::jsonb,
 '[{"src":"/src/assets/product-trouser-walnut.jpg","alt":"Drawstring trouser"}]'::jsonb,
 '[{"src":"/src/assets/product-trouser-walnut.jpg","alt":"Front"},{"src":"/src/assets/product-trouser-walnut.jpg","alt":"Back"},{"src":"/src/assets/product-trouser-walnut.jpg","alt":"Detail"}]'::jsonb,
 6800, 'NPR', 0, 15, 'Cotton', 'Everyday', null, null, 'Walnut', 'Cotton',
 ARRAY['men','bottom','trouser'], ARRAY['new'],
 'Sagar — Drawstring Trouser', 'Walnut handloom cotton drawstring trouser.', '2026-07-08'),

('tara-jhumka-earrings', 'Tara — Filigree Jhumka Earrings', '1K-JEW-0009', 'jewellery', 'Newari Atelier',
 'Hand-worked silver filigree jhumkas with a fine gold wash and freshwater pearl drops.',
 null,
 '[{"label":"Metal","value":"Silver, gold-washed"},{"label":"Stone","value":"Freshwater pearl"}]'::jsonb,
 '[{"src":"/src/assets/product-jhumka.jpg","alt":"Filigree jhumkas"}]'::jsonb,
 '[{"src":"/src/assets/product-jhumka.jpg","alt":"Front"},{"src":"/src/assets/product-jhumka.jpg","alt":"Detail"},{"src":"/src/assets/product-jhumka.jpg","alt":"Side"}]'::jsonb,
 12800, 'NPR', 0, 6, 'Silver', 'Everyday', null, null, 'Silver / Gold', 'Metal',
 ARRAY['jewellery','earrings','silver'], ARRAY['new'],
 'Tara — Filigree Jhumka Earrings', 'Silver filigree jhumkas with pearl drops.', '2026-07-09'),

('asha-block-print-kurti', 'Asha — Block-print Cotton Kurti', '1K-WOM-0010', 'women-kurtis', '1KRAFTS Atelier',
 'A soft block-printed cotton kurti in indigo and ivory, cut long with side vents.',
 null,
 '[{"label":"Fabric","value":"Cotton"},{"label":"Print","value":"Hand block"}]'::jsonb,
 '[{"src":"/src/assets/product-kurti-blockprint.jpg","alt":"Block print kurti"}]'::jsonb,
 '[{"src":"/src/assets/product-kurti-blockprint.jpg","alt":"Front"},{"src":"/src/assets/product-kurti-blockprint.jpg","alt":"Back"},{"src":"/src/assets/product-kurti-blockprint.jpg","alt":"Detail"}]'::jsonb,
 9800, 'NPR', 0, 10, 'Cotton', 'Everyday', null, null, 'Indigo / Ivory', 'Cotton',
 ARRAY['kurti','cotton','block-print'], ARRAY['bestseller'],
 'Asha — Block-print Cotton Kurti', 'Long-cut block-print cotton kurti.', '2026-07-10'),

('surya-cotton-shirt-white', 'Surya — White Cotton Shirt', '1K-MEN-0011', 'men-shirts', '1KRAFTS Atelier',
 'A crisp white cotton shirt with a soft point collar, ideal under a bandhgala or on its own.',
 null,
 '[{"label":"Fabric","value":"Cotton poplin"},{"label":"Fit","value":"Regular"}]'::jsonb,
 '[{"src":"/src/assets/product-shirt-white.jpg","alt":"White cotton shirt"}]'::jsonb,
 '[{"src":"/src/assets/product-shirt-white.jpg","alt":"Front"},{"src":"/src/assets/product-shirt-white.jpg","alt":"Back"},{"src":"/src/assets/product-shirt-white.jpg","alt":"Detail"}]'::jsonb,
 6500, 'NPR', 0, 18, 'Cotton', 'Everyday', null, null, 'White', 'Cotton',
 ARRAY['men','shirt','cotton'], ARRAY[]::text[],
 'Surya — White Cotton Shirt', 'Crisp white cotton shirt with a soft point collar.', '2026-07-11'),

('meera-graphic-tee', 'Meera — Graphic Cotton Tee', '1K-MEN-0012', 'men-tshirts', '1KRAFTS Atelier',
 'A midweight tee in charcoal with a hand screen-printed heritage motif at the chest.',
 null,
 '[{"label":"Fabric","value":"Cotton"},{"label":"Print","value":"Hand screen"}]'::jsonb,
 '[{"src":"/src/assets/product-tee-graphic.jpg","alt":"Graphic tee"}]'::jsonb,
 '[{"src":"/src/assets/product-tee-graphic.jpg","alt":"Front"},{"src":"/src/assets/product-tee-graphic.jpg","alt":"Back"},{"src":"/src/assets/product-tee-graphic.jpg","alt":"Detail"}]'::jsonb,
 3200, 'NPR', 0, 22, 'Cotton', 'Everyday', null, null, 'Charcoal', 'Cotton',
 ARRAY['men','tshirt','graphic'], ARRAY[]::text[],
 'Meera — Graphic Cotton Tee', 'Midweight charcoal tee with a hand-printed motif.', '2026-07-12'),

('himal-cream-silk-kurta', 'Himal — Cream Silk Kurta', '1K-MEN-0013', 'men-kurtas', '1KRAFTS Atelier',
 'A ceremonial cream raw-silk kurta with a fine gold zari collar and cuffs.',
 null,
 '[{"label":"Fabric","value":"Raw silk"},{"label":"Detail","value":"Gold zari"}]'::jsonb,
 '[{"src":"/src/assets/product-kurta-silk.jpg","alt":"Cream silk kurta"}]'::jsonb,
 '[{"src":"/src/assets/product-kurta-silk.jpg","alt":"Front"},{"src":"/src/assets/product-kurta-silk.jpg","alt":"Back"},{"src":"/src/assets/product-kurta-silk.jpg","alt":"Detail"}]'::jsonb,
 28000, 'NPR', 0, 4, 'Raw silk', 'Ceremony', null, null, 'Cream', 'Silk',
 ARRAY['men','kurta','silk','ceremony'], ARRAY['limited'],
 'Himal — Cream Silk Kurta', 'Cream raw-silk kurta with gold zari collar and cuffs.', '2026-07-13'),

('kailash-linen-trouser', 'Kailash — Ivory Linen Trouser', '1K-MEN-0014', 'men-bottoms', '1KRAFTS Atelier',
 'A tailored ivory linen trouser with a flat-front cut and side adjusters.',
 null,
 '[{"label":"Fabric","value":"Linen"},{"label":"Waist","value":"Side adjusters"}]'::jsonb,
 '[{"src":"/src/assets/product-trouser-linen.jpg","alt":"Ivory linen trouser"}]'::jsonb,
 '[{"src":"/src/assets/product-trouser-linen.jpg","alt":"Front"},{"src":"/src/assets/product-trouser-linen.jpg","alt":"Back"},{"src":"/src/assets/product-trouser-linen.jpg","alt":"Detail"}]'::jsonb,
 9500, 'NPR', 0, 5, 'Linen', 'Everyday', null, null, 'Ivory', 'Linen',
 ARRAY['men','bottom','linen'], ARRAY['new'],
 'Kailash — Ivory Linen Trouser', 'Tailored ivory linen trouser with side adjusters.', '2026-07-14')
on conflict (sku) do nothing;

insert into journal_posts (slug, title, excerpt, category, cover, author, published_at, body) values
('the-loom-that-remembers', 'The Loom That Remembers', 'How a wooden loom in a Kathmandu courtyard keeps a two-hundred-year-old memory alive.', 'Craft', '/src/assets/craft-loom.jpg', 'Anjana Shrestha', '2026-05-14',
 'In a courtyard behind the Boudha stupa, a wooden loom clicks on with a rhythm older than the road outside. This is the loom that made the first Rakta silk. It has not been rebuilt.'),
('gold-thread-slow-time', 'Gold Thread, Slow Time', 'The forty-two days it takes to finish a single Banaras border.', 'Atelier', '/src/assets/craft-embroidery.jpg', 'Krishna Rai', '2026-06-02',
 'A zari border is not woven. It is coaxed. You cannot rush a thread that measures itself in years, not minutes.'),
('chyangra-and-the-cold', 'Chyangra and the Cold', 'Above three thousand metres, a goat and a shepherd give us pashmina.', 'Heritage', '/src/assets/heritage-mountain.jpg', 'Pemba Sherpa', '2026-06-19',
 'Chyangra pashmina is only pashmina because the cold makes it so. This is a story about wind, altitude, and the slow patience of fibre.')
on conflict (slug) do nothing;

insert into testimonials (name, location, quote, rating) values
('Aarohi Rana', 'Kathmandu', 'I wore Sagun for my wedding. Three years later friends still ask where it came from. It is the finest thing I own.', 5),
('Ishaan Malla', 'London', 'The daura arrived pressed like a letter. You can feel the hours in it. Nothing else in my wardrobe compares.', 5),
('Priya Shah', 'Mumbai', 'The Himal pashmina is the softest thing I have touched. It has become the piece I gift to people I love.', 5);
