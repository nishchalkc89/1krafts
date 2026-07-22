import { Link } from "@tanstack/react-router";
import logo from "@/assets/1krafts-logo-transparent.png";

interface LogoProps {
  className?: string;
  variant?: "full" | "mark";
}

export function Logo({ className, variant = "mark" }: LogoProps) {
  return (
    <Link to="/" className={"group inline-flex items-center " + (className ?? "")} aria-label="1KRAFTS home">
      <img
        src={logo}
        alt="1KRAFTS — Crafted with Tradition"
        className={variant === "full" ? "h-28 w-auto md:h-40" : "h-24 w-auto md:h-36"}
        draggable={false}
      />
    </Link>
  );
}