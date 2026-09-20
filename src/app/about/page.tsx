import type { Metadata } from "next";
import Link from "next/link";
import { Crumbs } from "@/components/Crumbs";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Our story",
  description:
    "Why ROOH exists, how the fragrances are composed, and what we will and will not claim about them.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Crumbs trail={[["Home", "/"], ["Our story", ""]]} />
      <div className="wrap" style={{ maxWidth: 760, paddingBottom: "var(--s9)" }}>
        <div className="phead">
          <p className="eyebrow">Our story</p>
          <h1>Born in India. Created for the world.</h1>
          <p className="lead">
            One straightforward idea: Indian fragrance, composed properly, priced at what it costs
            to make well, and described in language you can check.
          </p>
        </div>

        <h2 style={{ marginBlock: "var(--s6) var(--s4)" }}>What we will not print</h2>
        <p className="lead" style={{ maxWidth: "none" }}>
          No guaranteed 24-hour longevity, because longevity depends on skin, weather and
          application, and anyone promising a number is guessing. We publish the range we measured.
        </p>
        <p className="lead" style={{ maxWidth: "none" }}>
          No “100% natural”, no “chemical-free”, no “IFRA certified” without the documents to
          support it for that specific product. No countdown timers, no invented scarcity, and no
          reviews until somebody has actually worn the thing.
        </p>
        <p className="lead" style={{ maxWidth: "none" }}>
          Most modern perfumery at this price is synthetic, including ours. There is no ethical or
          affordable natural alternative at this scale, and we would not pretend otherwise.
        </p>

        <h2 style={{ marginBlock: "var(--s6) var(--s4)" }}>How it is made</h2>
        <p className="lead" style={{ maxWidth: "none" }}>
          The eaux de parfum are composed at roughly 18% fragrance oil rather than the 10–12% that
          is common at this price. It costs more per bottle. It is also the reason we can write
          this paragraph.
        </p>

        <div className="row wrapf" style={{ gap: 12, marginTop: "var(--s7)" }}>
          <Link href="/shop" className="btn btn-primary btn-lg">See the range</Link>
          <Link href="/journal" className="btn btn-secondary btn-lg">Read the journal</Link>
        </div>
      </div>
    </>
  );
}
