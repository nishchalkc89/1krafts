import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        {eyebrow && (
          <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[color:var(--sindoor)]">{eyebrow}</div>
        )}
        <h1 className="mt-1 font-display text-3xl text-[color:var(--walnut)]">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-[color:var(--walnut-soft)]">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`admin-card ${className}`}>{children}</div>;
}

export function EmptyState({ icon, title, description }: { icon?: ReactNode; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      {icon && <div className="text-[color:var(--walnut)]/25">{icon}</div>}
      <p className="text-sm font-medium text-[color:var(--walnut)]">{title}</p>
      {description && <p className="max-w-xs text-sm text-[color:var(--walnut-soft)]">{description}</p>}
    </div>
  );
}

export function IconButton({
  onClick,
  children,
  variant = "default",
  title,
}: {
  onClick: () => void;
  children: ReactNode;
  variant?: "default" | "danger";
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={
        "grid h-8 w-8 place-items-center rounded-md transition-all duration-150 hover:scale-110 active:scale-95 " +
        (variant === "danger"
          ? "text-[color:var(--sindoor)] hover:bg-[color:var(--sindoor)]/10"
          : "text-[color:var(--walnut-soft)] hover:bg-[color:var(--walnut)]/8 hover:text-[color:var(--walnut)]")
      }
    >
      {children}
    </button>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--walnut-soft)]">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--sindoor)]">{children}</div>
  );
}
