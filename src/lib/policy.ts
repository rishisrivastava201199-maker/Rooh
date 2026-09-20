/* Generated from the audited prototype — values were read out of the
   running page, never retyped, so nothing drifted in transcription.
   Edit here; this is the source of truth for the app. */

/* [title, eyebrow, intro, sections] where each section is a heading
   and its paragraphs — the same shape the storefront rendered. */
export type PolicySection = [heading: string, paragraphs: string[]];
export type PolicyDoc = [
  title: string,
  eyebrow: string,
  intro: string,
  sections: PolicySection[],
];

export const POLICY: Record<string, PolicyDoc> = {
  shipping: [
    "Shipping policy",
    "Delivery",
    "Where your order goes, how long it takes, and what happens when something goes wrong in transit.",
    [
      [
        "Dispatch",
        [
          "Orders placed before 4 pm on a working day are dispatched within 24 hours. Orders placed on Sundays and public holidays are dispatched the next working day."
        ]
      ],
      [
        "Charges",
        [
          "Shipping is ₹79 on orders below ₹999 and free above it. Express delivery, where the PIN code supports it, is ₹149. Cash on delivery adds a ₹49 handling fee and is available up to ₹5,000."
        ]
      ],
      [
        "Timelines",
        [
          "Typically 2–4 working days in metro cities and 4–7 working days elsewhere. These are courier estimates rather than guarantees, and monsoon and festival weeks do affect them."
        ]
      ],
      [
        "If a parcel is damaged or lost",
        [
          "Photograph the parcel before opening it if it looks tampered with, and write to us within 48 hours of delivery. Parcels damaged in transit are replaced or refunded at our cost."
        ]
      ],
      [
        "International",
        [
          "We do not ship outside India yet. Alcohol-based fragrance is classified as dangerous goods for air transport, which requires specific packaging, documentation and carrier approval. We would rather launch it properly than badly."
        ]
      ]
    ]
  ],
  returns: [
    "Return &amp; refund policy",
    "Returns",
    "Seven days, no argument on unopened items — and an honest explanation of why opened fragrance is different.",
    [
      [
        "What can be returned",
        [
          "Unopened items in their original packaging, within seven days of delivery. The outer carton, bottle and any seals should be intact."
        ]
      ],
      [
        "What cannot",
        [
          "Opened fragrance cannot be returned for hygiene reasons, unless it arrived damaged, leaked in transit, or is not the product you ordered. In those cases we cover the return shipping and the replacement."
        ]
      ],
      [
        "How to start a return",
        [
          "Write to us with your order number and, where relevant, a photograph. We arrange a reverse pickup where the courier services your PIN code, and send a prepaid label where it does not."
        ]
      ],
      [
        "Refunds",
        [
          "Credited to the original payment method within 5–7 working days of the item reaching us. Cash-on-delivery orders are refunded by bank transfer to an account you nominate."
        ]
      ],
      [
        "Why we sell a ₹299 discovery set",
        [
          "Because the honest answer to “what if I do not like it” is to smell it before spending ₹899, not to build a return policy that pretends fragrance can be tried and sent back."
        ]
      ]
    ]
  ],
  privacy: [
    "Privacy policy",
    "Your data",
    "What we collect, why, and what we deliberately do not collect.",
    [
      [
        "What we collect",
        [
          "Your email address, and — if you place an order — your name, delivery address and phone number. That is what an order needs. We do not ask for your date of birth, your gender or a profile photograph."
        ]
      ],
      [
        "Why",
        [
          "To process and deliver your order, to send transactional messages about it, to answer support requests, and to meet Indian tax and accounting obligations."
        ]
      ],
      [
        "Marketing",
        [
          "Separate from the above, and opt-in. You can turn marketing email, SMS and WhatsApp on or off individually in your account, and turning all of them off does not stop order emails."
        ]
      ],
      [
        "Retention",
        [
          "Profile data is deleted when you delete your account. Order and invoice records are retained for the statutory period under Indian tax law, detached from your profile."
        ]
      ],
      [
        "Sharing",
        [
          "With the courier that delivers your parcel, the payment provider that processes your payment, and the email provider that sends your confirmations. Nobody else, and never for sale."
        ]
      ]
    ]
  ],
  terms: [
    "Terms of service",
    "Terms",
    "The basis on which we sell to you.",
    [
      [
        "Pricing",
        [
          "Prices are in Indian rupees and inclusive of GST. We print one price and hold it rather than inflating an MRP and discounting against it. Prices can change, but the price shown when you place an order is the price you pay."
        ]
      ],
      [
        "Product descriptions",
        [
          "Fragrance notes, families and character scores are our own assessment of each composition and are described as such. Longevity is quoted as a measured range because it varies with skin, climate and application. We do not make claims about naturalness, certification or therapeutic effect that our documentation does not support."
        ]
      ],
      [
        "Orders",
        [
          "An order is an offer to buy, accepted when we dispatch it. We can decline an order — for a pricing error, a stock problem, or a suspected fraudulent payment — and refund it in full."
        ]
      ],
      [
        "Liability",
        [
          "Fragrance is for external use only. Patch-test if you have sensitive skin and discontinue use if irritation occurs. We are not liable for indirect loss beyond the value of the order."
        ]
      ],
      [
        "Governing law",
        ["These terms are governed by Indian law."]
      ]
    ]
  ]
};

export const POLICY_SLUGS = Object.keys(POLICY);
export const policyBySlug = (s: string): PolicyDoc | undefined => POLICY[s];
