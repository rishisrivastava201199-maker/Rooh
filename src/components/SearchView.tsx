"use client";
import { useMemo, useState } from "react";
import { ProductGrid } from "./ProductCard";
import { FAM_LABEL, OCC_LABEL, TYPE_LABEL, type Product } from "@/lib/products";

/* Eleven products fit in the page, so search runs in the browser
   with no round trip. Move it behind an endpoint when the catalogue
   outgrows a single payload. */
function score(p: Product, q: string): number {
  const hay = [
    p.name, p.short, p.family, p.size,
    ...p.fams.map((f) => FAM_LABEL[f] ?? f),
    ...p.occ.map((o) => OCC_LABEL[o] ?? o),
    TYPE_LABEL[p.type] ?? p.type,
    ...p.notes.top, ...p.notes.heart, ...p.notes.base,
  ]
    .join(" ")
    .toLowerCase();

  let s = 0;
  if (p.name.toLowerCase().includes(q)) s += 60;
  if (hay.includes(q)) s += 20;
  q.split(/\s+/).filter(Boolean).forEach((w) => {
    if (hay.includes(w)) s += 8;
  });
  return s;
}

export function SearchView({ all }: { all: Product[] }) {
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (term.length < 2) return [];
    return all
      .map((p) => ({ p, s: score(p, term) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.p);
  }, [all, term]);

  return (
    <div className="wrap" style={{ paddingBottom: "var(--s9)" }}>
      <div className="phead">
        <h1>Search</h1>
        <label className="sr" htmlFor="searchInput">Search fragrances</label>
        <input
          className="input"
          id="searchInput"
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          placeholder="Try oud, mitti, office, rose…"
          value={q}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
        />
      </div>

      {term.length < 2 ? (
        <p className="hint">Type at least two characters.</p>
      ) : results.length ? (
        <>
          <h2 className="eyebrow" style={{ marginBottom: "var(--s5)" }}>
            {results.length} {results.length === 1 ? "match" : "matches"}
          </h2>
          <ProductGrid items={results} />
        </>
      ) : (
        <div className="emp">
          <p className="eyebrow">No match</p>
          <h2 style={{ fontSize: "var(--t-h3)", fontWeight: 300 }}>
            Nothing is called “{q}”
          </h2>
          <p className="lead" style={{ margin: 0 }}>
            The range is eleven products. Try a family — oud, rose, vetiver — or an occasion.
          </p>
        </div>
      )}
    </div>
  );
}
