import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Heart, Mail, MessageCircle, Phone, Play, Share2 } from "lucide-react";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { ProductGrid } from "@/components/product/ProductGrid";
import { services } from "@/services";
import { formatPrice } from "@/lib/format";
import { useEnquiry } from "@/context/EnquiryContext";
import { useWishlist } from "@/context/WishlistContext";

const productQuery = (slug: string) =>
  queryOptions({ queryKey: ["product", slug], queryFn: () => services.products.bySlug(slug) });
const relatedQuery = (id: string) =>
  queryOptions({ queryKey: ["related", id], queryFn: () => services.products.related(id, 4) });

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ params, context }) => {
    const p = await context.queryClient.fetchQuery(productQuery(params.slug));
    if (!p) throw notFound();
    await context.queryClient.fetchQuery(relatedQuery(p.id));
  },
  head: ({ params, loaderData: _l }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — 1KRAFTS` },
      { property: "og:url", content: `/products/${params.slug}` },
      { property: "og:type", content: "product" },
    ],
    links: [{ rel: "canonical", href: `/products/${params.slug}` }],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: p } = useSuspenseQuery(productQuery(slug));
  const { data: related } = useSuspenseQuery(relatedQuery(p!.id));
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number; on: boolean }>({ x: 50, y: 50, on: false });
  const mainRef = useRef<HTMLDivElement>(null);
  const { openEnquiry } = useEnquiry();
  const wl = useWishlist();

  if (!p) return null;
  const baseGallery = (p.gallery.length ? p.gallery : p.images).slice(0, 3);
  const VIDEO_SRC = "https://cdn.coverr.co/videos/coverr-a-fashion-model-in-a-flowing-dress-2633/1080p.mp4";
  type Media = { kind: "image" | "video"; src: string; poster?: string };
  const gallery: Media[] = [
    ...baseGallery.map((g) => ({ kind: "image" as const, src: g.src })),
    { kind: "video", src: VIDEO_SRC, poster: baseGallery[0]?.src },
  ];
  const prev = () => setActive((i) => (i - 1 + gallery.length) % gallery.length);
  const next = () => setActive((i) => (i + 1) % gallery.length);
  const current = gallery[active];
  const VIEW_LABELS = ["Front", "Back", "Side", "Detail"];

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = mainRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setZoom({ x, y, on: true });
  }

  return (
    <>
      <section className="pt-32 px-6 md:px-10">
        <div className="mx-auto grid max-w-[1680px] gap-12 lg:grid-cols-[1.15fr_1fr]">
          {/* Gallery */}
          <div>
            <div className="grid grid-cols-[80px_1fr] md:grid-cols-[100px_1fr] gap-3 md:gap-6">
              <div className="flex flex-col gap-3">
                {gallery.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={
                      "relative aspect-[3/4] overflow-hidden rounded-2xl border-2 transition-all " +
                      (i === active
                        ? "border-[color:var(--brass)] shadow-[0_10px_30px_-15px_color-mix(in_oklab,var(--walnut)_40%,transparent)]"
                        : "border-transparent opacity-70 hover:opacity-100")
                    }
                  >
                    <img src={g.kind === "video" ? g.poster! : g.src} alt="" className="h-full w-full object-cover" />
                    {g.kind === "video" && (
                      <span className="absolute inset-0 grid place-items-center bg-[color:var(--walnut)]/35">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-[color:var(--walnut)]">
                          <Play size={12} fill="currentColor" />
                        </span>
                      </span>
                    )}
                    {g.kind === "image" && (
                      <span className="absolute bottom-1.5 left-1.5 right-1.5 rounded-full bg-white/85 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-[color:var(--walnut)] text-center">
                        {VIEW_LABELS[i] ?? `View ${i + 1}`}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <motion.div
                key={active}
                ref={mainRef}
                initial={{ opacity: 0, filter: "blur(8px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => current.kind === "image" && setZoom((z) => ({ ...z, on: true }))}
                onMouseLeave={() => setZoom({ x: 50, y: 50, on: false })}
                onMouseMove={(e) => current.kind === "image" && onMove(e)}
                className={
                  "relative aspect-[4/5] overflow-hidden rounded-3xl bg-[color:var(--parchment)] shadow-[0_30px_80px_-40px_color-mix(in_oklab,var(--walnut)_45%,transparent)] " +
                  (current.kind === "image" ? "cursor-zoom-in" : "")
                }
              >
                {current.kind === "image" ? (
                  <img
                    src={current.src}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-300 ease-out will-change-transform"
                    style={{
                      transformOrigin: `${zoom.x}% ${zoom.y}%`,
                      transform: zoom.on ? "scale(2.1)" : "scale(1)",
                    }}
                  />
                ) : (
                  <video
                    src={current.src}
                    poster={current.poster}
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover"
                  />
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/85 backdrop-blur-md border border-[color:var(--brass)]/40 text-[color:var(--walnut)] hover:bg-white shadow-md transition"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/85 backdrop-blur-md border border-[color:var(--brass)]/40 text-[color:var(--walnut)] hover:bg-white shadow-md transition"
                >
                  <ChevronRight size={18} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {gallery.map((_, i) => (
                    <span
                      key={i}
                      className={
                        "h-1.5 rounded-full transition-all " +
                        (i === active ? "w-6 bg-[color:var(--brass)]" : "w-1.5 bg-white/70")
                      }
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <div className="eyebrow">{p.categorySlug}</div>
              <h1 className="mt-4 display-lg">{p.name}</h1>

              {/* Price banner */}
              <div className="mt-8 rounded-2xl bg-gradient-to-r from-[color:var(--walnut)] to-[color:var(--maroon)] px-8 py-6 text-center shadow-[0_20px_50px_-25px_color-mix(in_oklab,var(--walnut)_50%,transparent)]">
                <div className="font-display italic text-3xl md:text-4xl text-[color:var(--ivory)]">
                  {formatPrice(p.price, p.currency)}
                </div>
              </div>

              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-foreground">
                Prices exclude taxes · SKU {p.sku}
              </p>

              <p className="mt-8 max-w-lg font-medium text-foreground leading-relaxed">{p.description}</p>
              {p.story && (
                <p className="mt-4 max-w-lg font-medium text-foreground italic leading-relaxed">{p.story}</p>
              )}

              <div className="mt-10 flex flex-wrap gap-3">
                <button
                  onClick={() => openEnquiry({ productSlug: p.slug, productName: p.name })}
                  className="inline-flex items-center gap-3 rounded-full border border-foreground bg-foreground px-8 py-4 text-[0.72rem] uppercase tracking-[0.28em] text-[color:var(--ivory)] hover:bg-transparent hover:text-foreground transition-colors"
                >
                  Send Enquiry
                </button>
                <a
                  href={`https://wa.me/9779800000000?text=${encodeURIComponent(`Hello 1KRAFTS, I'd like to enquire about ${p.name}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/30 px-6 py-4 text-[0.72rem] uppercase tracking-[0.28em] hover:border-foreground"
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
                <a href="tel:+9779800000000" className="grid h-12 w-12 place-items-center rounded-full border border-foreground/30 hover:border-foreground">
                  <Phone size={14} />
                </a>
                <a href="mailto:atelier@1krafts.com" className="grid h-12 w-12 place-items-center rounded-full border border-foreground/30 hover:border-foreground">
                  <Mail size={14} />
                </a>
                <button
                  onClick={() => wl.toggle(p.id)}
                  aria-label="Wishlist"
                  className={
                    "grid h-12 w-12 place-items-center rounded-full border transition-colors " +
                    (wl.has(p.id) ? "border-[color:var(--maroon)] bg-[color:var(--maroon)] text-[color:var(--ivory)]" : "border-foreground/30 hover:border-foreground")
                  }
                >
                  <Heart size={14} fill={wl.has(p.id) ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={() => navigator.share?.({ url: window.location.href, title: p.name }).catch(() => {})}
                  className="grid h-12 w-12 place-items-center rounded-full border border-foreground/30 hover:border-foreground"
                >
                  <Share2 size={14} />
                </button>
              </div>

              <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-foreground/10 pt-10 text-sm">
                <SpecItem k="Material" v={p.material} />
                <SpecItem k="Fabric" v={p.fabric} />
                <SpecItem k="Colour" v={p.color} />
                <SpecItem k="Occasion" v={p.occasion} />
                {p.dimensions && <SpecItem k="Dimensions" v={p.dimensions} />}
                {p.weight && <SpecItem k="Weight" v={p.weight} />}
                {p.specifications.map((s) => (
                  <SpecItem key={s.label} k={s.label} v={s.value} />
                ))}
                <SpecItem k="Stock" v={p.stock > 0 ? `${p.stock} pieces` : "Made to order"} />
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Film / video section */}
      <section className="px-6 md:px-10 mt-32">
        <div className="mx-auto max-w-[1680px]">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <div className="eyebrow">The Film</div>
              <h2 className="mt-4 display-md">In motion</h2>
            </div>
            <p className="hidden md:block max-w-sm text-sm font-medium text-foreground leading-relaxed">
              A short study of drape, hand, and light — filmed inside our Kathmandu atelier.
            </p>
          </div>
          <ProductFilm poster={gallery[0].src} title={p.name} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="px-6 md:px-10 py-32 mt-32 bg-[color:var(--cream)]">
          <div className="mx-auto max-w-[1680px]">
            <div className="mb-12 flex items-end justify-between gap-6">
              <div>
                <div className="eyebrow">Chosen with</div>
                <h2 className="mt-4 display-md">You may also like</h2>
              </div>
              <Link
                to="/collections/$slug"
                params={{ slug: p.categorySlug }}
                className="text-[0.72rem] uppercase tracking-[0.28em] gold-underline"
              >
                View all in {p.categorySlug} →
              </Link>
            </div>
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </>
  );
}

