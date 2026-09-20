"use client";
/* Desktop shows a main image with a thumbnail rail; the phone gets
   a snapping track you swipe, with dots and an "n of 8" counter.

   Both are built from the same slot list, so the two can never
   drift apart — that was a real bug the audit caught. Every copy of
   a slot is re-stamped with its own ids, because the same SVG
   string appearing twice on a page means url(#…) has two possible
   referents. */
import { useRef, useState } from "react";
import { Figure } from "./Figure";
import {
  figBottle, figCarton, figMacro, figMaterial, figLifestyle,
  figNotesCard, figScale, figBand,
} from "@/lib/figures";
import type { Product } from "@/lib/products";

/* `where` keeps the three render sites apart. The same slot drawn
   in the track, the main image and the rail must not share gradient
   ids, or url(#…) resolves to whichever copy came first. */
function slots(p: Product, where: string): [label: string, svg: string][] {
  const set = p.type === "set";
  const at = (n: string) => `${p.slug}:${where}:${n}`;
  const base: [string, string][] = [
    ["Hero", figBottle(p, false, at("hero"))],
    [set ? "In the box" : "Bottle and carton", figCarton(p, at("carton"))],
    [set ? "Detail" : "Collar detail", figMacro(p, at("macro"))],
    ["The material", figMaterial(p, at("material"))],
    ["Lifestyle", figLifestyle(p, at("life"))],
  ];
  if (!set) base.push(["Fragrance notes", figNotesCard(p, at("notes"))]);
  base.push(["Scale", figScale(p, at("scale"))]);
  base.push(["Editorial", figBand(p.pal.top, p.pal.bot, 0, at("band"))]);
  return base;
}

export function Gallery({ product }: { product: Product }) {
  const track$ = slots(product, "track");
  const main$ = slots(product, "main");
  const thumb$ = slots(product, "thumb");
  const all = track$;
  const [i, setI] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const current = main$[i] ?? main$[0]!;

  const onScroll = () => {
    const t = track.current;
    if (!t || !t.clientWidth) return;
    const n = Math.round(t.scrollLeft / t.clientWidth);
    if (n !== i) setI(Math.max(0, Math.min(all.length - 1, n)));
  };

  const goto = (n: number) => {
    setI(n);
    const t = track.current;
    if (t) t.scrollTo({ left: n * t.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="gal">
      {/* phone: a track you swipe */}
      <div
        className="gal-track"
        id="galTrack"
        ref={track}
        onScroll={onScroll}
        tabIndex={0}
        role="group"
        aria-label="Product images, swipe to browse"
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
          e.preventDefault();
          goto(Math.max(0, Math.min(all.length - 1, i + (e.key === "ArrowRight" ? 1 : -1))));
        }}
      >
        {track$.map(([label, svg], n) => (
          <div
            className="gal-slide"
            key={label}
            role="group"
            aria-roledescription="slide"
            aria-label={`${label}, ${n + 1} of ${all.length}`}
          >
            <Figure svg={svg} />
          </div>
        ))}
      </div>
      <span className="gal-count" id="galCount">{i + 1} / {all.length}</span>
      <div className="gal-dots" id="galDots">
        {all.map(([label], n) => (
          <button
            key={label}
            type="button"
            className="gal-dot"
            aria-current={n === i}
            aria-label={`Go to ${label}`}
            onClick={() => goto(n)}
          />
        ))}
      </div>

      {/* desktop: a main image and a rail */}
      <div className="gal-main" id="galMain">
        <Figure svg={current[1]} />
      </div>
      <div className="gal-thumbs" role="tablist" aria-label="Product images">
        {thumb$.map(([label, svg], n) => (
          <button
            key={label}
            role="tab"
            aria-current={n === i}
            aria-label={label}
            onClick={() => setI(n)}
          >
            <Figure svg={svg} />
          </button>
        ))}
      </div>
      <p className="gal-cap" id="galCap">
        {current[0]} — generated placeholder in photography slot {String(i + 1).padStart(2, "0")}
      </p>
    </div>
  );
}
