/* ══════════════════════════════════════════════════════════════
   DATA STORE

   ⚠️  THIS IS NOT A PRODUCTION DATABASE.

   A JSON file under ./data so the whole app runs on a laptop with
   no external service. It is not safe for concurrent writes, it has
   no transactions, and it will lose data under load.

   Everything the rest of the app touches goes through the functions
   below, so swapping in Postgres means rewriting this one file and
   nothing else. See SETUP.md for the shape each table needs.
   ══════════════════════════════════════════════════════════════ */
import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { PricedCart, PayMethod, ShipSpeed } from "./pricing";

const DIR = path.join(process.cwd(), "data");
const FILE = path.join(DIR, "store.json");

export interface User {
  id: string;
  email: string;
  first: string;
  last: string;
  phone: string;
  createdAt: number;
  /* Marketing consent is false until the customer ticks the box.
     A pre-ticked box is not consent — see SETUP.md. */
  news: boolean;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2: string;
  landmark: string;
  city: string;
  state: string;
  pin: string;
  country: string;
  isDefault: boolean;
}

export type OrderStatus =
  | "pending_payment"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  userId: string | null;
  email: string;
  createdAt: number;
  status: OrderStatus;
  /** A frozen copy of the priced cart. Never recomputed after this. */
  priced: PricedCart;
  /** Immutable snapshot: editing the address book must not rewrite history. */
  shipTo: Omit<Address, "userId" | "isDefault">;
  ship: ShipSpeed;
  pay: PayMethod;
  payment: {
    provider: "razorpay" | "cod";
    orderId?: string;
    paymentId?: string;
    verifiedAt?: number;
  };
  giftNote: string | null;
}

export interface OtpChallenge {
  id: string;
  email: string;
  /** HMAC of the code. The code itself is never stored. */
  hash: string;
  expiresAt: number;
  attempts: number;
  resends: number;
  createdAt: number;
}

interface Shape {
  users: User[];
  addresses: Address[];
  orders: Order[];
  otps: OtpChallenge[];
  newsletter: { email: string; at: number }[];
}

const EMPTY: Shape = { users: [], addresses: [], orders: [], otps: [], newsletter: [] };

function read(): Shape {
  try {
    if (!fs.existsSync(FILE)) return structuredClone(EMPTY);
    const parsed = JSON.parse(fs.readFileSync(FILE, "utf8")) as Partial<Shape>;
    return { ...structuredClone(EMPTY), ...parsed };
  } catch {
    return structuredClone(EMPTY);
  }
}

function write(data: Shape): void {
  fs.mkdirSync(DIR, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf8");
}

function mutate<T>(fn: (data: Shape) => T): T {
  const data = read();
  const out = fn(data);
  write(data);
  return out;
}

export const store = {
  /* ── users ─────────────────────────────────────────────── */
  findUserByEmail(email: string): User | undefined {
    const want = email.trim().toLowerCase();
    return read().users.find((u) => u.email === want);
  },
  findUser(id: string): User | undefined {
    return read().users.find((u) => u.id === id);
  },
  upsertUser(user: User): User {
    return mutate((d) => {
      const i = d.users.findIndex((u) => u.id === user.id);
      if (i > -1) d.users[i] = user;
      else d.users.push(user);
      return user;
    });
  },
  deleteUser(id: string): void {
    mutate((d) => {
      d.users = d.users.filter((u) => u.id !== id);
      d.addresses = d.addresses.filter((a) => a.userId !== id);
      /* Orders are deliberately NOT deleted. Indian tax and
         accounting rules require sales records to be retained, so
         they are detached from the profile instead of erased. The
         account page says this in as many words. */
      d.orders = d.orders.map((o) => (o.userId === id ? { ...o, userId: null } : o));
    });
  },

  /* ── addresses ─────────────────────────────────────────── */
  addressesFor(userId: string): Address[] {
    return read().addresses.filter((a) => a.userId === userId);
  },
  saveAddress(addr: Address): Address {
    return mutate((d) => {
      if (addr.isDefault) {
        d.addresses = d.addresses.map((a) =>
          a.userId === addr.userId ? { ...a, isDefault: false } : a,
        );
      }
      const i = d.addresses.findIndex((a) => a.id === addr.id);
      if (i > -1) d.addresses[i] = addr;
      else d.addresses.push(addr);
      return addr;
    });
  },
  deleteAddress(userId: string, id: string): void {
    mutate((d) => {
      d.addresses = d.addresses.filter((a) => !(a.id === id && a.userId === userId));
    });
  },

  /* ── orders ────────────────────────────────────────────── */
  createOrder(order: Order): Order {
    return mutate((d) => {
      d.orders.push(order);
      return order;
    });
  },
  findOrder(id: string): Order | undefined {
    return read().orders.find((o) => o.id === id);
  },
  /** A scan here; in a real database this is an index on payment.orderId. */
  findOrderByProviderOrderId(providerOrderId: string): Order | undefined {
    return read().orders.find((o) => o.payment.orderId === providerOrderId);
  },
  ordersFor(userId: string): Order[] {
    return read()
      .orders.filter((o) => o.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },
  updateOrder(id: string, patch: Partial<Order>): Order | undefined {
    return mutate((d) => {
      const i = d.orders.findIndex((o) => o.id === id);
      if (i < 0) return undefined;
      d.orders[i] = { ...d.orders[i]!, ...patch };
      return d.orders[i];
    });
  },

  /* ── one-time codes ────────────────────────────────────── */
  createOtp(c: OtpChallenge): OtpChallenge {
    return mutate((d) => {
      d.otps = d.otps.filter((o) => o.expiresAt > Date.now());
      d.otps.push(c);
      return c;
    });
  },
  findOtp(id: string): OtpChallenge | undefined {
    return read().otps.find((o) => o.id === id);
  },
  updateOtp(id: string, patch: Partial<OtpChallenge>): void {
    mutate((d) => {
      const i = d.otps.findIndex((o) => o.id === id);
      if (i > -1) d.otps[i] = { ...d.otps[i]!, ...patch };
    });
  },
  consumeOtp(id: string): void {
    mutate((d) => {
      d.otps = d.otps.filter((o) => o.id !== id);
    });
  },
  recentOtpsFor(email: string, sinceMs: number): OtpChallenge[] {
    const cut = Date.now() - sinceMs;
    return read().otps.filter((o) => o.email === email && o.createdAt > cut);
  },

  /* ── newsletter ────────────────────────────────────────── */
  subscribe(email: string): void {
    mutate((d) => {
      if (!d.newsletter.some((n) => n.email === email)) {
        d.newsletter.push({ email, at: Date.now() });
      }
    });
  },
  unsubscribe(email: string): void {
    mutate((d) => {
      d.newsletter = d.newsletter.filter((n) => n.email !== email);
    });
  },
};
