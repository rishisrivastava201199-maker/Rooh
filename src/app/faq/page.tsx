import type { Metadata } from "next";
import { DETAIL } from "@/lib/detail";
import { Crumbs } from "@/components/Crumbs";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Questions",
  description:
    "Questions about shipping, returns, longevity, ingredients and gifting, answered plainly.",
  path: "/faq",
});

export default function FaqPage() {
  /* the product FAQs, gathered — no separate copy to drift */
  const all = Object.values(DETAIL).flatMap((d) => d.faqs);
  const seen = new Set<string>();
  const unique = all.filter(([q]) => (seen.has(q) ? false : (seen.add(q), true)));

  return (
    <>
      <Crumbs trail={[["Home", "/"], ["Questions", ""]]} />
      <div className="wrap" style={{ maxWidth: 760, paddingBottom: "var(--s9)" }}>
        <div className="phead">
          <p className="eyebrow">{unique.length} questions</p>
          <h1>Questions</h1>
          <p className="lead">
            Answered plainly, including the ones where the answer is that it depends.
          </p>
        </div>
        {unique.map(([q, a]) => (
          <details className="acc-i" key={q}>
            <summary className="acc-t">{q}</summary>
            <div className="acc-b">
              <p className="lead" style={{ maxWidth: "none" }}>{a}</p>
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
