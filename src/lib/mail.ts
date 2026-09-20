/* ══════════════════════════════════════════════════════════════
   EMAIL

   With no provider key configured, a sign-in code is written to the
   server log and the caller is told the email was not sent. It is
   not pretended to have arrived — that was the rule in the brief
   and it is easier to debug besides.
   ══════════════════════════════════════════════════════════════ */
import "server-only";
import { env, emailConfigured } from "./env";

export interface SendResult {
  delivered: boolean;
  reason?: string;
}

export async function sendMail(to: string, subject: string, text: string): Promise<SendResult> {
  if (!emailConfigured()) {
    console.info(
      `\n[mail] RESEND_API_KEY is not set, so nothing was sent.\n` +
        `[mail] to: ${to}\n[mail] subject: ${subject}\n[mail] body:\n${text}\n`,
    );
    return { delivered: false, reason: "Email is not configured on this server." };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${env.resendApiKey}`,
    },
    body: JSON.stringify({ from: env.mailFrom, to: [to], subject, text }),
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[mail] provider rejected the send:", res.status, detail.slice(0, 300));
    return { delivered: false, reason: "The email provider rejected the message." };
  }
  return { delivered: true };
}
