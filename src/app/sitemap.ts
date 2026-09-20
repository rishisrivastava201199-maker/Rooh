import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";
import { COLLECTIONS } from "@/lib/collections";
import { JOURNAL } from "@/lib/journal";
import { SITE } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const at = new Date();
  const url = (p: string) => `${SITE.origin}${p}`;

  const statics = [
    "/", "/shop", "/collections", "/attars", "/gifts", "/discovery",
    "/fragrance-finder", "/journal", "/about", "/faq", "/help",
    "/shipping", "/returns", "/privacy", "/terms", "/track",
  ];

  return [
    ...statics.map((p) => ({
      url: url(p),
      lastModified: at,
      changeFrequency: "weekly" as const,
      priority: p === "/" ? 1 : 0.7,
    })),
    ...PRODUCTS.map((p) => ({
      url: url(`/product/${p.slug}`),
      lastModified: at,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...COLLECTIONS.map((c) => ({
      url: url(`/collections/${c.slug}`),
      lastModified: at,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...JOURNAL.map((j) => ({
      url: url(`/journal/${j.slug}`),
      lastModified: at,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
