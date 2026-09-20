"use client";
/* ══════════════════════════════════════════════════════════════
   THE BAG, IN THE BROWSER

   This holds slugs and quantities and nothing else. It does not
   hold a price, a discount or a total, and it is never asked what
   anything costs — /api/cart/price answers that, from the
   catalogue, on the server.

   The `snapshot` on a line exists only so the bag can render a
   name before the first round trip. The server ignores it.
   ══════════════════════════════════════════════════════════════ */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { PricedCart, PayMethod, ShipSpeed } from "@/lib/pricing";

export interface BagLine {
  slug: string;
  qty: number;
  snapshot?: { name: string; size: string };
}

interface BagState {
  lines: BagLine[];
  coupon: string | null;
  ship: ShipSpeed;
  pay: PayMethod;
}

interface BagApi extends BagState {
  count: number;
  priced: PricedCart | null;
  pricing: boolean;
  add(slug: string, snapshot?: BagLine["snapshot"]): void;
  setQty(slug: string, qty: number): void;
  remove(slug: string): void;
  clear(): void;
  setCoupon(code: string | null): void;
  setShip(s: ShipSpeed): void;
  setPay(p: PayMethod): void;
}

const KEY = "rooh.bag.v2";
const Ctx = createContext<BagApi | null>(null);

const EMPTY: BagState = { lines: [], coupon: null, ship: "standard", pay: "online" };

function load(): BagState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<BagState>;
    return {
      lines: Array.isArray(parsed.lines) ? parsed.lines.filter((l) => l && typeof l.slug === "string") : [],
      coupon: typeof parsed.coupon === "string" ? parsed.coupon : null,
      ship: parsed.ship === "express" ? "express" : "standard",
      pay: parsed.pay === "cod" ? "cod" : "online",
    };
  } catch {
    return EMPTY;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BagState>(EMPTY);
  const [priced, setPriced] = useState<PricedCart | null>(null);
  const [pricing, setPricing] = useState(false);
  const hydrated = useRef(false);
  const seq = useRef(0);

  /* read storage after mount so the server and the first client
     render agree and React never reports a mismatch */
  useEffect(() => {
    setState(load());
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* private mode, blocked storage — the bag still works for this visit */
    }
  }, [state]);

  /* every total on screen comes back from the server */
  useEffect(() => {
    if (!hydrated.current) return;
    const mine = ++seq.current;
    if (state.lines.length === 0) {
      setPriced(null);
      setPricing(false);
      return;
    }
    setPricing(true);
    const ctrl = new AbortController();
    fetch("/api/cart/price", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        lines: state.lines.map((l) => ({ slug: l.slug, qty: l.qty })),
        coupon: state.coupon,
        ship: state.ship,
        pay: state.pay,
      }),
      signal: ctrl.signal,
    })
      .then((r) => (r.ok ? (r.json() as Promise<PricedCart>) : null))
      .then((data) => {
        if (mine !== seq.current) return;
        setPriced(data);
        setPricing(false);
        /* the server may have trimmed a line it could not honour */
        if (data && data.lines.length !== state.lines.length) {
          setState((s) => ({
            ...s,
            lines: s.lines.filter((l) => data.lines.some((d) => d.slug === l.slug)),
          }));
        }
      })
      .catch(() => {
        if (mine === seq.current) setPricing(false);
      });
    return () => ctrl.abort();
  }, [state]);

  const add = useCallback((slug: string, snapshot?: BagLine["snapshot"]) => {
    setState((s) => {
      const i = s.lines.findIndex((l) => l.slug === slug);
      const lines = [...s.lines];
      if (i > -1) lines[i] = { ...lines[i]!, qty: Math.min(10, lines[i]!.qty + 1) };
      else lines.push({ slug, qty: 1, snapshot });
      return { ...s, lines };
    });
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setState((s) => ({
      ...s,
      lines:
        qty <= 0
          ? s.lines.filter((l) => l.slug !== slug)
          : s.lines.map((l) => (l.slug === slug ? { ...l, qty: Math.min(10, qty) } : l)),
    }));
  }, []);

  const remove = useCallback((slug: string) => {
    setState((s) => ({ ...s, lines: s.lines.filter((l) => l.slug !== slug) }));
  }, []);

  const clear = useCallback(() => setState({ ...EMPTY }), []);
  const setCoupon = useCallback((code: string | null) => setState((s) => ({ ...s, coupon: code })), []);
  const setShip = useCallback((ship: ShipSpeed) => setState((s) => ({ ...s, ship })), []);
  const setPay = useCallback((pay: PayMethod) => setState((s) => ({ ...s, pay })), []);

  const value = useMemo<BagApi>(
    () => ({
      ...state,
      count: state.lines.reduce((a, l) => a + l.qty, 0),
      priced,
      pricing,
      add,
      setQty,
      remove,
      clear,
      setCoupon,
      setShip,
      setPay,
    }),
    [state, priced, pricing, add, setQty, remove, clear, setCoupon, setShip, setPay],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBag(): BagApi {
  const ctx = useContext<BagApi | null>(Ctx);
  if (!ctx) throw new Error("useBag must be used inside <CartProvider>");
  return ctx;
}
