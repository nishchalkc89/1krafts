import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ScrollProgress } from "./ScrollProgress";
import { GrainOverlay } from "@/components/brand/GrainOverlay";
import { EnquiryDrawer } from "@/components/commerce/EnquiryDrawer";
import { WishlistDrawer } from "@/components/commerce/WishlistDrawer";
import { SearchOverlay } from "@/components/commerce/SearchOverlay";

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <Header />
      <main>{children}</main>
      <Footer />
      <EnquiryDrawer />
      <WishlistDrawer />
      <SearchOverlay />
      <GrainOverlay />
    </div>
  );
}