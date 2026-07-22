import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { Divider } from "@/components/brand/Divider";
import { CATEGORIES } from "@/data/categories";

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: [
      { title: "Collections — 1KRAFTS" },
      { name: "description", content: "All fourteen collections from the 1KRAFTS atelier — sarees, pashmina, dhaka, jewellery, and more." },
      { property: "og:title", content: "Collections — 1KRAFTS" },
      { property: "og:description", content: "Fourteen studios. One heritage house." },
      { property: "og:url", content: "/collections" },
    ],
    links: [{ rel: "canonical", href: "/collections" }],
  }),
  component: CollectionsIndex,
});

function CollectionsIndex() {
  return (
    <>
      <section className="pt-40 pb-16 px-6 md:px-10">
        <div className="mx-auto max-w-[1680px]">
          <Reveal>
            <div className="eyebrow">Fourteen studios</div>
            <h1 className="mt-6 display-xl max-w-[16ch]">
              <span className="italic font-light">The</span> Collections.
            </h1>
          </Reveal>
        </div>
      </section>
      <Divider className="mx-6 md:mx-10" />
      <section className="px-6 md:px-10 py-20">
        <div className="mx-auto grid max-w-[1680px] gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: (i % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to="/collections/$slug" params={{ slug: c.slug }} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1600ms] group-hover:scale-[1.05]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--ink)]/50 via-transparent to-transparent" />
                  <div className="absolute inset-x-6 bottom-6 flex items-end justify-between text-[color:var(--ivory)]">
                    <div>
                      <div className="eyebrow text-[color:var(--ivory)]">{c.tagline}</div>
                      <div className="mt-2 font-display text-3xl">{c.name}</div>
                    </div>
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
                <p className="mt-4 text-sm font-medium text-foreground max-w-md">{c.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}