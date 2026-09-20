"use client";
/* Saved locally. It follows the browser, not the account, until you
   wire it to the server — which is honest and needs no session. */
import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductGrid } from "./ProductCard";
import { PRODUCTS } from "@/lib/products";

const KEY = "rooh.wish.v1";

export function Wishlist() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      setSlugs(raw ? (JSON.parse(raw) as string[]) : []);
    } catch {
      setSlugs([]);
    }
  }, []);

  const items = PRODUCTS.filter((p) => slugs.includes(p.slug));

  return (
    <div className="wrap" style={{ paddingBottom: "var(--s9)" }}>
      <div className="phead">
        <h1>Wishlist</h1>
        <p className="lead">
          Saved in this browser. Sign in and it can follow your account instead.
        </p>
      </div>
      {items.length ? (
        <ProductGrid items={items} />
      ) : (
        <div className="emp">
          <p className="eyebrow">Nothing saved</p>
          <h2 style={{ fontSize: "var(--t-h3)" }}>Your wishlist is empty</h2>
          <Link href="/shop" className="btn btn-primary">Browse fragrances</Link>
        </div>
      )}
    </div>
  );
}
