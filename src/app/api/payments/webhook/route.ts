/* The provider's own callback — the backstop for when the browser
   closes before it can call /api/payments/verify.

   Signed with a different secret from payments, and verified
   against the RAW body: parsing first would change the bytes the
   signature was computed over. */
import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { verifyWebhookSignature } from "@/lib/payments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RazorpayEvent {
  event?: string;
  payload?: { payment?: { entity?: { order_id?: string; id?: string } } };
}

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "Bad signature." }, { status: 400 });
  }

  let event: RazorpayEvent;
  try {
    event = JSON.parse(raw) as RazorpayEvent;
  } catch {
    return NextResponse.json({ error: "Bad payload." }, { status: 400 });
  }

  const entity = event.payload?.payment?.entity;

  if (event.event === "payment.captured" && entity?.order_id) {
    const order = store.findOrderByProviderOrderId(entity.order_id);
    if (order && order.status === "pending_payment") {
      store.updateOrder(order.id, {
        status: "confirmed",
        payment: { ...order.payment, paymentId: entity.id, verifiedAt: Date.now() },
      });
      console.info("[payments] confirmed", order.id, "from webhook");
    }
  }

  /* Answer 200 once the signature checks out, including for events
     we do not handle, so the provider stops retrying. */
  return NextResponse.json({ received: true });
}
