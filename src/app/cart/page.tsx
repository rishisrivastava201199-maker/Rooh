import type { Metadata } from "next";
import { Crumbs } from "@/components/Crumbs";
import { BagView } from "@/components/BagView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Your bag",
  description:
    "Review what is in your ROOH bag before you order. Nothing is reserved until the order is placed, and shipping is complimentary over ₹999.",
  path: "/cart",
});

export default function CartPage() {
  return (
    <>
      <Crumbs trail={[["Home", "/"], ["Your bag", ""]]} />
      <BagView />
    </>
  );
}