function SpecItem({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="eyebrow text-[color:var(--sindoor)]">{k}</dt>
      <dd className="mt-1 text-foreground">{v}</dd>
    </div>
  );
}

function ProductFilm({ poster, title }: { poster: string; title: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  }
  return (
    <div className="relative aspect-[21/9] overflow-hidden rounded-3xl bg-[color:var(--walnut)] shadow-[0_40px_100px_-40px_color-mix(in_oklab,var(--walnut)_60%,transparent)]">
      <video
        ref={ref}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        className="h-full w-full object-cover"
        aria-label={`${title} film`}
      >
        <source src="https://cdn.coverr.co/videos/coverr-a-fashion-model-in-a-flowing-dress-2633/1080p.mp4" type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color:var(--walnut)]/60 via-transparent to-transparent" />
      <button
        onClick={toggle}
        aria-label={playing ? "Pause film" : "Play film"}
        className="group absolute inset-0 grid place-items-center"
      >
        <span className={"grid h-20 w-20 md:h-24 md:w-24 place-items-center rounded-full border border-[color:var(--ivory)]/70 bg-[color:var(--ivory)]/10 backdrop-blur-md text-[color:var(--ivory)] transition-transform group-hover:scale-110 " + (playing ? "opacity-0" : "opacity-100")}>
          <Play size={26} className="translate-x-0.5" fill="currentColor" />
        </span>
      </button>
      <div className="pointer-events-none absolute bottom-6 left-6 md:bottom-8 md:left-10">
        <div className="eyebrow text-[color:var(--ivory)]">Atelier Film · 00:42</div>
        <div className="mt-2 font-display italic text-2xl md:text-3xl text-[color:var(--ivory)]">{title}</div>
      </div>
    </div>
  );
}