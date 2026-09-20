"use client";
/* ══════════════════════════════════════════════════════════════
   THE FRAGRANCE STYLIST

   The panel is a conversation; the ranking is not. Free text goes
   to /api/stylist, which extracts preferences with the same
   deterministic matcher the prototype used and ranks with the same
   engine over real stock. The browser never sees a catalogue it
   could be talked into misreading, and nothing here can invent a
   product, a note or a price.

   No language model is connected. The panel says so, in the panel,
   before the first message.
   ══════════════════════════════════════════════════════════════ */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useBag } from "./CartProvider";
import { inr } from "@/lib/format";
import type { Profile } from "@/lib/engine";

interface Rec {
  slug: string;
  name: string;
  family: string;
  size: string;
  price: number;
  mrp: number;
  pct: number;
  why: string[];
  against: string[];
  longev: [number, number];
  sillage: string;
}

interface Msg {
  role: "a" | "u";
  kind: "text" | "open" | "chips" | "recs";
  text?: string;
  chips?: [label: string, value: string][];
  recs?: Rec[];
}

const OPENERS: [string, string][] = [
  ["For me", "for me"],
  ["A gift", "it's a gift"],
  ["I don't know where to start", "I don't know anything about perfume"],
];

export function Stylist({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { add } = useBag();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open || msgs.length) return;
    setMsgs([
      { role: "a", kind: "open", text: "Let me help you find a fragrance that feels unmistakably yours." },
      {
        role: "a",
        kind: "text",
        text:
          "Tell me what you are after in your own words — an occasion, a smell you like, a budget — " +
          "or tap one of these. You can skip anything you would rather not answer.",
      },
      { role: "a", kind: "chips", chips: OPENERS },
    ]);
  }, [open, msgs.length]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, busy]);

  /* Escape closes, and Tab cannot walk out into the page behind */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const f = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),input,textarea,[tabindex]:not([tabindex="-1"])',
      );
      if (!f.length) return;
      const first = f[0]!;
      const last = f[f.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [open, onClose]);

  async function send(raw: string) {
    const said = raw.trim();
    if (!said || busy) return;
    setMsgs((m) => [...m, { role: "u", kind: "text", text: said }]);
    setText("");
    setBusy(true);
    try {
      const res = await fetch("/api/stylist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: said, profile }),
      });
      const data = (await res.json()) as {
        say: string[];
        ask?: { text: string; chips: [string, string][] } | null;
        recs?: Rec[] | null;
        profile: Profile;
      };
      setProfile(data.profile);
      setMsgs((m) => {
        const next = [...m];
        data.say.forEach((t) => next.push({ role: "a", kind: "text", text: t }));
        if (data.recs?.length) next.push({ role: "a", kind: "recs", recs: data.recs });
        if (data.ask) {
          next.push({ role: "a", kind: "text", text: data.ask.text });
          next.push({ role: "a", kind: "chips", chips: data.ask.chips });
        }
        return next;
      });
    } catch {
      setMsgs((m) => [
        ...m,
        { role: "a", kind: "text", text: "Something went wrong reaching the shop. Try again in a moment." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  const last = msgs.length - 1;

  return (
    <section
      ref={panelRef}
      className={`sty${open ? " is-open" : ""}`}
      id="styPanel"
      role="dialog"
      aria-modal="false"
      aria-labelledby="styTitle"
      hidden={!open}
    >
      <header className="sty-hd">
        <div>
          <h2 id="styTitle">Fragrance Stylist</h2>
          <p>Tell me what you are after. I rank our eleven products against it.</p>
        </div>
        <button className="ibtn" onClick={onClose} aria-label="Close the stylist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </header>

      <div className="sty-note">
        <details>
          <summary>
            <strong>No language model is connected in this prototype.</strong> What that means
          </summary>
          <p style={{ marginTop: 8 }}>
            This is a matcher that reads your words against our own vocabulary and ranks real
            products. It will not invent a fragrance, a note or a claim.
          </p>
          <div className="api">
            POST /api/stylist
            <br />
            &nbsp;&nbsp;body&nbsp; &#123; message, profile &#125;
            <br />
            &nbsp;&nbsp;reply &#123; say, ask, recs, profile &#125;
          </div>
          <p style={{ marginTop: 8 }}>
            A model would phrase the reply and read preferences out of your message. It is never
            handed the catalogue and never picks the products — ranking stays server-side, over
            real stock and real prices.
          </p>
        </details>
      </div>

      <div className="sty-body" id="styBody" role="log" aria-live="polite" ref={bodyRef} tabIndex={-1}>
        {msgs.map((m, i) => {
          if (m.kind === "chips") {
            if (i !== last) return null; /* an answered question's options go away */
            return (
              <div className="sty-chips" key={i}>
                {m.chips!.map(([label, value]) => (
                  <button
                    key={value}
                    type="button"
                    className="sty-chip"
                    disabled={busy}
                    onClick={() => send(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            );
          }
          if (m.kind === "recs") {
            return (
              <div key={i}>
                {m.recs!.map((r, n) => (
                  <article className="rec" key={r.slug}>
                    <div className="rec-top">
                      <div className="rec-b">
                        <span className="rec-rank">
                          {m.recs!.length > 1 ? (n === 0 ? "Best match" : `Option ${n + 1}`) : "Match"} · {r.pct}%
                        </span>
                        <h3 className="rec-n">{r.name}</h3>
                        <p className="rec-m">
                          {r.family} · {r.size}
                        </p>
                        <p className="rec-m">
                          <strong style={{ color: "var(--ink)" }}>{inr(r.price)}</strong>{" "}
                          {r.mrp > r.price ? <s>{inr(r.mrp)}</s> : null}
                        </p>
                      </div>
                    </div>
                    <p className="rec-why">
                      {r.why.length ? r.why.slice(0, 3).join("; ") : ""}
                      {r.why.length ? ". " : ""}
                      <span style={{ color: "var(--ink-faint)" }}>
                        {r.longev[0]}–{r.longev[1]} hrs · {r.sillage.toLowerCase()}.
                        {r.against.length ? ` Worth knowing: ${r.against[0]}.` : ""}
                      </span>
                    </p>
                    <div className="rec-act">
                      <button type="button" onClick={() => add(r.slug, { name: r.name, size: r.size })}>
                        Add to bag
                      </button>
                      <Link href={`/product/${r.slug}`} onClick={onClose}>
                        Full page
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            );
          }
          return (
            <div className={`msg ${m.role === "u" ? "u" : "a"}${m.kind === "open" ? " open" : ""}`} key={i}>
              <p>{m.text}</p>
            </div>
          );
        })}
        {busy ? (
          <div className="typing">
            <i /><i /><i />
            <span>finding the notes</span>
          </div>
        ) : null}
      </div>

      <div className="sty-ft">
        <form
          className="sty-form"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            void send(text);
          }}
        >
          <label className="sr" htmlFor="styInput">
            Message the stylist
          </label>
          <textarea
            id="styInput"
            rows={1}
            placeholder="Tell me what you are after…"
            value={text}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(text);
              }
            }}
          />
          <button className="sty-send" type="submit" disabled={busy} aria-label="Send">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M4 12h15M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>
        <p className="sty-hint">
          Nothing you type here is stored against your account, and no profile is created unless
          you ask to save one.
        </p>
      </div>
    </section>
  );
}
