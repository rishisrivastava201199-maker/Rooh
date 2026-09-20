/* Structured data for a route. Emitted server-side so a crawler
   sees it in the HTML rather than after hydration. */
export function JsonLd({ graph }: { graph: Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // the graph is assembled from our own catalogue records
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
