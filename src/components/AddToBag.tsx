"use client";
import { useState } from "react";
import { useBag } from "./CartProvider";
import type { Product } from "@/lib/products";

export function AddToBag({ p }: { p: Product }) {
  const { add, setQty, lines } = useBag();
  const [done, setDone] = useState(false);
  const inBag = lines.find((l) => l.slug === p.slug);

  if (p.stock <= 0) {
    return (
      <button className="btn btn-secondary btn-lg" disabled>
        Out of stock
      </button>
    );
  }

  return (
    <div className="row wrapf" style={{ gap: 12 }}>
      {inBag ? (
        <div className="qty" role="group" aria-label="Quantity">
          <button
            onClick={() => setQty(p.slug, inBag.qty - 1)}
            aria-label="Reduce quantity"
            disabled={inBag.qty <= 1}
          >
            −
          </button>
          <span className="tnum" aria-live="polite">{inBag.qty}</span>
          <button
            onClick={() => setQty(p.slug, inBag.qty + 1)}
            aria-label="Increase quantity"
            disabled={inBag.qty >= Math.min(10, p.stock)}
          >
            +
          </button>
        </div>
      ) : null}
      <button
        className="btn btn-primary btn-lg"
        onClick={() => {
          add(p.slug, { name: p.name, size: p.size });
          setDone(true);
          window.setTimeout(() => setDone(false), 2200);
        }}
      >
        {done ? "Added to your bag" : inBag ? "Add another" : "Add to bag"}
      </button>
    </div>
  );
}
