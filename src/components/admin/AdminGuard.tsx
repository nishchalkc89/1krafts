import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAdminSession } from "@/hooks/use-admin-session";
import { hasSupabaseConfig } from "@/services/supabase/client";
import logo from "@/assets/1krafts-logo-transparent.png";

export function AdminGuard({ children }: { children: ReactNode }) {
  const { session, loading } = useAdminSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/admin/login" });
  }, [loading, session, navigate]);

  if (!hasSupabaseConfig) {
    return (
      <div className="grid min-h-screen place-items-center bg-[color:var(--linen)] px-6 text-center">
        <div>
          <p className="font-display text-xl text-[color:var(--walnut)]">Supabase isn't configured</p>
          <p className="mt-2 text-sm text-[color:var(--walnut-soft)]">
            Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local.
          </p>
        </div>
      </div>
    );
  }

  if (loading || !session) {
    return (
      <div className="grid min-h-screen place-items-center bg-[color:var(--linen)]">
        <img src={logo} alt="" className="h-10 w-auto animate-pulse opacity-60" draggable={false} />
      </div>
    );
  }

  return <>{children}</>;
}
