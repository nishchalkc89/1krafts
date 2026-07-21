import type { ReactNode } from "react";
import { EnquiryProvider } from "./EnquiryContext";
import { WishlistProvider } from "./WishlistContext";
import { SearchProvider } from "./SearchContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <EnquiryProvider>
      <WishlistProvider>
        <SearchProvider>{children}</SearchProvider>
      </WishlistProvider>
    </EnquiryProvider>
  );
}