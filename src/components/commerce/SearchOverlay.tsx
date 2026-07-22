import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchOverlay } from "@/context/SearchContext";
import { services } from "@/services";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/format";
import { useEscapeKey } from "@/hooks/use-escape-key";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";

export function SearchOverlay() {
  const { open, setOpen } = useSearchOverlay();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  useEscapeKey(open, useCallback(() => setOpen(false), [setOpen]));
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  useEffect(() => {
    const h = setTimeout(async () => {
      if (!q.trim()) return setResults([]);
      setResults(await services.products.search(q));
    }, 120);
    return () => clearTimeout(h);
  }, [q]);

  const suggestions = useMemo(
    () => ["saree", "kurti", "kurta", "shirt", "tshirt", "jewellery"],
    [],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-[color:var(--ivory)]/95 backdrop-blur-md"
        >
          <div className="mx-auto flex h-full max-w-[1200px] flex-col px-6 md:px-10">
            <div className="flex items-center justify-between py-6">
              <div className="eyebrow">Search the atelier</div>
              <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-foreground/15">
                <X size={16} />
              </button>
            </div>
            <div className="flex items-center gap-4 border-b border-foreground/20 pb-6">
              <Search size={22} className="text-foreground/40" />
              <input
                autoFocus
                placeholder="Search pieces, fabrics, occasions…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full bg-transparent font-display text-3xl md:text-5xl outline-none placeholder:text-foreground/50"
              />
            </div>
            <div className="mt-8 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-foreground">
              {suggestions.map((s) => (
                <button key={s} onClick={() => setQ(s)} className="rounded-full border border-foreground/15 px-4 py-2 hover:border-foreground">
                  {s}
                </button>
              ))}
            </div>
            <div className="mt-10 flex-1 overflow-y-auto">
              {results.length === 0 && q.trim() ? (
                <div className="font-medium text-foreground">No pieces match "{q}".</div>
              ) : (
                <ul className="grid gap-x-6 gap-y-4 md:grid-cols-2">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link
                        to="/products/$slug"
                        params={{ slug: p.slug }}
                        onClick={() => setOpen(false)}
                        className="group flex gap-4 border-b border-foreground/10 py-4 hover:border-foreground/40"
                      >
                        <img src={p.images[0].src} alt={p.name} className="h-24 w-20 object-cover" />
                        <div className="flex flex-1 flex-col">
                          <span className="font-display text-xl">{p.name}</span>
                          <span className="text-xs font-semibold text-foreground uppercase tracking-[0.24em]">{p.categorySlug}</span>
                          <span className="mt-auto text-sm">{formatPrice(p.price, p.currency)}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}