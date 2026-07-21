import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import mountain from "@/assets/heritage-mountain.jpg";

export function Heritage() {
  return (
    <section className="relative overflow-hidden bg-[color:var(--parchment)] text-[color:var(--walnut)] px-5 sm:px-6 md:px-10 py-14 md:py-24">
      <div className="mx-auto max-w-[1680px] grid md:grid-cols-12 gap-8 md:gap-14 items-center">
        <div className="relative md:col-span-7 h-[340px] sm:h-[480px] md:h-[640px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-[0_40px_80px_-40px_color-mix(in_oklab,var(--walnut)_50%,transparent)]">
          <Parallax offset={80} className="absolute inset-0">
            <img src={mountain} alt="The Himalayan range at dawn" loading="lazy" className="h-full w-full object-cover object-center" />
          </Parallax>
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          <span className="pointer-events-none absolute top-6 left-6 h-8 w-8 border-t border-l border-[color:var(--brass-soft)]" />
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <span className="number-tag text-[color:var(--brass-soft)]">Latitude 27.7° · Kathmandu Valley</span>
          </div>
        </div>
        <div className="flex items-center md:col-span-5">
          <Reveal>
            <div className="max-w-lg">
              <div className="flex items-center gap-4">
                <span className="number-tag">004 — Heritage</span>
                <span className="h-px w-16 bg-[color:var(--brass)]/60" />
              </div>
              <h2 className="mt-6 md:mt-8 display-lg">
                A small house
                <span className="block italic brass-text">at the foot</span>
                of a very old mountain.
              </h2>
              <p className="mt-6 md:mt-10 text-[color:var(--walnut-soft)] leading-relaxed text-base md:text-lg">
                1KRAFTS was founded to keep the vanishing crafts of the valley alive —
                the pit-loom of Palpa, the filigree bench of Patan, the wool-spinning of Mustang.
                Every piece is signed by the hands that made it.
              </p>
              <Link
                to="/heritage"
                className="mt-8 md:mt-12 inline-flex items-center gap-3 border-b border-[color:var(--brass)] pb-2 text-[0.7rem] uppercase tracking-[0.32em] text-[color:var(--brass)] hover:tracking-[0.36em] transition-all"
              >
                Read the story
                <span aria-hidden>→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}