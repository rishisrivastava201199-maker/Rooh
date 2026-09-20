/* Money and text helpers shared by the server and the browser. */

export const inr = (n: number): string =>
  "₹" + Number(n || 0).toLocaleString("en-IN");

export const clamp = (n: number, a: number, b: number): number =>
  Math.max(a, Math.min(b, n));

export const pct = (mrp: number, price: number): number =>
  mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

export const titleCase = (s: string): string =>
  s.charAt(0).toUpperCase() + s.slice(1);
