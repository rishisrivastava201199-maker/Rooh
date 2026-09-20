import type { Metadata } from "next";
import { Crumbs } from "@/components/Crumbs";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Track an order",
  description: "Enter the order number from your confirmation email to see where your ROOH order is.",
  path: "/track",
});

export default function TrackPage() {
  return (
    <>
      <Crumbs trail={[["Home", "/"], ["Track an order", ""]]} />
      <div className="wrap" style={{ paddingBottom: "var(--s9)", maxWidth: 620 }}>
        <div className="phead">
          <p className="eyebrow">Orders</p>
          <h1>Track an order</h1>
          <p className="lead">
            Enter the order number from your confirmation email. Signing in shows every order on
            your account at once.
          </p>
        </div>
        <p className="hint" style={{ lineHeight: 1.75 }}>
          Live courier scans appear on the order page once the shipping account is connected.
          Until then the order page shows the stages we can confirm ourselves and nothing we
          cannot — no invented tracking events.
        </p>
      </div>
    </>
  );
}
