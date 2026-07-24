import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/format";
import { useWishlist } from "@/context/WishlistContext";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const wl = useWishlist();
  const mainSrc = product.images[0]?.src;
  const hoverSrc = product.gallery[1]?.src ?? mainSrc;
  const active = wl.has(product.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <Link to="/products/$slug" params={{ slug: product.slug }} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:rounded-[1.25rem] bg-[color:var(--sand)] shadow-[0_20px_50px_-30px_color-mix(in_oklab,var(--walnut)_35%,transparent)]">
          {mainSrc && (
            <img
              src={mainSrc}
              alt={product.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1200ms] ease-out group-hover:opacity-0 group-hover:scale-[1.03]"
            />
          )}
          {hoverSrc && (
            <img
              src={hoverSrc}
              alt=""
              aria-hidden
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-[opacity,transform] duration-[1200ms] ease-out group-hover:opacity-100 group-hover:scale-[1.06]"
            />
          )}
          {/* corner marks */}
          <span className="pointer-events-none absolute top-3 left-3 h-3 w-3 border-t border-l border-[color:var(--brass)]/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[color:var(--brass)]/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="absolute left-3 top-3 number-tag text-white/90 mix-blend-difference">0{(index % 9) + 1}</span>
          {product.badges?.[0] && (
            <span className="absolute right-3 top-3 rounded-full border border-[color:var(--brass)]/60 bg-white/85 px-2.5 py-1 text-[9px] uppercase tracking-[0.28em] text-[color:var(--brass)] backdrop-blur-sm">
              {product.badges[0]}
            </span>
          )}
          <button
            aria-label={active ? "Remove from wishlist" : "Save to wishlist"}
            onClick={(e) => {
              e.preventDefault();
              wl.toggle(product.id);
            }}
            className={
              "absolute right-3 bottom-3 grid h-10 w-10 place-items-center rounded-full border backdrop-blur-sm transition-colors " +
              (active
                ? "border-[color:var(--sindoor)] bg-[color:var(--sindoor)] text-white"
                : "border-white/60 bg-white/70 text-[color:var(--walnut)] hover:border-[color:var(--brass)] hover:text-[color:var(--brass)]")
            }
          >
            <Heart size={14} fill={active ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="mt-4 md:mt-6 flex items-baseline justify-between gap-3 md:gap-4">
          <div className="min-w-0">
            <div className="eyebrow truncate">{product.categorySlug}</div>
            <h3 className="mt-2 font-display italic text-lg md:text-xl leading-tight text-[color:var(--walnut)]">{product.name}</h3>
          </div>
          <div className="shrink-0 text-xs md:text-sm text-[color:var(--brass)] font-mono">{formatPrice(product.price, product.currency)}</div>
        </div>
      </Link>
    </motion.article>
  );
}