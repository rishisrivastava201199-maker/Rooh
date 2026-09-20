/* Generated from the audited prototype — values were read out of the
   running page, never retyped, so nothing drifted in transcription.
   Edit here; this is the source of truth for the app. */

export interface JournalEntry {
  slug: string;
  title: string;
  cat: string;
  mins: number;
  excerpt: string;
  /** the two colours its generated tile is drawn from */
  a: string;
  b: string;
}

export const JOURNAL: JournalEntry[] = [
  {
    slug: "real-attar-vs-synthetic",
    cat: "Fragrance education",
    mins: 7,
    title: "Real attar vs synthetic: how to tell the difference",
    excerpt: "Why a ₹49 rose attar exists, what is actually inside it, and how to judge what you are buying — including what is in ours.",
    a: "#6B4527",
    b: "#241610"
  },
  {
    slug: "how-attar-is-made-in-kannauj",
    cat: "Heritage",
    mins: 6,
    title: "How attar is made in Kannauj",
    excerpt: "Copper stills, bamboo condensers, and a distillation method that has barely changed in four hundred years.",
    a: "#8A6440",
    b: "#2A1E12"
  },
  {
    slug: "how-to-make-perfume-last-longer",
    cat: "How to",
    mins: 5,
    title: "How to make fragrance last on Indian skin",
    excerpt: "Seven things that genuinely change longevity, and three that do not.",
    a: "#4C6041",
    b: "#1B2617"
  }
];

/* An article is a list of sections. Each section is an optional
   heading and the paragraphs under it. */
export type Section = [heading: string | null, paragraphs: string[]];

export interface Article {
  date: string;
  body: Section[];
}

export const ARTICLES: Record<string, Article> = {
  "real-attar-vs-synthetic": {
    date: "4 February 2026",
    body: [
      [
        null,
        [
          "Walk through any market in India and you will find rose attar at ₹49 for 12 ml, and rose attar at ₹4,000 for the same volume. Both are labelled the same way. Neither is necessarily lying. The difference is almost entirely in the base."
        ]
      ],
      [
        "What an attar actually is",
        [
          "Traditionally an attar is made by hydro-distillation: flowers go into a copper still called a deg, and the aromatic vapour is received directly into a second vessel — the bhapka — containing sandalwood oil. The sandalwood absorbs the aroma over repeated cycles. This is the method Kannauj holds a Geographical Indication for.",
          "The problem is arithmetic. Indian sandalwood oil currently trades between roughly ₹98,000 and ₹2,50,000 per kilogram. A 6 ml bottle of true sandalwood-base attar cannot be sold for ₹399, or ₹999, or anything close to it."
        ]
      ],
      [
        "So what is in the affordable ones",
        [
          "A carrier. Commonly DPG — dipropylene glycol, a cosmetic-grade solvent — or cheaper plasticiser-grade materials costing a few hundred rupees a kilogram. A carrier is not a scandal; almost every fragrance on earth is aromatic material dissolved in something. The question is what proportion of the bottle is aroma and what proportion is filler.",
          "At ₹49 for 12 ml, the aromatic content is necessarily tiny. That is how the price works."
        ]
      ],
      [
        "How to judge what you are buying",
        [
          "Four things tell you most of what you need. Ask what the base is — a seller who will not answer has told you the answer. Apply one drop and check it at four and eight hours. Look at colour and viscosity: real oils are rarely water-clear and rarely water-thin. And buy the same product twice, six weeks apart, and compare — batch drift is the most common failure in this trade and almost nobody tests for it."
        ]
      ],
      [
        "What is in ours",
        [
          "Our itras use a cosmetic-grade carrier oil, not sandalwood oil, and we would rather say that on a page you can read than imply otherwise on a label. What we do instead is put the money into aromatic concentration. That is a real trade-off and you should judge it by wearing the product, not by reading this."
        ]
      ]
    ]
  },
  "how-attar-is-made-in-kannauj": {
    date: "18 February 2026",
    body: [
      [
        null,
        [
          "Kannauj sits about 350 kilometres south-east of Delhi in Uttar Pradesh. It has been distilling fragrance for long enough that the Mughal court bought from it, and the district holds a Geographical Indication for its perfume."
        ]
      ],
      [
        "The deg and the bhapka",
        [
          "The deg is a copper vessel, roughly cauldron-shaped, sealed with a paste of clay and cotton. Flowers and water go in. Underneath it, a wood fire — controlled by a distiller who reads the sound of the boil rather than a thermometer.",
          "The vapour travels through a bamboo pipe into a receiver, the bhapka, partly submerged in a water tank for cooling. Crucially the bhapka already contains sandalwood oil: the aromatic vapour condenses directly into it and is absorbed, across multiple distillations."
        ]
      ],
      [
        "Mitti: the one nobody else makes",
        [
          "Mitti attar is the strangest thing Kannauj does and the most Indian. Instead of flowers, baked clay discs go into the still — the same clay used for earthenware. The result is petrichor: the smell of first rain on dry ground, captured and bottled.",
          "No Western perfume house has a real equivalent. It is worth wearing once simply because it exists."
        ]
      ],
      [
        "An industry under pressure",
        [
          "Kannauj had several hundred working distilleries in the 1990s. Today the figure is considerably lower. Sandalwood cost, synthetic substitutes and a generation moving to other work have all taken their share. The GI tag has not measurably reversed it.",
          "That is the honest context for anything sold on Kannauj's name — including ours."
        ]
      ]
    ]
  },
  "how-to-make-perfume-last-longer": {
    date: "5 March 2026",
    body: [
      [
        null,
        [
          "Longevity is the most common complaint about fragrance in India, and a fair amount of it is application rather than product. Here is what genuinely helps."
        ]
      ],
      [
        "What works",
        [
          "Apply to moisturised skin. Dry skin holds fragrance poorly, and Indian air-conditioning is very drying.",
          "Apply to pulse points — wrists, base of the throat, behind the ears. Warmth drives projection.",
          "Do not rub your wrists together. It is the single most common mistake; friction and heat break the top notes down faster.",
          "Spray onto skin rather than clothes where the fabric allows. Skin develops a fragrance; cloth holds the top of it.",
          "Store the bottle away from light and heat. A bathroom windowsill is the worst place in the house.",
          "Choose concentration honestly. An eau de toilette at 8% will not behave like an eau de parfum at 18%, whatever the marketing says.",
          "Layer. An unscented body oil, or a drop of a complementary itra, gives the fragrance a base to sit on."
        ]
      ],
      [
        "What does not work",
        [
          "Spraying more. Past about four sprays you are increasing sillage, not longevity.",
          "Petroleum jelly on pulse points. It changes almost nothing and is unpleasant.",
          "Keeping the bottle in the fridge. Temperature stability matters; cold does not."
        ]
      ],
      [
        "And a caveat",
        [
          "Skin chemistry is real. The same fragrance can last eight hours on one person and three on another, and neither is doing anything wrong. This is why we quote longevity as a range and not a number, and why we would rather sell you a ₹299 sample set than a ₹899 bottle you end up not wearing."
        ]
      ]
    ]
  }
};

export const journalBySlug = (s: string) => JOURNAL.find((j) => j.slug === s);
