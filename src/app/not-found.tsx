import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap" style={{ paddingBlock: "var(--s8) var(--s9)", maxWidth: 620 }}>
      <p className="eyebrow">404</p>
      <h1 style={{ fontSize: "var(--t-h1)", marginBlock: "var(--s4)" }}>This page does not exist</h1>
      <p className="lead">
        The link may be old, or we may have moved something. The whole range is eleven products,
        so nothing is far away.
      </p>
      <div className="row wrapf" style={{ gap: 12, marginTop: "var(--s6)" }}>
        <Link href="/shop" className="btn btn-primary btn-lg">All fragrances</Link>
        <Link href="/" className="btn btn-secondary btn-lg">Home</Link>
      </div>
    </div>
  );
}
