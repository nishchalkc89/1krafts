import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/motion/Reveal";
import { Divider } from "@/components/brand/Divider";
import { Parallax } from "@/components/motion/Parallax";
import mountain from "@/assets/heritage-mountain.jpg";
import loom from "@/assets/craft-loom.jpg";
import festival from "@/assets/cat-festival.jpg";

export const Route = createFileRoute("/heritage")({
  head: () => ({
    meta: [
      { title: "Heritage — 1KRAFTS" },
      { name: "description", content: "The Nepali heritage that shapes every piece we make." },
      { property: "og:title", content: "Heritage — 1KRAFTS" },
      { property: "og:description", content: "The Nepali heritage that shapes every piece we make." },
      { property: "og:url", content: "/heritage" },
    ],
    links: [{ rel: "canonical", href: "/heritage" }],
  }),
  component: Heritage,
});

function Heritage() {
  return (
    <>
      <section className="relative h-[85svh] min-h-[600px] overflow-hidden bg-[color:var(--ink)] text-[color:var(--ivory)]">
        <Parallax offset={60} className="absolute inset-0">
          <img src={mountain} alt="The Himalayas at dawn" className="h-full w-full object-cover opacity-80" />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--ink)]/40 via-transparent to-[color:var(--ink)]/60" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1680px] flex-col justify-end px-6 md:px-10 pb-24">
          <Reveal>
            <div className="eyebrow text-[color:var(--ivory)]/70">Chapter one</div>
            <h1 className="mt-6 display-xl max-w-4xl">A country of makers.</h1>
          </Reveal>
        </div>
      </section>

      <section className="px-6 md:px-10 py-32">
        <div className="mx-auto grid max-w-[1200px] gap-16 md:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <div className="eyebrow">Est. 2018 · Boudha</div>
            <p className="mt-8 text-foreground/60">Kathmandu · Nepal</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-6 text-lg leading-relaxed text-foreground/85 font-display">
              <p>1KRAFTS began with a saree. Then a loom. Then a name.</p>
              <p>
                We are a small house, working with twenty-nine master artisans across
                the Kathmandu valley — the weavers of Palpa, the goldsmiths of Patan,
                the wool-spinners of Mustang, the wood-carvers of Bhaktapur.
              </p>
              <p>
                We do not run seasons. We release a piece when it is finished. Every
                item carries the name of the person who made it, stitched or engraved
                into its inside seam.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative">
        <div className="grid md:grid-cols-2">
          <Reveal className="aspect-[4/5] overflow-hidden">
            <img src={loom} alt="A loom in Kathmandu" loading="lazy" className="h-full w-full object-cover" />
          </Reveal>
          <Reveal delay={0.15} className="aspect-[4/5] overflow-hidden">
            <img src={festival} alt="A Nepali festival evening" loading="lazy" className="h-full w-full object-cover" />
          </Reveal>
        </div>
      </section>

      <section className="px-6 md:px-10 py-32">
        <Divider className="mx-auto max-w-3xl" label="A promise" />
        <Reveal className="mx-auto mt-16 max-w-3xl text-center">
          <h2 className="display-lg">
            <span className="italic font-light">Nothing here</span> is machine-made.
          </h2>
          <p className="mt-8 text-foreground/60 leading-relaxed">
            Not a stitch, not a bead, not a border. If a piece cannot be made by
            hand, we do not make it.
          </p>
        </Reveal>
      </section>
    </>
  );
}