import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COLLECTIONS, collBySlug, collProducts } from "@/lib/collections";
import { Crumbs } from "@/components/Crumbs";
import { ProductGrid } from "@/components/ProductCard";
import { JsonLd } from "@/components/JsonLd";
import { graphFor, pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = collBySlug(slug);
  if (!c) return pageMeta({ title: "Not found", description: "", path: `/collections/${slug}` });
  return pageMeta({
    title: c.title,
    description: c.desc.slice(0, 300),
    path: `/collections/${c.slug}`,
  });
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = collBySlug(slug);
  if (!c) notFound();
  const items = collProducts(c);

  return (
    <>
      <JsonLd graph={graphFor(`/collections/${c.slug}`)} />
      <Crumbs trail={[["Home", "/"], ["Collections", "/collections"], [c.title, ""]]} />
      <div className="wrap">
        <div className="phead">
          <p className="eyebrow">{c.tag}</p>
          <h1>{c.title}</h1>
          <p className="lead">{c.desc}</p>
        </div>
        <h2 className="sr">
          {items.length} {items.length === 1 ? "fragrance" : "fragrances"}
        </h2>
        <div style={{ paddingBottom: "var(--s9)" }}>
          <ProductGrid items={items} />
        </div>
      </div>
    </>
  );
}
