/* ══════════════════════════════════════════════════════════════
   RECOMMENDATION ENGINE  (stage 7) and PREFERENCE EXTRACTION (8)

   Ported unchanged from the audited prototype. Two properties the
   tests there pinned down and that must not drift:

     · recommend() can only ever return objects already in
       PRODUCTS. It cannot invent a fragrance, a note or a price.
     · extract() reads a sentence against ROOH's own vocabulary.
       No language model is involved. If you add one, its job is to
       phrase the reply and fill this same profile shape — it is
       never handed the catalogue and never picks the products.
   ══════════════════════════════════════════════════════════════ */
import { PRODUCTS, FAM_LABEL, OCC_LABEL, SEASON_LABEL, INT_LABEL, TYPE_LABEL, type Product } from "./products";
import { DETAIL } from "./detail";

export interface Profile {
  who: string;
  occasion: string[];
  season: string;
  family: string[];
  intensity: string;
  type: string;
  budget: string;
  dislike: string[];
  notes: string[];
}

export interface Scored {
  p: Product;
  score: number;
  pct: number;
  why: string[];
  against: string[];
}

export interface Recommendation {
  list: Scored[];
  all: Scored[];
  relaxed: string[];
  decisive: boolean;
}

export interface Delta { [k: string]: unknown }
export interface Extraction {
  delta: Delta;
  matched: string[];
  mode: string | null;
  empty: boolean;
}

export const MAX_QUESTIONS = 6;

export const WEIGHTS: Record<string, number> = { family: 30, notes: 20, occasion: 15, budget: 10, season: 10, intensity: 5, longevity: 5, popularity: 5 };

export const WEIGHT_TOTAL: number = Object.keys(WEIGHTS).reduce((s, k) => s + WEIGHTS[k]!, 0);

export const FAMILY_PLAIN: Record<string, string> = {
  woody: "Wood and dry cedar",
  oud: "Smoke and resin",
  floral: "Flowers — rose and jasmine",
  fresh: "Green, citrus, cut stems",
  earthy: "Wet earth after rain",
  musky: "Clean skin, barely there",
  oriental: "Warm amber and vanilla",
  spicy: "Cardamom and pepper"
};

/* Each dislike is a rule over the catalogue, not a keyword match.
   Three of the four read the measured fragrance profile rather than
   the family, which is why "nothing sweet" can rule out a woody
   composition that happens to score high on sweetness. */
export const DISLIKE_MAP: Record<string, { label: string; test: (p: Product) => boolean }> = {
  sweet: {
    label: "Sweetness",
    test: (p) => Boolean(DETAIL[p.slug] && (DETAIL[p.slug]!.profile as Record<string, number>)?.Sweet >= 6),
  },
  smoke: {
    label: "Smoke and resin",
    test: (p) => p.fams.indexOf("oud") > -1 || p.fams.indexOf("oriental") > -1,
  },
  floral: {
    label: "Strong florals",
    test: (p) => Boolean(DETAIL[p.slug] && (DETAIL[p.slug]!.profile as Record<string, number>)?.Floral >= 7),
  },
  heavy: { label: "Anything heavy", test: (p) => p.intensity === "strong" },
};

