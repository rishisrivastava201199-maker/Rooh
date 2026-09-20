"use client";
import { useState } from "react";

export function DeleteAccount() {
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <>
      <label className="check">
        <input
          type="checkbox"
          checked={ok}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOk(e.target.checked)}
        />
        <span>I understand my profile is removed and my order records are retained.</span>
      </label>
      <button
        className="btn btn-secondary danger"
        disabled={!ok || busy}
        style={{ marginTop: "var(--s5)" }}
        onClick={async () => {
          setBusy(true);
          await fetch("/api/account", { method: "DELETE" });
          window.location.href = "/";
        }}
      >
        {busy ? "Deleting…" : "Delete my account"}
      </button>
    </>
  );
}
