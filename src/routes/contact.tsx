import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Divider } from "@/components/brand/Divider";
import { useEnquiry } from "@/context/EnquiryContext";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — 1KRAFTS" },
      { name: "description", content: "Reach the 1KRAFTS atelier in Boudha, Kathmandu. WhatsApp, phone, or email." },
      { property: "og:title", content: "Contact — 1KRAFTS" },
      { property: "og:description", content: "Reach the 1KRAFTS atelier." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const { openEnquiry } = useEnquiry();
  return (
    <section className="pt-40 pb-32 px-6 md:px-10">
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <div className="eyebrow">Reach the atelier</div>
          <h1 className="mt-6 display-xl italic font-light">Come and see.</h1>
        </Reveal>
        <Divider className="my-16" />
        <div className="grid gap-16 md:grid-cols-2">
          <Reveal>
            <div className="space-y-8">
              <Row icon={<MapPin size={18} />} k="Atelier" v="Boudha · Kathmandu 44600 · Nepal" />
              <Row icon={<Phone size={18} />} k="Call" v="+977 98 0000 0000" />
              <Row icon={<MessageCircle size={18} />} k="WhatsApp" v="+977 98 0000 0000" />
              <Row icon={<Mail size={18} />} k="Email" v="atelier@1krafts.com" />
              <div className="pt-6">
                <button
                  onClick={() => openEnquiry()}
                  className="inline-flex items-center gap-3 rounded-full border border-foreground bg-foreground px-8 py-4 text-[0.72rem] uppercase tracking-[0.28em] text-[color:var(--ivory)] hover:bg-transparent hover:text-foreground transition-colors"
                >
                  Send an enquiry
                </button>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-sm border border-foreground/15 bg-[color:var(--cream)] p-10">
              <div className="eyebrow">Atelier hours</div>
              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex justify-between border-b border-foreground/10 pb-2"><span>Sunday — Friday</span><span>10 : 00 — 19 : 00</span></li>
                <li className="flex justify-between border-b border-foreground/10 pb-2"><span>Saturday</span><span>By appointment</span></li>
              </ul>
              <p className="mt-8 text-sm text-foreground/60">
                Private appointments for bridal and made-to-measure are held on Saturdays at the Boudha atelier. Please write ahead.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Row({ icon, k, v }: { icon: React.ReactNode; k: string; v: string }) {
  return (
    <div className="flex items-start gap-4 border-b border-foreground/10 pb-6">
      <span className="mt-0.5 text-foreground/50">{icon}</span>
      <div>
        <div className="eyebrow text-foreground/50">{k}</div>
        <div className="mt-1 font-display text-2xl">{v}</div>
      </div>
    </div>
  );
}