export const LEX: Record<string, Record<string, string[]>> = {
  family: {
    oud: ["oud", "agarwood", "oudh", "smoky", "smoke", "resin", "resinous"],
    woody: ["wood", "woody", "cedar", "sandalwood", "sandal", "chandan", "dry wood"],
    floral: ["floral", "flower", "rose", "gulab", "jasmine", "mogra", "chameli", "saffron", "kesar"],
    fresh: ["fresh", "citrus", "lemon", "bergamot", "green", "aquatic", "clean air", "light"],
    earthy: ["earthy", "earth", "mitti", "soil", "petrichor", "rain", "vetiver", "khus", "root"],
    musky: ["musk", "musky", "skin", "subtle", "soft", "powdery"],
    oriental: ["amber", "vanilla", "warm", "oriental", "sweet", "honey", "resinous warmth"],
    spicy: ["spicy", "spice", "cardamom", "pepper", "cinnamon", "clove", "elaichi"]
  },
  occasion: {
    wedding: ["wedding", "shaadi", "shadi", "marriage", "baraat", "reception", "nikah"],
    office: ["office", "work", "meeting", "workplace", "professional", "corporate"],
    everyday: ["everyday", "daily", "every day", "day to day", "casual", "regular", "routine"],
    date: ["date", "dinner date", "romantic", "anniversary"],
    evening: ["evening", "night", "after dark", "party", "dinner", "going out"],
    festive: ["festival", "festive", "diwali", "eid", "holi", "puja", "celebration", "navratri"]
  },
  season: {
    summer: ["summer", "hot", "heat", "warm weather", "garmi", "humid heat"],
    winter: ["winter", "cold", "chilly", "sardi", "december"],
    monsoon: ["monsoon", "rain", "rainy", "humid", "barish"],
    "all-season": ["all year", "year round", "all seasons", "any weather", "every season"]
  },
  intensity: {
    soft: ["subtle", "light", "soft", "close", "discreet", "not loud", "barely", "mild", "gentle"],
    moderate: ["moderate", "balanced", "noticeable", "medium", "present"],
    strong: ["strong", "bold", "loud", "heavy", "powerful", "announce", "long lasting", "intense", "beast"]
  },
  type: {
    attar: [
      "attar",
      "itra",
      "ittar",
      "oil based",
      "oil-based",
      "non alcoholic",
      "alcohol free",
      "roll on"
    ],
    edp: ["spray", "sprays", "eau de parfum", "edp", "alcohol based", "alcohol-based"]
  },
  dislike: {
    sweet: ["sweet", "sugary", "gourmand", "vanilla heavy", "too sweet"],
    smoke: ["smoky", "smoke", "oud", "resin", "medicinal"],
    floral: ["floral", "flowery", "rose", "too floral"],
    heavy: ["heavy", "overpowering", "too strong", "strong", "loud", "cloying"]
  }
};
export const NEG: string[] = [
  "not",
  "no",
  "nothing",
  "avoid",
  "without",
  "dislike",
  "hate",
  "don't",
  "dont",
  "less",
  "too",
  "except",
  "other than",
  "apart from"
];
export const GIFT: string[] = [
  "gift",
  "present",
  "for my",
  "for her",
  "for him",
  "for a friend",
  "for wife",
  "for husband",
  "for mother",
  "for father",
  "for sister",
  "for brother",
  "birthday",
  "anniversary gift"
];
export const BEGINNER: string[] = [
  "don't know",
  "dont know",
  "no idea",
  "new to",
  "never worn",
  "first time",
  "beginner",
  "not sure",
  "confused",
  "help me understand",
  "what is"
];
export const EXPERT: string[] = [
  "accord",
  "dry down",
  "drydown",
  "sillage",
  "projection",
  "concentration",
  "notes pyramid",
  "base note",
  "top note",
  "aldehyde",
  "absolute",
  "macerat"
];

export const QUESTIONS: QuestionLike[] = [
  {
    key: "who",
    kind: "single",
    opts: [
      ["Myself", "me", "Something you will wear"],
      ["A gift", "gift", "For someone else"]
    ]
  },
  {
    key: "family",
    kind: "multi",
    max: 2,
    opts: [
      ["Wood and dry cedar", "woody", "Woody"],
      ["Smoke and resin", "oud", "Oud"],
      ["Flowers — rose and jasmine", "floral", "Floral"],
      ["Green, citrus, cut stems", "fresh", "Fresh"],
      ["Wet earth after rain", "earthy", "Earthy"],
      ["Clean skin, barely there", "musky", "Musk"],
      ["Warm amber and vanilla", "oriental", "Amber"],
      ["Cardamom and pepper", "spicy", "Spicy"]
    ]
  },
  {
    key: "occasion",
    kind: "multi",
    max: 2,
    opts: [
      ["Everyday", "everyday", ""],
      ["Office", "office", ""],
      ["Date", "date", ""],
      ["Wedding", "wedding", ""],
      ["Evening", "evening", ""],
      ["Festive", "festive", ""],
      ["No particular occasion", "any", ""]
    ]
  },
  {
    key: "season",
    kind: "single",
    opts: [
      ["Hot most of the year", "summer", "Above thirty for months"],
      ["Humid and rainy", "monsoon", "Monsoon country"],
      ["Proper winters", "winter", "Cold enough for wool"],
      ["All four seasons", "all-season", "A bit of everything"]
    ]
  },
  {
    key: "intensity",
    kind: "single",
    opts: [
      ["Only to people close by", "soft", "Skin scent"],
      ["Noticeable in a room", "moderate", "Present, not loud"],
      ["It should announce itself", "strong", "Makes an entrance"],
      ["No strong feeling", "any", ""]
    ]
  },
  {
    key: "type",
    kind: "single",
    opts: [
      ["A spray, like most perfume", "edp", "Eau de parfum"],
      ["A traditional itra", "attar", "Applied in drops"],
      ["Either is fine", "any", ""]
    ]
  },
  {
    key: "budget",
    kind: "single",
    opts: [
      ["Under ₹500", "low", ""],
      ["₹500 to ₹1,000", "mid", ""],
      ["₹1,000 and above", "high", ""],
      ["Whatever suits best", "any", ""]
    ]
  },
  {
    key: "dislike",
    kind: "multi",
    max: 3,
    opts: [
      ["Sweetness", "sweet", ""],
      ["Smoke and resin", "smoke", ""],
      ["Strong florals", "floral", ""],
      ["Anything heavy", "heavy", ""],
      ["Nothing in particular", "none", ""]
    ]
  }
];

