/* The only route that may mark an order paid, and it will only do
   so for a signature that verifies against the key secret. A
   "success" posted by the browser proves nothing on its own. */
import { NextResponse } from "next/server";
import { z } from "zod";
import { store } from "@/lib/store";
import { verifyPaymentSignature } from "@/lib/payments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  orderId: z.string().min(4).max(80),
  razorpayOrderId: z.string().min(4).max(120),
  razorpayPaymentId: z.string().min(4).max(120),
  signature: z.string().min(8).max(300),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Malformed verification." }, { status: 400 });
  }
  const b = parsed.data;

  const order = store.findOrder(b.orderId);
  if (!order) return NextResponse.json({ error: "Unknown order." }, { status: 404 });

  /* the provider order id must be the one we created for this order */
  if (order.payment.orderId !== b.razorpayOrderId) {
    return NextResponse.json({ error: "That payment does not belong to this order." }, { status: 409 });
  }

  const ok = verifyPaymentSignature({
    orderId: b.razorpayOrderId,
    paymentId: b.razorpayPaymentId,
    signature: b.signature,
  });

  if (!ok) {
    console.warn("[payments] signature did not verify for order", order.id);
    return NextResponse.json({ error: "That payment could not be verified." }, { status: 400 });
  }

  store.updateOrder(order.id, {
    status: "confirmed",
    payment: {
      ...order.payment,
      paymentId: b.razorpayPaymentId,
      verifiedAt: Date.now(),
    },
  });

  return NextResponse.json({ ok: true, orderId: order.id, status: "confirmed" });
}
