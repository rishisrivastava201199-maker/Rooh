import type { Metadata } from "next";
import { Crumbs } from "@/components/Crumbs";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Help & contact",
  description: "Reach a person at ROOH by WhatsApp or email, usually within a working day.",
  path: "/help",
});

export default function HelpPage() {
  return (
    <>
      <Crumbs trail={[["Home", "/"], ["Help", ""]]} />
      <div className="wrap" style={{ maxWidth: 620, paddingBottom: "var(--s9)" }}>
        <div className="phead">
          <p className="eyebrow">Answered by a person</p>
          <h1>Help &amp; contact</h1>
          <p className="lead">
            WhatsApp and email, usually within a working day. No queue, no ticket number, no bot
            asking you to rephrase the question.
          </p>
        </div>
        <p className="hint">
          Replace these with your real handles before launch — they are placeholders.
        </p>
      </div>
    </>
  );
}
