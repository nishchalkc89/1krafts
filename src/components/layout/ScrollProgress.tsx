import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, mass: 0.4 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0 0" }}
      className="fixed inset-x-0 top-0 z-[70] h-[2px] bg-gradient-to-r from-transparent via-[color:var(--gold)] to-transparent"
    />
  );
}