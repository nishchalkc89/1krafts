import { Link } from "@tanstack/react-router";
import { Instagram, Phone, Mail } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Divider } from "@/components/brand/Divider";

export function Footer() {
  return (
    <footer className="relative bg-[color:var(--parchment)] text-[color:var(--walnut)] border-t border-[color:var(--walnut)]/10">
      <div className="mx-auto max-w-[1680px] px-5 sm:px-6 md:px-10 pt-16 md:pt-24 pb-10">
        <div className="grid gap-12 md:gap-16 sm:grid-cols-2 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <Logo variant="full" />
            <p className="mt-6 max-w-sm font-display font-medium text-xl md:text-2xl leading-tight text-[color:var(--walnut)]">
              A Nepali heritage house. Slow-made, considered, kept alive by hand.
            </p>
          </div>
          <FooterCol title="House">
            <FLink to="/heritage">Heritage</FLink>
            <FLink to="/craftsmanship">The Atelier</FLink>
            <FLink to="/journal">Journal</FLink>
            <FLink to="/about">About</FLink>
          </FooterCol>
          <FooterCol title="Shop">
            <Link to="/collections" className="gold-underline w-fit">All Collections</Link>
            <Link to="/collections/$slug" params={{ slug: "sarees" }} className="gold-underline w-fit">Sarees</Link>
            <Link to="/collections/$slug" params={{ slug: "women-kurtis" }} className="gold-underline w-fit">Women Kurtis</Link>
            <Link to="/collections/$slug" params={{ slug: "men-kurtas" }} className="gold-underline w-fit">Men Kurtas</Link>
            <Link to="/collections/$slug" params={{ slug: "jewellery" }} className="gold-underline w-fit">Jewellery</Link>
          </FooterCol>
          <FooterCol title="Reach us">
            <a href="mailto:atelier@1krafts.com" className="gold-underline inline-flex items-center gap-2 text-sm">
              <Mail size={14} /> atelier@1krafts.com
            </a>
            <a href="tel:+9779800000000" className="gold-underline inline-flex items-center gap-2 text-sm">
              <Phone size={14} /> +977 98 0000 0000
            </a>
            <a href="https://wa.me/9779800000000" className="gold-underline text-sm" target="_blank" rel="noreferrer">
              WhatsApp the Atelier
            </a>
            <a href="#" className="gold-underline inline-flex items-center gap-2 text-sm">
              <Instagram size={14} /> @1krafts
            </a>
          </FooterCol>
        </div>
        <Divider className="mt-16 md:mt-20 text-[color:var(--walnut)]/25" />
        <div className="mt-6 flex flex-col items-center justify-center gap-3 text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--walnut)]">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link to="/about" className="hover:text-[color:var(--walnut)]">The House</Link>
            <a href="#" className="hover:text-[color:var(--walnut)]">Privacy</a>
            <a href="#" className="hover:text-[color:var(--walnut)]">Terms</a>
          </div>
          <span>© {new Date().getFullYear()} 1KRAFTS · Kathmandu</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="eyebrow">{title}</div>
      <div className="mt-6 flex flex-col gap-3 text-sm font-medium text-[color:var(--walnut)]">{children}</div>
    </div>
  );
}

function FLink({ to, children }: { to: "/heritage" | "/craftsmanship" | "/journal" | "/about" | "/collections"; children: React.ReactNode }) {
  return (
    <Link to={to} className="gold-underline w-fit">
      {children}
    </Link>
  );
}