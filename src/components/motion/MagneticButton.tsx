import { motion, useReducedMotion } from "framer-motion";
import { useRef, type ButtonHTMLAttributes, type ReactNode } from "react";

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  strength?: number;
}

export function MagneticButton({ children, strength = 0.25, className, ...rest }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  function handleMove(e: React.MouseEvent<HTMLButtonElement>) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    ref.current.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
  }
  function reset() {
    if (!ref.current) return;
    ref.current.style.transform = "translate3d(0,0,0)";
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ transition: "transform 400ms cubic-bezier(0.22, 1, 0.36, 1)" }}
      className={className}
      {...(rest as any)}
    >
      <span className="pointer-events-none inline-block">{children}</span>
    </motion.button>
  );
}