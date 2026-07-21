import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import loom from "@/assets/craft-loom.jpg";
import embroidery from "@/assets/craft-embroidery.jpg";

export const Route = createFileRoute("/craftsmanship")({
  head: () => ({
    meta: [
      { title: "The Atelier — 1KRAFTS" },
      { name: "description", content: "Inside the 1KRAFTS atelier — the artisans, the looms, the slow hours." },
      { property: "og:title", content: "The Atelier — 1KRAFTS" },
      { property: "og:description", content: "The artisans, the looms, the slow hours." },
      { property: "og:url", content: "/craftsmanship" },
    ],
    links: [{ rel: "canonical", href: "/craftsmanship" }],
  }),
  component: Craft,
});

const NUMBERS = [
  { k: "01", h: "Warp", body: "A single Rakta saree begins with 4,800 warp threads set on a wooden pit loom in Palpa." },
  { k: "02", h: "Weft", body: "For forty-two days the weaver returns to the same loom. A rhythm the room learns." },
  { k: "03", h: "Border", body: "Zari borders are worked separately, in Boudha, by two women who have done nothing else for twenty years." },
  { k: "04", h: "Finish", body: "The final piece is washed once, in cold well-water, then folded into muslin and sealed with wax." },
];

function Craft() {
  return (
    <>
      <section className="relative h-[80svh] min-h-[560px] overflow-hidden bg-[color:var(--ink)] text-[color:var(--ivory)]">
        <Parallax className="absolute inset-0" offset={40}>
          <img src={loom} alt="A wooden loom" className="h-full w-full object-cover opacity-75" />
        </Parallax>
        <div className="relative z-10 mx-auto flex h-full max-w-[1680px] flex-col justify-end px-6 md:px-10 pb-24">
          <Reveal>
            <div className="eyebrow text-[color:var(--ivory)]/70">The Atelier</div>
            <h1 className="mt-6 display-xl max-w-4xl italic font-light">Forty-two days.</h1>
            <p className="mt-6 max-w-lg text-[color:var(--ivory)]/70">The time it takes to make a single saree. Not a minute less.</p>
          </Reveal>
        </div>
      </section>

      <section className="px-6 md:px-10 py-32">
        <div className="mx-auto max-w-[1200px] space-y-24">
          {NUMBERS.map((n, i) => (
            <Reveal key={n.k} delay={i * 0.05}>
              <article className="grid gap-10 md:grid-cols-[120px_1fr]">
                <div className="font-display text-6xl text-[color:var(--gold)]">{n.k}</div>
                <div>
                  <h3 className="display-md">{n.h}</h3>
                  <p className="mt-6 max-w-2xl text-foreground/70 leading-relaxed">{n.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-2">
        <img src={embroidery} alt="Zari" className="aspect-[4/5] w-full object-cover" loading="lazy" />
        <div className="flex items-center bg-[color:var(--cream)] px-6 md:px-16 py-24">
          <Reveal>
            <div className="max-w-md">
              <div className="eyebrow">The signature</div>
              <h3 className="mt-6 display-md">Every piece is signed inside.</h3>
              <p className="mt-8 text-foreground/70 leading-relaxed">
                On the inside seam of every 1KRAFTS piece, the maker's name is stitched by hand. When you own one of ours, you know exactly whose hours are folded into it.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}