"use client";
/* Email and a one-time code. No password to leak, and the same
   answer whether or not an account exists — asking for a code
   cannot be used to find out who has one. */
import { useState } from "react";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [challenge, setChallenge] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function request() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { challengeId?: string; note?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "That did not work.");
        return;
      }
      setChallenge(data.challengeId ?? null);
      setNote(data.note ?? null);
    } finally {
      setBusy(false);
    }
  }

  async function verify() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ challengeId: challenge, code }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "That code is not right.");
        return;
      }
      window.location.reload();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="wrap" style={{ paddingBlock: "var(--s8) var(--s9)", maxWidth: 460 }}>
      <p className="eyebrow">Session</p>
      <h1 style={{ fontSize: "var(--t-h1)", marginBlock: "var(--s4)" }}>Please sign in</h1>
      <p className="lead">
        This page is yours alone, so it needs a verified session. Sign in with a one-time code and
        you will come straight back here.
      </p>

      <div className="frm" style={{ marginTop: "var(--s6)" }}>
        {!challenge ? (
          <>
            <div className="field">
              <label className="label" htmlFor="authEmail">Email address</label>
              <input
                className="input" id="authEmail" type="email" inputMode="email"
                autoComplete="email" placeholder="you@example.com" value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary btn-lg"
              disabled={busy || !/^\S+@\S+\.\S+$/.test(email)}
              onClick={() => void request()}
            >
              {busy ? "Sending…" : "Send me a code"}
            </button>
          </>
        ) : (
          <>
            {note ? <p className="hint">{note}</p> : null}
            <div className="field">
              <label className="label" htmlFor="authCode">Six-digit code</label>
              <input
                className="input" id="authCode" inputMode="numeric" maxLength={6}
                autoComplete="one-time-code" value={code}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
              />
              <p className="hint">It expires in ten minutes.</p>
            </div>
            <button
              className="btn btn-primary btn-lg"
              disabled={busy || !/^\d{6}$/.test(code)}
              onClick={() => void verify()}
            >
              {busy ? "Checking…" : "Sign in"}
            </button>
          </>
        )}
        {error ? <p className="bad-msg">{error}</p> : null}
      </div>
    </div>
  );
}
