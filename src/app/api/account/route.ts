import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { getSession, endSession } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE() {
  /* whose account is derived from the cookie, not from the request */
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  store.deleteUser(session.userId);
  await endSession();
  return NextResponse.json({ ok: true });
}
