# Setting this up

Everything needed to run ROOH locally, then everything that has to be true
before it takes real money. Read the first section, then skip to whichever
of the rest applies to you.

---

## 1 · Local, from zero

**You need:** Node 18.18 or newer (22 LTS recommended) and npm. Nothing
else — no database, no accounts, no keys.

```bash
cd rooh-next
npm install
cp .env.example .env.local
npm run typecheck
npm run dev
```

Open http://localhost:3000.

### Do `npm run typecheck` before anything else

This code was written in an environment where the npm registry was blocked,
so **`npm install` and `npm run build` never ran there and Next.js never
compiled it.** It was type-checked against hand-written ambient declarations
for `next/*`, `react` and `zod` — which verifies import paths, exported
names, data shapes and function signatures, and caught about a dozen real
errors — but those declarations are mine, not Vercel's.

`npm run typecheck` runs the same check against the genuine type
definitions. It is the first place a remaining problem will show up, and it
takes seconds. Then `npm run build`, which is where the bundler and the
Server Component rules get their say.

If something does fail, expect it to be small and local. The structural
layer — links, imports, class names, data shapes, engine behaviour — is
already covered by checks that pass (see the README table).

### What works with no configuration at all

| | |
| --- | --- |
| Browsing, search, filters, collections, journal, policies | Fully |
| Cart and server-side pricing | Fully — every total is computed server-side |
| Fragrance finder and the stylist | Fully — the engine is local, no API call leaves the machine |
| Sign-in by one-time code | Works; the code is printed in your terminal instead of emailed, and the UI says so |
| Checkout, cash on delivery | Works end to end; the order is written to `./data/store.json` |
| Checkout, online payment | Stops at the payment step and says online payment is not configured. It does not pretend to succeed |
| Order tracking | Shows only the stages the shop can confirm itself. No invented courier scans |

### Useful during development

```bash
node verify/check.mjs         # links, imports, env names, class names
node verify/engine.test.mjs   # 11 engine behaviour tests
npm run lint
```

To reset the local data: `rm -f data/store.json`. It is recreated empty.

---

## 2 · Environment variables

Copy `.env.example` to `.env.local`. `.env.local` is gitignored; never
commit real keys, and never put any of these in client code — everything
that reads them imports `src/lib/env.ts`, which starts with
`import "server-only"`, so importing it from a client component is a build
error rather than a leak.

| Variable | Needed | What happens without it |
| --- | --- | --- |
| `SESSION_SECRET` | **Production** | Development falls back to a fixed insecure string. In production it is read lazily, so the first request that touches a session or a sign-in code throws with a clear message rather than signing with a default. Generate with `openssl rand -base64 48` |
| `NEXT_PUBLIC_SITE_ORIGIN` | Production | Defaults to `http://localhost:3000`. Canonical URLs, Open Graph and the sitemap all use it. No trailing slash |
| `NEXT_PUBLIC_ALLOW_INDEXING` | Launch | Anything other than `true` ships `noindex,nofollow` on every page — which is what you want on staging. Set it to `true` only when the live store is real |
| `RAZORPAY_KEY_ID` | Online payment | Checkout stops honestly at the payment step |
| `RAZORPAY_KEY_SECRET` | Online payment | As above. This one never reaches the browser |
| `RAZORPAY_WEBHOOK_SECRET` | Online payment | Webhooks are rejected. It is deliberately a *different* secret from the key secret |
| `RESEND_API_KEY` | Email | Sign-in codes go to the server log and the response says the email was not sent |
| `MAIL_FROM` | Email | Defaults to an `example.invalid` address |
| `DATABASE_URL` | Production | The JSON file store under `./data` is used. See §4 |

The structural check enforces that every `process.env` name read anywhere
in `src/` appears in `.env.example`. There are ten, and all ten are
documented above.

---

## 3 · What is real and what is a stub

Being precise about this matters more than the feature list.

**Real, working, and safe to build on:**

- Server-authoritative pricing. `priceCart()` in `src/lib/pricing.ts` is the
  only thing that decides money. The browser sends slugs and quantities; the
  coupon rules, free-shipping threshold, COD ceiling and GST breakout are
  all applied server-side. Both `/api/cart/price` and `/api/checkout` call it,
  so the displayed total and the charged total come from one function.
- Coupon validation — minimum spend, cap, and product-type restriction —
  server-side. A coupon value sent by the client is never read.
