# ROOH — storefront

Indian eau de parfum and traditional itra. Next.js 15 App Router, React 19,
TypeScript. Eleven products, twenty-two pages, nine API endpoints, no CSS
framework.

This is the rebuild that came out of the eleven-stage design programme, not
the earlier prototype. The stylesheets in `src/styles/` are the audited
design system, and the cascade order they are imported in is load-bearing —
see **The design system is frozen** below before you touch them.

---

## Run it

```bash
npm install
cp .env.example .env.local     # nothing needs filling in for local dev
npm run typecheck              # do this first — see the note below
npm run dev                    # http://localhost:3000
```

Node 18.18 or newer. Nothing else is required: with no keys set, the app
runs on a JSON file under `./data`, writes sign-in codes to the terminal
instead of emailing them, and stops honestly at the payment step.

`SETUP.md` has the full guide — every environment variable, what is real
and what is stubbed, and the list of things that must be true before this
takes a real payment.

---

## One thing to know before you start

**`npm install` and `npm run build` were never run in the environment this
was written in.** The npm registry was blocked there by network policy, so
no package was ever downloaded and Next.js never compiled this code.

What *was* done instead, and what it does and does not prove:

| Check | Result | What it covers |
| --- | --- | --- |
| `tsc --noEmit` against hand-written ambient declarations for `next/*`, `react` and `zod` | 0 errors | Every import path resolves, every exported name exists, every data shape and function signature matches. This caught roughly a dozen real errors. |
| A structural sweep (`verify/check.mjs`) | 6/6 pass | Internal links resolve to a route · every import resolves to a file · every `process.env` name is documented in `.env.example` · no escape sequence renders literally · all 175 class names exist in the stylesheets · generated SVG ids are unique per render site. |
| Engine behaviour tests (`verify/engine.test.mjs`) | 11/11 pass | The recommendation engine and preference parser behave as they did in the audited build. |

What that does **not** cover: the real `next` type definitions (the shims
are mine, not Vercel's), the bundler, `next/font` reaching Google Fonts at
build time, React Server Component boundary rules that only the compiler
enforces, and runtime behaviour of any kind.

So: **run `npm run typecheck` first.** It is the same check, but against
the real type definitions, and it is where any remaining error will surface.
Then `npm run build`. If either complains, the errors will be small and
local — a type import, a prop name — not structural.

---

## What is in here

```
src/
  app/                22 pages + 9 API routes + sitemap, robots, error, 404
  components/         21 components
  lib/                16 modules — pricing, session, payments, store,
                      recommendation engine, SVG figures, SEO, catalogue
  styles/             9 stylesheets, 77KB, imported in cascade order
verify/               the checks described above; not part of the build
data/                 the JSON dev store lands here (gitignored)
```

The twenty-two pages: home, shop, product, collections, attars, gifts,
discovery, fragrance finder, journal, cart, checkout, account (orders,
wishlist, deletion), search, about, FAQ, help, order tracking and four
policy pages.

### Where the money is decided

The browser sends **slugs and quantities and nothing else**. Every total —
subtotal, coupon, shipping, GST breakout, COD eligibility — is recomputed
server-side by `priceCart()` in `src/lib/pricing.ts`, both for the live cart
display (`/api/cart/price`) and again at checkout. A price, a discount or a
coupon value arriving from the client is not read anywhere.

Identity works the same way. `requireUser()` reads the HMAC-signed session
cookie; a user id in a request body is ignored. One-time codes are stored as
an HMAC, never in plaintext. Razorpay signatures are verified server-side
against the key secret with a constant-time compare, and the webhook uses
its own separate secret against the raw body. Nothing treats a client
"success" as proof of payment.

### The design system is frozen

There is no Tailwind, no Radix, no component library — deliberately. The
nine stylesheets are the output of a measured audit: contrast ratios, the
motion budget, the radius and shadow inventory and the restraint counts were
all verified against the computed result of exactly this import sequence, in
`src/app/globals.css`:

```
01-tokens · 02-base · 03-shop · 04-product · 05-checkout
06-finder · 07-stylist · 08-mobile · 09-audit
```

Reordering them, or adding a framework whose reset lands in the same
cascade, voids those guarantees. `09-audit.css` in particular exists to win
against what precedes it.

Fonts are the one thing the prototype could not do and this does:
`next/font/google` self-hosts and subsets Cormorant Garamond and Manrope at
build time and emits size-adjusted fallbacks, wired into the frozen
`--display` / `--ui` tokens through `--font-display` / `--font-ui`. No
third-party font request, no render-blocking stylesheet, no layout shift.

### One design decision left open

181 spacing declarations use values the scale does not contain — mostly
`6px`, `7px`, `10px`, `14px`, sitting between the 4 / 8 / 12 / 16 steps.
That is the system reporting that its fine end is too coarse for component
internals, not 181 mistakes. Two defensible answers: snap everything to the
scale and accept looser components, or formally extend the scale's fine end.
Both are visual-design calls, so they were recorded rather than made badly
at the end of an audit. Nothing is broken either way.

---

## Scripts

| | |
| --- | --- |
| `npm run dev` | development server |
| `npm run build` | production build |
| `npm start` | serve the production build |
| `npm run typecheck` | `tsc --noEmit` against the real types |
| `npm run lint` | ESLint, `eslint-config-next` |
| `node verify/check.mjs` | the structural sweep |
| `node verify/engine.test.mjs` | engine behaviour tests (needs TypeScript, so run it after `npm install`) |

`verify/` is excluded from `tsconfig.json` and from the build. It is a
development aid, not shipped code.
