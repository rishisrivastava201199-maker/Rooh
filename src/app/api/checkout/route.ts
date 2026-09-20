/* ══════════════════════════════════════════════════════════════
   PLACING AN ORDER

   Everything that decides money happens here:

     · the cart is re-priced from the catalogue, so the total the
       order is written with is never the total the browser sent;
     · the shipping address is copied into the order as a snapshot,
       so editing the address book later cannot rewrite history;
     · identity comes from the signed session when there is one, and
       from a verified email otherwise. A user id in the body is
       ignored;
     · an online order is created as pending_payment and stays that
       way until /api/payments/verify sees a signature that checks
       out against the key secret. Nothing here marks it paid.
   ══════════════════════════════════════════════════════════════ */
import { NextResponse } from "next/server";
import { z } from "zod";
import { priceCart } from "@/lib/pricing";
import { store, type Order } from "@/lib/store";
import { getSession, newId } from "@/lib/session";
import { createPaymentOrder, toPaise, PaymentsNotConfigured } from "@/lib/payments";
import { COMMERCE } from "@/lib/commerce";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Address = z.object({
  label: z.string().max(40).default("Home"),
  name: z.string().min(2).max(120),
  phone: z.string().regex(/^\d{10}$/, "A ten-digit mobile number."),
  line1: z.string().min(3).max(200),
  line2: z.string().max(200).default(""),
  landmark: z.string().max(120).default(""),
  city: z.string().min(2).max(120),
  state: z.string().min(2).max(120),
  pin: z.string().regex(/^\d{6}$/, "A six-digit PIN code."),
  country: z.string().max(80).default("India"),
});

const Body = z.object({
  email: z.string().email().max(200),
  lines: z
    .array(z.object({ slug: z.string().min(1).max(80), qty: z.number().int().min(1).max(99) }))
    .min(1)
    .max(40),
  coupon: z.string().max(40).nullable().optional(),
  ship: z.enum(["standard", "express"]).default("standard"),
  pay: z.enum(["online", "cod"]).default("online"),
  address: Address,
  giftNote: z.string().max(400).nullable().optional(),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Some details are missing or malformed.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const b = parsed.data;

  /* re-priced here; whatever the browser thought is discarded */
  const priced = priceCart(b.lines, { coupon: b.coupon ?? null, ship: b.ship, pay: b.pay });
  if (!priced.lines.length) {
    return NextResponse.json({ error: "Nothing in the bag is available to order." }, { status: 409 });
  }
  if (b.pay === "cod" && !priced.codEligible) {
    return NextResponse.json(
      { error: `Cash on delivery is available up to ₹${COMMERCE.codMax.toLocaleString("en-IN")}.` },
      { status: 409 },
    );
  }

  /* identity from the cookie, never from the body */
  const session = await getSession();

  const order: Order = {
    id: "ROOH" + newId("").slice(1, 9).toUpperCase(),
    userId: session?.userId ?? null,
    email: session?.email ?? b.email.trim().toLowerCase(),
    createdAt: Date.now(),
    status: b.pay === "cod" ? "confirmed" : "pending_payment",
    priced,
    shipTo: { id: newId("adr"), ...b.address },
    ship: b.ship,
    pay: b.pay,
    payment: { provider: b.pay === "cod" ? "cod" : "razorpay" },
    giftNote: b.giftNote ?? null,
  };

  if (b.pay === "cod") {
    store.createOrder(order);
    return NextResponse.json({ orderId: order.id, status: order.status, total: priced.total });
  }

  try {
    const provider = await createPaymentOrder(toPaise(priced.total), order.id);
    order.payment.orderId = provider.id;
    store.createOrder(order);
    return NextResponse.json({
      orderId: order.id,
      status: order.status,
      total: priced.total,
      payment: { provider: "razorpay", orderId: provider.id, amount: provider.amount, keyId: provider.keyId },
    });
  } catch (err) {
    if (err instanceof PaymentsNotConfigured) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[checkout] could not create the payment order:", err);
    return NextResponse.json(
      { error: "We could not reach the payment provider. Nothing was charged." },
      { status: 502 },
    );
  }
}
