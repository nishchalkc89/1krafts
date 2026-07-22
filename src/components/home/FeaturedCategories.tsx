import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { CATEGORIES } from "@/data/categories";

export function FeaturedCategories() {
  const items = CATEGORIES.filter((c) => c.featured).slice(0, 6);
  return (
    <section className="relative bg-[color:var(--parchment)] px-5 sm:px-6 md:px-10 py-14 md:py-24 text-[color:var(--walnut)]">
      <div className="mx-auto max-w-[1680px]">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-8">
            <div>
              <div className="flex items-center gap-4">
                <span className="number-tag">002 — The Studios</span>
                <span className="h-px w-16 bg-[color:var(--brass)]/60" />
              </div>
              <h2 className="mt-6 display-lg max-w-[14ch]">
                Six studios. <span className="italic brass-text">One house.</span>
              </h2>
            </div>
            <p className="max-w-sm font-medium text-[color:var(--walnut-soft)] leading-relaxed">
              From the loom of Palpa to the filigree bench of Patan — each studio guards one craft, kept alive by one master and their hands.
            </p>
          </div>
        </Reveal>

        {/* Asymmetric editorial grid — 3 columns, offset rows */}
        <div className="mt-10 md:mt-16 grid grid-cols-12 gap-x-5 sm:gap-x-6 gap-y-8 md:gap-y-20">
          {items.map((c, i) => {
            const spans = ["md:col-span-5", "md:col-span-4 md:mt-20", "md:col-span-3", "md:col-span-4", "md:col-span-3 md:-mt-12", "md:col-span-5"];
            const aspect = "aspect-[4/5]";
            return (
              <motion.div
                key={c.slug}
                initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 1.1, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={"col-span-12 sm:col-span-6 " + spans[i]}
              >
                <Link to="/collections/$slug" params={{ slug: c.slug }} className="group block">
                  <div className={"relative " + aspect + " overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-[color:var(--sand)] shadow-[0_25px_60px_-30px_color-mix(in_oklab,var(--walnut)_40%,transparent)]"}>
                    <img
                      src={c.image}
                      alt={c.name}
                      loading="lazy"
                      className="h-full w-full object-cover object-[center_20%] transition-all duration-[1800ms] ease-out group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a120b]/75 via-[#1a120b]/15 to-transparent" />
                    <span className="absolute left-4 top-4 number-tag text-[color:var(--brass-soft)]">0{i + 1}</span>
                    <div className="absolute inset-x-5 bottom-5 flex items-end justify-between">
                      <div>
                        <div className="eyebrow text-[color:var(--brass-soft)]">{c.tagline}</div>
                        <div className="mt-2 font-display italic text-2xl sm:text-3xl md:text-4xl text-white">{c.name}</div>
                      </div>
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/50 text-white transition-all duration-500 group-hover:border-[color:var(--brass)] group-hover:bg-[color:var(--brass)] group-hover:text-white group-hover:rotate-45" aria-hidden>→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 md:mt-20 flex justify-center">
          <Link
            to="/collections"
            className="group inline-flex items-center gap-4 rounded-full border border-[color:var(--walnut)]/25 px-7 py-3.5 sm:px-8 sm:py-4 text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-[color:var(--walnut)] transition-colors hover:border-[color:var(--brass)] hover:text-[color:var(--brass)]"
          >
            All fourteen studios
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}