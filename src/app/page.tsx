import Link from "next/link";
import { PRODUCTS, bySlug } from "@/lib/products";
import { Figure } from "@/components/Figure";
import { ProductGrid } from "@/components/ProductCard";
import { JsonLd } from "@/components/JsonLd";
import { figHero, figHeroMobile, figFamily, FAMILIES } from "@/lib/figures";
import { graphFor } from "@/lib/seo";

const START_HERE = [
  "oud-and-woods",
  "discovery-collection",
  "rose-and-saffron",
  "mitti-itra",
  "royal-musk",
  "indian-vetiver",
];

export default function Home() {
  const shelf = START_HERE.map(bySlug).filter((p) => p !== undefined);

  return (
    <>
      <JsonLd graph={graphFor("/")} />

      <section className="hero">
        <Figure svg={figHero("hero")} className="hero-fig d" />
        <Figure svg={figHeroMobile("hero-m")} className="hero-fig m" />
        <div className="wrap">
          <div className="hero-in">
            <p className="eyebrow" style={{ color: "var(--on-dark-muted)" }}>
              Eau de parfum &amp; traditional itra
            </p>
            <h1>
              The Art
              <br />
              of Fragrance
            </h1>
            <p className="hero-sub">
              Indian fragrance heritage, interpreted for the modern wearer. Eleven compositions,
              made in India, priced at what they cost to make well.
            </p>
            <div className="hero-cta">
              <Link href="/shop" className="btn btn-on-dark btn-lg">Explore collection</Link>
              <Link href="/about" className="btn btn-ghost-dark btn-lg">Discover our story</Link>
            </div>
          </div>
        </div>
        <div className="hero-foot">
          <div className="wrap">
            <ul>
              <li>Composed at 18% fragrance oil</li>
              <li>Made in India, sold at one honest price</li>
              <li>Dispatched within 24 hours</li>
              <li>Seven-day returns on unopened items</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Nothing has shipped, so there is no ranking to show. The
          shelf says what it actually is. */}
      <section className="sec" style={{ background: "var(--surface-muted)" }}>
        <div className="wrap">
          <div className="shead">
            <div className="shead-txt">
              <p className="eyebrow">Where to start</p>
              <h2>If you are new to the range</h2>
              <p className="lead" style={{ marginTop: "var(--s4)" }}>
                Nothing has shipped yet, so there is no sales ranking to show you. These six are
                what we would put in your hands first, chosen by what they are built from. Once
                there are orders this becomes a real ranking, and we will say so here.
              </p>
            </div>
            <Link href="/collections/start-here" className="btn btn-tertiary">See all six</Link>
          </div>
          <ProductGrid items={shelf} />
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="shead">
            <div className="shead-txt">
              <p className="eyebrow">By family</p>
              <h2>What it is made of</h2>
              <p className="lead" style={{ marginTop: "var(--s4)" }}>
                Grouped by the material a fragrance is built on and by when you would actually
                wear it — not by gender.
              </p>
            </div>
            <Link href="/collections" className="btn btn-tertiary">All collections</Link>
          </div>
          <div className="grid g4">
            {FAMILIES.map((f, i) => (
              <Link key={f.slug} href={`/collections/${f.slug}`} className="ccard">
                <Figure svg={figFamily(f, i, `fam:${f.slug}`)} className="fig" />
                <span className="ccard-body">
                  <h3>{f.name}</h3>
                  <p>{f.desc}</p>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec on-dark">
        <div className="wrap">
          <div className="shead">
            <div className="shead-txt">
              <p className="eyebrow">Not sure yet</p>
              <h2>Wear it for a day before you commit</h2>
              <p className="lead" style={{ marginTop: "var(--s4)" }}>
                Five signature fragrances, 2 ml each, for ₹299 — with ₹150 back on your first full
                size. Nobody should spend ₹899 on a scent they have not worn.
              </p>
            </div>
            <Link href="/discovery" className="btn btn-on-dark btn-lg">The Discovery Collection</Link>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="shead">
            <div className="shead-txt">
              <p className="eyebrow">The full range</p>
              <h2>Eleven products, and that is all</h2>
              <p className="lead" style={{ marginTop: "var(--s4)" }}>
                Five eaux de parfum, three traditional itras, a discovery set and two gift sets.
                Nothing is listed that we would not wear ourselves.
              </p>
            </div>
            <Link href="/shop" className="btn btn-tertiary">See everything</Link>
          </div>
          <ProductGrid items={PRODUCTS.slice(0, 8)} />
        </div>
      </section>
    </>
  );
}
