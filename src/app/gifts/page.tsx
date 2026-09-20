import type { Metadata } from "next";
import { collBySlug, collProducts } from "@/lib/collections";
import { Crumbs } from "@/components/Crumbs";
import { ProductGrid } from "@/components/ProductCard";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Gifting",
  description:
    "Gift sets presented in rigid boxes, with a handwritten note if you want one, and the invoice left out of the parcel.",
  path: "/gifts",
});

export default function GiftsPage() {
  const items = collProducts(collBySlug("gifts"));
  return (
    <>
      <Crumbs trail={[["Home", "/"], ["Gifting", ""]]} />
      <div className="wrap">
        <div className="phead">
          <h1>Gifting</h1>
          <p className="lead">
            Everything ships in a rigid carton that needs no additional wrapping. Add a handwritten
            note at checkout at no cost, and we leave the invoice out of the parcel whenever a gift
            note is attached.
          </p>
        </div>
        <h2 className="sr">Gift sets</h2>
        <div style={{ paddingBottom: "var(--s9)" }}>
          <ProductGrid items={items} />
        </div>
      </div>
    </>
  );
}
