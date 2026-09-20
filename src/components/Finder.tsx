"use client";
/* The finder asks at most six questions and stops as soon as the
   answer is not going to change. Every result carries the reasons
   it scored, and the reasons against it — a recommender that only
   ever agrees with you is a salesperson. */
import { useState } from "react";
import Link from "next/link";
import { useBag } from "./CartProvider";
import { Price } from "./Price";
import {
  blankProfile, recommend, MAX_QUESTIONS, QUESTIONS,
  type Profile, type Recommendation, type QuestionLike,
} from "@/lib/engine";

const filled = (p: Profile, k: string): boolean => {
  const v = (p as unknown as Record<string, unknown>)[k];
  return Array.isArray(v) ? v.length > 0 : Boolean(v);
};

export function Finder() {
  const { add } = useBag();
  const [profile, setProfile] = useState<Profile>(blankProfile());
  const [asked, setAsked] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const remaining = QUESTIONS.filter((q) => !asked.includes(q.key));
  const current: QuestionLike | undefined = remaining[0];
  const result: Recommendation | null = done ? recommend(profile, 3) : null;

  const answer = (q: QuestionLike, value: string) => {
    const next = { ...profile } as unknown as Record<string, unknown>;
    if (q.kind === "multi") {
      const cur = Array.isArray(next[q.key]) ? (next[q.key] as string[]) : [];
      next[q.key] = cur.includes(value)
        ? cur.filter((v) => v !== value)
        : [...cur, value].slice(-(q.max ?? 2));
    } else {
      next[q.key] = value;
    }
    setProfile(next as unknown as Profile);
  };

  const commit = (q: QuestionLike) => {
    const nextAsked = [...asked, q.key];
    setAsked(nextAsked);
    if (nextAsked.length >= MAX_QUESTIONS || nextAsked.length >= QUESTIONS.length) setDone(true);
  };

  const restart = () => {
    setProfile(blankProfile());
    setAsked([]);
    setDone(false);
  };

  if (result) {
    return (
      <div className="wrap fdr" style={{ paddingBottom: "var(--s9)" }}>
        {result.relaxed.length ? (
          <div className="panel pad" style={{ marginBottom: "var(--s6)", background: "var(--surface-muted)" }}>
            <p className="eyebrow" style={{ color: "var(--accent-ink)", marginBottom: 8 }}>
              We had to loosen something
            </p>
            <p className="hint" style={{ lineHeight: 1.75 }}>
              Nothing in the range matched all of that at once, so we set aside{" "}
              {result.relaxed.join(", then ")} to find the closest options. Everything else you
              asked for still applies.
            </p>
          </div>
        ) : null}

        {result.list.map((r, i) => (
          <article className="panel pad" key={r.p.slug} style={{ marginBottom: "var(--s5)" }}>
            <div className="row between wrapf" style={{ gap: 12 }}>
              <div>
                <p className="eyebrow" style={{ color: "var(--accent-ink)" }}>
                  {i === 0 ? "Best match" : `Option ${i + 1}`} · {r.pct}%
                </p>
                <h2 style={{ fontSize: "var(--t-h3)", marginBlock: "var(--s3)" }}>
                  <Link href={`/product/${r.p.slug}`}>{r.p.name}</Link>
                </h2>
                <p className="lead" style={{ margin: 0 }}>{r.p.short}</p>
              </div>
              <Price price={r.p.price} mrp={r.p.mrp} />
            </div>

            <ul className="res-why" style={{ marginTop: "var(--s4)" }}>
              {r.why.slice(0, 4).map((w) => (
                <li key={w}><span>{w.charAt(0).toUpperCase() + w.slice(1)}</span></li>
              ))}
              {r.against.length ? (
                <li style={{ color: "var(--ink-faint)" }}>
                  <span>Worth knowing: {r.against[0]}.</span>
                </li>
              ) : null}
            </ul>

            <div className="row wrapf" style={{ gap: 12, marginTop: "var(--s5)" }}>
              <button className="btn btn-primary" onClick={() => add(r.p.slug, { name: r.p.name, size: r.p.size })}>
                Add to bag
              </button>
              <Link href={`/product/${r.p.slug}`} className="btn btn-secondary">View details</Link>
            </div>
          </article>
        ))}

        <div className="row wrapf" style={{ gap: 12, marginTop: "var(--s6)" }}>
          <button className="btn btn-quiet" onClick={restart}>Start again</button>
          <Link href="/discovery" className="btn btn-tertiary">Or try five for ₹299</Link>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="wrap fdr" style={{ paddingBottom: "var(--s9)" }}>
        <button className="btn btn-primary btn-lg" onClick={() => setDone(true)}>See the results</button>
      </div>
    );
  }

  const chosen = (profile as unknown as Record<string, unknown>)[current.key];
  const has = Array.isArray(chosen) ? chosen.length > 0 : Boolean(chosen);

  return (
    <div className="wrap fdr" style={{ paddingBottom: "var(--s9)" }}>
      <div className="fdr-prog" aria-hidden="true">
        {QUESTIONS.slice(0, MAX_QUESTIONS).map((q, i) => (
          <i key={q.key} className={i < asked.length ? "done" : i === asked.length ? "now" : ""} />
        ))}
      </div>

      <p className="eyebrow" style={{ marginTop: "var(--s5)" }}>
        Question {asked.length + 1} of {Math.min(MAX_QUESTIONS, QUESTIONS.length)}
      </p>
      <h2 style={{ fontSize: "var(--t-h2)", marginBlock: "var(--s4)" }}>{current.ask}</h2>
      {current.hint ? <p className="hint">{current.hint}</p> : null}

      <div className="opts" style={{ marginTop: "var(--s5)" }}>
        {current.opts.map((o) => {
          const [label, value, note] = o;
          const on = Array.isArray(chosen) ? chosen.includes(value) : chosen === value;
          return (
            <button
              key={value}
              className={`opt-btn${on ? " on" : ""}`}
              onClick={() => answer(current, value)}
            >
              <span className="t">{label}</span>
              {note ? <span className="s">{note}</span> : null}
            </button>
          );
        })}
      </div>

      <div className="row wrapf" style={{ gap: 12, marginTop: "var(--s6)" }}>
        <button className="btn btn-primary" disabled={!has} onClick={() => commit(current)}>
          Continue
        </button>
        <button className="btn btn-quiet" onClick={() => commit(current)}>
          Skip this
        </button>
      </div>
    </div>
  );
}
