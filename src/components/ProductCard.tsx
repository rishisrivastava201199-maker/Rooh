"use client";
import Link from "next/link";
import { useBag } from "./CartProvider";
import { Figure } from "./Figure";
import { Price } from "./Price";
import { figBottle } from "@/lib/figures";
import type { Product } from "@/lib/products";

export function ProductCard({ p }: { p: Product }) {
  const { add } = useBag();
  const snapshot = { name: p.name, size: p.size };

  return (
    <article className="pcard">
      <div className="pcard-media">
        <Figure svg={figBottle(p, false, `card:${p.slug}`)} />
        <Link
          href={`/product/${p.slug}`}
          aria-label={p.name}
          style={{ position: "absolute", inset: 0, zIndex: 1 }}
        />
        {p.badge ? (
          <span className={`pcard-badge badge ${p.badge === "Signature" ? "badge-solid" : "badge-brass"}`}>
            {p.badge}
          </span>
        ) : null}
        <button className="pcard-add" onClick={() => add(p.slug, snapshot)}>
          Add to bag
        </button>
      </div>

      <div className="pcard-body">
        <p className="pcard-family">{p.family}</p>
        <h3 className="pcard-name">
          <Link href={`/product/${p.slug}`}>{p.name}</Link>
        </h3>
        <p className="pcard-desc">{p.short}</p>
        <div className="pcard-foot">
          <Price price={p.price} mrp={p.mrp} />
          <span className="pcard-size">{p.size}</span>
        </div>
        <button className="pcard-mobile-add" onClick={() => add(p.slug, snapshot)}>
          Add to bag
        </button>
      </div>
    </article>
  );
}

export function ProductGrid({ items }: { items: Product[] }) {
  return (
    <div className="grid g4">
      {items.map((p) => (
        <ProductCard key={p.slug} p={p} />
      ))}
    </div>
  );
}
