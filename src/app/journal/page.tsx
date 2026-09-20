import type { Metadata } from "next";
import Link from "next/link";
import { JOURNAL } from "@/lib/journal";
import { Crumbs } from "@/components/Crumbs";
import { Figure } from "@/components/Figure";
import { figJournal } from "@/lib/figures";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "The journal",
  description:
    "How fragrance is made, how to judge what you are buying, and the things the trade would rather not put in writing.",
  path: "/journal",
});

export default function JournalPage() {
  return (
    <>
      <Crumbs trail={[["Home", "/"], ["Journal", ""]]} />
      <div className="wrap">
        <div className="phead">
          <p className="eyebrow">{JOURNAL.length} articles</p>
          <h1>The journal</h1>
          <p className="lead">
            How fragrance is made, how to judge what you are buying, and the things the trade
            would rather not put in writing.
          </p>
        </div>
      </div>
      <div className="wrap" style={{ paddingBottom: "var(--s9)" }}>
        <h2 className="sr">All articles</h2>
        <div className="grid g3">
          {JOURNAL.map((j) => (
            <Link className="jcard" href={`/journal/${j.slug}`} key={j.slug}>
              <span className="fig">
                <Figure svg={figJournal(j, `journal:${j.slug}`)} />
              </span>
              <span className="eyebrow">
                {j.cat} · {j.mins} min read
              </span>
              <h3>{j.title}</h3>
              <p className="muted" style={{ fontSize: "var(--t-small)", lineHeight: 1.65 }}>
                {j.excerpt}
              </p>
              <span className="eyebrow" style={{ color: "var(--accent-ink)", marginTop: 2 }}>Read</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
