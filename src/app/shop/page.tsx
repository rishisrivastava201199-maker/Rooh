import { Suspense } from "react";
import type { Metadata } from "next";
import { PRODUCTS } from "@/lib/products";
import { Crumbs } from "@/components/Crumbs";
import { JsonLd } from "@/components/JsonLd";
import { ShopFilters } from "@/components/ShopFilters";
import { graphFor, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "All fragrances",
  description:
    "All eleven ROOH fragrances: five eaux de parfum, three traditional itras, a discovery set and two gift sets. Filter by family, occasion, season and intensity.",
  path: "/shop",
});

export default function ShopPage() {
  return (
    <>
      <JsonLd graph={graphFor("/shop")} />
      <Crumbs trail={[["Home", "/"], ["All fragrances", ""]]} />
      <div className="wrap">
        <div className="phead">
          <p className="eyebrow">The full range</p>
          <h1>All fragrances</h1>
          <p className="lead">
            Eleven products in total: five eaux de parfum composed at roughly 18% fragrance oil,
            three traditional itras, a discovery set and two gift sets. Nothing is listed that we
            would not wear ourselves.
          </p>
        </div>
      </div>
      {/* the filters read the URL, which needs a boundary while the
          search params resolve */}
      <Suspense fallback={<div className="wrap" style={{ paddingBlock: "var(--s7)" }} />}>
        <ShopFilters all={PRODUCTS} />
      </Suspense>
    </>
  );
}
