/* ══════════════════════════════════════════════════════════════
   GENERATED VISUALS — photography placeholders

   Eight fixed image slots per product, drawn rather than shot, so
   the grid reads as one campaign while the real photography is
   commissioned. Each returns an SVG string; replace the call site
   with an <Image> when the photographs exist.

   One change from the prototype: ids are derived from a caller
   supplied seed rather than a module counter, so the server and the
   browser produce identical markup and React never reports a
   hydration mismatch.
   ══════════════════════════════════════════════════════════════ */
import { bySlug, type Product } from "./products";

export interface FamilyTile {
  slug: string;
  name: string;
  desc: string;
  a: string;
  b: string;
}

export interface Ingredient {
  key: string;
  name: string;
  a: string;
  b: string;
  [k: string]: unknown;
}

/* a short, stable id from a seed — same input, same output, always */
let _fallback = 0;
export function mkId(seed?: string): string {
  if (!seed) return "f" + _fallback++;
  let h = 5381;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) + h + seed.charCodeAt(i)) >>> 0;
  return "f" + h.toString(36);
}

const esc = (s: unknown): string =>
  String(s == null ? "" : s).replace(
    /[&<>"']/g,
    (c) => (({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }) as Record<string, string>)[c]!,
  );

const svg = (vb: string, inner: string, extra?: string): string =>
  '<svg viewBox="' + vb + '" role="img" aria-label="Generated visual — photography placeholder" ' +
  'preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%' + (extra || "") + '">' + inner + "</svg>";

const SETPAL: [string, string][] = [
  ["#6B4527", "#2B1A11"],
  ["#8A7B69", "#3B332B"],
  ["#4C6041", "#1F2C1B"],
  ["#8C3446", "#3E1220"],
  ["#A56A28", "#42260F"]
];

export const FAMILIES: FamilyTile[] = [
  { slug: "oud", name: "Oud", desc: "Resinous. Smoky. Unmistakable.", a: "#4A2E1C", b: "#1C110A" },
  { slug: "woody", name: "Woody", desc: "Warm. Grounded. Refined.", a: "#6B4C30", b: "#2A1C11" },
  { slug: "floral", name: "Floral", desc: "Rose, jasmine, saffron.", a: "#8C3446", b: "#3A1020" },
  { slug: "fresh", name: "Fresh", desc: "Citrus and cut green stems.", a: "#4C6041", b: "#1B2617" },
  { slug: "musky", name: "Musk", desc: "Quiet. Close to the skin.", a: "#8A7B69", b: "#332B24" },
  { slug: "oriental", name: "Amber", desc: "Resin, vanilla, golden warmth.", a: "#A56A28", b: "#3C2210" },
  { slug: "spicy", name: "Spicy", desc: "Cardamom, pepper, cinnamon.", a: "#8E4A2A", b: "#331508" },
  { slug: "earthy", name: "Earthy", desc: "Wet clay and vetiver root.", a: "#6E5636", b: "#261C10" }
];

const FAM2ING: Record<string, string> = {
  oud: "oud", woody: "sandalwood", floral: "rose", fresh: "vetiver",
  earthy: "vetiver", musky: "musk", oriental: "saffron", spicy: "saffron",
};

export const INGREDIENTS: Ingredient[] = [
  {
    key: "saffron",
    name: "Saffron",
    a: "#C4761F",
    b: "#5A2B08",
    body: "The most expensive spice in the world, and one of the few materials that reads as luxury on skin without being sweet. In perfumery it gives a leathery, slightly medicinal warmth that keeps rose from turning sugary. A little goes a long way — measured in fractions of a percent.",
    note: "Kashmir and Iran",
    rel: ["rose-and-saffron", "amber-spice"]
  },
  {
    key: "rose",
    name: "Rose",
    a: "#B0445C",
    b: "#4A1020",
    body: "India grows some of the world's finest rose, and Indian perfumery composes it differently from Europe — warmer and rounder, with spice and wood underneath rather than green freshness on top. Rose is the most-worn floral in the country and the least likely to be mistaken for anything else.",
    note: "Damask rose",
    rel: ["rose-and-saffron", "gulab-itra"]
  },
  {
    key: "oud",
    name: "Oud",
    a: "#6B4020",
    b: "#20120A",
    body: "Agarwood resin, formed when a tree is infected and defends itself. Genuine distilled oud runs into lakhs of rupees per kilogram, which is why almost everything sold at mid-market prices — ours included — uses a composed oud accord rather than the real distillate. We would rather say that here than imply otherwise on a label.",
    note: "An accord, not a distillate",
    rel: ["oud-and-woods"]
  },
  {
    key: "sandalwood",
    name: "Sandalwood",
    a: "#B99A63",
    b: "#4A3A1E",
    body: "Creamy, milky, quietly persistent — the backbone of traditional attar, because the oil itself is what the flower aroma is distilled into. Indian sandalwood oil currently trades between roughly ₹98,000 and ₹2,50,000 per kilogram, which is the whole reason a ₹399 attar cannot be sandalwood-based.",
    note: "Base note and fixative",
    rel: ["oud-and-woods", "royal-musk"]
  },
  {
    key: "vetiver",
    name: "Vetiver",
    a: "#5F7346",
    b: "#1E2A16",
    body: "Khus — the root, not the leaf. Dry, green, faintly smoky, and one of the few materials that stays comfortable above thirty-five degrees. In India it has been woven into screens and hung in doorways for centuries, cooling the air as water evaporates through it.",
    note: "Distilled from the root",
    rel: ["indian-vetiver", "khus-itra"]
  },
  {
    key: "musk",
    name: "Musk",
    a: "#9C8C79",
    b: "#3A322A",
    body: "The quietest thing in perfumery and often the most memorable. Modern musks are synthetic — no animal source, and no realistic alternative at this price or ethically. They read as clean skin rather than as a scent, which is precisely why they work under everything else.",
    note: "Synthetic, by choice",
    rel: ["royal-musk", "oud-and-woods"]
  }
];

export function figSet(p: Product, dark?: boolean, seed?: string): string{
  const id = mkId(seed);
  const n = p.slug === "signature-duo" ? 2 : p.slug === "itra-discovery-box" ? 3 : 5;
  const vial = p.slug === "itra-discovery-box";
  const full = p.slug === "signature-duo";
  const pals = vial ? [["#7C5730","#3A2614"],["#A24A5C","#4A1A26"],["#5B7048","#23301B"]]
                    : SETPAL.slice(0, n);
  const ground = dark
    ? '<stop offset="0" stop-color="#2E1529"/><stop offset="1" stop-color="#150A14"/>'
    : '<stop offset="0" stop-color="#F6F1E7"/><stop offset="1" stop-color="#E7DFD1"/>';
  const grads = pals.map(function(c,i){
    return '<linearGradient id="'+id+'p'+i+'" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0" stop-color="'+c[0]+'"/><stop offset="1" stop-color="'+c[1]+'"/></linearGradient>'; }).join("");
  const defs = '<defs>'
    + '<linearGradient id="'+id+'bg" x1="0" y1="0" x2="0" y2="1">' + ground + '</linearGradient>'
    + '<linearGradient id="'+id+'sp" x1="0" y1="0" x2="1" y2="0">'
    +   '<stop offset="0" stop-color="#fff" stop-opacity=".42"/>'
    +   '<stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
    + '<radialGradient id="'+id+'sh" cx=".5" cy=".5" r=".5">'
    +   '<stop offset="0" stop-color="'+(dark?"#000":"#3A2E23")+'" stop-opacity="'+(dark?".5":".30")+'"/>'
    +   '<stop offset="1" stop-color="'+(dark?"#000":"#3A2E23")+'" stop-opacity="0"/></radialGradient>'
    + grads + '</defs>';

  const w = full ? 74 : vial ? 52 : 40;
  const h = full ? 150 : vial ? 132 : 104;
  const gap = full ? 24 : vial ? 26 : 14;
  const span = n * w + (n - 1) * gap;
  const x0 = 200 - span / 2 + w / 2;
  const base = 384;

  const one = function (i: number) {
    const x = x0 + i * (w + gap);
    const capH = full ? 30 : vial ? 22 : 18;
    return '<g transform="translate('+x+' 0)">'
      + '<rect x="'+(-w/2)+'" y="'+(base-h)+'" width="'+w+'" height="'+h+'" rx="2" fill="url(#'+id+'p'+i+')"/>'
      + '<rect x="'+(-w/2)+'" y="'+(base-h)+'" width="'+Math.round(w*0.3)+'" height="'+h+'" fill="url(#'+id+'sp)"/>'
      + '<rect x="'+(-w*0.22)+'" y="'+(base-h-6)+'" width="'+(w*0.44)+'" height="6" fill="#A58A5B"/>'
      + '<rect x="'+(-w*0.3)+'" y="'+(base-h-6-capH)+'" width="'+(w*0.6)+'" height="'+capH+'" fill="#241D19"/>'
      + '<rect x="'+(-w*0.34)+'" y="'+(base-h*0.46)+'" width="'+(w*0.68)+'" height="'+(h*0.32)+'" fill="#F7F3EC" fill-opacity=".93"/>'
      + (w >= 52 ? '<text x="0" y="'+(base-h*0.30)+'" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-size="'+(w>=70?11:9)+'" letter-spacing="1.4" fill="#241D19">ROOH</text>' : '')
      + '</g>';
  };
  let art = "";
  for (let i = 0; i < n; i++) art += one(i);

  return svg("0 0 400 520", defs
    + '<rect width="400" height="520" fill="url(#'+id+'bg)"/>'
    + '<rect y="366" width="400" height="154" fill="'+(dark?"#1B0D1A":"#DFD5C4")+'" opacity="'+(dark?".5":"1")+'"/>'
    + '<rect y="365" width="400" height="1" fill="#241D19" opacity=".07"/>'
    + '<rect x="'+(200-span/2-18)+'" y="384" width="'+(span+36)+'" height="26" fill="#241D19" opacity=".07"/>'
    + '<ellipse cx="200" cy="392" rx="'+(span/2+26)+'" ry="16" fill="url(#'+id+'sh)"/>'
    + art
    + '<text x="200" y="440" text-anchor="middle" font-family="Manrope,Helvetica,sans-serif" font-size="9" '
    + 'letter-spacing="3.6" fill="'+(dark?"#F2EBE1":"#241D19")+'" fill-opacity=".42">'
    + (full ? "TWO FULL SIZES" : vial ? "THREE ITRAS" : "FIVE × 2 ML") + '</text>');
}

export function figBottle(p: Product, dark?: boolean, seed?: string): string{
  if (p.type === "set") return figSet(p, dark, seed);
  const id = mkId(seed), pal = p.pal, attar = p.type === "attar";
  const ground = dark
    ? '<stop offset="0" stop-color="#2E1529"/><stop offset="1" stop-color="#150A14"/>'
    : '<stop offset="0" stop-color="#F6F1E7"/><stop offset="1" stop-color="#E7DFD1"/>';
  const floor = dark ? '#1B0D1A' : '#DFD5C4';
  const defs = '<defs>'
    + '<linearGradient id="'+id+'bg" x1="0" y1="0" x2="0" y2="1">' + ground + '</linearGradient>'
    + '<linearGradient id="'+id+'gl" x1="0" y1="0" x2="0" y2="1">'
    +   '<stop offset="0" stop-color="'+pal.top+'"/><stop offset=".62" stop-color="'+pal.bot+'"/>'
    +   '<stop offset="1" stop-color="'+pal.bot+'"/></linearGradient>'
    + '<linearGradient id="'+id+'sp" x1="0" y1="0" x2="1" y2="0">'
    +   '<stop offset="0" stop-color="#fff" stop-opacity=".40"/>'
    +   '<stop offset=".55" stop-color="#fff" stop-opacity=".06"/>'
    +   '<stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
    + '<linearGradient id="'+id+'ed" x1="0" y1="0" x2="1" y2="0">'
    +   '<stop offset="0" stop-color="#000" stop-opacity="0"/>'
    +   '<stop offset="1" stop-color="#000" stop-opacity=".26"/></linearGradient>'
    + '<linearGradient id="'+id+'cp" x1="0" y1="0" x2="1" y2="0">'
    +   '<stop offset="0" stop-color="#fff" stop-opacity=".22"/>'
    +   '<stop offset=".4" stop-color="#fff" stop-opacity="0"/></linearGradient>'
    + '<radialGradient id="'+id+'sh" cx=".5" cy=".5" r=".5">'
    +   '<stop offset="0" stop-color="'+(dark?"#000":"#3A2E23")+'" stop-opacity="'+(dark?".55":".34")+'"/>'
    +   '<stop offset="1" stop-color="'+(dark?"#000":"#3A2E23")+'" stop-opacity="0"/></radialGradient>'
    + '<radialGradient id="'+id+'lt" cx=".5" cy=".28" r=".55">'
    +   '<stop offset="0" stop-color="#C9A96E" stop-opacity="'+(dark?".26":"0")+'"/>'
    +   '<stop offset="1" stop-color="#C9A96E" stop-opacity="0"/></radialGradient>'
    + '</defs>';

  const base = '<rect width="400" height="520" fill="url(#'+id+'bg)"/>'
    + '<rect y="366" width="400" height="154" fill="'+floor+'" opacity="'+(dark?".5":"1")+'"/>'
    + '<rect y="365" width="400" height="1" fill="#241D19" opacity=".07"/>'
    + '<rect width="400" height="520" fill="url(#'+id+'lt)"/>'
    + '<ellipse cx="204" cy="402" rx="132" ry="26" fill="url(#'+id+'sh)"/>'
    + '<ellipse cx="200" cy="398" rx="'+(attar?40:62)+'" ry="'+(attar?6:8)+'" fill="#3A2E23" opacity=".22"/>';

  let art;
  if (!attar){
    art = '<rect x="176" y="96" width="48" height="52" fill="'+pal.cap+'"/>'
      + '<rect x="176" y="96" width="48" height="52" fill="url(#'+id+'cp)"/>'
      + '<rect x="176" y="96" width="48" height="2" fill="#fff" opacity=".18"/>'
      + '<rect x="181" y="148" width="38" height="7" fill="#A58A5B"/>'
      + '<rect x="181" y="148" width="38" height="2" fill="#D9C296" opacity=".8"/>'
      + '<rect x="187" y="155" width="26" height="30" fill="url(#'+id+'gl)"/>'
      + '<path d="M187 185 Q187 194 170 199 L152 199 Q146 199 146 206 L146 386 Q146 394 154 394 L246 394 Q254 394 254 386 L254 206 Q254 199 248 199 L230 199 Q213 194 213 185 Z" fill="url(#'+id+'gl)"/>'
      + '<path d="M187 185 Q187 194 170 199 L152 199 Q146 199 146 206 L146 386 Q146 394 154 394 L246 394 Q254 394 254 386 L254 206 Q254 199 248 199 L230 199 Q213 194 213 185 Z" fill="url(#'+id+'ed)"/>'
      + '<rect x="150" y="203" width="26" height="187" fill="url(#'+id+'sp)"/>'
      + '<rect x="146" y="352" width="108" height="42" fill="#000" opacity=".12"/>'
      + '<rect x="166" y="276" width="68" height="76" fill="#F7F3EC"/>'
      + '<rect x="166" y="276" width="68" height="76" fill="none" stroke="#241D19" stroke-opacity=".10"/>'
      + '<text x="200" y="304" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-size="15" letter-spacing="2.2" fill="#241D19">ROOH</text>'
      + '<rect x="180" y="312" width="40" height="1" fill="#A58A5B"/>'
      + '<text x="200" y="328" text-anchor="middle" font-family="Manrope,Helvetica,sans-serif" font-size="5.2" letter-spacing="1.5" fill="#241D19" fill-opacity=".72">EAU DE PARFUM</text>'
      + '<text x="200" y="342" text-anchor="middle" font-family="Manrope,Helvetica,sans-serif" font-size="5.2" letter-spacing="1.5" fill="#241D19" fill-opacity=".52">'+p.size.toUpperCase()+'</text>';
  } else {
    art = '<g transform="translate(200 396) scale(.60) translate(-200 -396)">'
      + '<path d="M186 92 q14 -14 28 0 z" fill="#A58A5B"/>'
      + '<rect x="184" y="92" width="32" height="34" fill="'+pal.cap+'"/>'
      + '<rect x="184" y="92" width="32" height="34" fill="url(#'+id+'cp)"/>'
      + '<rect x="180" y="126" width="40" height="8" fill="#A58A5B"/>'
      + '<rect x="180" y="126" width="40" height="2" fill="#D9C296" opacity=".8"/>'
      + '<rect x="190" y="134" width="20" height="24" fill="url(#'+id+'gl)"/>'
      + '<path d="M190 158 q0 10 -14 18 Q164 184 164 200 L164 362 Q164 388 190 388 L210 388 Q236 388 236 362 L236 200 Q236 184 224 176 Q210 168 210 158 Z" fill="url(#'+id+'gl)"/>'
      + '<path d="M190 158 q0 10 -14 18 Q164 184 164 200 L164 362 Q164 388 190 388 L210 388 Q236 388 236 362 L236 200 Q236 184 224 176 Q210 168 210 158 Z" fill="url(#'+id+'ed)"/>'
      + '<rect x="170" y="200" width="20" height="176" fill="url(#'+id+'sp)"/>'
      + '<rect x="176" y="286" width="48" height="60" fill="#F7F3EC"/>'
      + '<rect x="176" y="286" width="48" height="60" fill="none" stroke="#241D19" stroke-opacity=".10"/>'
      + '<text x="200" y="310" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-size="13" letter-spacing="1.8" fill="#241D19">ROOH</text>'
      + '<rect x="186" y="317" width="28" height="1" fill="#A58A5B"/>'
      + '<text x="200" y="332" text-anchor="middle" font-family="Manrope,Helvetica,sans-serif" font-size="5" letter-spacing="1.4" fill="#241D19" fill-opacity=".70">ITRA</text></g>';
  }
  return svg("0 0 400 520", defs + base + art);
}

export function figHero(seed?: string): string{
  const id = mkId(seed);
  const defs = '<defs>'
    + '<linearGradient id="'+id+'g" x1="0" y1="0" x2="1" y2="1">'
    +   '<stop offset="0" stop-color="#1B0B19"/><stop offset=".5" stop-color="#260F24"/>'
    +   '<stop offset="1" stop-color="#3A1B37"/></linearGradient>'
    + '<radialGradient id="'+id+'l" cx=".72" cy=".34" r=".48">'
    +   '<stop offset="0" stop-color="#C9A96E" stop-opacity=".40"/>'
    +   '<stop offset="1" stop-color="#C9A96E" stop-opacity="0"/></radialGradient>'
    + '<linearGradient id="'+id+'v" x1="0" y1="0" x2="1" y2="0">'
    +   '<stop offset="0" stop-color="#160A15" stop-opacity=".92"/>'
    +   '<stop offset=".52" stop-color="#160A15" stop-opacity=".35"/>'
    +   '<stop offset="1" stop-color="#160A15" stop-opacity="0"/></linearGradient>'
    + '<linearGradient id="'+id+'b" x1="0" y1="0" x2="0" y2="1">'
    +   '<stop offset="0" stop-color="#8A5F33"/><stop offset=".6" stop-color="#3A2114"/>'
    +   '<stop offset="1" stop-color="#241209"/></linearGradient>'
    + '<linearGradient id="'+id+'s" x1="0" y1="0" x2="1" y2="0">'
    +   '<stop offset="0" stop-color="#fff" stop-opacity=".34"/>'
    +   '<stop offset=".5" stop-color="#fff" stop-opacity=".04"/>'
    +   '<stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
    + '<radialGradient id="'+id+'sh" cx=".5" cy=".5" r=".5">'
    +   '<stop offset="0" stop-color="#000" stop-opacity=".55"/>'
    +   '<stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>'
    + '</defs>';
  const bg = '<rect width="1440" height="900" fill="url(#'+id+'g)"/>'
    + '<rect width="1440" height="900" fill="url(#'+id+'l)"/>'
    + '<g fill="none" stroke="#C9A96E" stroke-opacity=".16">'
    +   '<circle cx="1010" cy="330" r="300"/><circle cx="1010" cy="330" r="212"/>'
    +   '<path d="M0 690 C 380 596 760 772 1440 640"/>'
    +   '<path d="M0 742 C 420 654 820 828 1440 706"/></g>'
    + '<rect y="700" width="1440" height="200" fill="#120711" opacity=".55"/>';
  const bottle = '<g transform="translate(1010 330) scale(1.55) translate(-200 -260)">'
    + '<ellipse cx="200" cy="404" rx="118" ry="20" fill="url(#'+id+'sh)"/>'
    + '<rect x="176" y="96" width="48" height="52" fill="#180C17"/>'
    + '<rect x="181" y="148" width="38" height="7" fill="#A58A5B"/>'
    + '<rect x="187" y="155" width="26" height="30" fill="url(#'+id+'b)"/>'
    + '<path d="M187 185 Q187 194 170 199 L152 199 Q146 199 146 206 L146 386 Q146 394 154 394 L246 394 Q254 394 254 386 L254 206 Q254 199 248 199 L230 199 Q213 194 213 185 Z" fill="url(#'+id+'b)"/>'
    + '<rect x="150" y="203" width="24" height="187" fill="url(#'+id+'s)"/>'
    + '<rect x="166" y="276" width="68" height="76" fill="#F7F3EC" fill-opacity=".94"/>'
    + '<text x="200" y="306" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-size="16" letter-spacing="2.4" fill="#241D19">ROOH</text>'
    + '<rect x="180" y="314" width="40" height="1" fill="#A58A5B"/>'
    + '<text x="200" y="330" text-anchor="middle" font-family="Manrope,Helvetica,sans-serif" font-size="5.4" letter-spacing="1.6" fill="#241D19" fill-opacity=".7">EAU DE PARFUM</text>'
    + '</g>';
  return svg("0 0 1440 900", defs + bg + bottle + '<rect width="1440" height="900" fill="url(#'+id+'v)"/>');
}

export function figHeroMobile(seed?: string): string{
  const id = mkId(seed);
  const defs = '<defs>'
    + '<linearGradient id="'+id+'g" x1="0" y1="0" x2="1" y2="1">'
    +   '<stop offset="0" stop-color="#1B0B19"/><stop offset=".55" stop-color="#260F24"/>'
    +   '<stop offset="1" stop-color="#3A1B37"/></linearGradient>'
    + '<radialGradient id="'+id+'l" cx=".66" cy=".74" r=".52">'
    +   '<stop offset="0" stop-color="#C9A96E" stop-opacity=".38"/>'
    +   '<stop offset="1" stop-color="#C9A96E" stop-opacity="0"/></radialGradient>'
    + '<linearGradient id="'+id+'v" x1="0" y1="0" x2="0" y2="1">'
    +   '<stop offset="0" stop-color="#160A15" stop-opacity=".88"/>'
    +   '<stop offset=".58" stop-color="#160A15" stop-opacity=".42"/>'
    +   '<stop offset="1" stop-color="#160A15" stop-opacity=".1"/></linearGradient>'
    + '<linearGradient id="'+id+'b" x1="0" y1="0" x2="0" y2="1">'
    +   '<stop offset="0" stop-color="#8A5F33"/><stop offset=".6" stop-color="#3A2114"/>'
    +   '<stop offset="1" stop-color="#241209"/></linearGradient>'
    + '<linearGradient id="'+id+'s" x1="0" y1="0" x2="1" y2="0">'
    +   '<stop offset="0" stop-color="#fff" stop-opacity=".32"/>'
    +   '<stop offset=".5" stop-color="#fff" stop-opacity=".03"/>'
    +   '<stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
    + '<radialGradient id="'+id+'sh" cx=".5" cy=".5" r=".5">'
    +   '<stop offset="0" stop-color="#000" stop-opacity=".5"/>'
    +   '<stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>';
  const bottle = '<g transform="translate(300 710) scale(1.05) translate(-200 -300)">'
    + '<ellipse cx="200" cy="400" rx="112" ry="18" fill="url(#'+id+'sh)"/>'
    + '<rect x="176" y="96" width="48" height="52" fill="#180C17"/>'
    + '<rect x="181" y="148" width="38" height="7" fill="#A58A5B"/>'
    + '<rect x="187" y="155" width="26" height="30" fill="url(#'+id+'b)"/>'
    + '<path d="M187 185 Q187 194 170 199 L152 199 Q146 199 146 206 L146 386 Q146 394 154 394 L246 394 Q254 394 254 386 L254 206 Q254 199 248 199 L230 199 Q213 194 213 185 Z" fill="url(#'+id+'b)"/>'
    + '<rect x="150" y="203" width="24" height="187" fill="url(#'+id+'s)"/>'
    + '<rect x="166" y="276" width="68" height="76" fill="#F7F3EC" fill-opacity=".92"/>'
    + '<text x="200" y="306" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-size="16" letter-spacing="2.4" fill="#241D19">ROOH</text>'
    + '<rect x="180" y="314" width="40" height="1" fill="#A58A5B"/></g>';
  return svg("0 0 430 860", defs
    + '<rect width="430" height="860" fill="url(#'+id+'g)"/>'
    + '<rect width="430" height="860" fill="url(#'+id+'l)"/>'
    + '<g fill="none" stroke="#C9A96E" stroke-opacity=".14">'
    + '<circle cx="300" cy="700" r="250"/><circle cx="300" cy="700" r="176"/></g>'
    + bottle
    + '<rect width="430" height="860" fill="url(#'+id+'v)"/>');
}

export function figFamily(f: FamilyTile, ix: number, seed?: string): string{
  const id = mkId(seed), v = (ix||0) % 4;
  const lx = [".34",".68",".5",".26"][v], ly = [".30",".26",".18",".36"][v];
  const motif = [
    '<g fill="none" stroke="#F7F3EC" stroke-opacity=".22">'
      + '<ellipse cx="150" cy="168" rx="96" ry="120"/><ellipse cx="150" cy="168" rx="60" ry="84"/></g>'
      + '<ellipse cx="150" cy="168" rx="32" ry="50" fill="#F7F3EC" fill-opacity=".10"/>',
    '<g fill="none" stroke="#F7F3EC" stroke-opacity=".22" stroke-linecap="round">'
      + '<path d="M40 -10 q40 200 -6 420 M90 -10 q34 200 -4 420 M150 -10 q10 210 0 420'
      + ' M210 -10 q-34 200 4 420 M260 -10 q-40 200 6 420"/></g>',
    '<g fill="none" stroke="#F7F3EC" stroke-opacity=".20">'
      + '<path d="M-20 120 q170 -58 340 0 M-20 176 q170 -58 340 0 M-20 232 q170 -58 340 0"/></g>'
      + '<ellipse cx="150" cy="176" rx="104" ry="60" fill="#F7F3EC" fill-opacity=".07"/>',
    '<g fill="none" stroke="#F7F3EC" stroke-opacity=".20">'
      + '<circle cx="102" cy="146" r="84"/><circle cx="198" cy="200" r="84"/></g>'
      + '<circle cx="150" cy="173" r="30" fill="#F7F3EC" fill-opacity=".08"/>'
  ][v];
  const defs = '<defs>'
    + '<linearGradient id="'+id+'g" x1=".1" y1="0" x2=".9" y2="1">'
    +   '<stop offset="0" stop-color="'+f.a+'"/><stop offset="1" stop-color="'+f.b+'"/></linearGradient>'
    + '<radialGradient id="'+id+'l" cx="'+lx+'" cy="'+ly+'" r=".62">'
    +   '<stop offset="0" stop-color="#F6E7C9" stop-opacity=".40"/>'
    +   '<stop offset="1" stop-color="#F6E7C9" stop-opacity="0"/></radialGradient></defs>';
  return svg("0 0 300 400", defs
    + '<rect width="300" height="400" fill="url(#'+id+'g)"/>'
    + '<rect width="300" height="400" fill="url(#'+id+'l)"/>'
    + motif
    + '<rect y="248" width="300" height="152" fill="'+f.b+'" opacity=".38"/>');
}

export function figIngredient(i: Ingredient, seed?: string): string {
  const id = mkId(seed);
  const defs = '<defs>'
    + '<linearGradient id="'+id+'g" x1="0" y1="0" x2="1" y2="1">'
    +   '<stop offset="0" stop-color="'+i.a+'"/><stop offset="1" stop-color="'+i.b+'"/></linearGradient>'
    + '<radialGradient id="'+id+'l" cx=".38" cy=".32" r=".58">'
    +   '<stop offset="0" stop-color="#FBF0DA" stop-opacity=".40"/>'
    +   '<stop offset="1" stop-color="#FBF0DA" stop-opacity="0"/></radialGradient></defs>';
  const motif = ({
    saffron:'<g stroke="#F7E3C0" stroke-opacity=".62" fill="none" stroke-linecap="round">'
      + '<path d="M70 120 q22 -34 44 -12 M96 96 q18 -30 36 -6 M78 146 q30 -26 52 -6 M112 138 q22 -28 44 -10"/></g>',
    rose:'<g fill="none" stroke="#FBDCE2" stroke-opacity=".55">'
      + '<circle cx="100" cy="100" r="16"/><circle cx="100" cy="100" r="30"/>'
      + '<circle cx="100" cy="100" r="44"/><circle cx="100" cy="100" r="58"/></g>',
    oud:'<g fill="none" stroke="#E8CFA8" stroke-opacity=".42">'
      + '<path d="M52 44 q26 56 0 112 M74 36 q28 64 0 128 M96 30 q30 70 0 140 M118 36 q28 64 0 128 M140 44 q26 56 0 112"/></g>',
    sandalwood:'<g fill="none" stroke="#F3E2BE" stroke-opacity=".45">'
      + '<path d="M28 70 q72 -30 144 0 M28 100 q72 -30 144 0 M28 130 q72 -30 144 0"/></g>',
    vetiver:'<g fill="none" stroke="#DDEAC6" stroke-opacity=".48" stroke-linecap="round">'
      + '<path d="M78 34 q-14 60 6 132 M100 30 q4 66 0 136 M122 34 q14 60 -6 132 M60 52 q-10 48 10 106 M140 52 q10 48 -10 106"/></g>',
    musk:'<g fill="#FBF2E4" fill-opacity=".16">'
      + '<circle cx="100" cy="100" r="58"/><circle cx="100" cy="100" r="38" fill-opacity=".2"/></g>'
  } as Record<string, string>)[i.key] || "";
  return svg("0 0 200 200", defs
    + '<rect width="200" height="200" fill="url(#'+id+'g)"/>'
    + '<rect width="200" height="200" fill="url(#'+id+'l)"/>' + motif);
}

export function figJournal(j: { slug: string; title: string; a: string; b: string }, seed?: string): string {
  const id = mkId(seed);
  return svg("0 0 640 400",
    '<defs><linearGradient id="'+id+'g" x1="0" y1="0" x2="1" y2="1">'
    + '<stop offset="0" stop-color="'+j.a+'"/><stop offset="1" stop-color="'+j.b+'"/></linearGradient>'
    + '<radialGradient id="'+id+'l" cx=".68" cy=".26" r=".55">'
    + '<stop offset="0" stop-color="#F5E6C8" stop-opacity=".34"/>'
    + '<stop offset="1" stop-color="#F5E6C8" stop-opacity="0"/></radialGradient></defs>'
    + '<rect width="640" height="400" fill="url(#'+id+'g)"/>'
    + '<rect width="640" height="400" fill="url(#'+id+'l)"/>'
    + '<g fill="none" stroke="#F7F3EC" stroke-opacity=".18">'
    + '<circle cx="452" cy="112" r="120"/><circle cx="452" cy="112" r="76"/>'
    + '<path d="M-20 300 C 140 248 300 342 660 268"/></g>');
}

export function figItraScene(seed?: string): string{
  const id = mkId(seed);
  const vial = (x: number, top: string, bot: string, s: number) =>
    '<g transform="translate('+x+' 358) scale('+s+') translate(-200 -388)">'
    + '<ellipse cx="200" cy="392" rx="46" ry="8" fill="#000" opacity=".42"/>'
    + '<path d="M186 92 q14 -14 28 0 z" fill="#A58A5B"/>'
    + '<rect x="184" y="92" width="32" height="34" fill="#180C17"/>'
    + '<rect x="180" y="126" width="40" height="8" fill="#A58A5B"/>'
    + '<rect x="190" y="134" width="20" height="24" fill="'+bot+'"/>'
    + '<path d="M190 158 q0 10 -14 18 Q164 184 164 200 L164 362 Q164 388 190 388 L210 388 Q236 388 236 362 L236 200 Q236 184 224 176 Q210 168 210 158 Z" fill="url(#'+id+top+')"/>'
    + '<rect x="170" y="200" width="18" height="176" fill="url(#'+id+'sp)"/></g>';
  const grad = (n: string, a: string, b: string) => '<linearGradient id="'+id+n+'" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0" stop-color="'+a+'"/><stop offset="1" stop-color="'+b+'"/></linearGradient>';
  const defs = '<defs>'
    + '<linearGradient id="'+id+'bg" x1="0" y1="0" x2="1" y2="1">'
    +   '<stop offset="0" stop-color="#1D0D1B"/><stop offset="1" stop-color="#301531"/></linearGradient>'
    + '<radialGradient id="'+id+'l" cx=".5" cy=".3" r=".5">'
    +   '<stop offset="0" stop-color="#C9A96E" stop-opacity=".30"/>'
    +   '<stop offset="1" stop-color="#C9A96E" stop-opacity="0"/></radialGradient>'
    + '<linearGradient id="'+id+'sp" x1="0" y1="0" x2="1" y2="0">'
    +   '<stop offset="0" stop-color="#fff" stop-opacity=".34"/>'
    +   '<stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
    + grad('a', '#7C5730', '#3A2614') + grad('b', '#A24A5C', '#4A1A26') + grad('c', '#5B7048', '#23301B')
    + '</defs>';
  return svg("0 0 640 480", defs
    + '<rect width="640" height="480" fill="url(#'+id+'bg)"/>'
    + '<rect width="640" height="480" fill="url(#'+id+'l)"/>'
    + '<rect y="356" width="640" height="124" fill="#120711" opacity=".5"/>'
    + '<rect y="356" width="640" height="1" fill="#C9A96E" opacity=".18"/>'
    + vial(176, 'a', '#3A2614', .62) + vial(320, 'b', '#4A1A26', .70) + vial(464, 'c', '#23301B', .62));
}

export function figAmbient(warm?: boolean, seed?: string): string {
  const id = mkId(seed);
  return svg("0 0 1440 800",
    '<defs><radialGradient id="'+id+'a" cx="'+(warm?".18":".82")+'" cy=".2" r=".6">'
    + '<stop offset="0" stop-color="#C9A96E" stop-opacity=".16"/>'
    + '<stop offset="1" stop-color="#C9A96E" stop-opacity="0"/></radialGradient></defs>'
    + '<rect width="1440" height="800" fill="url(#'+id+'a)"/>'
    + '<g fill="none" stroke="#C9A96E" stroke-opacity=".10">'
    + '<path d="M0 560 C 360 470 780 640 1440 520"/>'
    + '<path d="M0 620 C 400 530 820 700 1440 580"/></g>');
}

export function figStory(seed?: string): string{
  const id = mkId(seed);
  return svg("0 0 640 480",
    '<defs><linearGradient id="'+id+'g" x1="0" y1="0" x2="1" y2="1">'
    + '<stop offset="0" stop-color="#3E2A16"/><stop offset=".55" stop-color="#6B4A28"/>'
    + '<stop offset="1" stop-color="#2A1A0E"/></linearGradient>'
    + '<radialGradient id="'+id+'l" cx=".32" cy=".26" r=".6">'
    + '<stop offset="0" stop-color="#F6E6C4" stop-opacity=".40"/>'
    + '<stop offset="1" stop-color="#F6E6C4" stop-opacity="0"/></radialGradient></defs>'
    + '<rect width="640" height="480" fill="url(#'+id+'g)"/>'
    + '<rect width="640" height="480" fill="url(#'+id+'l)"/>'
    + '<g fill="none" stroke="#F7F3EC" stroke-opacity=".16">'
    + '<path d="M60 400 q40 -150 130 -190 M120 410 q30 -170 128 -214 M0 380 q54 -120 128 -166"/>'
    + '<circle cx="470" cy="150" r="96"/><circle cx="470" cy="150" r="58"/></g>'
    + '<rect y="380" width="640" height="100" fill="#1E1208" opacity=".45"/>');
}

export function figDiscovery(seed?: string): string{
  const id = mkId(seed);
  const mini = (x: number, a: string, b: string) => '<g transform="translate('+x+' 0)">'
    + '<rect x="-17" y="-96" width="34" height="112" rx="2" fill="url(#'+id+b+')"/>'
    + '<rect x="-17" y="-96" width="11" height="112" fill="url(#'+id+'sp)"/>'
    + '<rect x="-7" y="-112" width="14" height="16" fill="#241D19"/>'
    + '<rect x="-11" y="-42" width="22" height="30" fill="#F7F3EC" fill-opacity=".92"/></g>';
  const grad = (n: string, a: string, b: string) => '<linearGradient id="'+id+n+'" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0" stop-color="'+a+'"/><stop offset="1" stop-color="'+b+'"/></linearGradient>';
  const defs = '<defs>'
    + '<linearGradient id="'+id+'bg" x1="0" y1="0" x2="0" y2="1">'
    +   '<stop offset="0" stop-color="#F6F1E7"/><stop offset="1" stop-color="#E4DACA"/></linearGradient>'
    + '<linearGradient id="'+id+'sp" x1="0" y1="0" x2="1" y2="0">'
    +   '<stop offset="0" stop-color="#fff" stop-opacity=".42"/>'
    +   '<stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
    + grad('1','#6B4527','#2B1A11') + grad('2','#8A7B69','#3B332B') + grad('3','#4C6041','#1F2C1B')
    + grad('4','#8C3446','#3E1220') + grad('5','#A56A28','#42260F')
    + '</defs>';
  return svg("0 0 640 480", defs
    + '<rect width="640" height="480" fill="url(#'+id+'bg)"/>'
    + '<rect y="340" width="640" height="140" fill="#DCD1BE"/>'
    + '<rect y="339" width="640" height="1" fill="#241D19" opacity=".08"/>'
    + '<rect x="120" y="300" width="400" height="56" fill="#CFC2AC"/>'
    + '<ellipse cx="320" cy="352" rx="210" ry="18" fill="#3A2E23" opacity=".16"/>'
    + '<g transform="translate(0 300)">'
    + mini(180,'a','1') + mini(250,'a','2') + mini(320,'a','3') + mini(390,'a','4') + mini(460,'a','5')
    + '</g>'
    + '<text x="320" y="392" text-anchor="middle" font-family="Manrope,Helvetica,sans-serif" font-size="9" letter-spacing="4" fill="#241D19" fill-opacity=".45">THE DISCOVERY COLLECTION</text>');
}

export function figureFor(key: string, seed?: string): string{
  if (key === "hero") return figHero(seed);
  if (key === "band-disc") return figBand("#3A1B37", "#160A15", 1, seed);
  if (key === "hero-m") return figHeroMobile(seed);
  if (key === "story") return figStory(seed);
  if (key === "itra-scene") return figItraScene(seed);
  if (key === "itra-bg") return figAmbient(false, seed);
  if (key === "disc" || key === "disc-hero") return figDiscovery(seed);
  if (key.indexOf("fam-") === 0){
    const ix = FAMILIES.findIndex(x => x.slug === key.slice(4));
    return ix > -1 ? figFamily(FAMILIES[ix], ix, seed) : "";
  }
  if (key === "p-oud-hero") {
    const oud = bySlug("oud-and-woods");
    return oud ? figBottle(oud, false, seed) : "";
  }
  return "";
}

export function figBand(a: string, b: string, ix?: number, seed?: string): string{
  const id = mkId(seed), v = (ix||0) % 4;
  const lx = [".30",".70",".50",".22"][v], ly = [".28",".24",".16",".34"][v];
  const motif = [
    '<g fill="none" stroke="#F7F3EC" stroke-opacity=".16">'
      + '<ellipse cx="1080" cy="240" rx="300" ry="210"/><ellipse cx="1080" cy="240" rx="190" ry="132"/></g>',
    '<g fill="none" stroke="#F7F3EC" stroke-opacity=".16" stroke-linecap="round">'
      + '<path d="M140 -40 q90 300 -20 620 M420 -40 q70 300 -16 620 M720 -40 q20 310 0 620'
      + ' M1020 -40 q-70 300 16 620 M1300 -40 q-90 300 20 620"/></g>',
    '<g fill="none" stroke="#F7F3EC" stroke-opacity=".15">'
      + '<path d="M-40 190 q760 -120 1520 0 M-40 280 q760 -120 1520 0 M-40 370 q760 -120 1520 0"/></g>',
    '<g fill="none" stroke="#F7F3EC" stroke-opacity=".16">'
      + '<circle cx="880" cy="230" r="210"/><circle cx="1120" cy="300" r="210"/></g>'
  ][v];
  return svg("0 0 1440 520",
    '<defs><linearGradient id="'+id+'g" x1=".05" y1="0" x2=".95" y2="1">'
    + '<stop offset="0" stop-color="'+a+'"/><stop offset="1" stop-color="'+b+'"/></linearGradient>'
    + '<radialGradient id="'+id+'l" cx="'+lx+'" cy="'+ly+'" r=".62">'
    + '<stop offset="0" stop-color="#F6E7C9" stop-opacity=".34"/>'
    + '<stop offset="1" stop-color="#F6E7C9" stop-opacity="0"/></radialGradient></defs>'
    + '<rect width="1440" height="520" fill="url(#'+id+'g)"/>'
    + '<rect width="1440" height="520" fill="url(#'+id+'l)"/>' + motif);
}

export function figCarton(p: Product, seed?: string): string{
  const id = mkId(seed), pal = p.pal;
  return svg("0 0 400 520",
    '<defs><linearGradient id="'+id+'bg" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0" stop-color="#F6F1E7"/><stop offset="1" stop-color="#E7DFD1"/></linearGradient>'
    + '<linearGradient id="'+id+'b" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0" stop-color="'+pal.top+'"/><stop offset="1" stop-color="'+pal.bot+'"/></linearGradient>'
    + '<linearGradient id="'+id+'k" x1="0" y1="0" x2="1" y2="0">'
    + '<stop offset="0" stop-color="#EFE7D8"/><stop offset=".55" stop-color="#E2D7C2"/>'
    + '<stop offset="1" stop-color="#CFC2A9"/></linearGradient>'
    + '<linearGradient id="'+id+'s" x1="0" y1="0" x2="1" y2="0">'
    + '<stop offset="0" stop-color="#fff" stop-opacity=".40"/>'
    + '<stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>'
    + '<rect width="400" height="520" fill="url(#'+id+'bg)"/>'
    + '<rect y="374" width="400" height="146" fill="#DFD5C4"/>'
    + '<rect y="373" width="400" height="1" fill="#241D19" opacity=".07"/>'
    + '<ellipse cx="205" cy="392" rx="150" ry="18" fill="#3A2E23" opacity=".18"/>'
    /* carton */
    + '<rect x="96" y="150" width="118" height="240" fill="url(#'+id+'k)"/>'
    + '<rect x="96" y="150" width="118" height="240" fill="none" stroke="#241D19" stroke-opacity=".10"/>'
    + '<text x="155" y="268" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-size="19" letter-spacing="3" fill="#241D19">ROOH</text>'
    + '<rect x="128" y="278" width="54" height="1" fill="#A58A5B"/>'
    + '<text x="155" y="296" text-anchor="middle" font-family="Manrope,Helvetica,sans-serif" font-size="6" letter-spacing="1.8" fill="#241D19" fill-opacity=".62">'+esc(p.size.toUpperCase())+'</text>'
    /* bottle in front, right */
    + '<rect x="226" y="222" width="86" height="168" rx="3" fill="url(#'+id+'b)"/>'
    + '<rect x="226" y="222" width="24" height="168" fill="url(#'+id+'s)"/>'
    + '<rect x="256" y="208" width="26" height="14" fill="#A58A5B"/>'
    + '<rect x="250" y="172" width="38" height="36" fill="'+pal.cap+'"/>'
    + '<rect x="243" y="286" width="52" height="58" fill="#F7F3EC" fill-opacity=".94"/>'
    + '<text x="269" y="312" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-size="12" letter-spacing="1.6" fill="#241D19">ROOH</text>');
}

export function figMacro(p: Product, seed?: string): string{
  const id = mkId(seed), pal = p.pal;
  return svg("0 0 400 520",
    '<defs><linearGradient id="'+id+'bg" x1=".2" y1="0" x2=".8" y2="1">'
    + '<stop offset="0" stop-color="'+pal.top+'" stop-opacity=".22"/>'
    + '<stop offset="1" stop-color="'+pal.bot+'" stop-opacity=".40"/></linearGradient>'
    + '<linearGradient id="'+id+'g" x1="0" y1="0" x2="1" y2="0">'
    + '<stop offset="0" stop-color="'+pal.bot+'"/><stop offset=".34" stop-color="'+pal.top+'"/>'
    + '<stop offset="1" stop-color="'+pal.bot+'"/></linearGradient>'
    + '<linearGradient id="'+id+'m" x1="0" y1="0" x2="1" y2="0">'
    + '<stop offset="0" stop-color="#6E5326"/><stop offset=".3" stop-color="#E4CB97"/>'
    + '<stop offset=".55" stop-color="#A58A5B"/><stop offset="1" stop-color="#6E5326"/></linearGradient>'
    + '<radialGradient id="'+id+'l" cx=".34" cy=".26" r=".6">'
    + '<stop offset="0" stop-color="#fff" stop-opacity=".34"/>'
    + '<stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>'
    + '<rect width="400" height="520" fill="url(#'+id+'bg)"/>'
    + '<rect width="400" height="520" fill="url(#'+id+'l)"/>'
    + '<rect x="96" y="-30" width="208" height="250" fill="'+pal.cap+'"/>'
    + '<rect x="96" y="-30" width="54" height="250" fill="#fff" fill-opacity=".10"/>'
    + '<rect x="96" y="220" width="208" height="34" fill="url(#'+id+'m)"/>'
    + '<rect x="96" y="254" width="208" height="300" fill="url(#'+id+'g)"/>'
    + '<rect x="120" y="254" width="34" height="300" fill="#fff" fill-opacity=".16"/>'
    + '<text x="200" y="470" text-anchor="middle" font-family="Manrope,Helvetica,sans-serif" font-size="8" letter-spacing="3.4" fill="#F7F3EC" fill-opacity=".5">COLLAR DETAIL</text>');
}

export function figLifestyle(p: Product, seed?: string): string{
  const id = mkId(seed), pal = p.pal;
  return svg("0 0 400 520",
    '<defs><linearGradient id="'+id+'bg" x1="0" y1="0" x2=".8" y2="1">'
    + '<stop offset="0" stop-color="#2A1E16"/><stop offset=".55" stop-color="'+pal.top+'"/>'
    + '<stop offset="1" stop-color="#1A120C"/></linearGradient>'
    + '<radialGradient id="'+id+'l" cx=".68" cy=".22" r=".5">'
    + '<stop offset="0" stop-color="#F5DFB4" stop-opacity=".40"/>'
    + '<stop offset="1" stop-color="#F5DFB4" stop-opacity="0"/></radialGradient></defs>'
    + '<rect width="400" height="520" fill="url(#'+id+'bg)"/>'
    + '<rect width="400" height="520" fill="url(#'+id+'l)"/>'
    /* window light and a linen fold */
    + '<g opacity=".30"><rect x="238" y="40" width="96" height="150" fill="#F8E9C8"/>'
    + '<rect x="238" y="40" width="96" height="150" fill="none" stroke="#F8E9C8" stroke-opacity=".6"/>'
    + '<rect x="284" y="40" width="2" height="150" fill="#2A1E16" opacity=".5"/></g>'
    + '<g fill="none" stroke="#F7F3EC" stroke-opacity=".16">'
    + '<path d="M-20 400 q120 -46 210 -8 q90 38 230 -18"/>'
    + '<path d="M-20 436 q120 -46 210 -8 q90 38 230 -18"/>'
    + '<path d="M-20 472 q120 -46 210 -8 q90 38 230 -18"/></g>'
    + '<rect x="150" y="286" width="58" height="112" rx="2" fill="'+pal.bot+'"/>'
    + '<rect x="150" y="286" width="16" height="112" fill="#fff" fill-opacity=".18"/>'
    + '<rect x="168" y="266" width="22" height="20" fill="'+pal.cap+'"/>'
    + '<ellipse cx="180" cy="400" rx="46" ry="7" fill="#000" opacity=".4"/>');
}

export function figNotesCard(p: Product, seed?: string): string{
  const id = mkId(seed), n = p.notes;
  const line = function (y: number, label: string, items: string[], size: number) {
    return '<text x="200" y="'+y+'" text-anchor="middle" font-family="Manrope,Helvetica,sans-serif" '
      + 'font-size="7" letter-spacing="2.6" fill="#241D19" fill-opacity=".48">'+esc(label)+'</text>'
      + items.map(function (t: string, i: number) {
          return '<text x="200" y="'+(y+24+i*24)+'" text-anchor="middle" '
            + 'font-family="Cormorant Garamond,Georgia,serif" font-size="'+size+'" fill="#241D19">'+esc(t)+'</text>'; }).join("");
  };
  const topY = 74, heartY = topY + 34 + n.top.length*24, baseY = heartY + 34 + n.heart.length*24;
  return svg("0 0 400 520",
    '<defs><linearGradient id="'+id+'bg" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0" stop-color="#F8F4EC"/><stop offset="1" stop-color="#EDE5D7"/></linearGradient></defs>'
    + '<rect width="400" height="520" fill="url(#'+id+'bg)"/>'
    + '<rect x="28" y="28" width="344" height="464" fill="none" stroke="#A58A5B" stroke-opacity=".45"/>'
    + line(topY,"TOP",n.top,17)
    + '<rect x="176" y="'+(heartY-22)+'" width="48" height="1" fill="#A58A5B"/>'
    + line(heartY,"HEART",n.heart,17)
    + '<rect x="176" y="'+(baseY-22)+'" width="48" height="1" fill="#A58A5B"/>'
    + line(baseY,"BASE",n.base,17));
}

export function figScale(p: Product, seed?: string): string{
  const id = mkId(seed), pal = p.pal;
  const tall = p.ml >= 50 ? 168 : 104, wide = p.ml >= 50 ? 86 : 44;
  return svg("0 0 400 520",
    '<defs><linearGradient id="'+id+'b" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0" stop-color="'+pal.top+'"/><stop offset="1" stop-color="'+pal.bot+'"/></linearGradient></defs>'
    + '<rect width="400" height="520" fill="#F4EFE5"/>'
    + '<g stroke="#241D19" stroke-opacity=".16" stroke-width="1">'
    + '<path d="M96 '+(340-tall)+' H 84 M96 340 H 84 M90 '+(340-tall)+' V 340"/>'
    + '<path d="M'+(150)+' 360 V 372 M'+(150+wide)+' 360 V 372 M150 366 H '+(150+wide)+'"/></g>'
    + '<text x="72" y="'+(340-tall/2)+'" text-anchor="end" font-family="Manrope,Helvetica,sans-serif" font-size="9" fill="#241D19" fill-opacity=".55">'+(p.ml>=50?"98 mm":"64 mm")+'</text>'
    + '<text x="'+(150+wide/2)+'" y="390" text-anchor="middle" font-family="Manrope,Helvetica,sans-serif" font-size="9" fill="#241D19" fill-opacity=".55">'+(p.ml>=50?"46 mm":"26 mm")+'</text>'
    + '<rect x="150" y="'+(340-tall)+'" width="'+wide+'" height="'+tall+'" rx="2" fill="url(#'+id+'b)"/>'
    + '<rect x="150" y="'+(340-tall)+'" width="'+Math.round(wide*0.28)+'" height="'+tall+'" fill="#fff" fill-opacity=".26"/>'
    + '<rect x="'+(150+wide*0.28)+'" y="'+(340-tall-18)+'" width="'+(wide*0.44)+'" height="18" fill="'+pal.cap+'"/>'
    + '<text x="200" y="450" text-anchor="middle" font-family="Manrope,Helvetica,sans-serif" font-size="8" letter-spacing="3.2" fill="#241D19" fill-opacity=".45">ACTUAL SIZE · '+esc(p.size.toUpperCase())+'</text>');
}

export function figMaterial(p: Product, seed?: string): string {
  const key = FAM2ING[p.fams[0] ?? ""] || "sandalwood";
  const ing = INGREDIENTS.find((i) => i.key === key) || INGREDIENTS[0]!;
  return figIngredient(ing, seed);
}