export interface QuestionLike {
  key: string;
  kind?: string;
  ask?: string;
  hint?: string;
  max?: number;
  skip?: string;
  opts: [label: string, value: string, hint?: string][];
  optional?: boolean;
  skipInGift?: boolean;
}

const BUDGET_BANDS: Record<string, [number, number]> = { low:[0,499], mid:[500,1000], high:[1000,1e6], any:[0,1e6] };

const RELAX_ORDER: [key: string, label: string][] = [["budget","budget"],["intensity","how noticeable it is"],
                     ["season","the weather"],["occasion","the occasion"]];

function topThree(prof: Profile): string {
  return recommend(prof, 3).list.map(function(r){ return r.p.slug; }).join("|");
}

export function questionMatters(q: QuestionLike, prof: Profile, askedCount: number): boolean {
  if (q.skipInGift && prof.who === "gift") return false;
  /* the first two questions always run — nothing is known yet, so a
     simulation would be meaningless */
  if (q.optional !== true && (askedCount || 0) < 2) return true;
  const base = topThree(prof);
  return q.opts.some(function(o){
    if (o[1] === "none") return false;
    const test = JSON.parse(JSON.stringify(prof));
    if (q.kind === "multi") test[q.key] = [o[1]]; else test[q.key] = o[1];
    return topThree(test) !== base;
  });
}

function lexHit(text: string, bag: string[]): boolean {
  return bag.some((w) => text.indexOf(w) > -1);
}

export function blankProfile(): Profile {
  return { who:"", occasion:[], season:"", family:[], intensity:"", type:"",
           budget:"", dislike:[], notes:[] };
}

