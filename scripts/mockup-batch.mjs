/**
 * Batch driver: builds the 3 programmatic mockup styles for every web project.
 *   style 3 fullpage  -> compose-fullpage-mockup.mjs   (longest page)
 *   style 1 duo       -> compose-duo-mockup.mjs        (2 distinct pages)
 *   style 2 showcase  -> compose-showcase-mockup.mjs   (1-3 distinct pages)
 *
 * Auto page-pick: website-shaped images (h/w >= 1.25), deduped by base name,
 * sorted tallest-first. Brand color: saturated-hue histogram over the header
 * strip of the primary page, with per-project overrides.
 *
 * Usage: node scripts/mockup-batch.mjs [projectName]  (omit = all)
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const SRC = "my portfolio/01 - UIUX Design/Web";
const OUT = "my portfolio/08 - Mockups";

/* ghost word + optional brand hex override per project */
const META = {
  "Jadarat Platform":   { word: "JADARAT" },
  "Turki Butchery":     { word: "TURKI" },
  "Phoenitech Website": { word: "PHOENITECH" },
  "Menu":               { word: "MENU" },
  "Emirates Sands":     { word: "EMIRATES" },
  "KRSY":               { word: "KRSY" },
  "E-Commerce Concept": { word: "SHOP" },
  "Codxeon":            { word: "CODXEON" },
  "Damac":              { word: "DAMAC" },
  "BigBoss":            { word: "BIGBOSS" },
  "Kafoo":              { word: "KAFOO" },
  "Golden Horse":       { word: "GOLDEN" },
  "SAAB Logistics":     { word: "SAAB", hex: "#1b3a7a" },
  "Fast Express":       { skip: true }, // PDF source — needs image export
};

async function brandHex(imgPath) {
  // saturated-hue histogram over the top 14% (header) of the page
  const meta = await sharp(imgPath).metadata();
  const stripH = Math.max(40, Math.round(meta.height * 0.14));
  const { data, info } = await sharp(imgPath)
    .extract({ left: 0, top: 0, width: meta.width, height: stripH })
    .resize({ width: 240 })
    .raw().toBuffer({ resolveWithObject: true });
  const buckets = new Map(); // hueBucket -> {n, r, g, b}
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    const s = max === 0 ? 0 : d / max;
    if (s < 0.3 || max < 0.15 || max > 0.98) continue;
    let h = 0;
    if (d > 0) {
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h = Math.round(((h * 60) + 360) % 360);
    }
    const k = Math.floor(h / 30);
    const cur = buckets.get(k) || { n: 0, r: 0, g: 0, b: 0 };
    cur.n++; cur.r += data[i]; cur.g += data[i + 1]; cur.b += data[i + 2];
    buckets.set(k, cur);
  }
  const total = data.length / info.channels;
  const best = [...buckets.values()].sort((x, y) => y.n - x.n)[0];
  if (!best || best.n / total < 0.004) {
    const { dominant } = await sharp(imgPath).stats();
    return "#" + [dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, "0")).join("");
  }
  return "#" + [best.r / best.n, best.g / best.n, best.b / best.n]
    .map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}

async function pickPages(dir) {
  const files = fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  const infos = [];
  for (const f of files) {
    try {
      const m = await sharp(path.join(dir, f)).metadata();
      if (m.width >= 900 && m.height / m.width >= 1.25) {
        infos.push({ f, w: m.width, h: m.height, aspect: m.height / m.width });
      }
    } catch { /* unreadable */ }
  }
  // dedupe near-duplicates like "Home-2.jpg" vs "Home-2-1.jpg"
  const seen = new Map();
  for (const it of infos.sort((a, b) => b.h / b.w - a.h / a.w)) {
    const key = it.f.replace(/\.(jpe?g|png|webp)$/i, "").replace(/-1$/, "").toLowerCase();
    if (!seen.has(key)) seen.set(key, it);
  }
  return [...seen.values()].sort((a, b) => b.aspect - a.aspect).slice(0, 3)
    .map((it) => path.join(dir, it.f));
}

function run(script, args) {
  const res = spawnSync("node", [script, ...args], { encoding: "utf8" });
  if (res.status !== 0) throw new Error(`${script} failed: ${res.stderr}`);
  return res.stdout.trim();
}

const only = process.argv[2];
const projects = fs.readdirSync(SRC).filter((d) => fs.statSync(path.join(SRC, d)).isDirectory());

for (const proj of projects) {
  if (only && proj !== only) continue;
  const meta = META[proj] || {};
  meta.word = "HLA PORTFOLIO"; // per user: background text only "Hla Portfolio" in Latin, never Arabic
  if (meta.skip) { console.log(`skip: ${proj}`); continue; }

  const dir = path.join(SRC, proj);
  const pages = await pickPages(dir);
  if (pages.length === 0) { console.log(`NO PAGES: ${proj}`); continue; }

  const outDir = path.join(OUT, proj);
  fs.mkdirSync(outDir, { recursive: true });
  const hexColor = meta.hex || (await brandHex(pages[0]));

  console.log(`\n=== ${proj}  pages=${pages.length}  brand=${hexColor}`);
  console.log(run("scripts/compose-fullpage-mockup.mjs", [pages[0], path.join(outDir, "fullpage.png"), meta.word, hexColor]));
  if (pages.length >= 2) {
    console.log(run("scripts/compose-duo-mockup.mjs", [pages[0], pages[1], path.join(outDir, "duo.png"), hexColor]));
  }
  const showcasePages = pages.length >= 3 ? [pages[1], pages[0], pages[2]] : pages.length === 2 ? [pages[1], pages[0]] : [pages[0]];
  console.log(run("scripts/compose-showcase-mockup.mjs", [...showcasePages, path.join(outDir, "showcase.png"), hexColor]));
}
console.log("\nBATCH DONE");
