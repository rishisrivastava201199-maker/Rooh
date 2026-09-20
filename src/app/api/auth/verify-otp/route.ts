import { NextResponse } from "next/server";
import { z } from "zod";
import { store } from "@/lib/store";
import { otpMatches, startSession, newId, OTP_MAX_ATTEMPTS } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  challengeId: z.string().min(4).max(80),
  code: z.string().regex(/^\d{6}$/, "Six digits."),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter the six-digit code." }, { status: 400 });
  }

  const challenge = store.findOtp(parsed.data.challengeId);
  if (!challenge || challenge.expiresAt < Date.now()) {
    return NextResponse.json({ error: "That code has expired. Ask for a new one." }, { status: 400 });
  }
  if (challenge.attempts >= OTP_MAX_ATTEMPTS) {
    return NextResponse.json({ error: "Too many attempts. Ask for a new code." }, { status: 429 });
  }

  if (!otpMatches(parsed.data.code, challenge.id, challenge.hash)) {
    store.updateOtp(challenge.id, { attempts: challenge.attempts + 1 });
    return NextResponse.json(
      { error: "That code is not right.", left: OTP_MAX_ATTEMPTS - challenge.attempts - 1 },
      { status: 400 },
    );
  }

  /* one code, one use */
  store.consumeOtp(challenge.id);

  let user = store.findUserByEmail(challenge.email);
  if (!user) {
    user = {
      id: newId("usr"),
      email: challenge.email,
      first: "",
      last: "",
      phone: "",
      createdAt: Date.now(),
      /* consent is given, never assumed */
      news: false,
    };
    store.upsertUser(user);
  }

  await startSession(user.id, user.email);
  return NextResponse.json({ ok: true, email: user.email });
}
