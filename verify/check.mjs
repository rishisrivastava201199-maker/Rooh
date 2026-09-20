/* ══════════════════════════════════════════════════════════════
   PROJECT CHECKS

   npm is unavailable where this was written, so none of this is a
   substitute for `npm install && npm run build`. It is the set of
   mistakes that CAN be caught without installing anything:

     1. every internal <Link href> resolves to a real route
     2. every "@/" and relative import resolves to a real file
     3. every process.env name is documented in .env.example
     4. no \uXXXX escape sits in JSX text, where it renders literally
     5. every className used in TSX exists in the stylesheets
     6. the SVG figure ids cannot collide on one page
   ══════════════════════════════════════════════════════════════ */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "src");
let fails = 0;
const fail = (m) => { console.log("  FAIL  " + m); fails++; };
const pass = (m) => console.log("  ok    " + m);

const walk = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
};

const files = walk(SRC);
const code = files.filter((f) => /\.(ts|tsx)$/.test(f));
const read = (f) => fs.readFileSync(f, "utf8");
const rel = (f) => path.relative(ROOT, f);

/* ── 1. routes ─────────────────────────────────────────────── */
const routes = new Set(["/"]);
for (const f of files.filter((f) => f.endsWith("page.tsx"))) {
  let r = path.relative(path.join(SRC, "app"), path.dirname(f)).split(path.sep).join("/");
  r = r.replace(/\(([^)]+)\)\/?/g, "");           // route groups are invisible in the URL
  routes.add("/" + r.replace(/\/$/, ""));
}
const dynamic = [...routes].filter((r) => r.includes("["));
const staticRoutes = new Set([...routes].filter((r) => !r.includes("[")));
const matchesDynamic = (href) =>
  dynamic.some((d) => {
    const re = new RegExp("^" + d.replace(/\[\.\.\.[^\]]+\]/g, ".+").replace(/\[[^\]]+\]/g, "[^/]+") + "$");
    return re.test(href);
  });

console.log("\n1 · internal links resolve to a route");
let badLinks = 0;
for (const f of code) {
  const src = read(f);
  for (const m of src.matchAll(/href=(?:"([^"]+)"|\{`([^`$]+)`\})/g)) {
    const href = (m[1] ?? m[2] ?? "").split(/[?#]/)[0];
    if (!href.startsWith("/")) continue;
    const clean = href.length > 1 ? href.replace(/\/$/, "") : href;
    if (staticRoutes.has(clean) || matchesDynamic(clean)) continue;
    fail(`${rel(f)} → ${href} has no route`);
    badLinks++;
  }
}
if (!badLinks) pass(`${staticRoutes.size} static routes, ${dynamic.length} dynamic — every link resolves`);

/* ── 2. imports ────────────────────────────────────────────── */
console.log("\n2 · every import resolves");
const EXT = [".ts", ".tsx", ".css", "/index.ts", "/index.tsx"];
const exists = (base) => fs.existsSync(base) || EXT.some((e) => fs.existsSync(base + e));
let badImports = 0;
for (const f of code.concat(files.filter((f) => f.endsWith(".css")))) {
  const src = read(f);
  const specs = [
    ...src.matchAll(/from\s+"([^"]+)"/g),
    ...src.matchAll(/import\s+"([^"]+)"/g),
    ...src.matchAll(/@import\s+"([^"]+)"/g),
  ].map((m) => m[1]);
  for (const s of specs) {
    let target = null;
    if (s.startsWith("@/")) target = path.join(SRC, s.slice(2));
    else if (s.startsWith(".")) target = path.resolve(path.dirname(f), s);
    else continue; // a package
    if (!exists(target)) {
      fail(`${rel(f)} imports ${s} — not found`);
      badImports++;
    }
  }
}
if (!badImports) pass("all relative and @/ imports resolve to files that exist");

/* ── 3. environment ────────────────────────────────────────── */
console.log("\n3 · env names are documented");
const envExample = read(path.join(ROOT, ".env.example"));
const used = new Set();
for (const f of code) {
  for (const m of read(f).matchAll(/process\.env\.([A-Z0-9_]+)/g)) used.add(m[1]);
}
const undocumented = [...used].filter((k) => k !== "NODE_ENV" && !envExample.includes(k));
if (undocumented.length) undocumented.forEach((k) => fail(`${k} is read but not in .env.example`));
else pass(`${used.size} variables read, all documented`);

/* ── 4. escapes in JSX text ────────────────────────────────── */
console.log("\n4 · no escape sequence renders literally");
let badEsc = 0;
for (const f of code.filter((f) => f.endsWith(".tsx"))) {
  const src = read(f);
  // a \uXXXX that is NOT inside a quoted string is JSX text
  for (const line of src.split("\n")) {
    if (!/\\u[0-9A-Fa-f]{4}/.test(line)) continue;
    const stripped = line.replace(/"[^"]*"/g, "").replace(/'[^']*'/g, "").replace(/`[^`]*`/g, "");
    if (/\\u[0-9A-Fa-f]{4}/.test(stripped)) {
      fail(`${rel(f)}: ${line.trim().slice(0, 70)}`);
      badEsc++;
    }
  }
}
if (!badEsc) pass("no \\uXXXX sits in JSX text");

/* ── 5. class names exist in the stylesheets ───────────────── */
console.log("\n5 · classNames exist in the design system");
const css = files.filter((f) => f.endsWith(".css")).map(read).join("\n");
const defined = new Set([...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]));
const usedClasses = new Set();
for (const f of code.filter((f) => f.endsWith(".tsx"))) {
  const src = read(f);
  for (const m of src.matchAll(/className=(?:"([^"]+)"|\{`([^`]*)`\})/g)) {
    (m[1] ?? m[2] ?? "")
      .replace(/\$\{[^}]*\}/g, " ")
      .split(/\s+/)
      .filter(Boolean)
      .forEach((c) => usedClasses.add(c));
  }
}
const missing = [...usedClasses].filter((c) => !defined.has(c));
if (missing.length) {
  fail(`${missing.length} class names are used but never defined: ${missing.slice(0, 12).join(", ")}`);
} else {
  pass(`${usedClasses.size} class names used, all defined in the stylesheets`);
}

/* ── 6. figure ids cannot collide ──────────────────────────── */
console.log("\n6 · generated SVG ids are per-render-site");
const gallery = read(path.join(SRC, "components/Gallery.tsx"));
if (/slots\(product, "track"\)/.test(gallery) && /slots\(product, "main"\)/.test(gallery) && /slots\(product, "thumb"\)/.test(gallery)) {
  pass("the gallery seeds the track, the main image and the rail separately");
} else {
  fail("the gallery may render the same SVG ids more than once on a page");
}

console.log("\n" + (fails ? `${fails} problem(s)` : "all checks passed"));
process.exit(fails ? 1 : 0);
