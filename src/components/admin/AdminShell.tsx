import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutGrid, LogOut, Mail, Menu, MessageSquare, Newspaper, Package, Quote, Upload, X } from "lucide-react";
import { supabase } from "@/services/supabase/client";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import logo from "@/assets/1krafts-logo-transparent.png";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutGrid, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/products/import", label: "Bulk Import", icon: Upload },
  { to: "/admin/categories", label: "Categories", icon: LayoutGrid },
  { to: "/admin/journal", label: "Journal", icon: Newspaper },
  { to: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { to: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
  { to: "/admin/newsletter", label: "Newsletter", icon: Mail },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [pathname]);
  useBodyScrollLock(mobileOpen);

  async function signOut() {
    await supabase?.auth.signOut();
    navigate({ to: "/admin/login" });
  }

  const navList = (onNavigate?: () => void) => (
    <nav className="flex-1 space-y-1 p-3">
      {NAV.map((n) => (
        <Link
          key={n.to}
          to={n.to}
          onClick={onNavigate}
          activeOptions={{ exact: true }}
          activeProps={{ className: "bg-[color:var(--walnut)] !text-[color:var(--linen)] shadow-soft" }}
          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[color:var(--walnut-soft)] transition-all duration-200 hover:translate-x-0.5 hover:bg-[color:var(--walnut)]/8 hover:text-[color:var(--walnut)]"
        >
          <n.icon size={16} className="transition-transform duration-200 group-hover:scale-110" />
          {n.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[color:var(--linen)] text-[color:var(--walnut)] md:flex">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-[color:var(--walnut)]/10 bg-[color:var(--parchment)] px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <img src={logo} alt="1KRAFTS" className="h-5 w-auto" draggable={false} />
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--sindoor)]">Admin</div>
        </div>
        <button
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
          className="grid h-9 w-9 place-items-center rounded-md text-[color:var(--walnut)] hover:bg-[color:var(--walnut)]/8"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-[color:var(--walnut)]/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-72 max-w-[80vw] flex-col bg-[color:var(--parchment)] shadow-lift">
            <div className="flex items-center justify-between border-b border-[color:var(--walnut)]/10 px-5 py-4">
              <img src={logo} alt="1KRAFTS" className="h-6 w-auto" draggable={false} />
              <button
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-md text-[color:var(--walnut)] hover:bg-[color:var(--walnut)]/8"
              >
                <X size={16} />
              </button>
            </div>
            {navList(() => setMobileOpen(false))}
            <div className="border-t border-[color:var(--walnut)]/10 p-3">
              <button
                onClick={signOut}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[color:var(--walnut-soft)] hover:bg-[color:var(--sindoor)]/8 hover:text-[color:var(--sindoor)]"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-[color:var(--walnut)]/10 bg-[color:var(--parchment)] md:flex">
        <div className="flex items-center gap-2.5 border-b border-[color:var(--walnut)]/10 px-5 py-4">
          <img src={logo} alt="1KRAFTS" className="h-6 w-auto" draggable={false} />
          <div>
            <div className="font-display text-sm leading-none">1KRAFTS</div>
            <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[color:var(--sindoor)]">Admin</div>
          </div>
        </div>
        {navList()}
        <div className="border-t border-[color:var(--walnut)]/10 p-3">
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[color:var(--walnut-soft)] transition-colors hover:bg-[color:var(--sindoor)]/8 hover:text-[color:var(--sindoor)]"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-10 md:py-9">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
