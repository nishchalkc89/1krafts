import { Link } from "@tanstack/react-router";
import fullLogo from "@/assets/1krafts-logo.png.asset.json";
import markLogo from "@/assets/1krafts-mark.png.asset.json";

interface LogoProps {
  className?: string;
  variant?: "full" | "mark";
}

export function Logo({ className, variant = "mark" }: LogoProps) {
  const src = variant === "full" ? fullLogo.url : markLogo.url;
  return (
    <Link to="/" className={"group inline-flex items-center " + (className ?? "")} aria-label="1KRAFTS home">
      <img
        src={src}
        alt="1KRAFTS — Crafted with Tradition"
        className={variant === "full" ? "h-14 w-auto md:h-16" : "h-10 w-auto md:h-11"}
        draggable={false}
      />
    </Link>
  );
}