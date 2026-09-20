import type { Metadata } from "next";
import Link from "next/link";
import { bySlug } from "@/lib/products";
import { setDetailFor } from "@/lib/detail";
import { Crumbs } from "@/components/Crumbs";
import { AddToBag } from "@/components/AddToBag";
import { Price } from "@/components/Price";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "The Discovery Collection",
  description:
    "Five signature fragrances, 2 ml each, for ₹299 — with ₹150 back on your first full size. The honest way to buy a scent you have not worn.",
  path: "/discovery",
});

export default function DiscoveryPage() {
  const p = bySlug("discovery-collection");
  const d = setDetailFor("discovery-collection");
  if (!p) return null;

  return (
    <>
      <Crumbs trail={[["Home", "/"], ["Discovery", ""]]} />
      <div className="wrap" style={{ maxWidth: 820, paddingBottom: "var(--s9)" }}>
        <div className="phead">
          <p className="eyebrow">Start here</p>
          <h1>Wear it for a day before you commit</h1>
          <p className="lead">{d?.lead}</p>
        </div>

        <div className="row wrapf" style={{ gap: "var(--s5)", alignItems: "center" }}>
          <Price price={p.price} mrp={p.mrp} large showOff />
          <AddToBag p={p} />
        </div>

        {d?.how?.length ? (
          <ol className="dsteps" style={{ marginTop: "var(--s7)" }}>
            {d.how.map((step, i) => (
              <li className="dstep" key={i}>
                <span className="n">{String(i + 1).padStart(2, "0")}</span>
                <p className="lead" style={{ margin: 0, maxWidth: "none" }}>{step}</p>
              </li>
            ))}
          </ol>
        ) : null}

        <p className="hint" style={{ marginTop: "var(--s6)" }}>
          <Link href={`/product/${p.slug}`} className="btn btn-tertiary">See the full product page</Link>
        </p>
      </div>
    </>
  );
}
