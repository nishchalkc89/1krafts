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
        className={variant === "full" ? "h-16 w-auto md:h-20" : "h-12 w-auto md:h-16"}
        draggable={false}
      />
    </Link>
  );
}