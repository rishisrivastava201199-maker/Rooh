import { NextResponse } from "next/server";
import { z } from "zod";
import { store } from "@/lib/store";
import { sendMail } from "@/lib/mail";
import {
  generateOtp, hashOtp, newId,
  OTP_TTL_MS, OTP_MAX_RESENDS,
} from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({ email: z.string().email().max(200) });

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  const email = parsed.data.email.trim().toLowerCase();

  /* a crude rate limit; move it to Redis or the edge before launch */
  const recent = store.recentOtpsFor(email, 15 * 60 * 1000);
  if (recent.length >= OTP_MAX_RESENDS) {
    return NextResponse.json(
      { error: "Too many codes requested. Try again in fifteen minutes." },
      { status: 429 },
    );
  }

  const id = newId("otp");
  const code = generateOtp();
  store.createOtp({
    id,
    email,
    /* only the HMAC is kept — the code itself is never stored */
    hash: hashOtp(code, id),
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
    resends: recent.length,
    createdAt: Date.now(),
  });

  const sent = await sendMail(
    email,
    "Your ROOH sign-in code",
    `Your sign-in code is ${code}. It expires in ten minutes.\n\n` +
      `If you did not ask for this, you can ignore it — nobody can sign in without the code.`,
  );

  /* The same answer whether or not an account exists, so this
     endpoint cannot be used to discover who has one. */
  return NextResponse.json({
    challengeId: id,
    expiresInMs: OTP_TTL_MS,
    delivered: sent.delivered,
    note: sent.delivered
      ? undefined
      : "Email is not configured on this server, so the code was written to the server log.",
  });
}
