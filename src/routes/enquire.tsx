import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useEnquiry } from "@/context/EnquiryContext";
import { Reveal } from "@/components/motion/Reveal";

export const Route = createFileRoute("/enquire")({
  head: () => ({
    meta: [
      { title: "Send an Enquiry — 1KRAFTS" },
      { name: "description", content: "Send an enquiry to the 1KRAFTS atelier." },
      { property: "og:title", content: "Send an Enquiry — 1KRAFTS" },
      { property: "og:description", content: "Send an enquiry to the 1KRAFTS atelier." },
      { property: "og:url", content: "/enquire" },
    ],
    links: [{ rel: "canonical", href: "/enquire" }],
  }),
  component: Enquire,
});

function Enquire() {
  const { openEnquiry } = useEnquiry();
  useEffect(() => {
    const t = setTimeout(() => openEnquiry(), 200);
    return () => clearTimeout(t);
  }, [openEnquiry]);
  return (
    <section className="pt-40 pb-32 px-6 md:px-10">
      <div className="mx-auto max-w-[900px] text-center">
        <Reveal>
          <div className="eyebrow">One conversation</div>
          <h1 className="mt-6 display-xl italic font-light">Write to the atelier.</h1>
          <p className="mt-8 font-medium text-foreground max-w-xl mx-auto">
            Every enquiry is read by a member of the atelier, personally. We aim to reply within 24 hours.
          </p>
          <button
            onClick={() => openEnquiry()}
            className="mt-12 inline-flex items-center gap-3 rounded-full border border-foreground bg-foreground px-8 py-4 text-[0.72rem] uppercase tracking-[0.28em] text-[color:var(--ivory)] hover:bg-transparent hover:text-foreground transition-colors"
          >
            Open the form
          </button>
        </Reveal>
      </div>
    </section>
  );
}