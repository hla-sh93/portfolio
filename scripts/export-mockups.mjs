/**
 * Export mockups for the website: webp @1600w + tiny "Hla Shindeah" watermark.
 * Masters in "08 - Mockups" stay clean; only exported copies carry the mark.
 *
 * Usage: node scripts/export-mockups.mjs [--out public/images/mockups]
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = "my portfolio/08 - Mockups";
const OUT = process.argv.includes("--out")
  ? process.argv[process.argv.indexOf("--out") + 1]
  : "public/images/mockups";
const WIDTH = 1600;

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function watermark(w) {
  const fontSize = Math.max(18, Math.round(w * 0.014));
  const pad = Math.round(fontSize * 0.9);
  return Buffer.from(`<svg width="${w}" height="${fontSize * 2 + pad}">
    <text x="${w - pad}" y="${fontSize + pad / 2}" text-anchor="end"
      font-family="Arial, sans-serif" font-weight="600" font-size="${fontSize}"
      fill="rgba(255,255,255,0.55)" stroke="rgba(0,0,0,0.18)" stroke-width="0.6"
      letter-spacing="1.5">HLA SHINDEAH</text>
  </svg>`);
}

for (const proj of fs.readdirSync(SRC)) {
  const dir = path.join(SRC, proj);
  if (!fs.statSync(dir).isDirectory()) continue;
  const outDir = path.join(OUT, slug(proj));
  fs.mkdirSync(outDir, { recursive: true });

  for (const f of fs.readdirSync(dir).filter((f) => /\.(png|jpe?g)$/i.test(f))) {
    const img = sharp(path.join(dir, f)).resize({ width: WIDTH, withoutEnlargement: true });
    const meta = await img.toBuffer({ resolveWithObject: true });
    const wm = await watermark(meta.info.width);
    const out = path.join(outDir, f.replace(/\.(png|jpe?g)$/i, ".webp"));
    await sharp(meta.data)
      .composite([{ input: wm, gravity: "southeast" }])
      .webp({ quality: 84 })
      .toFile(out);
    console.log("exported:", out);
  }
}
console.log("EXPORT DONE");
