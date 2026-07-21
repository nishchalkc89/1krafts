import { Reveal } from "@/components/motion/Reveal";
import { TESTIMONIALS } from "@/data/testimonials";

export function Testimonials() {
  return (
    <section className="bg-[color:var(--parchment)] text-[color:var(--walnut)] px-5 sm:px-6 md:px-10 py-14 md:py-24">
      <div className="mx-auto max-w-[1680px]">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-4">
              <span className="h-px w-16 bg-[color:var(--brass)]/60" />
              <span className="number-tag">007 — Kept by them</span>
              <span className="h-px w-16 bg-[color:var(--brass)]/60" />
            </div>
            <h2 className="mt-8 display-lg max-w-3xl mx-auto">
              <span className="italic brass-text">Worn once.</span> Kept forever.
            </h2>
          </div>
        </Reveal>
        <div className="mt-10 md:mt-16 grid gap-x-8 md:gap-x-10 gap-y-10 md:gap-y-14 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.1}>
              <figure className="flex h-full flex-col justify-between border-t border-[color:var(--walnut)]/20 pt-8 md:pt-10">
                <blockquote className="font-display italic text-xl md:text-[1.65rem] leading-snug text-[color:var(--walnut)]">
                  <span className="mr-2 font-display text-4xl text-[color:var(--brass)] leading-none">"</span>
                  {t.quote}
                </blockquote>
                <figcaption className="mt-8 md:mt-12 text-[0.7rem] uppercase tracking-[0.32em] text-[color:var(--walnut-soft)]">
                  <span className="text-[color:var(--brass)]">{t.name}</span> · {t.location}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}