import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types";

export function NewArrivals({ title = "New Arrivals", eyebrow = "The Latest", products }: { title?: string; eyebrow?: string; products: Product[] }) {
  return (
    <section className="relative bg-[color:var(--linen)] text-[color:var(--walnut)] px-5 sm:px-6 md:px-10 py-14 md:py-24">
      <div className="mx-auto max-w-[1680px]">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-8">
            <div>
              <div className="flex items-center gap-4">
                <span className="number-tag">003 — {eyebrow}</span>
                <span className="h-px w-16 bg-[color:var(--brass)]/60" />
              </div>
              <h2 className="mt-6 display-lg max-w-[14ch]">
                <span className="italic brass-text">{title.split(" ")[0]}</span>{" "}
                <span>{title.split(" ").slice(1).join(" ")}</span>
              </h2>
            </div>
            <div className="max-w-xs text-sm text-[color:var(--walnut-soft)]">
              Numbered pieces, released each month. Each one hand-finished by a named artisan.
            </div>
          </div>
        </Reveal>
        <div className="mt-10 md:mt-14 grid gap-x-5 sm:gap-x-6 gap-y-10 md:gap-y-14 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}