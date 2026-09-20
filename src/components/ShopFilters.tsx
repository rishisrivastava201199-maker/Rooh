"use client";
/* Filtering, sorting and the result count.

   The URL carries the state, so a filtered view can be shared,
   bookmarked and reopened — which is how the prototype behaved and
   how a shop should behave. */
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductGrid } from "./ProductCard";
import { SORTS } from "@/lib/commerce";
import { FAM_LABEL, OCC_LABEL, SEASON_LABEL, INT_LABEL, TYPE_LABEL, type Product } from "@/lib/products";

type Facet = { key: string; title: string; opts: [value: string, label: string][]; of: (p: Product) => string[] };

const FACETS: Facet[] = [
  { key: "type", title: "Type", opts: Object.entries(TYPE_LABEL), of: (p) => [p.type] },
  { key: "family", title: "Family", opts: Object.entries(FAM_LABEL), of: (p) => p.fams },
  { key: "occ", title: "Occasion", opts: Object.entries(OCC_LABEL), of: (p) => p.occ },
  { key: "season", title: "Season", opts: Object.entries(SEASON_LABEL), of: (p) => p.seasons },
  { key: "int", title: "Intensity", opts: Object.entries(INT_LABEL), of: (p) => [p.intensity] },
];

function sortBy(list: Product[], key: string): Product[] {
  const out = [...list];
  if (key === "price-asc") out.sort((a, b) => a.price - b.price);
  else if (key === "price-desc") out.sort((a, b) => b.price - a.price);
  else if (key === "name") out.sort((a, b) => a.name.localeCompare(b.name));
  else if (key === "longevity") out.sort((a, b) => b.longev[1] - a.longev[1]);
  else out.sort((a, b) => a.rank - b.rank);
  return out;
}

export function ShopFilters({ all }: { all: Product[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);

  const selected = useMemo(() => {
    const m: Record<string, string[]> = {};
    FACETS.forEach((f) => {
      const raw = params.get(f.key);
      m[f.key] = raw ? raw.split(",").filter(Boolean) : [];
    });
    return m;
  }, [params]);

  const sort = params.get("sort") || "featured";

  const matches = (p: Product, skip?: string) =>
    FACETS.every((f) => {
      if (f.key === skip) return true;
      const want = selected[f.key] ?? [];
      if (!want.length) return true;
      return f.of(p).some((v) => want.includes(v));
    });

  const shown = sortBy(all.filter((p) => matches(p)), sort);

  /* a facet's own count is taken with its own selection lifted, so
     ticking a second box in the same group never shows zero */
  const countFor = (f: Facet, value: string) =>
    all.filter((p) => matches(p, f.key) && f.of(p).includes(value)).length;

  const push = (next: Record<string, string[]>, nextSort = sort) => {
    const q = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => {
      if (v.length) q.set(k, v.join(","));
    });
    if (nextSort !== "featured") q.set("sort", nextSort);
    const s = q.toString();
    router.push(s ? `/shop?${s}` : "/shop", { scroll: false });
  };

  const toggle = (key: string, value: string) => {
    const cur = selected[key] ?? [];
    const next = { ...selected, [key]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value] };
    push(next);
  };

  const activeCount = Object.values(selected).reduce((a, v) => a + v.length, 0);

  return (
    <>
      <div className="toolbar">
        <div className="wrap">
          <div className="toolbar-row">
            <button className="tool-btn" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M3 6h18M6 12h12M10 18h4" />
              </svg>
              Filter
              {activeCount ? <span className="tool-count">{activeCount}</span> : null}
            </button>

            <h2 className="eyebrow tcount" id="resCount">
              {shown.length} {shown.length === 1 ? "fragrance" : "fragrances"}
            </h2>

            <span className="sortwrap">
              <label className="sr" htmlFor="sortSel">Sort</label>
              <select
                className="sortsel"
                id="sortSel"
                value={sort}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => push(selected, e.target.value)}
              >
                {Object.entries(SORTS).map(([k, label]) => (
                  <option key={k} value={k}>{label}</option>
                ))}
              </select>
            </span>
          </div>
        </div>
      </div>

      {open ? (
        <div className="fwrap" id="fwrap">
          <div className="fwrap-in">
            <div className="wrap">
              <div className="fgrid">
                {FACETS.map((f) => (
                  <fieldset className="fgroup" key={f.key}>
                    <legend>{f.title}</legend>
                    {f.opts.map(([value, label]) => {
                      const n = countFor(f, value);
                      const on = (selected[f.key] ?? []).includes(value);
                      return (
                        <label className="check" key={value}>
                          <input
                            type="checkbox"
                            checked={on}
                            disabled={n === 0 && !on}
                            onChange={() => toggle(f.key, value)}
                          />
                          <span>{label}</span>
                          <span className="n">{n}</span>
                        </label>
                      );
                    })}
                  </fieldset>
                ))}
              </div>
              <p className="fnote">
                <strong style={{ color: "var(--ink)" }}>On gender.</strong> All eleven compositions
                are made unisex, so a men/women filter would return the same eleven either way. We
                have left it out rather than ship a control that does nothing.
              </p>
            </div>
          </div>
          <div className="ffoot">
            <button className="btn btn-secondary" onClick={() => push({})}>Clear all</button>
            <button className="btn btn-primary" onClick={() => setOpen(false)}>Show results</button>
          </div>
        </div>
      ) : null}

      <div className="wrap" style={{ paddingBottom: "var(--s9)" }}>
        {shown.length ? (
          <ProductGrid items={shown} />
        ) : (
          <div className="emp">
            <p className="eyebrow">Nothing matched</p>
            <h2 style={{ fontSize: "var(--t-h3)" }}>No fragrance fits all of that at once</h2>
            <p className="lead" style={{ margin: 0 }}>
              With eleven products, a narrow combination can come back empty. Lift one filter and
              try again.
            </p>
            <button className="btn btn-primary" onClick={() => push({})}>Clear the filters</button>
          </div>
        )}
      </div>
    </>
  );
}
