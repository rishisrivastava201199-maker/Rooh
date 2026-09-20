import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PRODUCTS, bySlug, FAM_LABEL, OCC_LABEL, SEASON_LABEL, INT_LABEL } from "@/lib/products";
import { detailFor, setDetailFor } from "@/lib/detail";
import { Crumbs } from "@/components/Crumbs";
import { JsonLd } from "@/components/JsonLd";
import { Price } from "@/components/Price";
import { AddToBag } from "@/components/AddToBag";
import { Gallery } from "@/components/Gallery";
import { ProductGrid } from "@/components/ProductCard";
import { graphFor, pageMeta, productDescription } from "@/lib/seo";

/* every product page is generated at build time — a real path with
   real HTML, which is the whole reason this project exists */
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) return pageMeta({ title: "Not found", description: "", path: `/product/${slug}` });
  return pageMeta({
    title: p.name,
    description: productDescription(p),
    path: `/product/${p.slug}`,
    type: "website",
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) notFound();

  const d = detailFor(p.slug);
  const sd = setDetailFor(p.slug);
  /* a fragrance has a story and wear notes; a set has a lead and
     a list of what is in the box */
  const intro = d?.story.s ?? sd?.lead ?? null;
  const related = PRODUCTS.filter(
    (x) => x.slug !== p.slug && x.fams.some((f) => p.fams.includes(f)),
  )
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 4);

  const pair = p.type === "set" ? null : bySlug(p.type === "attar" ? "itra-discovery-box" : "discovery-collection");

  return (
    <>
      <JsonLd graph={graphFor(`/product/${p.slug}`)} />
      <Crumbs trail={[["Home", "/"], ["All fragrances", "/shop"], [p.name, ""]]} />

      <div className="wrap">
        <div className="pdp" style={{ paddingBlock: "var(--s5) var(--s8)" }}>
          <Gallery product={p} />

          <div className="pinfo">
            <div>
              <p className="eyebrow" style={{ color: "var(--accent-ink)" }}>{p.family}</p>
              <h1 style={{ marginBlock: "var(--s3)" }}>{p.name}</h1>
              <p className="psub">{p.short}</p>
            </div>

            <div className="row wrapf" style={{ gap: 14 }}>
              <Price price={p.price} mrp={p.mrp} large showOff />
              <span className="hint">Inclusive of all taxes</span>
            </div>

            <div className="row wrapf" style={{ gap: 7 }}>
              {p.occ.slice(0, 3).map((o) => (
                <span className="badge" key={o}>{OCC_LABEL[o] ?? o}</span>
              ))}
              <span className="badge badge-brass">{INT_LABEL[p.intensity]}</span>
            </div>

            <AddToBag p={p} />

            <p className="hint">
              {p.stock > 0 ? "In stock · dispatched within 24 hours" : "Out of stock"} · Free
              shipping over ₹999 · Seven-day returns on unopened items.
            </p>

            <dl className="pyr">
              {[
                ["Size", p.size],
                ["Concentration", p.type === "attar" ? "Attar / itra — alcohol-free fragrance oil" : p.type === "set" ? "Set" : "Eau de Parfum · approx. 18% fragrance oil"],
                ["Longevity", `${p.longev[0]}–${p.longev[1]} hours (our measured range)`],
                ["Sillage", p.sillage],
                ["Family", p.fams.map((f) => FAM_LABEL[f] ?? f).join(", ")],
                ["Season", p.seasons.map((s) => SEASON_LABEL[s] ?? s).join(", ")],
              ].map(([k, v]) => (
                <div className="pyr-row" key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {intro ? (
        <section className="sec" style={{ background: "var(--surface-muted)" }}>
          <div className="wrap" style={{ maxWidth: 760 }}>
            <p className="eyebrow">The fragrance</p>
            <h2 style={{ marginBlock: "var(--s4)" }}>
              {d ? "How it wears" : "What is in the box"}
            </h2>
            <p className="lead">{intro}</p>
            {d?.wear ? <p className="lead" style={{ marginTop: "var(--s5)" }}>{d.wear}</p> : null}
            {sd?.how?.length ? (
              <ol className="dsteps" style={{ marginTop: "var(--s6)" }}>
                {sd.how.map((step) => (
                  <li className="dstep" key={step}>
                    <p className="lead" style={{ margin: 0 }}>{step}</p>
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* the site has no reviews and does not pretend otherwise */}
      <section className="sec">
        <div className="wrap">
          <p className="eyebrow">Reviews</p>
          <h2 style={{ marginBlock: "var(--s4)" }}>No reviews yet</h2>
          <div className="rev-empty">
            <span className="eyebrow" style={{ color: "var(--accent-ink)" }}>Deliberately empty</span>
            <p className="lead" style={{ margin: 0 }}>
              {p.name} has not shipped yet, so nobody has worn it long enough to review it — and we
              are not going to seed the page with invented ones. Verified buyers will rate
              fragrance, packaging, value and longevity here, including the ones who did not get on
              with it.
            </p>
            <p className="hint">Only accounts with a delivered order for this product will be able to post.</p>
          </div>
        </div>
      </section>

      {pair ? (
        <section className="sec">
          <div className="wrap">
            <div className="shead">
              <div className="shead-txt">
                <p className="eyebrow">Before the full bottle</p>
                <h2>Wear it for a day first</h2>
                <p className="lead" style={{ marginTop: "var(--s4)" }}>
                  We have no purchase history to tell you what other people added, so this is not
                  that. It is the set that lets you live with the fragrance for a day before
                  committing to {p.size}.
                </p>
              </div>
              <Link href={`/product/${pair.slug}`} className="btn btn-tertiary">
                {pair.name}
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="sec" style={{ background: "var(--surface-muted)" }}>
          <div className="wrap">
            <div className="shead">
              <div className="shead-txt">
                <p className="eyebrow">Similar fragrances</p>
                <h2>If you like this</h2>
                <p className="lead" style={{ marginTop: "var(--s4)" }}>
                  Chosen because they share materials with {p.name}, not because they cost more.
                </p>
              </div>
              <Link href="/shop" className="btn btn-tertiary">All eleven</Link>
            </div>
            <ProductGrid items={related} />
          </div>
        </section>
      ) : null}
    </>
  );
}
