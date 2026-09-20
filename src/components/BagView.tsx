"use client";
/* Every figure on this page comes back from /api/cart/price. The
   browser does not add anything up. */
import Link from "next/link";
import { useBag } from "./CartProvider";
import { inr } from "@/lib/format";

export function BagView() {
  const { lines, priced, pricing, setQty, remove, coupon, setCoupon } = useBag();

  if (!lines.length) {
    return (
      <div className="wrap" style={{ paddingBlock: "var(--s6) var(--s9)" }}>
        <div className="emp" style={{ maxWidth: 620 }}>
          <p className="eyebrow">Your bag is empty</p>
          <h1 style={{ fontSize: "var(--t-h3)" }}>Nothing in here yet</h1>
          <p className="lead" style={{ margin: 0 }}>
            Not sure where to start? The Discovery Collection puts five fragrances in your hands
            for ₹299, with ₹150 back on your first full size.
          </p>
          <div className="row wrapf" style={{ gap: 12, marginTop: "var(--s3)" }}>
            <Link href="/discovery" className="btn btn-primary">Explore the Discovery Set</Link>
            <Link href="/shop" className="btn btn-secondary">All fragrances</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap" style={{ paddingBlock: "var(--s5) var(--s9)" }}>
      <div className="phead">
        <h1>Your bag</h1>
        <p className="lead">
          {priced ? `${priced.count} ${priced.count === 1 ? "item" : "items"}. ` : ""}
          Nothing is reserved until the order is placed.
        </p>
      </div>

      {priced?.issues.length ? (
        <div className="panel pad" style={{ marginBottom: "var(--s5)" }}>
          {priced.issues.map((m) => (
            <p className="hint" key={m}>{m}</p>
          ))}
        </div>
      ) : null}

      {priced && !priced.freeShip && priced.gap > 0 ? (
        <div className="panel pad" style={{ marginBottom: "var(--s5)" }}>
          <p className="hint">Add {inr(priced.gap)} more for complimentary shipping.</p>
        </div>
      ) : null}

      <div className="two">
        <div>
          {(priced?.lines ?? lines.map((l) => ({
            slug: l.slug, name: l.snapshot?.name ?? l.slug, size: l.snapshot?.size ?? "",
            family: "", qty: l.qty, unit: 0, mrp: 0, line: 0, lineMrp: 0, stock: 0,
            type: "edp" as const,
          }))).map((l) => (
            <div className="line" key={l.slug}>
              <div className="line-b">
                <div className="row between wrapf" style={{ gap: 12 }}>
                  <div>
                    <h2 style={{ fontFamily: "var(--display)", fontSize: "1.25rem" }}>
                      <Link href={`/product/${l.slug}`}>{l.name}</Link>
                    </h2>
                    <p className="hint">{[l.family, l.size].filter(Boolean).join(" · ")}</p>
                  </div>
                  {l.line ? (
                    <span className="price">
                      <span className="now">{inr(l.line)}</span>
                      {l.lineMrp > l.line ? <span className="was">{inr(l.lineMrp)}</span> : null}
                    </span>
                  ) : null}
                </div>

                <div className="row wrapf" style={{ gap: "var(--s4)", marginTop: "var(--s4)" }}>
                  <div className="qty" role="group" aria-label={`Quantity for ${l.name}`}>
                    <button onClick={() => setQty(l.slug, l.qty - 1)} aria-label="Reduce quantity" disabled={l.qty <= 1}>−</button>
                    <span className="tnum">{l.qty}</span>
                    <button onClick={() => setQty(l.slug, l.qty + 1)} aria-label="Increase quantity">+</button>
                  </div>
                  <button className="btn btn-tertiary" onClick={() => remove(l.slug)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="summ">
          <h2 className="eyebrow" style={{ marginBottom: "var(--s4)" }}>Summary</h2>

          <label className="sr" htmlFor="cpn">Coupon code</label>
          <div className="row" style={{ gap: 10, marginBottom: "var(--s5)" }}>
            <input
              className="input"
              id="cpn"
              placeholder="Coupon code"
              defaultValue={coupon ?? ""}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => setCoupon(e.target.value.trim() || null)}
              style={{ flex: 1 }}
            />
          </div>
          {priced?.couponError ? <p className="hint">{priced.couponError}</p> : null}
          {priced?.coupon ? <p className="hint">{priced.coupon.code} — {priced.coupon.desc}</p> : null}

          <dl>
            <div className="summ-row"><dt>Subtotal</dt><dd className="tnum">{priced ? inr(priced.subtotal) : "—"}</dd></div>
            {priced && priced.savings > 0 ? (
              <div className="summ-row"><dt>You save</dt><dd className="tnum">−{inr(priced.savings)}</dd></div>
            ) : null}
            {priced && priced.discount > 0 ? (
              <div className="summ-row"><dt>Coupon</dt><dd className="tnum">−{inr(priced.discount)}</dd></div>
            ) : null}
            <div className="summ-row">
              <dt>Shipping</dt>
              <dd className="tnum">{priced ? (priced.shipping === 0 ? "Free" : inr(priced.shipping)) : "—"}</dd>
            </div>
            <div className="summ-row tot"><dt>Total</dt><dd className="tnum">{priced ? inr(priced.total) : "—"}</dd></div>
          </dl>

          <p className="hint" style={{ marginBottom: "var(--s4)" }}>
            Inclusive of GST. Calculated on the server from the catalogue.
          </p>

          <Link
            href="/checkout"
            className="btn btn-primary btn-block btn-lg"
            aria-disabled={pricing || !priced}
          >
            Proceed to checkout
          </Link>
          <p className="hint" style={{ marginTop: "var(--s4)" }}>
            Secure payment · Seven-day returns · COD available
          </p>
        </aside>
      </div>
    </div>
  );
}
