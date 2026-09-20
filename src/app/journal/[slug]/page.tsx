import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JOURNAL, ARTICLES, journalBySlug } from "@/lib/journal";
import { Crumbs } from "@/components/Crumbs";
import { JsonLd } from "@/components/JsonLd";
import { graphFor, pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return JOURNAL.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const j = journalBySlug(slug);
  if (!j) return pageMeta({ title: "Not found", description: "", path: `/journal/${slug}` });
  return pageMeta({
    title: j.title,
    description: j.excerpt.slice(0, 300),
    path: `/journal/${j.slug}`,
    type: "article",
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const j = journalBySlug(slug);
  const a = ARTICLES[slug];
  if (!j || !a) notFound();

  return (
    <>
      <JsonLd graph={graphFor(`/journal/${j.slug}`)} />
      <Crumbs trail={[["Home", "/"], ["Journal", "/journal"], [j.title, ""]]} />
      <article className="wrap" style={{ paddingBottom: "var(--s8)", maxWidth: 720 }}>
        <div className="art" style={{ paddingBlock: "var(--s5) var(--s6)" }}>
          <p className="eyebrow">
            {j.cat} · {j.mins} min read{a.date ? ` · ${a.date}` : ""}
          </p>
          <h1 style={{ fontSize: "var(--t-h1)", marginBlock: "var(--s4)" }}>{j.title}</h1>
          <p className="lead" style={{ maxWidth: "none" }}>{j.excerpt}</p>
        </div>
        {a.body.map(([heading, paras], i) => (
          <section key={i}>
            {heading ? (
              <h2 style={{ marginBlock: "var(--s6) var(--s4)" }}>{heading}</h2>
            ) : null}
            {paras.map((text, n) => (
              <p key={n} className="lead" style={{ marginBottom: "var(--s4)", maxWidth: "none" }}>
                {text}
              </p>
            ))}
          </section>
        ))}
      </article>
    </>
  );
}
