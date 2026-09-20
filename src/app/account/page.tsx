import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { store } from "@/lib/store";
import { Crumbs } from "@/components/Crumbs";
import { SignIn } from "@/components/SignIn";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Your account",
  description: "Your ROOH account: orders, addresses, wishlist and fragrance profile.",
  path: "/account",
});

export default async function AccountPage() {
  /* identity comes from the signed cookie, never from a query
     string or a body — this is the whole rule in one line */
  const session = await getSession();

  if (!session) {
    return (
      <>
        <Crumbs trail={[["Home", "/"], ["Your account", ""]]} />
        <SignIn />
      </>
    );
  }

  const orders = store.ordersFor(session.userId);

  return (
    <>
      <Crumbs trail={[["Home", "/"], ["Your account", ""]]} />
      <div className="wrap" style={{ paddingBottom: "var(--s9)", maxWidth: 820 }}>
        <div className="phead">
          <p className="eyebrow">Signed in as {session.email}</p>
          <h1>Your account</h1>
        </div>

        <h2 style={{ fontSize: "var(--t-h3)", marginBottom: "var(--s4)" }}>Orders</h2>
        {orders.length ? (
          <div>
            {orders.map((o) => (
              <div className="panel pad" key={o.id} style={{ marginBottom: "var(--s4)" }}>
                <div className="row between wrapf" style={{ gap: 12 }}>
                  <div>
                    <p style={{ fontFamily: "var(--display)", fontSize: "1.125rem" }}>{o.id}</p>
                    <p className="hint">
                      {new Date(o.createdAt).toLocaleDateString("en-IN")} ·{" "}
                      {o.priced.count} {o.priced.count === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <span className="badge">{o.status.replace(/_/g, " ")}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="lead">No orders yet.</p>
        )}

        <div className="mtheme" style={{ marginTop: "var(--s7)" }}>
          <span>Leaving</span>
          <Link href="/account/delete" className="btn btn-tertiary">Delete your account</Link>
        </div>
      </div>
    </>
  );
}
