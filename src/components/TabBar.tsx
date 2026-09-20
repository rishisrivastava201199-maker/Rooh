"use client";
/* The phone's navigation (stage 9). Five destinations under a
   thumb, clearing the home indicator via the safe-area inset.

   Two rules carried over from the audit: the lit tab follows the
   route rather than the tap, and the bag count mirrors the header's
   own count rather than recounting, so the two cannot disagree. */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBag } from "./CartProvider";

export function TabBar({ onOpenStylist }: { onOpenStylist?: () => void }) {
  const path = usePathname() || "/";
  const { count } = useBag();

  const on = /^\/(shop|collections|attars|gifts|discovery|product|search)/.test(path)
    ? "shop"
    : /^\/account/.test(path)
      ? "you"
      : /^\/(cart|checkout)/.test(path)
        ? "bag"
        : "";

  const mark = (k: string) => (on === k ? ({ "aria-current": "page" } as const) : {});

  return (
    <nav className="tabbar" id="tabbar" aria-label="Main">
      <div className="tabbar-in">
        <Link className="tab" data-tab="shop" href="/shop" {...mark("shop")}>
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            <path d="M4 8h16l-1 12H5L4 8Z" /><path d="M8.5 8a3.5 3.5 0 0 1 7 0" />
          </svg>
          <span>Shop</span>
        </Link>

        <Link className="tab" data-tab="search" href="/search">
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.6-3.6" />
          </svg>
          <span>Search</span>
        </Link>

        <button className="tab" type="button" data-tab="stylist" onClick={onOpenStylist}>
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            <path d="M12 4v3M12 17v3M5.6 7.6l2.1 2.1M16.3 14.3l2.1 2.1M4 12h3M17 12h3M5.6 16.4l2.1-2.1M16.3 9.7l2.1-2.1" />
            <circle cx="12" cy="12" r="2.4" />
          </svg>
          <span>Stylist</span>
        </button>

        <Link className="tab" data-tab="bag" href="/cart" {...mark("bag")}>
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            <path d="M6 7.5h12l1 12.5H5l1-12.5Z" /><path d="M9.2 7.5a2.8 2.8 0 0 1 5.6 0" />
          </svg>
          <span>Bag</span>
          <span className="dot" hidden={count === 0}>{count}</span>
        </Link>

        <Link className="tab" data-tab="you" href="/account" {...mark("you")}>
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            <circle cx="12" cy="8" r="3.6" /><path d="M4.5 21c0-4 3.4-6 7.5-6s7.5 2 7.5 6" />
          </svg>
          <span>You</span>
        </Link>
      </div>
    </nav>
  );
}
