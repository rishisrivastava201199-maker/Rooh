/* ══════════════════════════════════════════════════════════════
   SEO

   The prototype could only fake this: everything after "#" never
   reaches a server, so the whole storefront was one URL to a
   crawler. That was Stage 10's one non-optional finding, and it is
   what this project fixes — every route below is a real path with
   its own HTML, its own title and its own structured data.

   What the structured data deliberately does NOT contain:

     · no aggregateRating and no review — the shop has no reviews,
       and inventing them is how a storefront loses rich results
       and lies to the customer in the same move;
     · no og:image that does not exist — add it when the real
       photography does;
     · no priceValidUntil — there is no real date to put in it.
   ══════════════════════════════════════════════════════════════ */
import type { Metadata } from "next";
import { PRODUCTS, bySlug, type Product } from "./products";
import { collBySlug, collProducts } from "./collections";
import { journalBySlug } from "./journal";

export const SITE = {
  name: "ROOH Fragrance House",
  /** Set NEXT_PUBLIC_SITE_ORIGIN in .env.local before going live. */
  origin: process.env.NEXT_PUBLIC_SITE_ORIGIN || "http://localhost:3000",
  locale: "en_IN",
  /** Flip to true only once the store is real and you want it indexed. */
  indexable: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
} as const;

const abs = (path: string): string => new URL(path, SITE.origin).toString();

export function pageMeta(input: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const url = abs(input.path);
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    robots: SITE.indexable
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
    openGraph: {
      type: input.type ?? "website",
      siteName: SITE.name,
      title: input.title,
      description: input.description,
      url,
      locale: SITE.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
    },
  };
}

export function productDescription(p: Product): string {
  return (
    `${p.name} — ${p.short} ${p.family}, ${p.size}, ` +
    `₹${p.price.toLocaleString("en-IN")}. Lasts ${p.longev[0]}–${p.longev[1]} ` +
    `hours in our own testing. Made in India.`
  );
}

/* ── JSON-LD ────────────────────────────────────────────────── */

type Json = Record<string, unknown>;

export const ldOrganization = (): Json => ({
  "@type": "Organization",
  "@id": abs("/#org"),
  name: SITE.name,
  url: SITE.origin,
  description: "Indian eau de parfum and traditional itra, made in India.",
});

export const ldWebSite = (): Json => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.origin,
  publisher: ldOrganization(),
});

export function ldProduct(p: Product): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.slug,
    description: p.short,
    category: p.family,
    brand: { "@type": "Brand", name: "ROOH" },
    offers: {
      "@type": "Offer",
      url: abs(`/product/${p.slug}`),
      price: String(p.price),
      priceCurrency: "INR",
      itemCondition: "https://schema.org/NewCondition",
      availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: SITE.name },
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Size", value: p.size },
      {
        "@type": "PropertyValue",
        name: "Concentration",
        value:
          p.type === "attar"
            ? "Attar / itra — alcohol-free fragrance oil"
            : p.type === "set"
              ? "Set"
              : "Eau de Parfum",
      },
      {
        "@type": "PropertyValue",
        name: "Longevity (our own measurement)",
        value: `${p.longev[0]}–${p.longev[1]} hours`,
      },
    ],
  };
}

export function ldBreadcrumb(trail: [label: string, href: string][]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([label, href], i) => {
      const item: Json = { "@type": "ListItem", position: i + 1, name: label };
      if (href) item.item = abs(href);
      return item;
    }),
  };
}

export function ldItemList(list: Product[], name: string): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: list.length,
    itemListElement: list.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: abs(`/product/${p.slug}`),
    })),
  };
}

/** The graph for a route, assembled from the same records the page renders. */
export function graphFor(path: string): Json[] {
  const blocks: Json[] = [ldWebSite()];
  const seg = path.split("/").filter(Boolean);

  if (seg[0] === "product" && seg[1]) {
    const p = bySlug(seg[1]);
    if (p) {
      blocks.push(ldProduct(p));
      blocks.push(
        ldBreadcrumb([
          ["Home", "/"],
          ["All fragrances", "/shop"],
          [p.name, ""],
        ]),
      );
    }
  } else if (path === "/shop") {
    blocks.push(ldItemList(PRODUCTS, "All ROOH fragrances"));
    blocks.push(
      ldBreadcrumb([
        ["Home", "/"],
        ["All fragrances", ""],
      ]),
    );
  } else if (seg[0] === "collections" && seg[1]) {
    const c = collBySlug(seg[1]);
    if (c) {
      blocks.push(ldItemList(collProducts(c), c.title));
      blocks.push(
        ldBreadcrumb([
          ["Home", "/"],
          ["Collections", "/collections"],
          [c.title, ""],
        ]),
      );
    }
  } else if (seg[0] === "journal" && seg[1]) {
    const j = journalBySlug(seg[1]);
    if (j) {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: j.title,
        description: j.excerpt,
        publisher: ldOrganization(),
        mainEntityOfPage: abs(`/journal/${j.slug}`),
      });
      blocks.push(
        ldBreadcrumb([
          ["Home", "/"],
          ["Journal", "/journal"],
          [j.title, ""],
        ]),
      );
    }
  }
  return blocks;
}
