/* ══════════════════════════════════════════════════════════════
   SESSIONS AND ONE-TIME CODES

   Two rules from the brief are enforced here and cannot be worked
   around by anything the browser sends:

     · A customer id from the client is never trusted. Identity comes
       from the signed cookie and nowhere else — see requireUser().
     · A one-time code is never stored in plaintext. Only an HMAC of
       it is kept, so a dump of the store does not let anyone sign in.
   ══════════════════════════════════════════════════════════════ */
import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { env } from "./env";

export const SESSION_COOKIE = "rooh_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_MAX_RESENDS = 3;

export interface SessionPayload {
  userId: string;
  email: string;
  exp: number;
}

const b64url = (b: Buffer): string => b.toString("base64url");

function sign(data: string): string {
  return b64url(crypto.createHmac("sha256", env.sessionSecret).update(data).digest());
}

/** Constant-time compare, so a wrong signature leaks no timing. */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function createSessionToken(payload: SessionPayload): string {
  const body = b64url(Buffer.from(JSON.stringify(payload)));
  return `${body}.${sign(body)}`;
}

export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot < 1) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!safeEqual(sig, sign(body))) return null;
  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    if (!parsed?.userId || !parsed?.email) return null;
    if (typeof parsed.exp !== "number" || parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function startSession(userId: string, email: string): Promise<void> {
  const token = createSessionToken({ userId, email, exp: Date.now() + SESSION_TTL_MS });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProduction,
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProduction,
    path: "/",
    maxAge: 0,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  return verifySessionToken(jar.get(SESSION_COOKIE)?.value);
}

/**
 * The only way a route learns who is asking. Never read a user id
 * out of a request body — that is the hole this closes.
 */
export async function requireUser(): Promise<SessionPayload> {
  const s = await getSession();
  if (!s) throw new UnauthorizedError();
  return s;
}

export class UnauthorizedError extends Error {
  readonly status = 401;
  constructor() {
    super("This request needs a verified session.");
    this.name = "UnauthorizedError";
  }
}

/* ── one-time codes ─────────────────────────────────────────── */

/** Six digits from a cryptographic source, not Math.random. */
export function generateOtp(): string {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
}

/** What gets stored. The code itself never is. */
export function hashOtp(code: string, challengeId: string): string {
  return crypto
    .createHmac("sha256", env.sessionSecret)
    .update(`${challengeId}:${code}`)
    .digest("hex");
}

export function otpMatches(code: string, challengeId: string, storedHash: string): boolean {
  return safeEqual(hashOtp(code, challengeId), storedHash);
}

export const newId = (prefix: string): string =>
  `${prefix}_${crypto.randomBytes(9).toString("base64url")}`;
