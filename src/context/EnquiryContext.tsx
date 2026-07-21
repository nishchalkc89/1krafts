import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface EnquiryTarget {
  productSlug?: string;
  productName?: string;
}

interface EnquiryContextValue {
  open: boolean;
  target: EnquiryTarget | null;
  openEnquiry: (target?: EnquiryTarget) => void;
  closeEnquiry: () => void;
}

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<EnquiryTarget | null>(null);

  const openEnquiry = useCallback((t?: EnquiryTarget) => {
    setTarget(t ?? null);
    setOpen(true);
  }, []);
  const closeEnquiry = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ open, target, openEnquiry, closeEnquiry }), [open, target, openEnquiry, closeEnquiry]);
  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>;
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error("useEnquiry must be used within EnquiryProvider");
  return ctx;
}