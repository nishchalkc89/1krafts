import logo from "@/assets/1krafts-logo-transparent.png";

// Rendered as the router's defaultPendingComponent, which normally only
// replaces the current route's own content inside the header/footer chrome.
// Fixed + full-viewport here so it visually covers everything — including
// the header and footer — for a clean full-screen loading state instead of
// a loader sandwiched between chrome that's still showing.
export function PageLoader() {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-[color:var(--linen)]">
      <div className="relative grid h-24 w-24 place-items-center">
        <div className="absolute inset-0 rounded-full border-2 border-[color:var(--brass)]/15" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[color:var(--brass)]" />
        <img src={logo} alt="" aria-hidden className="h-9 w-auto" draggable={false} />
      </div>
    </div>
  );
}
