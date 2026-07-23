import { AnimatePresence, motion } from "framer-motion";
import { Heart, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWishlist } from "@/context/WishlistContext";
import { services } from "@/services";
import { formatPrice } from "@/lib/format";
import { useEscapeKey } from "@/hooks/use-escape-key";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";

export function WishlistDrawer() {
  const { open, setOpen, ids, toggle } = useWishlist();
  // Wishlist stores product ids only — look the full records up from the live
  // catalog (not the old static mock data, whose ids never match real ones).
  const { data } = useQuery({
    queryKey: ["wishlist-products"],
    queryFn: () => services.products.list({ pageSize: 500 }),
    enabled: ids.length > 0,
  });
  const items = (data?.items ?? []).filter((p) => ids.includes(p.id));

  useEscapeKey(open, useCallback(() => setOpen(false), [setOpen]));
  useBodyScrollLock(open);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            aria-label="Close wishlist"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[80] bg-[color:var(--ink)]/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 z-[81] flex h-full w-full max-w-[440px] flex-col bg-[color:var(--ivory)] shadow-2xl"
          >
            <div className="flex items-center justify-between px-8 pt-8">
              <div className="eyebrow">Your wishlist</div>
              <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-foreground/15">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {items.length === 0 ? (
                <div className="mt-24 text-center text-foreground">
                  <Heart className="mx-auto mb-4" />
                  <div className="font-display text-2xl text-foreground">No pieces yet</div>
                  <p className="mt-2 text-sm font-medium">Save pieces you'd like to hear more about.</p>
                </div>
              ) : (
                <ul className="divide-y divide-foreground/10">
                  {items.map((p) => (
                    <li key={p.id} className="flex gap-4 py-5">
                      <img src={p.images[0].src} alt={p.name} className="h-24 w-20 object-cover" />
                      <div className="flex flex-1 flex-col">
                        <Link to="/products/$slug" params={{ slug: p.slug }} onClick={() => setOpen(false)} className="font-display text-lg">
                          {p.name}
                        </Link>
                        <div className="mt-1 text-xs font-semibold text-foreground">{formatPrice(p.price, p.currency)}</div>
                        <button onClick={() => toggle(p.id)} className="mt-auto self-start text-[10px] font-semibold uppercase tracking-[0.24em] text-[color:var(--sindoor)] hover:text-foreground">
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}