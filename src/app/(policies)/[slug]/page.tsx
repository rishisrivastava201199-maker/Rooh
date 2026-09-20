import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { POLICY_SLUGS, policyBySlug } from "@/lib/policy";
import { Crumbs } from "@/components/Crumbs";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return POLICY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = policyBySlug(slug);
  if (!doc) return pageMeta({ title: "Not found", description: "", path: `/${slug}` });
  return pageMeta({ title: doc[0], description: doc[2], path: `/${slug}` });
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = policyBySlug(slug);
  if (!doc) notFound();
  const [title, eyebrow, intro, sections] = doc;

  return (
    <>
      <Crumbs trail={[["Home", "/"], [title, ""]]} />
      <div className="wrap" style={{ paddingBottom: "var(--s9)", maxWidth: 760 }}>
        <div className="phead">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="lead">{intro}</p>
        </div>
        {sections.map(([heading, paras]) => (
          <section key={heading} style={{ marginBottom: "var(--s6)" }}>
            <h2 style={{ fontSize: "var(--t-h3)", marginBottom: "var(--s4)" }}>{heading}</h2>
            {paras.map((t, i) => (
              <p key={i} className="lead" style={{ marginBottom: "var(--s3)", maxWidth: "none" }}>
                {t}
              </p>
            ))}
          </section>
        ))}
      </div>
    </>
  );
}
