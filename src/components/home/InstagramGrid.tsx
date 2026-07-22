import { Reveal } from "@/components/motion/Reveal";
import a from "@/assets/cat-saree.jpg";
import b from "@/assets/cat-kurti.jpg";
import c from "@/assets/cat-men.jpg";
import d from "@/assets/cat-jewellery.jpg";
import e from "@/assets/cat-pashmina.jpg";
import f from "@/assets/cat-festival.jpg";

const imgs = [a, b, c, d, e, f];

export function InstagramGrid() {
  return (
    <section className="bg-[color:var(--linen)] text-[color:var(--walnut)] px-5 sm:px-6 md:px-10 py-14 md:py-24">
      <div className="mx-auto max-w-[1680px]">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-8">
            <div>
              <div className="flex items-center gap-4">
                <span className="number-tag">008 — @1krafts</span>
                <span className="h-px w-16 bg-[color:var(--brass)]/60" />
              </div>
              <h2 className="mt-6 display-lg"><span className="italic brass-text">In</span> the wild.</h2>
            </div>
            <p className="max-w-xs font-medium text-[color:var(--walnut-soft)]">Pieces lived in — photographed by the people who love them.</p>
          </div>
        </Reveal>
        <div className="mt-8 md:mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {imgs.map((src, i) => (
            <a href="#" key={i} className="group relative aspect-square overflow-hidden rounded-2xl bg-[color:var(--sand)]">
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-all duration-[1600ms] group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/0" />
              <span className="absolute left-3 bottom-3 number-tag text-[color:var(--brass-soft)] opacity-0 group-hover:opacity-100 transition-opacity">0{i + 1}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}