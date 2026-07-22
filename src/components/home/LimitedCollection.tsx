import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import wedding from "@/assets/cat-wedding.jpg";

export function LimitedCollection() {
  return (
    <section className="relative w-full px-5 sm:px-6 md:px-10 py-14 md:py-24 bg-[color:var(--linen)] text-white">
      <div className="mx-auto max-w-[1680px] relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_50px_100px_-40px_color-mix(in_oklab,var(--walnut)_50%,transparent)]">
        <div className="relative min-h-[560px] md:min-h-[720px]">
          <Parallax offset={80} className="absolute inset-0">
            <img src={wedding} alt="Sagun — the bridal collection" loading="lazy" className="h-full w-full object-cover object-[center_25%]" />
          </Parallax>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
          <div className="relative z-10 flex h-full min-h-[560px] md:min-h-[720px] flex-col justify-center px-6 sm:px-10 md:px-16 py-16">
            <Reveal>
              <div className="max-w-xl">
                <div className="flex items-center gap-4">
                  <span className="number-tag text-[color:var(--brass-soft)]">006 — Edition of twelve</span>
                  <span className="h-px w-16 bg-[color:var(--brass)]/60" />
                </div>
                <h2 className="mt-6 md:mt-8 display-lg text-white">
                  <span className="italic brass-text">Sagun</span>
                  <span className="block">— the bridal chapter.</span>
                </h2>
                <p className="mt-6 md:mt-8 font-medium text-white leading-relaxed text-base md:text-lg max-w-lg">
                  Twelve numbered ensembles. Each built with the wearer's name stitched inside
                  the pallu. Available only by appointment at the Boudha atelier.
                </p>
                <Link
                  to="/collections/$slug"
                  params={{ slug: "sarees" }}
                  className="mt-8 md:mt-12 inline-flex items-center gap-4 rounded-full border border-[color:var(--brass)] bg-[color:var(--brass)] px-7 py-3.5 sm:px-8 sm:py-4 text-[0.7rem] uppercase tracking-[0.32em] text-white transition-colors hover:bg-transparent hover:text-[color:var(--brass-soft)]"
                >
                  Enter Sagun
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}