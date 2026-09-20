/* Generated from the audited prototype — values were read out of the
   running page, never retyped, so nothing drifted in transcription.
   Edit here; this is the source of truth for the app. */

import { PRODUCTS, type Product } from "./products";

export interface Collection {
  slug: string;
  kind: "family" | "occasion" | "edit";
  title: string;
  tag: string;
  desc: string;
  items?: string[];
}

export const COLLECTIONS: Collection[] = [
  {
    slug: "oud",
    kind: "family",
    title: "Oud",
    tag: "Resinous. Smoky. Unmistakable.",
    desc: "Agarwood is the most expensive raw material in perfumery, which is why almost everything at this price — ours included — is built on a composed oud accord rather than the distillate. What you get is the character: dry, resinous, a little smoky, and considerably smoother than raw agarwood."
  },
  {
    slug: "woody",
    kind: "family",
    title: "Woody",
    tag: "Warm. Grounded. Refined.",
    desc: "Wood is the backbone of Indian perfumery. Sandalwood, cedar and dry woods — warmer than the European reading of the family, and better in cool air than in heat."
  },
  {
    slug: "floral",
    kind: "family",
    title: "Floral",
    tag: "Rose, jasmine, saffron.",
    desc: "India grows some of the finest rose and jasmine in the world. Composed the Indian way: warmer and rounder than a European floral, with spice and wood underneath rather than green freshness on top."
  },
  {
    slug: "fresh",
    kind: "family",
    title: "Fresh",
    tag: "Citrus and cut green stems.",
    desc: "Built for Indian heat. Green, citrus-lifted and dry — the compositions that stay comfortable above thirty-five degrees, when anything sweet turns cloying."
  },
  {
    slug: "musky",
    kind: "family",
    title: "Musk",
    tag: "Quiet. Close to the skin.",
    desc: "The quietest thing in perfumery and often the most memorable. These read as clean skin rather than as a scent, which is exactly why they work underneath everything else."
  },
  {
    slug: "oriental",
    kind: "family",
    title: "Amber",
    tag: "Resin, vanilla, golden warmth.",
    desc: "Warm, resinous and spice-led. The richest compositions in the range, and the ones that perform best after dark and in cooler weather."
  },
  {
    slug: "spicy",
    kind: "family",
    title: "Spicy",
    tag: "Cardamom, pepper, cinnamon.",
    desc: "Spice is what keeps Indian perfumery from reading as sweet. Cardamom, pepper and cinnamon give warmth without sugar."
  },
  {
    slug: "earthy",
    kind: "family",
    title: "Earthy",
    tag: "Wet clay and vetiver root.",
    desc: "The most distinctly Indian part of the catalogue. Petrichor and khus root — materials Western perfumery has almost no equivalent for."
  },
  {
    slug: "everyday",
    kind: "occasion",
    title: "Everyday",
    tag: "The ones you reach for without thinking.",
    desc: "Moderate, well-mannered compositions that work in an office, on a commute and in a lift. Nothing here will announce you before you arrive."
  },
  {
    slug: "evening",
    kind: "occasion",
    title: "After Dark",
    tag: "Richer, warmer, closer.",
    desc: "Built for cooler air and lower light. Deeper woods, more spice, more presence — worn when the occasion has some weight to it."
  },
  {
    slug: "wedding",
    kind: "occasion",
    title: "For Weddings",
    tag: "For the occasion, and for the guests.",
    desc: "The compositions we would choose to give, plus the sets that work as return gifts. For twenty units and above we quote directly rather than making you use a coupon."
  },
  {
    slug: "festive",
    kind: "occasion",
    title: "Festive",
    tag: "Diwali, Eid and everything between.",
    desc: "Worn and given during festival weeks. Warm, celebratory, and presented in a rigid carton that needs no wrapping."
  },
  {
    slug: "office",
    kind: "occasion",
    title: "For the Office",
    tag: "Present, not pervasive.",
    desc: "Fragrance at work is a question of restraint. Everything here sits close to the skin and stays comfortable in an air-conditioned room."
  },
  {
    slug: "date",
    kind: "occasion",
    title: "Date",
    tag: "Close range, on purpose.",
    desc: "Compositions that reward proximity rather than projection — the ones that work at conversational distance."
  },
  {
    slug: "itra",
    kind: "edit",
    title: "The Itra Collection",
    tag: "Alcohol-free. Oil-based. Traditional.",
    desc: "Concentrated fragrance oils made the traditional way — applied in drops rather than sprays, worn close to the skin, and lasting longer than they project.",
    items: ["mitti-itra", "gulab-itra", "khus-itra", "itra-discovery-box"]
  },
  {
    slug: "gifts",
    kind: "edit",
    title: "Gifting",
    tag: "Ready to give, nothing to wrap.",
    desc: "Presented in rigid boxes, with a handwritten note if you want one. We leave the invoice out of the parcel when a gift note is attached.",
    items: ["signature-duo", "itra-discovery-box", "discovery-collection", "rose-and-saffron"]
  },
  {
    slug: "start-here",
    kind: "edit",
    title: "Where to Start",
    tag: "The six we would hand you first.",
    desc: "A ranking by units sold is the honest way to run this shelf, and we will run it that way once there are units sold. Nothing has shipped yet, so for now these six are chosen by hand — the two families most people get on with, the set that lets you try five, and one itra. We would rather tell you it is hand-picked than dress a hand-picked list up as data.",
    items: [
      "oud-and-woods",
      "discovery-collection",
      "rose-and-saffron",
      "royal-musk",
      "mitti-itra",
      "indian-vetiver"
    ]
  }
];

export const collBySlug = (s: string): Collection | undefined =>
  COLLECTIONS.find((c) => c.slug === s);

export function collProducts(c: Collection | undefined): Product[] {
  if (!c) return [];
  if (c.items)
    return c.items
      .map((s) => PRODUCTS.find((p) => p.slug === s))
      .filter((p): p is Product => Boolean(p));
  if (c.kind === "family") return PRODUCTS.filter((p) => p.fams.includes(c.slug));
  if (c.kind === "occasion") return PRODUCTS.filter((p) => p.occ.includes(c.slug));
  return [];
}
