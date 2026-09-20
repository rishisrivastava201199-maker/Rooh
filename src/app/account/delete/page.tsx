import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { Crumbs } from "@/components/Crumbs";
import { SignIn } from "@/components/SignIn";
import { DeleteAccount } from "@/components/DeleteAccount";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Delete your account",
  description: "Remove your ROOH profile. What happens to your order records, stated plainly.",
  path: "/account/delete",
});

export default async function DeletePage() {
  const session = await getSession();
  if (!session) {
    return (
      <>
        <Crumbs trail={[["Home", "/"], ["Your account", "/account"], ["Delete", ""]]} />
        <SignIn />
      </>
    );
  }
  return (
    <>
      <Crumbs trail={[["Home", "/"], ["Your account", "/account"], ["Delete", ""]]} />
      <div className="wrap" style={{ paddingBlock: "var(--s6) var(--s9)" }}>
        <div className="panel pad" style={{ maxWidth: 600 }}>
          <h1 style={{ fontSize: "1.25rem", marginBottom: "var(--s4)" }}>Delete your account</h1>
          <p className="lead">
            This removes your profile, saved addresses, wishlist and fragrance profile, and signs
            you out everywhere. It cannot be undone.
          </p>
          <p className="lead" style={{ marginTop: "var(--s4)" }}>
            Your order and invoice records are <strong style={{ color: "var(--ink)" }}>not</strong>{" "}
            deleted. Indian tax and accounting rules require sales records to be retained, so they
            are detached from your profile and kept for the statutory period rather than erased. We
            would rather say that plainly than promise an erasure we cannot legally perform.
          </p>
          <div className="rule" style={{ marginBlock: "var(--s6)" }} />
          <DeleteAccount />
          <Link href="/account" className="btn btn-quiet" style={{ marginTop: "var(--s4)" }}>
            Keep my account
          </Link>
        </div>
      </div>
    </>
  );
}
