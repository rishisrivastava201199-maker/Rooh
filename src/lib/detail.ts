/* Generated from the audited prototype — values were read out of the
   running page, never retyped, so nothing drifted in transcription.

   Note the two shapes are genuinely different: a fragrance has a
   story, a measured profile and wear instructions; a set has a lead,
   its contents and how to use it. Both carry `comp`, which is the
   compliance block that has to appear on an Indian cosmetic listing.
*/

/** The claims block. Every field here ends up on the carton too. */
export interface Comp {
  net: string;
  hsn: string;
  shelf: number;
  conc: string;
  ing: string;
  dir: string;
  /** each warning is its own line on the carton */
  warn: string[];
}

export interface Story {
  /** inspiration */ i: string;
  /** how it smells */ s: string;
  /** character */ c: string;
  /** when to wear */ w: string;
}

export interface Detail {
  profile: Record<string, number>;
  story: Story;
  wear: string;
  benefits: [title: string, body: string][];
  faqs: [question: string, answer: string][];
  comp: Comp;
}

export interface SetDetail {
  lead: string;
  contents: string[];
  how: string[];
  comp: Comp;
}

export const DETAIL: Record<string, Detail> = {
  "oud-and-woods": {
    profile: { Woody: 9, Intensity: 8, Spicy: 6, Sweet: 5, Fresh: 3, Floral: 2 },
    story: {
      i: "The hour after sunset at a winter wedding — woodsmoke somewhere in the distance, attar on a borrowed shawl, everything warm and close.",
      s: "It opens bright and citrus-lifted, then settles quickly into wood. The oud accord is smooth rather than medicinal — closer to polished sandalwood than raw agarwood — sitting on amber and musk that keep it soft against the skin.",
      c: "Composed rather than loud. It reads as considered, which is why it works better at close range than across a room.",
      w: "After dark, in cooler weather, when the occasion has some weight to it."
    },
    wear: "Two sprays are enough for most people — one on each wrist, or one wrist and the base of the throat. Do not rub; let it open on the skin. A third spray on a scarf or collar extends it without increasing what the people around you smell.",
    benefits: [
      [
        "Depth without volume",
        "A woody composition built for presence at conversational distance rather than across a room."
      ],
      [
        "Made for evenings",
        "Suited to dinners, celebrations and occasions with some formality behind them."
      ],
      [
        "Indian structure",
        "Contemporary perfumery drawing on Indian oud and sandalwood traditions, not imitating a European brief."
      ],
      ["Gift ready", "Presented in a rigid carton that needs no additional wrapping."]
    ],
    faqs: [
      [
        "How long does it last?",
        "In our own wear-testing it stays clearly detectable for six to eight hours, with a close skin scent after that. Longevity genuinely varies with skin type, weather and how much you apply, so treat this as a measured range rather than a promise."
      ],
      [
        "Is it too strong for daily wear?",
        "It is our most intense composition. Two sprays suit most people. For an office, Royal Musk or Indian Vetiver will serve you better."
      ],
      [
        "Does it contain real oud?",
        "It uses an oud accord — a composed blend giving the character of agarwood. Genuine distilled agarwood runs into lakhs of rupees per kilogram and could not be sold at this price. We would rather tell you that than imply otherwise."
      ]
    ],
    comp: {
      net: "50 ml",
      hsn: "3303",
      shelf: 36,
      conc: "Eau de Parfum · approx. 18% fragrance oil",
      ing: "Alcohol Denat., Parfum (Fragrance), Aqua. Full INCI declaration to be printed from the manufacturer's certificate of analysis.",
      dir: "Spray two to four times on pulse points. Do not rub after applying.",
      warn: [
        "For external use only.",
        "Flammable. Keep away from heat, sparks and open flame.",
        "Avoid contact with eyes.",
        "Discontinue use if irritation occurs.",
        "Keep out of reach of children."
      ]
    }
  },
  "royal-musk": {
    profile: { Woody: 5, Intensity: 5, Spicy: 2, Sweet: 4, Fresh: 7, Floral: 5 },
    story: {
      i: "Clean cotton drying on a terrace in the late afternoon — nothing dramatic, just the smell of something well looked after.",
      s: "A citrus and aldehyde opening that reads as brightness rather than fruit, settling into a soft white floral and then into creamy musk over sandalwood.",
      c: "The quietest thing we make, and the one most people end up wearing most often. It reads as skin rather than as fragrance.",
      w: "Every day. Offices, commutes, lifts, meetings — anywhere projecting would be a mistake."
    },
    wear: "Two to three sprays. Musk sits close by nature, so applying more increases how long it lasts rather than how far it carries.",
    benefits: [
      [
        "Works everywhere",
        "Moderate by design. Nothing about it will be the first thing someone notices about you."
      ],
      [
        "Layers well",
        "Musk under a heavier fragrance gives it a base to sit on. Try it beneath Oud & Woods in winter."
      ],
      [
        "All-season",
        "One of two in the range that holds up in Indian summer as well as in December."
      ],
      [
        "Unisex by composition",
        "Not a men's fragrance with a softer label — composed unisex from the brief onwards."
      ]
    ],
    faqs: [
      [
        "Is musk animal-derived?",
        "No. Every musk in modern perfumery at this price is synthetic, including ours. There is no ethical or affordable natural alternative, and we would not use one if there were."
      ],
      [
        "Will people notice it?",
        "At arm's length, yes. Across a room, probably not. That is the point of the composition rather than a shortcoming of it."
      ],
      [
        "How long does it last?",
        "Four to six hours in our wear-testing, longer on moisturised skin."
      ]
    ],
    comp: {
      net: "50 ml",
      hsn: "3303",
      shelf: 36,
      conc: "Eau de Parfum · approx. 18% fragrance oil",
      ing: "Alcohol Denat., Parfum (Fragrance), Aqua. Full INCI declaration to be printed from the manufacturer's certificate of analysis.",
      dir: "Spray two to four times on pulse points. Do not rub after applying.",
      warn: [
        "For external use only.",
        "Flammable. Keep away from heat, sparks and open flame.",
        "Avoid contact with eyes.",
        "Discontinue use if irritation occurs.",
        "Keep out of reach of children."
      ]
    }
  },
  "indian-vetiver": {
    profile: { Woody: 7, Intensity: 5, Spicy: 2, Sweet: 2, Fresh: 9, Floral: 1 },
    story: {
      i: "Khus screens hung in a doorway in May, water thrown over them, the whole room turning cool and green for an hour.",
      s: "Bergamot and citrus at the top, then vetiver root — dry, green, faintly smoky — over cedar and a clean musk. Almost no sweetness anywhere in it.",
      c: "Bracing rather than comforting. The most obviously Indian of the five, and the one that behaves best in heat.",
      w: "Daytime, warm weather, outdoors. It is the summer answer in this range."
    },
    wear: "Three sprays in hot weather — heat lifts a fresh composition faster than a warm one. Reapply after the afternoon if you want it into the evening.",
    benefits: [
      [
        "Built for Indian heat",
        "Green and dry rather than sweet, which is what stops a fragrance turning cloying above thirty-five degrees."
      ],
      [
        "Recognisably Indian",
        "Khus has been cooling Indian rooms for centuries. This is that material in a modern structure."
      ],
      ["Office-safe", "Moderate projection. Nobody will ask you to tone it down."],
      ["Genuinely unisex", "Vetiver is one of the few materials nobody has managed to gender."]
    ],
    faqs: [
      [
        "Is this the same as khus attar?",
        "Related but not the same. This is an alcohol-based spray with vetiver at its heart; Khus Itra is an oil applied in drops. They smell like cousins."
      ],
      [
        "Does it last in summer?",
        "Four to six hours, and less on a very hot day — heat accelerates evaporation for everyone's fragrance, not just ours."
      ],
      [
        "Is it too masculine for me?",
        "It is not composed as masculine. If you like green and dry over sweet, it will suit you."
      ]
    ],
    comp: {
      net: "50 ml",
      hsn: "3303",
      shelf: 36,
      conc: "Eau de Parfum · approx. 18% fragrance oil",
      ing: "Alcohol Denat., Parfum (Fragrance), Aqua. Full INCI declaration to be printed from the manufacturer's certificate of analysis.",
      dir: "Spray two to four times on pulse points. Do not rub after applying.",
      warn: [
        "For external use only.",
        "Flammable. Keep away from heat, sparks and open flame.",
        "Avoid contact with eyes.",
        "Discontinue use if irritation occurs.",
        "Keep out of reach of children."
      ]
    }
  },
  "rose-and-saffron": {
    profile: { Woody: 6, Intensity: 7, Spicy: 6, Sweet: 6, Fresh: 3, Floral: 9 },
    story: {
      i: "A wedding card arriving in the post — saffron threads tucked into the fold, the paper holding the smell for weeks afterwards.",
      s: "Saffron opens it with a leathery, slightly medicinal warmth that keeps the rose from turning sugary. Jasmine widens the heart, and sandalwood and amber carry it down.",
      c: "The most obviously luxurious composition in the range, and the one we would reach for as a gift. Rich without being heavy.",
      w: "Weddings, festivals, evenings out. Cooler weather flatters it."
    },
    wear: "Two sprays. Saffron is powerful in small quantities and this is composed accordingly — a third spray tips it from rich to insistent.",
    benefits: [
      [
        "Indian floral, not European",
        "Warmer and rounder than a Western rose, with spice and wood underneath instead of green freshness on top."
      ],
      [
        "The most-given",
        "Our most frequent gift purchase, which is why it ships in the heavier carton."
      ],
      ["Saffron done properly", "Enough to be read as saffron rather than as generic warmth."],
      [
        "Holds its own",
        "Strong enough for an occasion where everyone else is also wearing something."
      ]
    ],
    faqs: [
      [
        "Is real saffron in it?",
        "Saffron in perfumery is usually a composed accord rather than the spice itself — safranal and related materials. Ours is an accord. The spice at market price would make the bottle several thousand rupees."
      ],
      [
        "Is it a women's fragrance?",
        "No. Rose is worn by everyone in India and has been for centuries; the gendering of rose is largely a Western marketing habit."
      ],
      ["How strong is it?", "Five to seven hours, noticeable in a room at two sprays."]
    ],
    comp: {
      net: "50 ml",
      hsn: "3303",
      shelf: 36,
      conc: "Eau de Parfum · approx. 18% fragrance oil",
      ing: "Alcohol Denat., Parfum (Fragrance), Aqua. Full INCI declaration to be printed from the manufacturer's certificate of analysis.",
      dir: "Spray two to four times on pulse points. Do not rub after applying.",
      warn: [
        "For external use only.",
        "Flammable. Keep away from heat, sparks and open flame.",
        "Avoid contact with eyes.",
        "Discontinue use if irritation occurs.",
        "Keep out of reach of children."
      ]
    }
  },
  "amber-spice": {
    profile: { Woody: 6, Intensity: 8, Spicy: 9, Sweet: 7, Fresh: 2, Floral: 3 },
    story: {
      i: "The spice shelf at the back of a kitchen in December — cardamom pods, a cinnamon stick, and something resinous underneath it all.",
      s: "Cardamom and cinnamon over citrus at the top, then amber and a warm floral heart, closing on vanilla, sandalwood and musk.",
      c: "Warm and enveloping. The one people reach for when it finally gets cold.",
      w: "Winter evenings, festival weeks, dinners. It is wasted in April."
    },
    wear: "Two sprays on pulse points and, if you like, one on a coat collar — wool holds amber beautifully and releases it slowly.",
    benefits: [
      [
        "Cold-weather composition",
        "Amber and resin need cool air. This is the winter fragrance in the range and we say so rather than selling it year round."
      ],
      ["Spice-led, not sweet-led", "Cardamom and pepper keep the vanilla in check."],
      ["Festival wear", "Warm, celebratory, and it survives a long evening."],
      [
        "Layers with musk",
        "A spray of Royal Musk underneath softens the opening if you find it too direct."
      ]
    ],
    faqs: [
      [
        "Is it very sweet?",
        "Sweeter than the rest of our range, but spice-led rather than gourmand. It does not smell of dessert."
      ],
      [
        "Can I wear it in summer?",
        "You can, but amber turns heavy in heat. Indian Vetiver or Royal Musk will serve you better above thirty degrees."
      ],
      ["How long does it last?", "Five to seven hours, and longer on fabric than on skin."]
    ],
    comp: {
      net: "50 ml",
      hsn: "3303",
      shelf: 36,
      conc: "Eau de Parfum · approx. 18% fragrance oil",
      ing: "Alcohol Denat., Parfum (Fragrance), Aqua. Full INCI declaration to be printed from the manufacturer's certificate of analysis.",
      dir: "Spray two to four times on pulse points. Do not rub after applying.",
      warn: [
        "For external use only.",
        "Flammable. Keep away from heat, sparks and open flame.",
        "Avoid contact with eyes.",
        "Discontinue use if irritation occurs.",
        "Keep out of reach of children."
      ]
    }
  },
  "mitti-itra": {
    profile: { Woody: 6, Intensity: 6, Spicy: 3, Sweet: 2, Fresh: 3, Floral: 0 },
    story: {
      i: "The first rain on dry ground in June, after eight weeks of nothing. Every Indian knows this smell and no Western perfume house has a real equivalent for it.",
      s: "Mineral, warm and faintly smoky. Not floral at all — this is baked earth, which is exactly what goes into the still instead of flowers.",
      c: "The strangest and most Indian thing we sell. Worth wearing once simply because it exists.",
      w: "Monsoon weeks, evenings, and any time you want a fragrance that starts a conversation."
    },
    wear: "A drop on each wrist and one behind the ears. Do not rub. Itra is concentrated — a 6 ml bottle is a great many wearings.",
    benefits: [
      [
        "Petrichor, bottled",
        "Baked clay discs go into the deg instead of flowers. The result is the smell of first rain."
      ],
      [
        "Alcohol-free",
        "An oil base, which means no alcohol bite on application and a slower, closer development."
      ],
      [
        "Lasts longer than it projects",
        "Six to nine hours on skin, but close to you rather than around you."
      ],
      ["Layers under a spray", "A drop under Oud & Woods gives the wood an earthier floor."]
    ],
    faqs: [
      [
        "Is this a natural product?",
        "It is an aromatic blend in a cosmetic-grade carrier oil. We do not claim it is 100% natural, because we have not got documentation that would support that claim for this product."
      ],
      [
        "Is it distilled into sandalwood oil?",
        "No. Traditional attar is, but sandalwood oil trades between roughly ₹98,000 and ₹2,50,000 per kilogram, which makes a ₹399 sandalwood-base attar impossible. Ours uses a carrier oil and puts the money into aromatic concentration."
      ],
      [
        "How do I know it is fresh?",
        "Every bottle carries a batch number and a manufacturing date on the carton. Best used within thirty-six months of opening."
      ]
    ],
    comp: {
      net: "6 ml",
      hsn: "3301",
      shelf: 36,
      conc: "Itra · oil-based, alcohol-free",
      ing: "Perfumers' oil blend in a cosmetic-grade carrier oil. Alcohol-free. Full INCI declaration to be printed from the manufacturer's certificate of analysis.",
      dir: "Apply a small amount to pulse points and let it develop on the skin.",
      warn: [
        "For external use only.",
        "Avoid contact with eyes.",
        "Patch-test before first use if you have sensitive skin.",
        "Keep out of reach of children."
      ]
    }
  },
  "gulab-itra": {
    profile: { Woody: 3, Intensity: 4, Spicy: 2, Sweet: 5, Fresh: 4, Floral: 9 },
    story: {
      i: "Rose water sprinkled on guests at a door — the oldest welcome in the subcontinent, and still the most immediate.",
      s: "Soft, round and unmistakably rose, with a little warmth underneath rather than the green sharpness a European rose usually carries.",
      c: "Gentle and traditional. The easiest of the three itras to wear if you have never worn one.",
      w: "Daily, weddings, festival mornings. It suits daytime better than midnight."
    },
    wear: "A drop on the wrists and, in winter, one at the base of the throat. Rose in an oil base develops for twenty minutes before it settles.",
    benefits: [
      ["The Indian rose", "Warmer and rounder than the European reading of the same flower."],
      [
        "Alcohol-free",
        "Gentler on skin that reacts to alcohol-based sprays, and quieter on application."
      ],
      ["Good first itra", "If you are new to oil perfume, start here rather than with Mitti."],
      [
        "Gifting standard",
        "Rose is the least likely fragrance in the range to be disliked by someone you are buying for."
      ]
    ],
    faqs: [
      [
        "Is it made from real roses?",
        "It is an aromatic rose blend in a carrier oil rather than a rose absolute, which would price the bottle far higher. The character is rose; the construction is a blend, and we say so."
      ],
      [
        "Will it stain clothes?",
        "Oil perfumes can mark light fabric. Apply to skin, let it absorb for a minute, then dress."
      ],
      ["How long does it last?", "Five to eight hours on skin in our wear-testing."]
    ],
    comp: {
      net: "6 ml",
      hsn: "3301",
      shelf: 36,
      conc: "Itra · oil-based, alcohol-free",
      ing: "Perfumers' oil blend in a cosmetic-grade carrier oil. Alcohol-free. Full INCI declaration to be printed from the manufacturer's certificate of analysis.",
      dir: "Apply a small amount to pulse points and let it develop on the skin.",
      warn: [
        "For external use only.",
        "Avoid contact with eyes.",
        "Patch-test before first use if you have sensitive skin.",
        "Keep out of reach of children."
      ]
    }
  },
  "khus-itra": {
    profile: { Woody: 6, Intensity: 4, Spicy: 1, Sweet: 1, Fresh: 9, Floral: 0 },
    story: {
      i: "A khus screen soaked in water across a window in peak summer, the air coming through it green and about five degrees cooler.",
      s: "Green vetiver root, dry grass and a faint cedar underneath. There is almost no sweetness in it at all.",
      c: "Cooling and quiet. The itra to wear when it is too hot for anything else.",
      w: "Summer, monsoon, daytime. Offices, especially."
    },
    wear: "A drop on each wrist. In very hot weather, one behind the knees sounds odd and works — vetiver rises.",
    benefits: [
      [
        "The summer itra",
        "Green and dry, which is what stays comfortable when warm compositions turn heavy."
      ],
      [
        "Traditional material",
        "Khus root has been cooling Indian rooms for centuries before anyone bottled it."
      ],
      [
        "Very close wearing",
        "Among the quietest things we make. Suitable anywhere projecting would be rude."
      ],
      ["Alcohol-free", "No alcohol bite, no evaporation spike in heat."]
    ],
    faqs: [
      [
        "How is it different from Indian Vetiver?",
        "Same material, different construction. Indian Vetiver is an alcohol spray with citrus lift; Khus Itra is the root in oil, applied in drops, quieter and longer."
      ],
      ["Is it unisex?", "Yes. Vetiver is about as unisex as perfumery gets."],
      [
        "Does it smell like grass?",
        "Like dried grass and root rather than cut lawn — earthier and drier than people expect."
      ]
    ],
    comp: {
      net: "6 ml",
      hsn: "3301",
      shelf: 36,
      conc: "Itra · oil-based, alcohol-free",
      ing: "Perfumers' oil blend in a cosmetic-grade carrier oil. Alcohol-free. Full INCI declaration to be printed from the manufacturer's certificate of analysis.",
      dir: "Apply a small amount to pulse points and let it develop on the skin.",
      warn: [
        "For external use only.",
        "Avoid contact with eyes.",
        "Patch-test before first use if you have sensitive skin.",
        "Keep out of reach of children."
      ]
    }
  }
};

