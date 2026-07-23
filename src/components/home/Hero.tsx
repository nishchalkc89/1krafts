import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useRef } from "react";
import hero from "@/assets/hero-main.jpg";
import { useEnquiry } from "@/context/EnquiryContext";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const { openEnquiry } = useEnquiry();

  return (
    <section ref={ref} className="relative min-h-[100svh] w-full overflow-hidden bg-[color:var(--linen)] text-[color:var(--walnut)]">
      {/* Editorial grid: massive left type, tall right image */}
      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-[1680px] grid-cols-12 gap-x-4 gap-y-12 px-5 pt-28 pb-14 sm:px-6 md:px-10 md:pt-40 md:pb-24">
        {/* Left: type */}
        <motion.div style={reduce ? undefined : { y: textY }} className="col-span-12 md:col-span-7 flex flex-col justify-between">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            <div className="flex items-center gap-4">
              <span className="number-tag">No. 001 — Kathmandu</span>
              <span className="h-px w-16 bg-[color:var(--brass)]/60" />
            </div>
            <h1 className="mt-8 sm:mt-10 display-xl">
              <span className="block">Crafted</span>
              <span className="block italic brass-text -mt-2">with tradition,</span>
              <span className="block">designed</span>
              <span className="block italic brass-text -mt-2">for today.</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
            className="mt-10 sm:mt-16 flex flex-wrap items-center gap-4 sm:gap-6"
          >
            <Link
              to="/collections"
              className="group relative inline-flex items-center gap-4 rounded-full border border-[color:var(--brass)] bg-[color:var(--brass)] px-7 py-3.5 sm:px-8 sm:py-4 text-[0.68rem] sm:text-[0.7rem] uppercase tracking-[0.28em] sm:tracking-[0.32em] text-[color:var(--walnut)] shadow-[0_16px_32px_-16px_color-mix(in_oklab,var(--brass)_70%,transparent)] transition-all hover:-translate-y-0.5 hover:bg-transparent hover:text-[color:var(--brass)] hover:shadow-[0_20px_40px_-18px_color-mix(in_oklab,var(--brass)_60%,transparent)]"
            >
              Shop the House
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/heritage"
              className="group inline-flex items-center gap-3 border-b border-[color:var(--walnut)]/30 pb-2 text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-[color:var(--walnut)] hover:text-[color:var(--brass)] hover:border-[color:var(--walnut)]"
            >
              Explore Heritage
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <button
              onClick={() => openEnquiry()}
              className="text-[0.7rem] uppercase tracking-[0.32em] text-[color:var(--brass)] hover:text-[color:var(--brass-soft)]"
            >
              — Send an enquiry
            </button>
          </motion.div>
        </motion.div>

        {/* Right: tall image */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 1.05 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="col-span-12 md:col-span-5 relative min-h-[360px] sm:min-h-[440px] md:min-h-0"
        >
          <motion.div style={reduce ? undefined : { y, scale }} className="absolute inset-0 overflow-hidden rounded-[2rem] md:rounded-[2.5rem] shadow-[0_40px_80px_-40px_color-mix(in_oklab,var(--walnut)_50%,transparent)]">
            <img
              src={hero}
              alt="A woman draped in a hand-woven vermilion saree in a Kathmandu heritage courtyard"
              className="h-full w-full object-cover"
              fetchPriority="high"
            />
            <div aria-hidden className="absolute inset-0 vignette" />
          </motion.div>
          {/* Corner markers */}
          <span className="pointer-events-none absolute -top-3 -left-3 h-6 w-6 border-t border-l border-[color:var(--brass)]" />
          <span className="pointer-events-none absolute -bottom-3 -right-3 h-6 w-6 border-b border-r border-[color:var(--brass)]" />
          {/* Floating caption */}
          <div className="absolute -bottom-8 left-4 right-4 flex items-end justify-between text-[color:var(--walnut)]">
            <div>
              <div className="number-tag">01 / 04</div>
              <div className="mt-2 font-display italic text-lg">Rakta — Banaras silk saree</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom marquee band */}
      <div className="relative z-10 border-y border-[color:var(--walnut)]/10 overflow-hidden bg-[color:var(--parchment)]">
        <div className="marquee flex whitespace-nowrap py-6 text-[color:var(--walnut)]">
          {Array.from({ length: 2 }).map((_, group) => (
            <div key={group} className="flex items-center gap-10 sm:gap-16 pr-10 sm:pr-16 font-display text-2xl sm:text-3xl italic">
              {["Pashmina from Mustang", "Dhaka from Palpa", "Filigree from Patan", "Silk from Kathmandu", "Wool from the peaks"].map((w) => (
                <span key={w} className="flex items-center gap-10 sm:gap-16">
                  <span>{w}</span>
                  <span className="h-1 w-1 rounded-full bg-[color:var(--brass)]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="pointer-events-none hidden md:flex absolute bottom-24 right-6 md:right-10 z-10 flex-col items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.36em] text-[color:var(--walnut)]"
      >
        <span className="rotate-90 origin-center pl-4">Scroll</span>
        <div className="h-16 w-px bg-gradient-to-b from-[color:var(--brass)]/70 to-transparent" />
      </motion.div>
    </section>
  );
}