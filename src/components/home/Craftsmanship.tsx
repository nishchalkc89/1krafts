import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/motion/Reveal";
import loom from "@/assets/craft-loom.jpg";
import embroidery from "@/assets/craft-embroidery.jpg";

export function Craftsmanship() {
  return (
    <section className="relative bg-[color:var(--linen)] text-[color:var(--walnut)] px-5 sm:px-6 md:px-10 py-14 md:py-24 overflow-hidden">
      {/* Faint background numeral */}
      <div aria-hidden className="pointer-events-none absolute -right-10 top-10 font-display italic text-[14rem] md:text-[22rem] leading-none text-[color:var(--brass)]/[0.08] select-none">005</div>
      <div className="relative mx-auto grid max-w-[1680px] gap-10 md:gap-16 md:grid-cols-[1fr_1.15fr] items-center">
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          <Reveal className="aspect-[3/4] overflow-hidden rounded-[1.25rem] md:rounded-[1.5rem] shadow-[0_25px_60px_-30px_color-mix(in_oklab,var(--walnut)_40%,transparent)]">
            <img src={loom} alt="A hand at the wooden loom" loading="lazy" className="h-full w-full object-cover" />
          </Reveal>
          <Reveal delay={0.15} className="mt-12 md:mt-24 aspect-[3/4] overflow-hidden rounded-[1.25rem] md:rounded-[1.5rem] shadow-[0_25px_60px_-30px_color-mix(in_oklab,var(--walnut)_40%,transparent)]">
            <img src={embroidery} alt="Zari embroidery, close" loading="lazy" className="h-full w-full object-cover" />
          </Reveal>
        </div>
        <div className="flex items-center">
          <Reveal>
            <div className="max-w-xl">
              <div className="flex items-center gap-4">
                <span className="number-tag">005 — Atelier</span>
                <span className="h-px w-16 bg-[color:var(--brass)]/60" />
              </div>
              <h2 className="mt-6 md:mt-8 display-lg">
                Slow-made.
                <span className="block italic brass-text">Never fast.</span>
              </h2>
              <p className="mt-6 md:mt-10 font-medium text-[color:var(--walnut-soft)] leading-relaxed text-base md:text-lg">
                A Rakta saree takes forty-two days on the loom. A Sagun lehenga takes six months
                between the atelier and the wearer. Twenty-nine master artisans, each named on
                the piece they made.
              </p>
              <ul className="mt-8 md:mt-12 grid grid-cols-3 gap-4 md:gap-6">
                <Stat n="29" label="Master artisans" />
                <Stat n="14" label="Craft studios" />
                <Stat n="200+" label="Years of memory" />
              </ul>
              <Link
                to="/craftsmanship"
                className="mt-10 md:mt-14 inline-flex items-center gap-3 border-b border-[color:var(--brass)] pb-2 text-[0.7rem] uppercase tracking-[0.32em] text-[color:var(--brass)] hover:tracking-[0.36em] transition-all"
              >
                Meet the atelier
                <span aria-hidden>→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <li className="border-t border-[color:var(--walnut)]/20 pt-4">
      <div className="font-display italic brass-text text-4xl md:text-6xl">{n}</div>
      <div className="mt-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-[color:var(--walnut-soft)]">{label}</div>
    </li>
  );
}