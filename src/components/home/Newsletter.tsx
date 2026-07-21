import { Reveal } from "@/components/motion/Reveal";
import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section className="relative bg-[color:var(--parchment)] text-[color:var(--walnut)] px-5 sm:px-6 md:px-10 py-16 md:py-28 overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60" style={{ background: "radial-gradient(60% 50% at 50% 50%, color-mix(in oklab, var(--brass) 22%, transparent), transparent 70%)" }} />
      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-[color:var(--brass)]/60" />
            <span className="number-tag">009 — The Letter</span>
            <span className="h-px w-16 bg-[color:var(--brass)]/60" />
          </div>
          <h2 className="mt-6 md:mt-8 display-lg">
            Quiet <span className="italic brass-text">updates</span>
            <span className="block">from the atelier.</span>
          </h2>
          <p className="mt-6 md:mt-8 text-[color:var(--walnut-soft)]">Four letters a year. New collections, small stories, private previews. No noise.</p>
          {done ? (
            <div className="mt-10 md:mt-14 inline-block rounded-2xl border border-[color:var(--brass)]/40 bg-white/60 backdrop-blur px-8 py-6 text-sm text-[color:var(--brass)]">
              Thank you. Look for the next letter shortly.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setDone(true);
              }}
              className="mt-10 md:mt-14 flex items-center gap-4 border-b border-[color:var(--walnut)]/30 focus-within:border-[color:var(--brass)] transition-colors"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                placeholder="your email address"
                className="flex-1 min-w-0 bg-transparent py-4 text-base md:text-lg outline-none placeholder:text-[color:var(--walnut-soft)]/60 text-[color:var(--walnut)]"
              />
              <button className="text-[0.7rem] uppercase tracking-[0.32em] text-[color:var(--brass)] hover:tracking-[0.36em] transition-all">
                Subscribe →
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}