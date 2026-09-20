"use client";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="wrap" style={{ paddingBlock: "var(--s8) var(--s9)", maxWidth: 620 }}>
      <p className="eyebrow">Something broke</p>
      <h1 style={{ fontSize: "var(--t-h2)", marginBlock: "var(--s4)" }}>
        That did not work
      </h1>
      <p className="lead">
        The error is in the server log. Nothing was charged and nothing was lost from your bag.
      </p>
      <button className="btn btn-primary btn-lg" style={{ marginTop: "var(--s6)" }} onClick={reset}>
        Try again
      </button>
    </div>
  );
}
