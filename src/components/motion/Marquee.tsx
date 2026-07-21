import type { ReactNode } from "react";

export function Marquee({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={"overflow-hidden " + (className ?? "")}>
      <div className="flex w-max marquee">
        <div className="flex shrink-0 items-center gap-16 pr-16">{children}</div>
        <div aria-hidden className="flex shrink-0 items-center gap-16 pr-16">
          {children}
        </div>
      </div>
    </div>
  );
}