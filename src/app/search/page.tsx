import { Suspense } from "react";
import type { Metadata } from "next";
import { PRODUCTS } from "@/lib/products";
import { Crumbs } from "@/components/Crumbs";
import { SearchView } from "@/components/SearchView";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Search",
  description: "Search the eleven ROOH fragrances by name, family, note or occasion.",
  path: "/search",
});

export default function SearchPage() {
  return (
    <>
      <Crumbs trail={[["Home", "/"], ["Search", ""]]} />
      <Suspense fallback={<div className="wrap" style={{ paddingBlock: "var(--s7)" }} />}>
        <SearchView all={PRODUCTS} />
      </Suspense>
    </>
  );
}
