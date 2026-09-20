"use client";
/* Three steps: contact, address, payment. Every total shown comes
   back from the server, and the order is created by the server from
   slugs and quantities — this form never sends a price. */
import { useState } from "react";
import Link from "next/link";
import { useBag } from "./CartProvider";
import { inr } from "@/lib/format";
import { COMMERCE } from "@/lib/commerce";

const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Tamil Nadu",
  "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

interface Placed {
  orderId: string;
  status: string;
  total: number;
  payment?: { provider: string; orderId: string; amount: number; keyId: string };
}

export function CheckoutView() {
  const { lines, priced, coupon, ship, pay, setShip, setPay, clear } = useBag();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [news, setNews] = useState(false); /* consent is given, never assumed */
  const [addr, setAddr] = useState({
    name: "", phone: "", line1: "", line2: "", landmark: "",
    city: "", state: "", pin: "", country: "India", label: "Home",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Placed | null>(null);

  const set = (k: keyof typeof addr) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddr((a) => ({ ...a, [k]: e.target.value }));

  if (!lines.length && !placed) {
    return (
      <div className="wrap" style={{ paddingBlock: "var(--s8) var(--s9)" }}>
        <div className="emp" style={{ maxWidth: 620 }}>
          <p className="eyebrow">Nothing to check out</p>
          <h1 style={{ fontSize: "var(--t-h3)" }}>Your bag is empty</h1>
          <Link href="/shop" className="btn btn-primary">Browse fragrances</Link>
        </div>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="wrap" style={{ paddingBlock: "var(--s8) var(--s9)", maxWidth: 620 }}>
        <p className="eyebrow">Order {placed.orderId}</p>
        <h1 style={{ fontSize: "var(--t-h2)", marginBlock: "var(--s4)" }}>
          {placed.status === "pending_payment" ? "Almost there" : "Thank you"}
        </h1>
        {placed.status === "pending_payment" ? (
          <p className="lead">
            The order is created but not paid. Payment happens in the provider&rsquo;s checkout,
            and the order is only confirmed once the signature verifies on our side. Nothing here
            pretends a payment succeeded.
          </p>
        ) : (
          <p className="lead">
            Your order is confirmed. A confirmation goes to {email} — or to the server log, if
            email is not configured on this machine.
          </p>
        )}
        <p className="hint" style={{ marginTop: "var(--s5)" }}>Total {inr(placed.total)}</p>
        <Link href="/shop" className="btn btn-secondary btn-lg" style={{ marginTop: "var(--s6)" }}>
          Keep looking
        </Link>
      </div>
    );
  }

  async function place() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        /* slugs and quantities only — no prices leave the browser */
        body: JSON.stringify({
          email,
          lines: lines.map((l) => ({ slug: l.slug, qty: l.qty })),
          coupon,
          ship,
          pay,
          address: addr,
        }),
      });
      const data = (await res.json()) as Placed & { error?: string };
      if (!res.ok) {
        setError(data.error ?? "That did not go through.");
        return;
      }
      setPlaced(data);
      clear();
    } catch {
      setError("We could not reach the shop. Nothing was charged.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="wrap" style={{ paddingBlock: "var(--s5) var(--s9)" }}>
      <div className="row between wrapf" style={{ gap: 12 }}>
        <h1>Checkout</h1>
        <p className="hint">Step {step} of 3 · secure</p>
      </div>

      <div className="steps" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <i key={n} className={n <= step ? "on" : ""} />
        ))}
      </div>

      <div className="two" style={{ marginTop: "var(--s6)" }}>
        <div>
          {step === 1 ? (
            <div className="frm">
              <div className="field">
                <label className="label" htmlFor="ckEmail">Email address</label>
                <input
                  className="input" id="ckEmail" type="email" inputMode="email"
                  autoComplete="email" placeholder="you@example.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />
                <p className="hint">Your confirmation and tracking updates go here.</p>
              </div>
              <label className="check">
                <input
                  type="checkbox"
                  checked={news}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNews(e.target.checked)}
                />
                <span>Send me occasional letters about new fragrances. Order emails come either way.</span>
              </label>
              <button
                className="btn btn-primary btn-lg"
                style={{ justifySelf: "start" }}
                disabled={!/^\S+@\S+\.\S+$/.test(email)}
                onClick={() => setStep(2)}
              >
                Continue to address
              </button>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="frm">
              {[
                ["name", "Full name", "name", "text"],
                ["phone", "Mobile number", "tel", "tel"],
                ["line1", "Flat, house no., building", "address-line1", "text"],
                ["line2", "Area, street, sector", "address-line2", "text"],
                ["landmark", "Landmark", "off", "text"],
              ].map(([k, label, ac, type]) => (
                <div className="field" key={k}>
                  <label className="label" htmlFor={`ad_${k}`}>{label}</label>
                  <input
                    className="input"
                    id={`ad_${k}`}
                    type={type}
                    inputMode={k === "phone" ? "numeric" : undefined}
                    maxLength={k === "phone" ? 10 : undefined}
                    autoComplete={ac}
                    value={addr[k as keyof typeof addr]}
                    onChange={set(k as keyof typeof addr)}
                  />
                </div>
              ))}
              <div className="frm-2">
                <div className="field">
                  <label className="label" htmlFor="ad_pin">PIN code</label>
                  <input
                    className="input" id="ad_pin" inputMode="numeric" maxLength={6}
                    autoComplete="postal-code" value={addr.pin} onChange={set("pin")}
                  />
                </div>
                <div className="field">
                  <label className="label" htmlFor="ad_city">City</label>
                  <input
                    className="input" id="ad_city" autoComplete="address-level2"
                    value={addr.city} onChange={set("city")}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="ad_state">State</label>
                <select
                  className="input" id="ad_state" value={addr.state}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setAddr((a) => ({ ...a, state: e.target.value }))
                  }
                >
                  <option value="">Choose a state</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="row wrapf" style={{ gap: 12 }}>
                <button className="btn btn-quiet" onClick={() => setStep(1)}>Back</button>
                <button
                  className="btn btn-primary btn-lg"
                  disabled={
                    addr.name.trim().length < 2 ||
                    !/^\d{10}$/.test(addr.phone) ||
                    addr.line1.trim().length < 3 ||
                    !/^\d{6}$/.test(addr.pin) ||
                    !addr.city.trim() ||
                    !addr.state
                  }
                  onClick={() => setStep(3)}
                >
                  Continue to payment
                </button>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="frm">
              <fieldset className="fgroup">
                <legend>Delivery speed</legend>
                {([["standard", `Standard — ${priced?.freeShip ? "free" : inr(COMMERCE.shipping)}`],
                   ["express", `Express — ${inr(COMMERCE.express)}`]] as const).map(([v, label]) => (
                  <label className="check" key={v}>
                    <input type="radio" name="ship" checked={ship === v} onChange={() => setShip(v)} />
                    <span>{label}</span>
                  </label>
                ))}
              </fieldset>

              <fieldset className="fgroup">
                <legend>Payment</legend>
                <label className="check">
                  <input type="radio" name="pay" checked={pay === "online"} onChange={() => setPay("online")} />
                  <span>UPI, card, netbanking or wallet</span>
                </label>
                <label className="check">
                  <input
                    type="radio" name="pay" checked={pay === "cod"}
                    disabled={priced ? !priced.codEligible : false}
                    onChange={() => setPay("cod")}
                  />
                  <span>
                    Cash on delivery{priced && !priced.codEligible
                      ? ` — not available over ${inr(COMMERCE.codMax)}`
                      : ` — ${inr(COMMERCE.codFee)} fee`}
                  </span>
                </label>
              </fieldset>

              {error ? <p className="bad-msg">{error}</p> : null}

              <div className="row wrapf" style={{ gap: 12 }}>
                <button className="btn btn-quiet" onClick={() => setStep(2)}>Back</button>
                <button className="btn btn-primary btn-lg" disabled={busy} onClick={() => void place()}>
                  {busy ? "Placing the order…" : `Place order · ${priced ? inr(priced.total) : ""}`}
                </button>
              </div>
              <p className="hint">
                The total is recalculated on the server from the catalogue before the order is
                written. Nothing this page sends decides what you pay.
              </p>
            </div>
          ) : null}
        </div>

        <aside className="summ">
          <h2 className="eyebrow" style={{ marginBottom: "var(--s4)" }}>Your order</h2>
          <dl>
            <div className="summ-row"><dt>Subtotal</dt><dd className="tnum">{priced ? inr(priced.subtotal) : "—"}</dd></div>
            {priced && priced.discount > 0 ? (
              <div className="summ-row"><dt>Coupon</dt><dd className="tnum">−{inr(priced.discount)}</dd></div>
            ) : null}
            <div className="summ-row">
              <dt>Shipping</dt>
              <dd className="tnum">{priced ? (priced.shipping === 0 ? "Free" : inr(priced.shipping)) : "—"}</dd>
            </div>
            {priced && priced.codFee > 0 ? (
              <div className="summ-row"><dt>COD fee</dt><dd className="tnum">{inr(priced.codFee)}</dd></div>
            ) : null}
            <div className="summ-row tot"><dt>Total</dt><dd className="tnum">{priced ? inr(priced.total) : "—"}</dd></div>
          </dl>
          {priced ? (
            <p className="hint" style={{ marginTop: "var(--s4)" }}>
              Includes {inr(priced.gst)} GST.
            </p>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
