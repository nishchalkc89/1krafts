import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase, hasSupabaseConfig } from "@/services/supabase/client";
import { useAdminSession } from "@/hooks/use-admin-session";
import logo from "@/assets/1krafts-logo-transparent.png";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin — 1KRAFTS" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const { session, loading } = useAdminSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/admin" });
  }, [loading, session, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = await supabase!.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    navigate({ to: "/admin" });
  }

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

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-[color:var(--linen)] px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, color-mix(in oklab, var(--brass) 14%, transparent), transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-[380px]">
        <div className="flex flex-col items-center text-center">
          <img src={logo} alt="1KRAFTS" className="h-20 w-auto" draggable={false} />
          <div className="mt-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-[color:var(--sindoor)]">
            1KRAFTS Admin
          </div>
          <h1 className="mt-2 font-display text-2xl text-[color:var(--walnut)]">Sign in to manage the house.</h1>
        </div>

        <form onSubmit={onSubmit} className="admin-card mt-8 p-7">
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--walnut-soft)]">Email</span>
              <input
                type="email"
                autoFocus
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input mt-1.5"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--walnut-soft)]">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input mt-1.5"
              />
            </label>
          </div>

          {error && <p className="mt-4 text-sm text-[color:var(--sindoor)]">{error}</p>}

          <button type="submit" disabled={submitting} className="admin-btn-primary mt-6 w-full justify-center py-2.5">
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[color:var(--walnut-soft)]">Kathmandu · 1KRAFTS Atelier</p>
      </div>
    </div>
  );
}
