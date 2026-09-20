import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  /* Until NEXT_PUBLIC_ALLOW_INDEXING is "true" this is a staging
     build and says so, rather than quietly inviting a crawler in. */
  if (!SITE.indexable) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/cart", "/checkout", "/account", "/search"],
      },
    ],
    sitemap: `${SITE.origin}/sitemap.xml`,
    host: SITE.origin,
  };
}
