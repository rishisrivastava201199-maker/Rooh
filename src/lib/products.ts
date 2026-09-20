/* Generated from the audited prototype — values were read out of the
   running page, never retyped, so nothing drifted in transcription.
   Edit here; this is the source of truth for the app. */

export type ProductType = "edp" | "attar" | "set";
export type Intensity = "soft" | "moderate" | "strong";

export interface Product {
  slug: string;
  name: string;
  family: string;
  type: ProductType;
  short: string;
  mrp: number;
  price: number;
  size: string;
  ml: number;
  badge: string;
  pal: { top: string; bot: string; cap: string };
  fams: string[];
  occ: string[];
  seasons: string[];
  intensity: Intensity;
  longev: [number, number];
  sillage: string;
  stock: number;
  rank: number;
  notes: { top: string[]; heart: string[]; base: string[] };
}

export const PRODUCTS: Product[] = [
  {
    slug: "oud-and-woods",
    name: "Oud & Woods",
    family: "Woody · Oriental",
    type: "edp",
    short: "Deep woods. Warm spice. A refined trail.",
    mrp: 1199,
    price: 899,
    size: "50 ml",
    ml: 50,
    badge: "Signature",
    pal: {
      top: "#6B4527",
      bot: "#2B1A11",
      cap: "#241D19"
    },
    fams: ["woody", "oriental", "oud"],
    occ: ["evening", "wedding", "festive", "date"],
    seasons: ["winter", "all-season"],
    intensity: "strong",
    longev: [6, 8],
    sillage: "Noticeable in a room",
    stock: 180,
    rank: 1,
    notes: {
      top: ["Bergamot", "Cardamom", "Pink Pepper"],
      heart: ["Woody Accord", "Cypriol", "Soft Florals"],
      base: ["Oud Accord", "Sandalwood", "Amber", "Musk"]
    }
  },
  {
    slug: "royal-musk",
    name: "Royal Musk",
    family: "Musky · Woody",
    type: "edp",
    short: "Clean. Soft. Elegant.",
    mrp: 1099,
    price: 799,
    size: "50 ml",
    ml: 50,
    badge: "",
    pal: {
      top: "#8A7B69",
      bot: "#3B332B",
      cap: "#241D19"
    },
    fams: ["musky", "woody", "fresh"],
    occ: ["everyday", "office", "date"],
    seasons: ["all-season", "summer"],
    intensity: "moderate",
    longev: [4, 6],
    sillage: "Close to the skin",
    stock: 210,
    rank: 4,
    notes: {
      top: ["Citrus", "Aldehydes"],
      heart: ["White Floral", "Soft Musk"],
      base: ["Creamy Musk", "Sandalwood", "Amber"]
    }
  },
  {
    slug: "indian-vetiver",
    name: "Indian Vetiver",
    family: "Fresh · Earthy",
    type: "edp",
    short: "Fresh earth. Green woods. Indian soul.",
    mrp: 1099,
    price: 799,
    size: "50 ml",
    ml: 50,
    badge: "",
    pal: {
      top: "#4C6041",
      bot: "#1F2C1B",
      cap: "#241D19"
    },
    fams: ["fresh", "earthy", "woody"],
    occ: ["everyday", "office", "festive"],
    seasons: ["summer", "monsoon", "all-season"],
    intensity: "moderate",
    longev: [4, 6],
    sillage: "Close to the skin",
    stock: 160,
    rank: 6,
    notes: {
      top: ["Bergamot", "Citrus"],
      heart: ["Vetiver", "Green Notes"],
      base: ["Cedarwood", "Musk", "Earthy Woods"]
    }
  },
  {
    slug: "rose-and-saffron",
    name: "Rose & Saffron",
    family: "Floral · Oriental",
    type: "edp",
    short: "Rose. Saffron. Indian luxury.",
    mrp: 1199,
    price: 899,
    size: "50 ml",
    ml: 50,
    badge: "For gifting",
    pal: {
      top: "#8C3446",
      bot: "#3E1220",
      cap: "#260F24"
    },
    fams: ["floral", "oriental", "woody"],
    occ: ["wedding", "evening", "festive", "date"],
    seasons: ["winter", "all-season"],
    intensity: "strong",
    longev: [5, 7],
    sillage: "Noticeable in a room",
    stock: 150,
    rank: 3,
    notes: {
      top: ["Saffron", "Fresh Citrus"],
      heart: ["Rose", "Jasmine"],
      base: ["Sandalwood", "Amber", "Musk"]
    }
  },
  {
    slug: "amber-spice",
    name: "Amber Spice",
    family: "Oriental · Spicy",
    type: "edp",
    short: "Warm spice. Golden amber. Lasting impression.",
    mrp: 1199,
    price: 899,
    size: "50 ml",
    ml: 50,
    badge: "",
    pal: {
      top: "#A56A28",
      bot: "#42260F",
      cap: "#241D19"
    },
    fams: ["oriental", "spicy", "woody"],
    occ: ["evening", "wedding", "festive"],
    seasons: ["winter"],
    intensity: "strong",
    longev: [5, 7],
    sillage: "Noticeable in a room",
    stock: 140,
    rank: 7,
    notes: {
      top: ["Cardamom", "Cinnamon", "Citrus"],
      heart: ["Amber", "Spices", "Floral Warmth"],
      base: ["Vanilla", "Sandalwood", "Musk"]
    }
  },
  {
    slug: "mitti-itra",
    name: "Mitti Itra",
    family: "Earthy · Traditional",
    type: "attar",
    short: "The fragrance of earth after rain.",
    mrp: 499,
    price: 399,
    size: "6 ml",
    ml: 6,
    badge: "Itra",
    pal: {
      top: "#7C5730",
      bot: "#3A2614",
      cap: "#241D19"
    },
    fams: ["earthy", "woody"],
    occ: ["evening", "festive", "everyday"],
    seasons: ["monsoon", "all-season"],
    intensity: "moderate",
    longev: [6, 9],
    sillage: "Very close to the skin",
    stock: 120,
    rank: 5,
    notes: {
      top: ["Baked Earth"],
      heart: ["Mineral Warmth", "Smoke"],
      base: ["Carrier Oil", "Soft Woods"]
    }
  },
  {
    slug: "gulab-itra",
    name: "Gulab Itra",
    family: "Floral · Traditional",
    type: "attar",
    short: "Timeless rose. Traditional soul.",
    mrp: 499,
    price: 399,
    size: "6 ml",
    ml: 6,
    badge: "Itra",
    pal: {
      top: "#A24A5C",
      bot: "#4A1A26",
      cap: "#260F24"
    },
    fams: ["floral"],
    occ: ["everyday", "wedding", "festive"],
    seasons: ["all-season", "winter"],
    intensity: "soft",
    longev: [5, 8],
    sillage: "Very close to the skin",
    stock: 130,
    rank: 8,
    notes: {
      top: ["Rose Petal"],
      heart: ["Damask Rose", "Soft Spice"],
      base: ["Carrier Oil", "Warm Woods"]
    }
  },
  {
    slug: "khus-itra",
    name: "Khus Itra",
    family: "Earthy · Fresh",
    type: "attar",
    short: "Green earth. Deep roots. Quiet freshness.",
    mrp: 499,
    price: 399,
    size: "6 ml",
    ml: 6,
    badge: "Itra",
    pal: {
      top: "#5B7048",
      bot: "#23301B",
      cap: "#241D19"
    },
    fams: ["earthy", "fresh"],
    occ: ["everyday", "office"],
    seasons: ["summer", "monsoon"],
    intensity: "soft",
    longev: [5, 7],
    sillage: "Very close to the skin",
    stock: 110,
    rank: 9,
    notes: {
      top: ["Green Vetiver"],
      heart: ["Khus Root", "Dry Grass"],
      base: ["Carrier Oil", "Cedar"]
    }
  },
  {
    slug: "discovery-collection",
    name: "The Discovery Collection",
    family: "Discovery set",
    type: "set",
    short: "Five signature fragrances, 2 ml each.",
    mrp: 499,
    price: 299,
    size: "5 × 2 ml",
    ml: 10,
    badge: "Start here",
    pal: {
      top: "#6B4527",
      bot: "#2B1A11",
      cap: "#241D19"
    },
    fams: ["woody", "floral", "fresh", "oriental", "musky"],
    occ: ["everyday", "evening", "office", "date", "wedding", "festive"],
    seasons: ["all-season"],
    intensity: "moderate",
    longev: [4, 8],
    sillage: "Varies by fragrance",
    stock: 400,
    rank: 2,
    notes: {
      top: ["Five compositions"],
      heart: ["2 ml each"],
      base: ["₹150 credit on a full size"]
    }
  },
  {
    slug: "signature-duo",
    name: "The Signature Duo",
    family: "Gift set",
    type: "set",
    short: "Any two signature eaux de parfum.",
    mrp: 2398,
    price: 1599,
    size: "2 × 50 ml",
    ml: 100,
    badge: "Gift",
    pal: {
      top: "#5A3E6B",
      bot: "#241031",
      cap: "#260F24"
    },
    fams: ["woody", "floral", "oriental", "musky", "fresh"],
    occ: ["wedding", "festive", "date"],
    seasons: ["all-season"],
    intensity: "strong",
    longev: [4, 8],
    sillage: "Varies by fragrance",
    stock: 70,
    rank: 10,
    notes: {
      top: ["Two full sizes"],
      heart: ["Your choice of pairing"],
      base: ["Rigid gift carton"]
    }
  },
  {
    slug: "itra-discovery-box",
    name: "Itra Discovery Box",
    family: "Gift set",
    type: "set",
    short: "Mitti, Gulab and Khus in full size.",
    mrp: 1497,
    price: 999,
    size: "3 × 6 ml",
    ml: 18,
    badge: "Gift",
    pal: {
      top: "#8A6440",
      bot: "#3A2A1E",
      cap: "#241D19"
    },
    fams: ["earthy", "floral", "fresh"],
    occ: ["wedding", "festive", "everyday"],
    seasons: ["all-season"],
    intensity: "soft",
    longev: [5, 9],
    sillage: "Very close to the skin",
    stock: 85,
    rank: 11,
    notes: {
      top: ["Three traditional itras"],
      heart: ["Full 6 ml each"],
      base: ["Rigid gift carton"]
    }
  }
];

export const bySlug = (s: string): Product | undefined =>
  PRODUCTS.find((p) => p.slug === s);

export const TYPE_LABEL: Record<string, string> = {
  edp: "Eau de Parfum",
  attar: "Itra / Attar",
  set: "Sets & gifting"
};
export const FAM_LABEL: Record<string, string> = {
  oud: "Oud",
  woody: "Woody",
  floral: "Floral",
  fresh: "Fresh",
  musky: "Musk",
  oriental: "Amber",
  spicy: "Spicy",
  earthy: "Earthy"
};
export const OCC_LABEL: Record<string, string> = {
  everyday: "Everyday",
  office: "Office",
  date: "Date",
  wedding: "Wedding",
  evening: "Evening",
  festive: "Festive"
};
export const SEASON_LABEL: Record<string, string> = {
  summer: "Summer",
  monsoon: "Monsoon",
  winter: "Winter",
  "all-season": "All season"
};
export const INT_LABEL: Record<string, string> = {
  soft: "Close to the skin",
  moderate: "Noticeable",
  strong: "Makes an entrance"
};
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
