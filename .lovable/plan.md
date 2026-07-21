
# 1KRAFTS — Phase 1: Brand + Storefront Shell

Deliver an Awwwards-caliber luxury storefront for a Nepali heritage brand. No live backend this phase — all data comes through a typed service layer with a mock implementation, so a real Supabase (or Node/Express/Nest) implementation can be dropped in later without touching UI code.

## Scope of this build

**Included**
- Full design system (ivory / cream / antique gold / dark brown / maroon / charcoal), serif + sans typography, motion tokens
- Cinematic home page with every section you listed
- Category landing pages (14 categories) using shared PLP shell (filter/sort UI, product-card grid, badges, hover image swap, quick view drawer) — powered by mock data
- Product detail page (gallery + zoom, specs, story, related, FAQ, reviews shell, share, wishlist, enquiry drawer, WhatsApp/call/email CTAs)
- Editorial pages: Heritage, Craftsmanship, Journal (shell), Contact, Enquiry
- Sticky nav with animated mega-menu, animated search, cart drawer (UI shell), wishlist drawer, enquiry drawer as primary CTA
- Luxury interactions: custom cursor accent, scroll progress, blur/reveal on scroll, parallax hero, marquee, magnetic buttons, subtle grain, glass morphism, skeleton loading, smooth page transitions
- Generated editorial imagery (hero cinemagraph poster, category tiles, craftsmanship story, textures)
- SEO: per-route metadata, OG tags, JSON-LD Product schema on PDP, sitemap/robots, semantic HTML
- Responsive (mobile-first), a11y baseline (focus states, reduced-motion, alt text, aria)

**Explicitly deferred (later phases)**
- Real Supabase wiring, auth, admin panel, bulk CSV/Excel import
- Real checkout, payments, orders

## Architecture (no vendor lock-in)

```text
src/
  routes/               TanStack Start file routes (framework requirement)
  components/
    ui/                 shadcn primitives (owned, unstyled Lovable coupling)
    brand/              Logo, WordMark, Monogram, Divider, GrainOverlay
    layout/             Header, MegaMenu, Footer, PageTransition, ScrollProgress
    motion/             Reveal, BlurIn, Parallax, Marquee, MagneticButton, Cursor
    product/            ProductCard, ProductGrid, QuickView, Gallery, Specs, Badge
    commerce/           EnquiryDrawer, WishlistDrawer, CartDrawer, SearchOverlay
    home/               Hero, FeaturedCategories, NewArrivals, Heritage, Craft,
                        LimitedCollection, Testimonials, InstagramGrid, Newsletter
  services/             ← swap layer (all backend access goes through here)
    types.ts            Product, Category, Collection, Enquiry, Testimonial, ...
    api.ts              Interface: ProductService, CategoryService, EnquiryService,
                        CmsService, TestimonialService
    mock/               MockProductService etc. — reads from /data fixtures
    supabase/           (stub file with TODOs; wired in phase 2)
    index.ts            Factory: picks impl from env, exports singletons
  hooks/                useReveal, useParallax, useCursor, useMediaQuery,
                        useWishlist, useEnquiryDrawer, useSearch (fuzzy)
  context/              WishlistProvider, EnquiryProvider, CartProvider (shell),
                        MotionProvider (reduced-motion aware)
  lib/                  cn, formatPrice, slug, seo helpers, fuse-search wrapper
  types/                Re-exports from services/types for app consumption
  utils/                animation constants, easings, breakpoints
  data/                 seed JSON for products, categories, testimonials, journal
  assets/               generated hero + editorial imagery (CDN-hosted)
  styles.css            design tokens + utility layers
```

Rule enforced everywhere: **components import from `@/services` and `@/types`, never from Supabase**. When you later add a real backend, only `services/supabase/*` (or `services/rest/*`) changes.

## Routes (phase 1)

