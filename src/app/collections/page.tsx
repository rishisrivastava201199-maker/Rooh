import type { Metadata } from "next";
import Link from "next/link";
import { COLLECTIONS, collProducts } from "@/lib/collections";
import { Crumbs } from "@/components/Crumbs";
import { Figure } from "@/components/Figure";
import { figBand } from "@/lib/figures";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Collections",
  description:
    "Browse ROOH by fragrance family, by occasion, and by the edits we put together — itra, gifting and where to start.",
  path: "/collections",
});

const GROUPS: [kind: "family" | "occasion" | "edit", eyebrow: string, title: string][] = [
  ["family", "By family", "What it is made of"],
  ["occasion", "By occasion", "When you would wear it"],
  ["edit", "Edits", "Put together by hand"],
];

export default function CollectionsPage() {
  return (
    <>
      <Crumbs trail={[["Home", "/"], ["Collections", ""]]} />
      <div className="wrap">
        <div className="phead">
          <p className="eyebrow">{COLLECTIONS.length} ways in</p>
          <h1>Collections</h1>
          <p className="lead">
            Grouped by the material a fragrance is built on and by when you would actually wear it
            — not by gender.
          </p>
        </div>
      </div>

      {GROUPS.map(([kind, eyebrow, title]) => {
        const items = COLLECTIONS.filter((c) => c.kind === kind);
        if (!items.length) return null;
        return (
          <section className="sec" key={kind}>
            <div className="wrap">
              <div className="shead">
                <div className="shead-txt">
                  <p className="eyebrow">{eyebrow}</p>
                  <h2>{title}</h2>
                </div>
              </div>
              <div className="grid g3">
                {items.map((c, i) => (
                  <Link key={c.slug} href={`/collections/${c.slug}`} className="ccard">
                    <Figure svg={figBand("#6B4527", "#241610", i, `coll:${c.slug}`)} className="fig" />
                    <span className="ccard-n badge badge-quiet" style={{ color: "#F7F3EC", borderColor: "rgba(247,243,236,.35)" }}>
                      {collProducts(c).length}
                    </span>
                    <span className="ccard-body">
                      <h3>{c.title}</h3>
                      <p>{c.tag}</p>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
