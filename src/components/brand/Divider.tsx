export function Divider({ label, className }: { label?: string; className?: string }) {
  return (
    <div className={"flex items-center gap-4 text-foreground/40 " + (className ?? "")}>
      <span className="hairline flex-1" />
      {label && <span className="eyebrow whitespace-nowrap">{label}</span>}
      <span className="hairline flex-1" />
    </div>
  );
}