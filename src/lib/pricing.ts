/* ══════════════════════════════════════════════════════════════
   PRICING — THE SERVER IS THE ONLY AUTHORITY

   The browser sends slugs, quantities, a coupon code, a shipping
   speed and a payment method. It sends no prices, no discounts, no
   shipping cost and no total, and nothing it sends about money is
   read. Every figure below is recomputed from the catalogue before
   an order is written.

   A bag line carries a name and a price in the browser purely so
   the bag can render without a round trip. That copy is never
   trusted: priceCart ignores it entirely.

   This mirrors the prototype's priceCart exactly — same coupon
   rules, same free-shipping threshold, same COD ceiling — so the
   numbers a customer saw in the prototype are the numbers here.
   ══════════════════════════════════════════════════════════════ */
import { COMMERCE } from "./commerce";
import { bySlug, type Product, type ProductType } from "./products";
import { clamp, inr } from "./format";

export const MAX_QTY_PER_LINE = 10;

export type ShipSpeed = "standard" | "express";
export type PayMethod = "online" | "cod";

/** Everything the browser is allowed to send about a line. */
export interface CartLineInput {
  slug: string;
  qty: number;
}

export interface PriceOptions {
  coupon?: string | null;
  ship?: ShipSpeed;
  pay?: PayMethod;
}

export interface PricedLine {
  slug: string;
  name: string;
  family: string;
  size: string;
  type: ProductType;
  qty: number;
  unit: number;
  mrp: number;
  line: number;
  lineMrp: number;
  stock: number;
}

export interface Coupon {
  kind: "percent" | "fixed";
  value: number;
  min: number;
  max: number;
  desc: string;
  /** when present the coupon only counts these product types */
  types?: ProductType[];
}

/* Coupons live on the server and are validated on the server. A code
   typed into the browser is only ever a string to look up. */
export const COUPONS: Record<string, Coupon> = {
  WELCOME10: { kind: "percent", value: 10, min: 599, max: 200, desc: "10% off your first order" },
  DISCOVER150: {
    kind: "fixed",
    value: 150,
    min: 799,
    max: 150,
    desc: "₹150 off a full-size eau de parfum",
    types: ["edp"],
  },
  ITRA50: {
    kind: "fixed",
    value: 50,
    min: 798,
    max: 50,
    desc: "₹50 off two or more itras",
    types: ["attar"],
  },
};

export interface PricedCart {
  lines: PricedLine[];
  count: number;
  subtotal: number;
  mrpTotal: number;
  savings: number;
  discount: number;
  coupon: { code: string; desc: string } | null;
  couponError: string | null;
  shipping: number;
  express: boolean;
  freeShip: boolean;
  gap: number;
  codEligible: boolean;
  codFee: number;
  gst: number;
  total: number;
  /** anything the server silently changed, so the bag can say so */
  issues: string[];
}

export function priceCart(rawLines: CartLineInput[], opts: PriceOptions = {}): PricedCart {
  const issues: string[] = [];

  /* collapse duplicates first, so ten separate lines of one product
     cannot walk past the per-line cap */
  const merged = new Map<string, number>();
  for (const raw of Array.isArray(rawLines) ? rawLines : []) {
    const slug = typeof raw?.slug === "string" ? raw.slug : "";
    const qty = Number(raw?.qty);
    if (!slug || !Number.isFinite(qty) || qty < 1) continue;
    merged.set(slug, (merged.get(slug) ?? 0) + Math.floor(qty));
  }

  const lines: PricedLine[] = [];
  for (const [slug, wanted] of merged) {
    const p: Product | undefined = bySlug(slug);
    if (!p) {
      issues.push("An item in your bag is no longer listed and was removed.");
      continue;
    }
    if (p.stock <= 0) {
      issues.push(`${p.name} is out of stock and was removed.`);
      continue;
    }
    let qty = clamp(wanted, 1, MAX_QTY_PER_LINE);
    if (qty < wanted) issues.push(`We cap ${p.name} at ${MAX_QTY_PER_LINE} per order.`);
    if (qty > p.stock) {
      qty = p.stock;
      issues.push(`Only ${p.stock} of ${p.name} left, so the quantity was reduced.`);
    }
    lines.push({
      slug: p.slug,
      name: p.name,
      family: p.family,
      size: p.size,
      type: p.type,
      qty,
      unit: p.price,
      mrp: p.mrp,
      line: p.price * qty,
      lineMrp: p.mrp * qty,
      stock: p.stock,
    });
  }

  const subtotal = lines.reduce((s, l) => s + l.line, 0);
  const mrpTotal = lines.reduce((s, l) => s + l.lineMrp, 0);
  const savings = mrpTotal - subtotal;

  let discount = 0;
  let coupon: PricedCart["coupon"] = null;
  let couponError: string | null = null;

  if (opts.coupon) {
    const code = String(opts.coupon).trim().toUpperCase();
    const c = COUPONS[code];
    if (!c) {
      couponError = "That code isn't valid.";
    } else {
      const types = c.types;
      const eligible = types ? lines.filter((l) => types.includes(l.type)) : lines;
      const base = eligible.reduce((s, l) => s + l.line, 0);
      if (base < c.min) {
        couponError = `Add ${inr(c.min - base)} more of eligible products to use ${code}.`;
      } else {
        discount = Math.min(
          c.kind === "percent" ? Math.round((base * c.value) / 100) : c.value,
          c.max,
        );
        coupon = { code, desc: c.desc };
      }
    }
  }

  const after = Math.max(0, subtotal - discount);
  const express = opts.ship === "express";
  const freeShip = after >= COMMERCE.freeShip;
  const shipping = !lines.length ? 0 : express ? COMMERCE.express : freeShip ? 0 : COMMERCE.shipping;
  const codEligible = after + shipping <= COMMERCE.codMax;
  const codFee = opts.pay === "cod" && codEligible ? COMMERCE.codFee : 0;
  const total = after + shipping + codFee;

  return {
    lines,
    count: lines.reduce((s, l) => s + l.qty, 0),
    subtotal,
    mrpTotal,
    savings,
    discount,
    coupon,
    couponError,
    shipping,
    express,
    freeShip,
    gap: Math.max(0, COMMERCE.freeShip - after),
    codEligible,
    codFee,
    /* prices already include GST; this is the tax inside the total,
       shown so the invoice can break it out */
    gst: Math.round(total - total / (1 + COMMERCE.gst)),
    total,
    issues,
  };
}
