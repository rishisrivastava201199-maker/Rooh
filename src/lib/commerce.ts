/* Generated from the audited prototype — values were read out of the
   running page, never retyped, so nothing drifted in transcription.
   Edit here; this is the source of truth for the app. */

export const COMMERCE = {
  freeShip: 999,
  shipping: 79,
  express: 149,
  codFee: 49,
  codMax: 5000,
  gst: 0.18,
  returnDays: 7
} as const;

export const SORTS: Record<string, string> = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  name: "Name: A–Z",
  longevity: "Longest lasting"
};
