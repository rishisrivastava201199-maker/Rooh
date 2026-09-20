"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useBag } from "./CartProvider";

const ANNOUNCE: [long: string, short: string][] = [
  ["Complimentary shipping on orders over ₹999", "Complimentary shipping over ₹999"],
  [
    "Discovery Collection ₹299 — ₹150 back on your first full size",
    "Discovery Collection ₹299 · ₹150 back",
  ],
  ["Dispatched within 24 hours · Seven-day returns", "Dispatched in 24 hours · 7-day returns"],
];

export function Header({ onOpenStylist }: { onOpenStylist?: () => void }) {
  const { count } = useBag();
  const [ann, setAnn] = useState(0);
  const [phone, setPhone] = useState(false);
  const [menu, setMenu] = useState(false);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width:639px)");
    const sync = () => setPhone(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    const t = window.setInterval(() => setAnn((i) => (i + 1) % ANNOUNCE.length), 5600);
    const onScroll = () => setStuck(window.scrollY > 6);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      mq.removeEventListener("change", sync);
      window.clearInterval(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  /* the phone bar is one line wide, so each message has a short
     form that says the same thing — no offer is hidden */
  const message = ANNOUNCE[ann]![phone ? 1 : 0];

  return (
    <>
      <a className="skip" href="#view">
        Skip to content
      </a>

      <div className="announce">
        <p id="announce">{message}</p>
      </div>

      <header className={`hdr${stuck ? " is-stuck" : ""}`} id="hdr">
        <div className="hdr-bar">
          <div className="wrap">
            <div className="hdr-row">
              <div className="hdr-side">
                <button
                  className="burger"
                  aria-label="Open menu"
                  aria-expanded={menu}
                  onClick={() => setMenu(true)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                    <path d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                </button>
                <nav className="nav" aria-label="Primary">
                  <Link className="nav-item" href="/shop">Shop</Link>
                  <Link className="nav-item" href="/collections">Collections</Link>
                  <Link className="nav-item" href="/attars">Itra</Link>
                  <Link className="nav-item" href="/journal">Discover</Link>
                  <Link className="nav-item" href="/about">Our Story</Link>
                </nav>
              </div>

              <Link href="/" className="brand" aria-label="ROOH — home">ROOH</Link>

              <div className="hdr-side r">
                <Link className="ibtn" href="/search" aria-label="Search">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" />
                  </svg>
                </Link>
                <button className="ibtn sty-ibtn" onClick={onOpenStylist} aria-label="Fragrance stylist" title="Fragrance stylist">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                    <path d="M20.5 12c0 3.9-3.8 7-8.5 7a9.7 9.7 0 0 1-2.6-.35L4.5 20l1.2-3.4A6.6 6.6 0 0 1 3.5 12c0-3.9 3.8-7 8.5-7s8.5 3.1 8.5 7Z" />
                    <path d="M9 11.6h6M9.8 14.4h4.4" />
                  </svg>
                </button>
                <ThemeButton />
                <Link className="ibtn" href="/account" aria-label="Your account">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                    <circle cx="12" cy="8" r="3.6" /><path d="M4.5 21c0-4 3.4-6 7.5-6s7.5 2 7.5 6" />
                  </svg>
                </Link>
                <Link className="ibtn" href="/account/wishlist" aria-label="Wishlist">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                    <path d="M12 20s-7-4.6-7-9.4A4 4 0 0 1 12 8a4 4 0 0 1 7 2.6C19 15.4 12 20 12 20Z" />
                  </svg>
                </Link>
                <Link className="ibtn" href="/cart" aria-label="Shopping bag" style={{ marginRight: "-8px" }}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                    <path d="M6 7.5h12l1 12.5H5l1-12.5Z" /><path d="M9.2 7.5a2.8 2.8 0 0 1 5.6 0" />
                  </svg>
                  <span className="dot" hidden={count === 0}>{count}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className={`scrim${menu ? " is-open" : ""}`} onClick={() => setMenu(false)} />
      <aside className={`drawer l${menu ? " is-open" : ""}`} aria-label="Menu" aria-hidden={!menu}>
        <div className="drawer-hd">
          <span className="brand" style={{ padding: 0 }}>ROOH</span>
          <button className="ibtn" aria-label="Close menu" onClick={() => setMenu(false)} style={{ marginRight: "-8px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <div className="drawer-body">
          <nav className="mnav" aria-label="Mobile" onClick={() => setMenu(false)}>
            <Link href="/shop">Perfumes</Link>
            <Link href="/attars">Itra</Link>
            <Link href="/collections">Collections</Link>
            <Link href="/discovery">Discovery</Link>
            <Link href="/gifts">Gifts</Link>
            <Link href="/fragrance-finder">Find your scent</Link>
            <Link href="/journal">Journal</Link>
            <Link href="/about">Our story</Link>
          </nav>
          <nav className="mnav mnav-sub" aria-label="Account" style={{ marginTop: "var(--s5)" }} onClick={() => setMenu(false)}>
            <Link href="/account">Your account</Link>
            <Link href="/account/wishlist">Wishlist</Link>
            <Link href="/help">Help &amp; contact</Link>
          </nav>
          <div className="mtheme">
            <span>Appearance</span>
            <ThemeButton labelled />
          </div>
        </div>
      </aside>
    </>
  );
}

function ThemeButton({ labelled }: { labelled?: boolean }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = (() => {
      try {
        return window.localStorage.getItem("rooh.theme");
      } catch {
        return null;
      }
    })();
    if (saved === "dark" || saved === "light") {
      document.documentElement.setAttribute("data-theme", saved);
      setDark(saved === "dark");
    } else {
      setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  const toggle = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem("rooh.theme", next);
    } catch {
      /* storage blocked — the choice just will not persist */
    }
    setDark(!dark);
  };

  if (labelled) {
    return (
      <button type="button" onClick={toggle}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9Z" />
        </svg>
        <span>{dark ? "Light" : "Dark"}</span>
      </button>
    );
  }
  return (
    <button className="ibtn" onClick={toggle} aria-label="Switch theme">
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9Z" />
      </svg>
    </button>
  );
}
