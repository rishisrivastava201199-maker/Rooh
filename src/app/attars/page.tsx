import type { Metadata } from "next";
import { PRODUCTS } from "@/lib/products";
import { Crumbs } from "@/components/Crumbs";
import { ProductGrid } from "@/components/ProductCard";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "The Itra Collection",
  description:
    "Three traditional itras — mitti, gulab and khus. Alcohol-free fragrance oils applied in drops, worn close to the skin.",
  path: "/attars",
});

export default function AttarsPage() {
  const itras = PRODUCTS.filter((p) => p.type === "attar");
  const box = PRODUCTS.filter((p) => p.slug === "itra-discovery-box");

  return (
    <>
      <Crumbs trail={[["Home", "/"], ["Itra", ""]]} />
      <div className="wrap">
        <div className="phead">
          <p className="eyebrow">Alcohol-free · Oil-based · Traditional</p>
          <h1>The Itra Collection</h1>
          <p className="lead">
            An itra is aromatic material in an oil base rather than alcohol. You apply it in drops,
            it sits close to the skin, and it tends to last longer than it projects.
          </p>
        </div>
        <h2 className="sr">The three itras</h2>
        <div style={{ paddingBottom: "var(--s9)" }}>
          <ProductGrid items={[...itras, ...box]} />
        </div>
      </div>
    </>
  );
}
