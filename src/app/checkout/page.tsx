import type { Metadata } from "next";
import { CheckoutView } from "@/components/CheckoutView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Checkout",
  description:
    "Checkout at ROOH. Pay by UPI, card, netbanking or wallet, or choose cash on delivery up to ₹5,000.",
  path: "/checkout",
});

export default function CheckoutPage() {
  return <CheckoutView />;
}
