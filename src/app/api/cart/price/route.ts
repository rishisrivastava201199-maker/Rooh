/* ══════════════════════════════════════════════════════════════
   THE ONLY PLACE A TOTAL IS PRODUCED

   The body is validated to slugs, quantities and three enums.
   Anything else it contains — a price, a total, a "discount"
   the browser would like applied — is dropped by the schema and
   never reaches priceCart.
   ══════════════════════════════════════════════════════════════ */
import { NextResponse } from "next/server";
import { z } from "zod";
import { priceCart } from "@/lib/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  lines: z
    .array(z.object({ slug: z.string().min(1).max(80), qty: z.number().int().min(1).max(99) }))
    .max(40),
  coupon: z.string().max(40).nullable().optional(),
  ship: z.enum(["standard", "express"]).optional(),
  pay: z.enum(["online", "cod"]).optional(),
});

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Expected JSON." }, { status: 400 });
  }

  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "That request did not look right." }, { status: 400 });
  }

  const { lines, coupon, ship, pay } = parsed.data;
  const priced = priceCart(lines, { coupon: coupon ?? null, ship, pay });
  return NextResponse.json(priced, { headers: { "cache-control": "no-store" } });
}
