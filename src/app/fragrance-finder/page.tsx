import type { Metadata } from "next";
import { Crumbs } from "@/components/Crumbs";
import { Finder } from "@/components/Finder";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Find your scent",
  description:
    "Answer a few questions about what you like and when you will wear it, and we rank all eleven ROOH fragrances against your answers, with the reasons shown.",
  path: "/fragrance-finder",
});

export default function FinderPage() {
  return (
    <>
      <Crumbs trail={[["Home", "/"], ["Find your scent", ""]]} />
      <div className="wrap">
        <div className="phead">
          <p className="eyebrow">Six questions, or fewer</p>
          <h1>Find your scent</h1>
          <p className="lead">
            Materials, occasion, weather and intensity — not a personality test, and not a promise
            that you will like them. Which is exactly why the discovery set exists.
          </p>
        </div>
      </div>
      <Finder />
    </>
  );
}
