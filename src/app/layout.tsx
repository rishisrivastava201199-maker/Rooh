import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/Shell";
import { JsonLd } from "@/components/JsonLd";
import { SITE, ldWebSite } from "@/lib/seo";

/* next/font self-hosts and subsets these at build time, so there is
   no request to a third-party font host and no render-blocking
   stylesheet. It also emits a size-adjusted fallback, which is the
   piece the prototype could not do — see SETUP.md. */
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

const ui = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-ui",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.origin),
  title: {
    default: "ROOH Fragrance House",
    template: "%s · ROOH",
  },
  description:
    "Indian eau de parfum and traditional itra, composed at 18% fragrance oil and sold at one honest price. Eleven compositions, made in India.",
  robots: SITE.indexable ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  /* without this every safe-area inset resolves to zero and the
     phone tab bar sits under the home indicator */
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F3EC" },
    { media: "(prefers-color-scheme: dark)", color: "#170C16" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${ui.variable}`} suppressHydrationWarning>
      <head>
        {/* applied before first paint so a dark-mode visitor never
            sees a flash of the light palette */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('rooh.theme');" +
              "if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t);}catch(e){}",
          }}
        />
      </head>
      <body>
        <JsonLd graph={[ldWebSite()]} />
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
