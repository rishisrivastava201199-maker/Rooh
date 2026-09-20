/* ══════════════════════════════════════════════════════════════
   ENGINE BEHAVIOUR

   The recommendation engine and the preference parser came across
   from the audited storefront. These are the properties its own
   tests pinned down there; if one of them ever fails, the engine
   has drifted.

     node verify/engine.test.mjs

   It compiles the three pure modules with tsc first, so it needs
   TypeScript available (npm install gives you that).
   ══════════════════════════════════════════════════════════════ */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const HERE = import.meta.dirname;
const ROOT = path.resolve(HERE, "..");
const OUT = path.join(HERE, ".build");

fs.rmSync(OUT, { recursive: true, force: true });
execSync("npx --no-install tsc -p verify/tsconfig.build.json", { cwd: ROOT, stdio: "inherit" });

/* tsc emits extensionless relative imports; Node's ESM loader needs
   the .js, so patch the three files before importing them */
for (const f of fs.readdirSync(OUT)) {
  const full = path.join(OUT, f);
  fs.writeFileSync(
    full,
    fs.readFileSync(full, "utf8").replace(/from "(\.\/[^"]+)"/g, (m, spec) =>
      spec.endsWith(".js") ? m : `from "${spec}.js"`,
    ),
  );
}

const load = (f) => import(pathToFileURL(path.join(OUT, f)).href);
const { PRODUCTS } = await load("products.js");
const { blankProfile, recommend, extract, applyDelta } = await load("engine.js");

let pass = 0;
let fail = 0;
const ok = (name, fn) => {
  try {
    fn();
    console.log("ok   " + name);
    pass++;
  } catch (e) {
    console.log("FAIL " + name + " — " + e.message);
    fail++;
  }
};

ok("the engine only ever returns products that exist", () => {
  const p = blankProfile();
  p.family = ["woody"];
  p.season = "winter";
  const bad = recommend(p, 5).list.filter((r) => !PRODUCTS.some((x) => x.slug === r.p.slug));
  if (bad.length) throw new Error(bad.length + " phantom products");
});

ok("every recommendation carries the reasons it scored", () => {
  const p = blankProfile();
  p.family = ["earthy"];
  p.occasion = ["everyday"];
  const n = recommend(p, 3).list.filter((r) => r.why.length === 0).length;
  if (n) throw new Error(n + " results with no explanation");
});

ok("a family preference actually moves the ranking", () => {
  const a = blankProfile();
  a.family = ["floral"];
  const b = blankProfile();
  b.family = ["earthy"];
  const x = recommend(a, 1).list[0].p.slug;
  const y = recommend(b, 1).list[0].p.slug;
  if (x === y) throw new Error("same top result for floral and earthy: " + x);
});

ok("a set never wins a plain family query", () => {
  const p = blankProfile();
  p.family = ["floral"];
  const top = recommend(p, 3).list[0].p;
  if (top.type === "set") throw new Error("a set won: " + top.slug);
});

ok("negation becomes a dislike, not a preference", () => {
  const d = extract("I want something fresh but nothing sweet").delta;
  if (!d.dislike || !d.dislike.includes("sweet")) throw new Error("no dislike read");
});

ok('"not too strong" does not set intensity to strong', () => {
  if (extract("not too strong please").delta.intensity === "strong") {
    throw new Error("read as strong");
  }
});

ok("budget phrasing lands in the right band", () => {
  const r = [
    extract("under 500").delta.budget,
    extract("budget is ₹1,000").delta.budget,
    extract("around 2500 is fine").delta.budget,
  ];
  if (r.join(",") !== "low,mid,high") throw new Error(r.join(","));
});

ok('"perfume" as a plain word is not a format choice', () => {
  const d = extract("I don't know anything about perfume, it's a gift for my mother").delta;
  if (d.type) throw new Error("read a format: " + d.type);
  if (d.who !== "gift") throw new Error("missed the gift");
});

ok('"alcohol free" reads as itra, not as a spray', () => {
  const d = extract("something alcohol free I can dab on").delta;
  if (d.type !== "attar") throw new Error("type " + d.type);
});

ok("an unreadable message says so rather than guessing", () => {
  if (extract("hello there").empty !== true) throw new Error("claimed to understand");
});

ok("a profile survives a round of merging", () => {
  const p = blankProfile();
  applyDelta(p, extract("woody and smoky").delta);
  applyDelta(p, extract("for the office").delta);
  if (!p.family.length || !p.occasion.length) throw new Error("nothing merged");
});

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
