import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Instagram, Mail, Menu, Phone, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { services } from "@/services";
import { useSearchOverlay } from "@/context/SearchContext";
import { useWishlist } from "@/context/WishlistContext";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useEscapeKey } from "@/hooks/use-escape-key";

const NAV = [
  { label: "Collections", to: "/collections" },
  { label: "Heritage", to: "/heritage" },
  { label: "Craft", to: "/craftsmanship" },
  { label: "Journal", to: "/journal" },
  { label: "Contact", to: "/contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [headerH, setHeaderH] = useState(64);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const search = useSearchOverlay();
  const wishlist = useWishlist();
  const qc = useQueryClient();
  const { data: CATEGORIES = [] } = useQuery({ queryKey: ["categories"], queryFn: () => services.categories.list() });

  // Header never unmounts between route changes, so its own query never gets a
  // natural remount-triggered refetch — without this, admin edits to categories
  // wouldn't show in the nav/mega-menu until a hard reload.
  useEffect(() => {
    qc.invalidateQueries({ queryKey: ["categories"] });
  }, [pathname, qc]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  // Lock background scroll while the mobile drawer is open — otherwise the page
  // underneath can scroll during the gesture and the drawer's positioning (tied to
  // the header's live height) fights with it, letting page content show through.
  useBodyScrollLock(menuOpen);
  useEscapeKey(menuOpen, () => setMenuOpen(false));
  useEscapeKey(megaOpen, () => setMegaOpen(false));

  // The header's height changes with scroll state, route, and logo size — measure
  // it directly instead of hardcoding an offset for the mobile drawer below it.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () => setHeaderH(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [scrolled, isHome]);

  return (
    <header
      ref={headerRef}
      className={
        "fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,color,padding,box-shadow] duration-500 " +
        (scrolled || !isHome
          ? "py-3 backdrop-blur-xl bg-[color:var(--linen)]/92 shadow-soft"
          : "py-5 md:py-6 bg-gradient-to-b from-[color:var(--linen)]/80 to-transparent")
      }
    >
      <div className="flex items-center justify-between px-5 sm:px-6 md:px-10">
        <div className="flex items-center">
          <Logo />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-6">
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--sindoor)]">
            <button
              onMouseEnter={() => setMegaOpen(true)}
              className="uppercase gold-underline hover:text-[color:var(--brass)]"
            >
              Collections
            </button>
            {NAV.slice(1).map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="gold-underline hover:text-[color:var(--brass)]"
                activeProps={{ className: "text-[color:var(--brass)]" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              aria-label="Search"
              className="grid h-10 w-10 place-items-center rounded-full border border-[color:var(--walnut)]/18 text-[color:var(--walnut)] transition-all hover:border-[color:var(--brass)] hover:bg-[color:var(--brass)]/10 hover:text-[color:var(--ember)]"
              onClick={() => search.setOpen(true)}
            >
              <Search size={16} />
            </button>
            <button
              aria-label="Wishlist"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-[color:var(--walnut)]/18 text-[color:var(--walnut)] transition-all hover:border-[color:var(--brass)] hover:bg-[color:var(--brass)]/10 hover:text-[color:var(--ember)]"
              onClick={() => wishlist.setOpen(true)}
            >
              <Heart size={16} fill={wishlist.count > 0 ? "currentColor" : "none"} />
              {wishlist.count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-[color:var(--sindoor)] text-[9px] font-semibold text-white">
                  {wishlist.count}
                </span>
              )}
            </button>
            <button
              aria-label="Menu"
              className="grid h-10 w-10 place-items-center rounded-full border border-[color:var(--walnut)]/18 text-[color:var(--walnut)] transition-all hover:border-[color:var(--brass)] hover:bg-[color:var(--brass)]/10 hover:text-[color:var(--ember)] md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mega menu */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onMouseLeave={() => setMegaOpen(false)}
            className="absolute inset-x-0 top-full hidden md:block bg-[color:var(--linen)]/97 backdrop-blur-xl border-y border-[color:var(--walnut)]/10 text-[color:var(--walnut)] shadow-lift"
          >
            <div className="mx-auto grid max-w-[1680px] grid-cols-4 gap-6 px-10 py-8">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  to="/collections/$slug"
                  params={{ slug: c.slug }}
                  className="group flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-[color:var(--walnut)]/4"
                >
                  <span className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-[color:var(--sand)]">
                    <img
                      src={c.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display italic text-lg leading-tight text-[color:var(--walnut)] transition-colors group-hover:text-[color:var(--sindoor)]">
                      {c.name}
                    </span>
                    <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--brass)]">
                      {c.tagline}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ top: headerH }}
            className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-[color:var(--linen)] text-[color:var(--walnut)] px-6 pt-6 pb-10 overflow-y-auto shadow-2xl"
          >
            <nav className="flex flex-col divide-y divide-[color:var(--walnut)]/15">
              {NAV.slice(1).map((n) => (
                <Link key={n.to} to={n.to} className="py-4 font-display font-semibold italic text-2xl text-[color:var(--walnut)] hover:text-[color:var(--brass)] transition-colors">
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 border-t border-[color:var(--walnut)]/15 pt-5">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--sindoor)] mb-4">Collections</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    to="/collections/$slug"
                    params={{ slug: c.slug }}
                    className="font-display font-semibold italic text-base text-[color:var(--walnut)] hover:text-[color:var(--brass)] transition-colors"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-8 border-t border-[color:var(--walnut)]/15 pt-6">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--sindoor)] mb-4">Reach us</div>
              <div className="flex items-center gap-3">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="grid h-11 w-11 place-items-center rounded-full border border-[color:var(--walnut)]/18 text-[color:var(--walnut)] transition-all hover:border-[color:var(--brass)] hover:bg-[color:var(--brass)]/10 hover:text-[color:var(--ember)]">
                  <Instagram size={16} />
                </a>
                <a href="https://wa.me/9779800000000" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid h-11 w-11 place-items-center rounded-full border border-[color:var(--walnut)]/18 text-[color:var(--walnut)] transition-all hover:border-[color:var(--brass)] hover:bg-[color:var(--brass)]/10 hover:text-[color:var(--ember)]">
                  <MessageIcon />
                </a>
                <a href="tel:+9779800000000" aria-label="Call" className="grid h-11 w-11 place-items-center rounded-full border border-[color:var(--walnut)]/18 text-[color:var(--walnut)] transition-all hover:border-[color:var(--brass)] hover:bg-[color:var(--brass)]/10 hover:text-[color:var(--ember)]">
                  <Phone size={16} />
                </a>
                <a href="mailto:atelier@1krafts.com" aria-label="Email" className="grid h-11 w-11 place-items-center rounded-full border border-[color:var(--walnut)]/18 text-[color:var(--walnut)] transition-all hover:border-[color:var(--brass)] hover:bg-[color:var(--brass)]/10 hover:text-[color:var(--ember)]">
                  <Mail size={16} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MessageIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12 0C5.37 0 0 5.37 0 12a11.9 11.9 0 0 0 1.64 6.06L0 24l6.13-1.6A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52Zm-8.52 18.4a9.87 9.87 0 0 1-5.02-1.37l-.36-.21-3.64.95.97-3.55-.24-.37A9.86 9.86 0 1 1 22 12c0 5.46-4.44 9.88-10 9.88Zm5.65-7.42c-.31-.16-1.83-.9-2.11-1s-.49-.16-.7.16-.8 1-.98 1.21-.36.24-.67.08a8.11 8.11 0 0 1-2.39-1.47 8.9 8.9 0 0 1-1.66-2.05c-.17-.31 0-.48.13-.63l.4-.47c.13-.16.17-.28.26-.47a.55.55 0 0 0 0-.53c-.08-.16-.7-1.68-.95-2.3-.25-.6-.5-.52-.7-.53h-.6a1.15 1.15 0 0 0-.84.4A3.5 3.5 0 0 0 4.7 9.4c0 1.55 1.13 3.05 1.29 3.25a11.75 11.75 0 0 0 4.53 4.02c.63.27 1.12.44 1.5.56a3.62 3.62 0 0 0 1.66.11 2.72 2.72 0 0 0 1.79-1.26 2.22 2.22 0 0 0 .16-1.25c-.07-.13-.28-.21-.6-.37Z"/>
    </svg>
  );
}