export function scoreProduct(p: Product, prof: Profile, relax: Record<string, boolean>): Scored {
  relax = relax || {};
  let score = 0; const why = [], against = [];

  /* family — the strongest signal */
  if (prof.family.length){
    const hit = prof.family.filter(function(f){ return p.fams.indexOf(f) > -1; });
    const frac = hit.length / prof.family.length;
    score += WEIGHTS.family * frac;
    if (hit.length) why.push("built on " + hit.map(function(f){ return (FAM_LABEL[f]||f).toLowerCase(); }).join(" and "));
  } else score += WEIGHTS.family * 0.5;

  /* notes the profile named explicitly (the stylist supplies these) */
  if (prof.notes && prof.notes.length){
    const all = ([] as string[]).concat(p.notes.top, p.notes.heart, p.notes.base).map((n) => n.toLowerCase());
    const hit = prof.notes.filter(function(n){ return all.some(function(x){ return x.indexOf(n.toLowerCase()) > -1; }); });
    score += WEIGHTS.notes * (hit.length / prof.notes.length);
    if (hit.length) why.push("contains " + hit.join(" and "));
  } else score += WEIGHTS.notes * 0.5;

  /* occasion */
  if (prof.occasion.length && prof.occasion.indexOf("any") === -1 && !relax.occasion){
    const hit = prof.occasion.filter(function(o){ return p.occ.indexOf(o) > -1; });
    score += WEIGHTS.occasion * (hit.length / prof.occasion.length);
    if (hit.length) why.push("suits " + hit.map(function(o){ return (OCC_LABEL[o]||o).toLowerCase(); }).join(" and ") + " wear");
    else against.push("not composed for " + prof.occasion.map(function(o){ return (OCC_LABEL[o]||o).toLowerCase(); }).join(" or "));
  } else score += WEIGHTS.occasion * 0.6;

  /* budget */
  if (prof.budget && prof.budget !== "any" && !relax.budget){
    const b = BUDGET_BANDS[prof.budget];
    if (p.price >= b[0] && p.price <= b[1]){ score += WEIGHTS.budget; why.push("inside your budget"); }
    else if (p.price <= b[1] * 1.25) score += WEIGHTS.budget * 0.4;
    else against.push("above the budget you chose");
  } else score += WEIGHTS.budget * 0.6;

  /* season / climate */
  if (prof.season && !relax.season){
    if (p.seasons.indexOf(prof.season) > -1){ score += WEIGHTS.season; why.push("holds up in " + (SEASON_LABEL[prof.season]||prof.season).toLowerCase()); }
    else if (p.seasons.indexOf("all-season") > -1) score += WEIGHTS.season * 0.6;
    else against.push("better in " + p.seasons.map(function(s){ return (SEASON_LABEL[s]||s).toLowerCase(); }).join(" or "));
  } else score += WEIGHTS.season * 0.6;

  /* intensity */
  const ORDER = ["soft","moderate","strong"];
  if (prof.intensity && prof.intensity !== "any" && !relax.intensity){
    const d = Math.abs(ORDER.indexOf(p.intensity) - ORDER.indexOf(prof.intensity));
    score += WEIGHTS.intensity * (d === 0 ? 1 : d === 1 ? 0.5 : 0);
    if (d === 0) why.push("projects about as much as you asked for");
  } else score += WEIGHTS.intensity * 0.6;

  /* longevity — our measured upper bound */
  score += WEIGHTS.longevity * Math.min(1, (p.longev[1] - 4) / 5);

  /* availability and how often it is actually bought */
  score += WEIGHTS.popularity * ((12 - p.rank) / 11) * (p.stock > 0 ? 1 : 0.2);

  /* product type is a hard filter rather than a weight */
  if (prof.type && prof.type !== "any"){
    if (prof.type === "edp" && p.type === "attar") score *= 0.25;
    if (prof.type === "attar" && p.type === "edp") score *= 0.25;
  }
  /* things they said to avoid */
  (prof.dislike||[]).forEach(function(d){
    const rule = DISLIKE_MAP[d];
    if (rule && rule.test(p)){ score *= 0.45; against.push("leans towards " + rule.label.toLowerCase()); }
  });
  /* a gift for someone whose taste is unknown favours sets */
  if (prof.who === "gift" && p.type === "set"){ score += 8; why.push("a set removes the guesswork in a gift"); }

  return { p:p, score:Math.round(score * 10) / 10, pct:Math.round(score / WEIGHT_TOTAL * 100), why:why, against:against };
}

export function recommend(prof: Profile, n: number): Recommendation {
  n = n || 3;
  /* A discovery or gift set carries every family in its record, so it
     would win any family query by construction. The finder ranks
     fragrances; sets are offered separately below the results, and
     only enter the ranking when the profile says it is a gift or the
     customer explicitly asked for a set. */
  const pool = PRODUCTS.filter(function(p){
    if (p.stock <= 0) return false;
    if (p.type === "set") return prof.who === "gift" || prof.type === "set";
    return true;
  });
  const relax: Record<string, boolean> = {};
  const relaxed: string[] = [];
  let ranked = pool.map(function(p){ return scoreProduct(p, prof, relax); })
                   .sort(function(a,b){ return b.score - a.score; });

  /* below half the possible score is not a match, whatever we call it;
     loosen one constraint at a time and say which one moved */
  let i = 0;
  while (ranked.length && ranked[0].pct < 50 && i < RELAX_ORDER.length){
    const step = RELAX_ORDER[i]!;
    relax[step[0]] = true;
    relaxed.push(step[1]);
    ranked = pool.map(function(p){ return scoreProduct(p, prof, relax); })
                 .sort(function(a,b){ return b.score - a.score; });
    i++;
  }
  return { list:ranked.slice(0, n), all:ranked, relaxed:relaxed,
           decisive: ranked.length > 1 && (ranked[0].score - ranked[1].score) >= 8 };
}

export function enoughInformation(prof: Profile, asked: string[]): boolean {
  if (asked.length >= MAX_QUESTIONS) return true;
  if (asked.length < 4) return false;
  if (recommend(prof, 3).decisive) return true;
  return QUESTIONS.filter(function(q){ return asked.indexOf(q.key) === -1; })
    .every(function(q){ return !questionMatters(q, prof, asked.length); });
}

function negatedNear(text: string, term: string): boolean {
  const i = text.indexOf(term);
  if (i < 0) return false;
  const before = text.slice(Math.max(0, i - 42), i);
  return NEG.some(function(n){ return before.indexOf(n) > -1; });
}

