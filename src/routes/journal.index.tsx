import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/motion/Reveal";
import { Divider } from "@/components/brand/Divider";
import { JOURNAL } from "@/data/journal";

export const Route = createFileRoute("/journal/")({
  head: () => ({
    meta: [
      { title: "Journal — 1KRAFTS" },
      { name: "description", content: "Slow essays from the atelier — craft, heritage, and the long hours behind our pieces." },
      { property: "og:title", content: "Journal — 1KRAFTS" },
      { property: "og:description", content: "Slow essays from the atelier." },
      { property: "og:url", content: "/journal" },
    ],
    links: [{ rel: "canonical", href: "/journal" }],
  }),
  component: JournalIndex,
});

function JournalIndex() {
  return (
    <>
      <section className="pt-40 pb-16 px-6 md:px-10">
        <div className="mx-auto max-w-[1680px]">
          <Reveal>
            <div className="eyebrow">Slow reading</div>
            <h1 className="mt-6 display-xl italic font-light">The Journal.</h1>
          </Reveal>
        </div>
      </section>
      <Divider className="mx-6 md:mx-10" />
      <section className="px-6 md:px-10 py-16">
        <div className="mx-auto grid max-w-[1400px] gap-x-6 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {JOURNAL.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.05}>
              <Link to="/journal/$slug" params={{ slug: p.slug }} className="group block">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={p.cover} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1600ms] group-hover:scale-[1.05]" />
                </div>
                <div className="mt-5 eyebrow text-foreground/60">{p.category} · {new Date(p.publishedAt).toLocaleDateString("en", { month: "long", year: "numeric" })}</div>
                <h2 className="mt-3 font-display text-3xl leading-tight">{p.title}</h2>
                <p className="mt-3 text-foreground/60">{p.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}