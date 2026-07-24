import logo from "@/assets/1krafts-logo-transparent.png";

export function PageLoader() {
  return (
    <div className="grid min-h-[70vh] place-items-center bg-[color:var(--linen)]">
      <div className="relative grid h-24 w-24 place-items-center">
        <div className="absolute inset-0 rounded-full border-2 border-[color:var(--brass)]/15" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[color:var(--brass)]" />
        <img src={logo} alt="" aria-hidden className="h-9 w-auto" draggable={false} />
      </div>
    </div>
  );
}