export const SETDETAIL: Record<string, SetDetail> = {
  "discovery-collection": {
    contents: ["oud-and-woods", "royal-musk", "indian-vetiver", "rose-and-saffron", "amber-spice"],
    lead: "Five 2 ml sprays, one of each signature eau de parfum. Enough for roughly eight to ten wearings each — long enough to know whether a fragrance is yours.",
    how: [
      "Order the set. It ships within 24 hours like anything else.",
      "Wear each for a full day. Fifteen minutes on a card tells you almost nothing.",
      "A code inside the box takes ₹150 off your first full size. No expiry, one use, not combinable with another offer."
    ],
    comp: {
      net: "5 × 2 ml (10 ml)",
      hsn: "3303",
      shelf: 36,
      conc: "Eau de Parfum · approx. 18% fragrance oil",
      ing: "Alcohol Denat., Parfum (Fragrance), Aqua. Full INCI declaration to be printed from the manufacturer's certificate of analysis.",
      dir: "Spray on the wrist and wear for a full day before deciding.",
      warn: [
        "For external use only.",
        "Flammable. Keep away from heat, sparks and open flame.",
        "Avoid contact with eyes.",
        "Discontinue use if irritation occurs.",
        "Keep out of reach of children."
      ]
    }
  },
  "signature-duo": {
    contents: ["oud-and-woods", "rose-and-saffron"],
    lead: "Any two full-size signature eaux de parfum in one rigid carton. The pairing shown is our most-given; you choose yours at checkout.",
    how: [
      "Pick any two of the five signature fragrances.",
      "They arrive in one rigid gift carton with a divider, needing no wrapping.",
      "Add a handwritten note at checkout at no cost — we leave the invoice out of the parcel."
    ],
    comp: {
      net: "2 × 50 ml (100 ml)",
      hsn: "3303",
      shelf: 36,
      conc: "Eau de Parfum · approx. 18% fragrance oil",
      ing: "Alcohol Denat., Parfum (Fragrance), Aqua. Full INCI declaration to be printed from the manufacturer's certificate of analysis.",
      dir: "Spray two to four times on pulse points. Do not rub after applying.",
      warn: [
        "For external use only.",
        "Flammable. Keep away from heat, sparks and open flame.",
        "Avoid contact with eyes.",
        "Discontinue use if irritation occurs.",
        "Keep out of reach of children."
      ]
    }
  },
  "itra-discovery-box": {
    contents: ["mitti-itra", "gulab-itra", "khus-itra"],
    lead: "All three itras at full 6 ml size — earth, rose and vetiver root — in a rigid presentation box. The cheapest way to own the whole traditional side of the range.",
    how: [
      "Three full-size bottles, not samples.",
      "Presented in a rigid box with a divider.",
      "The set saves ₹498 against buying the three separately."
    ],
    comp: {
      net: "3 × 6 ml (18 ml)",
      hsn: "3301",
      shelf: 36,
      conc: "Itra · oil-based, alcohol-free",
      ing: "Perfumers' oil blend in a cosmetic-grade carrier oil. Alcohol-free. Full INCI declaration to be printed from the manufacturer's certificate of analysis.",
      dir: "Apply a small amount to pulse points and let it develop on the skin.",
      warn: [
        "For external use only.",
        "Avoid contact with eyes.",
        "Patch-test before first use if you have sensitive skin.",
        "Keep out of reach of children."
      ]
    }
  }
};

export const detailFor = (slug: string): Detail | undefined => DETAIL[slug];
export const setDetailFor = (slug: string): SetDetail | undefined => SETDETAIL[slug];

/** The compliance block, whichever kind of product it is. */
export const compFor = (slug: string): Comp | undefined =>
  DETAIL[slug]?.comp ?? SETDETAIL[slug]?.comp;
