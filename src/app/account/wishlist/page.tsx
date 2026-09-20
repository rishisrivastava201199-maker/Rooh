import type { Metadata } from "next";
import { Crumbs } from "@/components/Crumbs";
import { Wishlist } from "@/components/Wishlist";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Wishlist",
  description: "Fragrances you have saved for later.",
  path: "/account/wishlist",
});

export default function WishlistPage() {
  return (
    <>
      <Crumbs trail={[["Home", "/"], ["Your account", "/account"], ["Wishlist", ""]]} />
      <Wishlist />
    </>
  );
}
