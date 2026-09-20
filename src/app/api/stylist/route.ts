/* ══════════════════════════════════════════════════════════════
   THE STYLIST

   The browser sends a sentence and the profile built so far. The
   server reads preferences out of the sentence with the same
   deterministic matcher the prototype used, merges them, and ranks
   with the Stage 7 engine over the real catalogue.

   The reply carries only the products the engine chose, with the
   reasons it chose them. Nothing here can mint a fragrance, a note
   or a price, because nothing here constructs one.

   If you put a language model behind this later, its job is to
   phrase `say` and to fill `delta` — not to pick products. Keep
   recommend() where it is.
   ══════════════════════════════════════════════════════════════ */
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  blankProfile, extract, applyDelta, recommend, enoughInformation,
  type Profile,
} from "@/lib/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ProfileSchema = z.object({
  who: z.string().max(40),
  occasion: z.array(z.string().max(40)).max(8),
  season: z.string().max(40),
  family: z.array(z.string().max(40)).max(8),
  intensity: z.string().max(40),
  type: z.string().max(40),
  budget: z.string().max(40),
  dislike: z.array(z.string().max(40)).max(8),
  notes: z.array(z.string().max(60)).max(12),
});

const Body = z.object({
  message: z.string().min(1).max(600),
  profile: ProfileSchema.nullable().optional(),
});

/* the order questions are asked in, and the chips for each */
const ASK: [key: keyof Profile, text: string, chips: [string, string][]][] = [
  ["family", "What kind of thing do you usually enjoy?", [
    ["Wood and smoke", "I like woody, smoky things"],
    ["Rose and flowers", "I like floral, rose"],
    ["Fresh and green", "something fresh and green"],
    ["Earth after rain", "earthy, like mitti"],
    ["Warm amber", "warm amber and vanilla"],
    ["Clean skin", "soft clean musk"],
  ]],
  ["occasion", "And when would you wear it most?", [
    ["Every day", "everyday wear"], ["Office", "for the office"],
    ["Evenings", "for evenings"], ["A wedding", "for a wedding"],
    ["Festivals", "for festivals"], ["A date", "for a date"],
  ]],
  ["season", "What is the weather like where it will be worn?", [
    ["Hot", "hot most of the year"], ["Humid and rainy", "monsoon, humid"],
    ["Cold winters", "proper winters"], ["All four", "all year round"],
  ]],
  ["intensity", "How noticeable should it be?", [
    ["Close to me", "subtle, close to the skin"],
    ["Noticeable", "noticeable in a room"],
    ["Make an entrance", "strong, I want it noticed"],
  ]],
  ["budget", "Is there a budget I should stay inside?", [
    ["Under ₹500", "under 500"], ["₹500 to ₹1,000", "around 1000"],
    ["Over ₹1,000", "above 1000"], ["No limit", "no budget limit"],
  ]],
];

const filled = (p: Profile, k: keyof Profile): boolean => {
  const v = p[k];
  return Array.isArray(v) ? v.length > 0 : Boolean(v);
};

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Expected JSON." }, { status: 400 });
  }
  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "That request did not look right." }, { status: 400 });
  }

  const profile: Profile = parsed.data.profile
    ? { ...blankProfile(), ...parsed.data.profile }
    : blankProfile();

  const read = extract(parsed.data.message);
  applyDelta(profile, read.delta);

  const say: string[] = [];
  if (read.empty) {
    say.push(
      "I did not catch a preference in that. You can tell me a smell you like, an occasion, " +
        "a budget, or how noticeable you want it to be.",
    );
  } else {
    say.push("Noted — " + read.matched.join(", ") + ".");
  }
  if (read.mode === "beginner") {
    say.push("And no jargon from me — I will keep it in plain words.");
  }

  const asked = ASK.filter(([k]) => filled(profile, k)).length;
  const ready = enoughInformation(profile, new Array(asked).fill("x")) || asked >= 4;

  if (!ready) {
    const next = ASK.find(([k]) => !filled(profile, k));
    if (next) {
      return NextResponse.json({
        say,
        ask: { text: next[1], chips: [...next[2], ["Skip this", "skip"] as [string, string]] },
        recs: null,
        profile,
      });
    }
  }

  const res = recommend(profile, 3);
  if (!res.list.length) {
    say.push(
      "I could not find anything in the range that fits. Rather than guess, here is the honest " +
        "answer: try the Discovery Collection and let your skin decide.",
    );
    return NextResponse.json({ say, ask: null, recs: null, profile });
  }

  if (res.relaxed.length) {
    say.push(
      "I could not find an exact match, so I set aside " +
        res.relaxed.join(", then ") +
        " to find the closest options. Everything else you told me still applies.",
    );
  } else {
    say.push("Here is what I would put in your hands, ranked against the eleven fragrances we actually make.");
  }

  /* only what the engine chose, read straight off the record */
  const recs = res.list.map((r) => ({
    slug: r.p.slug,
    name: r.p.name,
    family: r.p.family,
    size: r.p.size,
    price: r.p.price,
    mrp: r.p.mrp,
    pct: r.pct,
    why: r.why,
    against: r.against,
    longev: r.p.longev,
    sillage: r.p.sillage,
  }));

  return NextResponse.json({ say, ask: null, recs, profile });
}
