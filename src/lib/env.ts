/* ══════════════════════════════════════════════════════════════
   ENVIRONMENT

   Every secret is read here and nowhere else, so there is one place
   to look when something is missing.

   `import "server-only"` makes importing this from a client
   component a build error rather than a leak. That is the point:
   a key cannot reach the browser by accident.
   ══════════════════════════════════════════════════════════════ */
import "server-only";

function required(name: string, value: string | undefined, devFallback?: string): string {
  if (value && value.length > 0) return value;
  if (process.env.NODE_ENV !== "production" && devFallback) return devFallback;
  throw new Error(
    `Missing environment variable ${name}. Copy .env.example to .env.local and fill it in.`,
  );
}

export const env = {
  /** Signs session cookies and hashes one-time codes. */
  get sessionSecret(): string {
    return required(
      "SESSION_SECRET",
      process.env.SESSION_SECRET,
      "dev-only-insecure-secret-change-me",
    );
  },
  get siteOrigin(): string {
    return process.env.NEXT_PUBLIC_SITE_ORIGIN || "http://localhost:3000";
  },
  get isProduction(): boolean {
    return process.env.NODE_ENV === "production";
  },

  /* Razorpay. Absent in development, in which case checkout stops
     honestly at the payment step instead of pretending to succeed. */
  get razorpayKeyId(): string | undefined {
    return process.env.RAZORPAY_KEY_ID;
  },
  get razorpayKeySecret(): string | undefined {
    return process.env.RAZORPAY_KEY_SECRET;
  },
  get razorpayWebhookSecret(): string | undefined {
    return process.env.RAZORPAY_WEBHOOK_SECRET;
  },

  /* Email. Absent in development, in which case the one-time code is
     written to the server log and the UI says so. */
  get resendApiKey(): string | undefined {
    return process.env.RESEND_API_KEY;
  },
  get mailFrom(): string {
    return process.env.MAIL_FROM || "ROOH <orders@example.invalid>";
  },

  get databaseUrl(): string | undefined {
    return process.env.DATABASE_URL;
  },
} as const;

export const paymentsConfigured = (): boolean =>
  Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

export const emailConfigured = (): boolean => Boolean(process.env.RESEND_API_KEY);