```text
/                       Home (cinematic)
/collections            All categories overview
/collections/$slug      PLP for a category (sarees, kurti, pashmina, dhaka, …)
/products/$slug         PDP
/heritage               Nepali heritage story
/craftsmanship          Artisan / making-of story
/journal                Editorial index (shell)
/journal/$slug          Editorial article (shell w/ one seeded piece)
/enquire                Full enquiry page (drawer opens from anywhere)
/contact                Contact + WhatsApp/call/email
/about                  Brand story
```

All routes get their own `head()` with title, description, OG, twitter; PDP + collection routes render JSON-LD.

## Design language

- **Type**: Cormorant Garamond (display) + Manrope (body), loaded via `<link>` in `__root.tsx`. Large hero at ~clamp(4rem, 12vw, 12rem), tight tracking on serif, generous tracking on all-caps micro labels.
- **Palette (oklch tokens)**: `--ivory`, `--cream`, `--warm-white`, `--gold`, `--gold-soft`, `--brown`, `--maroon`, `--charcoal`, plus semantic maps to shadcn tokens.
- **Motion**: framer-motion for reveals/parallax/drawers, GSAP-free (framer covers spec). Reduced-motion path via `MotionProvider`.
- **Signature details**: subtle film grain overlay, hairline gold dividers, single-letter monogram "1K", ornate corner marks, slow-drifting gradient behind hero, cursor accent that softens over interactive elements.

## Editorial imagery plan

Generated via `imagegen` (fast tier, plus premium for hero). All saved under `src/assets/` and referenced from `data/*.json`:
- Hero: 2 layered stills (background drape + foreground artisan) for parallax
- 14 category tiles (saree, kurti, men, kids, traditional, jewellery, footwear, accessories, home decor, handicrafts, pashmina, dhaka, festival, wedding)
- 6 heritage / craftsmanship story frames (loom, dye pots, hands, temple bell, mountain morning, festival dusk)
- 12 product placeholders (three per featured category) — flat lay + on-model pair for hover swap
- 6 Instagram gallery frames + 3 testimonial portraits
- 1 tileable ivory paper texture, 1 gold foil texture

## Service layer contract (excerpt)

```ts
// services/types.ts
export interface Product { id; slug; name; sku; categorySlug; subcategory?; brand;
  description; specifications: Record<string,string>; images: string[]; gallery: string[];
  price; discount?; stock; material; occasion; weight?; dimensions?; color; fabric;
  tags: string[]; seo: { title; description }; badges?: ('new'|'bestseller'|'limited')[]; }

export interface ProductService {
  list(filter: ProductFilter): Promise<Paginated<Product>>;
  bySlug(slug: string): Promise<Product | null>;
  related(id: string): Promise<Product[]>;
  search(q: string): Promise<Product[]>;   // fuzzy via Fuse in mock
}
export interface EnquiryService { create(input: EnquiryInput): Promise<{ id: string }> }
// + CategoryService, CmsService, TestimonialService, JournalService
```

Mock impls read seeded JSON; the enquiry mock logs + resolves (in phase 2 it will insert into Supabase and RLS-scoped tables — the UI code will not change).

## Technical notes

- Stays on TanStack Start (SSR/SEO matters for Awwwards + Google). Folder intent from your brief is honored inside `src/`.
- No Lovable Cloud, no managed Supabase integration, no Lovable-proprietary imports. `@/services/supabase` will be a plain `@supabase/supabase-js` client reading `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` you provide.
- Libraries added: `framer-motion`, `fuse.js`, `embla-carousel-react`, `@vueuse/motion`-free (React only), `lucide-react` (already), `class-variance-authority` (already).
- Reduced-motion honored globally; every reveal has a static fallback.
- Lighthouse target: 95+ on desktop for the home page.

## What you'll see when this ships

A polished, dark-serif-on-ivory storefront that loads with a slow grain fade, drops you into a cinematic hero, and reveals each section as you scroll. Every category tile hovers into a slow zoom with a gold underline. Product cards flip between flat-lay and on-model. Clicking a product opens a full PDP with a big gallery, spec ledger, artisan story block, and a persistent "Send Enquiry / WhatsApp / Call" bar. Enquiry drawer collects name, phone, product ref, message, resolves to a success state — ready to be wired to Supabase in phase 2 by swapping one file.
