import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/motion/Reveal";
import { Divider } from "@/components/brand/Divider";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — 1KRAFTS" },
      { name: "description", content: "A small heritage house in Kathmandu keeping Nepali craft alive, one signed piece at a time." },
      { property: "og:title", content: "About — 1KRAFTS" },
      { property: "og:description", content: "A small heritage house in Kathmandu." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <section className="pt-40 pb-32 px-6 md:px-10">
      <div className="mx-auto max-w-[900px]">
        <Reveal>
          <div className="eyebrow">The House</div>
          <h1 className="mt-6 display-xl italic font-light">A very small house.</h1>
        </Reveal>
        <Divider className="my-16" />
        <Reveal delay={0.1}>
          <div className="space-y-6 font-display font-medium text-2xl leading-snug text-foreground">
            <p>1KRAFTS is a Kathmandu-based heritage house founded in 2018.</p>
            <p>We work with twenty-nine master artisans across Nepal, on saree, pashmina, dhaka, jewellery, footwear, and homeware.</p>
            <p>We keep the atelier small on purpose. Small enough that every piece can pass through the hands of the person who signed it.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}