function parseBudget(text: string): string | null {
  const m = text.match(/(?:under|below|less than|upto|up to|within|around|about|roughly|max(?:imum)?|budget(?:\s*(?:of|is))?|spend(?:ing)?|price)\s*(?:₹|rs\.?|inr)?\s*(\d{3,6})/);
  const n = text.match(/(?:₹|rs\.?|inr)\s*(\d{3,6})/);
  const raw = m ? m[1] : (n ? n[1] : null);
  if (!raw) return null;
  /* "under 500" names a ceiling, not a target — 500 itself is outside it */
  const ceiling = /(?:under|below|less than|upto|up to|within|max)/.test(text);
  const v = Number(raw) - (ceiling ? 1 : 0);
  if (v <= 0) return null;
  if (v < 500) return "low";
  if (v <= 1000) return "mid";
  return "high";
}

export function extract(raw: string): Extraction {
  const low  = String(raw||"").toLowerCase().replace(/(\d),(?=\d)/g,"$1");
  const text = " " + low.replace(/[^\w₹\s']/g," ").replace(/\s+/g," ") + " ";
  /* money keeps its symbols and its digits glued together */
  const num  = " " + low.replace(/[^\w₹.\s]/g," ").replace(/\s+/g," ") + " ";
  const delta: Delta = {};
  const matched: string[] = [];

  /* dislikes first, so a negated family term is not also read as a preference */
  const dislikes: string[] = [];
  Object.keys(LEX.dislike).forEach(function(k){
    LEX.dislike[k].forEach(function(w){
      if (text.indexOf(w) > -1 && negatedNear(text, w) && dislikes.indexOf(k) === -1){
        dislikes.push(k); matched.push("avoiding " + DISLIKE_MAP[k].label.toLowerCase());
      }
    });
  });
  if (dislikes.length) delta.dislike = dislikes;

  const fams: string[] = [];
  Object.keys(LEX.family).forEach(function(k){
    LEX.family[k].forEach(function(w){
      if (text.indexOf(w) > -1 && !negatedNear(text, w) && fams.indexOf(k) === -1) fams.push(k);
    });
  });
  if (fams.length){ delta.family = fams.slice(0,2); matched.push((delta.family as string[]).map((f) => (FAM_LABEL[f] || f).toLowerCase()).join(" and ")); }

  const occ: string[] = [];
  Object.keys(LEX.occasion).forEach(function(k){ if (lexHit(text, LEX.occasion[k])) occ.push(k); });
  if (occ.length){ delta.occasion = occ.slice(0,2); matched.push((delta.occasion as string[]).map((o) => (OCC_LABEL[o] || o).toLowerCase()).join(" and ")); }

  Object.keys(LEX.season).forEach(function(k){ if (lexHit(text, LEX.season[k])) delta.season = k; });
  if (delta.season) matched.push((SEASON_LABEL[delta.season as string] || "").toLowerCase() + " weather");

  Object.keys(LEX.intensity).forEach(function(k){
    LEX.intensity[k].forEach(function(w){ if (text.indexOf(w) > -1 && !negatedNear(text, w)) delta.intensity = k; });
  });
  if (delta.intensity) matched.push((INT_LABEL[delta.intensity as string] || "").toLowerCase());

  Object.keys(LEX.type).forEach(function(k){ if (lexHit(text, LEX.type[k])) delta.type = k; });
  if (delta.type) matched.push((TYPE_LABEL[delta.type as string] || "").toLowerCase());

  const b = parseBudget(num);
  if (b){ delta.budget = b; matched.push("a budget"); }

  if (lexHit(text, GIFT)){ delta.who = "gift"; matched.push("a gift"); }
  else if (/\bfor me\b|\bmyself\b/.test(text)){ delta.who = "me"; matched.push("for you"); }

  const mode = lexHit(text, EXPERT) ? "expert" : (lexHit(text, BEGINNER) ? "beginner" : null);
  return { delta:delta, matched:matched, mode:mode, empty:Object.keys(delta).length === 0 };
}

export function applyDelta(profile: Profile, delta: Delta): Profile {
  const p = profile as unknown as Record<string, unknown>;
  Object.keys(delta).forEach((k) => {
    const cur = p[k];
    if (Array.isArray(cur)) {
      const merged = cur
        .concat(delta[k] as unknown[])
        .filter((v, i, a) => a.indexOf(v) === i);
      /* keep the two most recent, the way the prototype did */
      p[k] = merged.slice(-2);
    } else {
      p[k] = delta[k];
    }
  });
  return profile;
}
