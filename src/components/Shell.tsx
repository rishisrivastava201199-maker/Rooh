"use client";
/* Everything that has to live in the browser, in one place: the
   bag, the header, the phone tab bar and the stylist panel. Pages
   themselves stay server components. */
import { useState } from "react";
import { CartProvider } from "./CartProvider";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { TabBar } from "./TabBar";
import { Stylist } from "./Stylist";

export function Shell({ children }: { children: React.ReactNode }) {
  const [stylist, setStylist] = useState(false);

  return (
    <CartProvider>
      <Header onOpenStylist={() => setStylist(true)} />
      <main id="view" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <TabBar onOpenStylist={() => setStylist(true)} />
      <Stylist open={stylist} onClose={() => setStylist(false)} />
      <div className="toasts" id="toasts" role="status" aria-live="polite" />
    </CartProvider>
  );
}