- Sessions. HMAC-signed cookies, `httpOnly`, verified with a constant-time
  compare. `requireUser()` derives identity from the cookie alone; a user id
  in a request body is ignored everywhere.
- One-time codes. Stored as an HMAC of the code plus the challenge id —
  never in plaintext. Ten-minute expiry, five attempts, three resends.
- Razorpay signature verification. `verifyPaymentSignature()` recomputes
  `HMAC-SHA256(orderId|paymentId)` with the key secret and compares in
  constant time. It returns false for anything that does not verify — no
  trusted-client flag, no development shortcut. A client "success" is not
  proof of payment anywhere in the codebase.
- Webhook verification against the raw request body with the separate
  webhook secret.
- The order snapshot. An order stores a frozen copy of the priced cart and
  of the shipping address, so editing the address book later cannot rewrite
  history.
- Account deletion. Removes the profile and addresses, and **detaches**
  orders rather than deleting them, because Indian tax and accounting rules
  require sales records to be retained. The account page says so in as many
  words rather than promising an erasure it cannot perform.
- The recommendation engine and preference parser. Entirely local — it only
  ever returns products from the actual catalogue, and it carries the reasons
  each one scored.

**Stubbed, and honest about it in the UI:**

- **Email.** `src/lib/mail.ts` is a Resend adapter. Without a key it logs and
  reports `delivered: false`. Swap the provider by rewriting the one `fetch`
  in that file.
- **The database.** A JSON file (§4).
- **Courier tracking.** There is no shipping integration. The track page says
  live scans appear once the shipping account is connected, and shows only
  the stages the shop can confirm itself. No fabricated tracking events.
- **Order confirmation email — not built at all.** `sendMail()` is called
  from exactly one place, the sign-in code route. Nothing emails a customer
  after an order is placed. Note that the track page copy already says
  "the order number from your confirmation email", so either wire the email
  up or change that line; today it points at something that does not arrive.
- **Product photography.** Every product image is a generated SVG from
  `src/lib/figures.ts`, drawn from the product's own palette. It is placeholder
  artwork, not stock photography and not anyone else's imagery. Replacing it
  is a data change, not a layout change.

**Deliberately absent:** reviews and star ratings (there are no real reviews
yet, and inventing them was ruled out), stock counters, countdown timers,
"only N left", "N people viewing", and any inflated MRP. None of these can
be switched on with a flag; they were never built.

---

## 4 · The database

`src/lib/store.ts` reads and writes a single JSON file at `./data/store.json`.

**This is for local development only.** It is not safe for concurrent
writes, has no transactions, and will lose data under load. Two orders
placed in the same moment can overwrite each other.

It is one file, on purpose. Every read and write in the app goes through the
`store` object, so moving to a real database means rewriting that file and
nothing else. The tables it needs, with the interfaces at the top of
`store.ts` as the source of truth:

| Table | Notes |
| --- | --- |
| `users` | Unique index on lowercased `email`. `news` (marketing consent) starts `false` — a pre-ticked box is not consent |
| `addresses` | Indexed by `userId`. `isDefault` is exclusive per user |
| `orders` | Indexed by `userId` and by `payment.orderId` (the webhook looks orders up by the provider's id — that lookup is a table scan today). `priced` and `shipTo` are immutable once written |
| `otps` | Indexed by `id` and by `email`. Store the `hash`, never a code. Expire rows on `expiresAt` |
| `newsletter` | Unique on `email` |

Two things to preserve when you port it:

1. `deleteUser` must keep the orders and null their `userId`. Deleting them
   would breach the retention rules the account page tells customers about.
2. Orders are written once. Nothing recomputes `priced` after the fact.

---

## 5 · Before this takes a real payment

Work through all of it. Each line is something that is *not* true yet.

**Configuration**

- [ ] `SESSION_SECRET` set to a real random value, different per environment.
- [ ] `NEXT_PUBLIC_SITE_ORIGIN` set to the live origin, no trailing slash.
- [ ] Razorpay live keys set, and `RAZORPAY_WEBHOOK_SECRET` set to the
      webhook's own secret — not a copy of the key secret.
- [ ] A real database behind `src/lib/store.ts`. The JSON store must not
      reach production.
- [ ] An email provider configured, and the sending domain's SPF/DKIM set up,
      or sign-in codes will not arrive.
- [ ] An order confirmation email written and sent from `/api/checkout` (for
      COD) and from `/api/payments/verify` (once a signature verifies). This
      does not exist yet, and the track page copy already promises it.
- [ ] `NEXT_PUBLIC_ALLOW_INDEXING=true` — last, once the store is genuinely live.

**Payments**

- [ ] Register the webhook in the Razorpay dashboard pointing at
      `/api/payments/webhook`, and confirm rejected signatures are rejected.
- [ ] Test the failure paths, not just the happy one: payment abandoned,
      payment failed, webhook arriving before the verify call, webhook
      arriving twice. The order must stay `pending_payment` until a signature
      verifies.
- [ ] Decide what happens to a `pending_payment` order that is never paid.
      Nothing expires them today.
- [ ] Reconcile at least the first weeks of orders against the provider's
      dashboard by hand.

**Legal and commercial — none of this is legal advice; have it reviewed**

- [ ] The four policy pages carry real terms for your business, not the
      drafted text shipped here. Shipping, returns, privacy and terms are
      written as plausible starting drafts and are not a substitute for
      advice from someone qualified.
- [ ] GST registration and the correct rate for perfumery. The checkout shows
      a GST breakout computed from a single rate in `src/lib/commerce.ts` —
      confirm it is the right one for what you sell.
- [ ] Confirm every product claim against your own documentation before
      publishing. The copy deliberately avoids "100% natural", "chemical
      free", "IFRA certified", "no side effects" and guaranteed longevity
      claims — where those phrases appear at all, the surrounding sentence
      is refusing to make the claim. Do not add them back without paperwork.
- [ ] Concentration and volume claims on every product match what is in the
      bottle.
- [ ] A working support address that a person actually reads.
- [ ] Rate-limiting in front of `/api/auth/request-otp` and `/api/checkout`.
      There is attempt and resend limiting in the code, but no IP-level limit.

**Operational**

- [ ] Real product photography in place of the generated SVGs.
- [ ] Backups of whatever database you chose, and a restore you have tested.
- [ ] Error reporting wired up. Today failures go to `console.error`.
- [ ] Run `npm run build` and walk the whole journey on a real phone, both
      light and dark, before pointing a domain at it.

---

## 6 · Working on the code

### Don't reorder the stylesheets

`src/app/globals.css` imports nine files in this order:

```
01-tokens · 02-base · 03-shop · 04-product · 05-checkout
06-finder · 07-stylist · 08-mobile · 09-audit
```

The contrast ratios, motion budget, radius and shadow inventory and the
restraint counts from the audit were all measured on the computed result of
exactly that sequence. `09-audit.css` exists to win against what comes
before it, and `08-mobile.css` must stay ahead of it. Reordering them, or
adding a framework whose reset lands in the same cascade, silently voids
those guarantees.

For the same reason there is no Tailwind and no component library here. It
is not an oversight — a second reset in the cascade is exactly what the
rebuild was undertaken to remove.

### Adding a product

`src/lib/products.ts` holds the catalogue and `src/lib/detail.ts` the long-form
content. Add to both, keyed by the same slug. Everything downstream —
shop, search, collections, sitemap, JSON-LD, the recommendation engine — reads
from those two files, so nothing else needs touching. Then:

```bash
node verify/check.mjs && node verify/engine.test.mjs
```

The engine test will fail if a recommendation ever points at a product that
does not exist.

### Class names

The structural check verifies that every class name used in `src/` is
defined in the stylesheets. If you add a class, add it to the right
stylesheet or the check will tell you. This caught ten invented class names
during the build, so it earns its keep.

### Generated artwork

`src/lib/figures.ts` draws the SVGs. Ids come from `mkId(seed)`, which is
deterministic — that keeps server and client markup identical, so there is
no hydration mismatch. **Give each render site its own seed.** The gallery
renders the same product in three places (the track, the main image, the
thumbnail rail) and seeds them separately; sharing a seed would produce
duplicate ids and the `url(#…)` references would resolve to the wrong
gradient. Check 6 in `verify/check.mjs` exists to catch exactly that
regression.

### Structured data

`src/lib/seo.ts` assembles JSON-LD from the catalogue. There is no
`aggregateRating` and no `review` block, because there are no real reviews —
marking up ratings you do not have is the kind of thing Google issues manual
actions for. Add them when you have real ones.
