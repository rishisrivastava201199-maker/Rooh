/* ══════════════════════════════════════════════════════════════
   PAYMENT VERIFICATION

   The rule from the brief, kept literally: a "success" coming back
   from the browser is not proof of payment. An order becomes paid
   only when a signature computed here with the key secret matches
   what the provider signed.

   Razorpay is wired because it is the usual choice for an Indian
   store. Nothing here fakes a payment: with no keys configured,
   `createPaymentOrder` refuses and checkout stops at that step and
   says why.
   ══════════════════════════════════════════════════════════════ */
import "server-only";
import crypto from "node:crypto";
import { env, paymentsConfigured } from "./env";

export interface ProviderOrder {
  id: string;
  amount: number; // paise
  currency: "INR";
  keyId: string;
}

export class PaymentsNotConfigured extends Error {
  readonly status = 503;
  constructor() {
    super(
      "Online payment is not configured on this server. Set RAZORPAY_KEY_ID and " +
        "RAZORPAY_KEY_SECRET in .env.local, or place the order as cash on delivery.",
    );
    this.name = "PaymentsNotConfigured";
  }
}

/**
 * Create the provider-side order. `amountPaise` must come from
 * priceCart on the server — never from the request body.
 */
export async function createPaymentOrder(
  amountPaise: number,
  receipt: string,
): Promise<ProviderOrder> {
  if (!paymentsConfigured()) throw new PaymentsNotConfigured();

  const keyId = env.razorpayKeyId!;
  const auth = Buffer.from(`${keyId}:${env.razorpayKeySecret!}`).toString("base64");

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Basic ${auth}` },
    body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt, payment_capture: 1 }),
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Razorpay rejected the order (${res.status}). ${detail.slice(0, 300)}`);
  }

  const json = (await res.json()) as { id: string; amount: number };
  return { id: json.id, amount: json.amount, currency: "INR", keyId };
}

/**
 * The only thing that may mark an order paid.
 * Returns false for anything that does not verify — no exceptions,
 * no "trusted" client flag, no development shortcut.
 */
export function verifyPaymentSignature(input: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = env.razorpayKeySecret;
  if (!secret) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${input.orderId}|${input.paymentId}`)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(input.signature || "");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/** Webhooks are signed with a different secret from payments. */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = env.razorpayWebhookSecret;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature || "");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export const toPaise = (rupees: number): number => Math.round(rupees * 100);
