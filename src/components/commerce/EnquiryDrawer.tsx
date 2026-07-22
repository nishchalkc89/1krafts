import { AnimatePresence, motion } from "framer-motion";
import { Phone, X, Mail, MessageCircle, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useEnquiry } from "@/context/EnquiryContext";
import { services } from "@/services";
import { useEscapeKey } from "@/hooks/use-escape-key";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";

export function EnquiryDrawer() {
  const { open, target, closeEnquiry } = useEnquiry();
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  useEscapeKey(open, closeEnquiry);
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) {
      setState("idle");
      setForm({ name: "", email: "", phone: "", message: "" });
    }
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      await services.enquiries.create({
        ...form,
        productSlug: target?.productSlug,
        productName: target?.productName,
      });
      setState("sent");
    } catch {
      setState("idle");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            aria-label="Close enquiry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeEnquiry}
            className="fixed inset-0 z-[80] bg-[color:var(--ink)]/40 backdrop-blur-sm"
          />
          <motion.aside
            role="dialog"
            aria-modal
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 z-[81] flex h-full w-full max-w-[520px] flex-col bg-[color:var(--ivory)] shadow-2xl"
          >
            <div className="flex items-center justify-between px-8 pt-8">
              <div className="eyebrow">Send Enquiry</div>
              <button onClick={closeEnquiry} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full border border-foreground/15 hover:border-foreground/40">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-10 pt-6">
              <h2 className="display-md">Speak with the atelier</h2>
              {target?.productName && (
                <p className="mt-2 text-sm font-medium text-foreground">Enquiring about <span className="italic">{target.productName}</span></p>
              )}

              {state === "sent" ? (
                <div className="mt-10 rounded-sm border border-foreground/15 bg-[color:var(--cream)] p-8 text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[color:var(--gold)]/20 text-[color:var(--gold)]">
                    <Check />
                  </div>
                  <div className="mt-4 font-display text-2xl">Thank you.</div>
                  <p className="mt-2 text-sm font-medium text-foreground">
                    A member of our atelier will reach out within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} className="mt-8 space-y-5">
                  <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
                  <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                  <Field label="Phone / WhatsApp" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                  <div>
                    <label className="eyebrow">Message</label>
                    <textarea
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={5}
                      className="mt-2 w-full resize-none border-b border-foreground/25 bg-transparent py-3 text-sm outline-none placeholder:text-foreground/50 focus:border-foreground"
                      placeholder="Tell us about the piece or occasion"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={state === "sending"}
                    className="group relative mt-4 inline-flex w-full items-center justify-center overflow-hidden rounded-none border border-foreground bg-foreground px-6 py-4 text-[0.72rem] uppercase tracking-[0.28em] text-[color:var(--ivory)] transition-colors hover:bg-transparent hover:text-foreground disabled:opacity-60"
                  >
                    {state === "sending" ? "Sending…" : "Send Enquiry"}
                  </button>
                </form>
              )}

              <div className="mt-10 border-t border-foreground/10 pt-8">
                <div className="eyebrow mb-4">Or reach us directly</div>
                <div className="flex flex-col gap-3">
                  <a href="https://wa.me/9779800000000" target="_blank" rel="noreferrer" className="group flex items-center justify-between border-b border-foreground/10 py-3">
                    <span className="flex items-center gap-3 text-sm"><MessageCircle size={16} /> WhatsApp</span>
                    <span className="text-xs font-semibold text-foreground">+977 98 0000 0000 →</span>
                  </a>
                  <a href="tel:+9779800000000" className="group flex items-center justify-between border-b border-foreground/10 py-3">
                    <span className="flex items-center gap-3 text-sm"><Phone size={16} /> Call the atelier</span>
                    <span className="text-xs font-semibold text-foreground">+977 98 0000 0000 →</span>
                  </a>
                  <a href="mailto:atelier@1krafts.com" className="group flex items-center justify-between py-3">
                    <span className="flex items-center gap-3 text-sm"><Mail size={16} /> Email</span>
                    <span className="text-xs font-semibold text-foreground">atelier@1krafts.com →</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Field(props: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="eyebrow">{props.label}</label>
      <input
        required={props.required}
        type={props.type ?? "text"}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="mt-2 w-full border-b border-foreground/25 bg-transparent py-3 text-sm outline-none focus:border-foreground"
      />
    </div>
  );
}