/**
 * Certificates pipeline
 * Drop certificate images (Udemy/Coursera/…) into:
 *   my portfolio/09 - Certificates/
 * Optional naming: "Udemy - Advanced Figma.jpg" → issuer "Udemy",
 * title "Advanced Figma" (issuer = text before first " - ").
 *
 * Outputs public/images/certificates/<n>.webp (1200w) + blur placeholders
 * and writes src/content/certificates.json consumed by the About page.
 *
 * Usage: node scripts/import-certificates.mjs
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = "my portfolio/09 - Certificates";
const OUT = "public/images/certificates";
const MANIFEST = "src/content/certificates.json";
const WIDTH = 1200;

fs.mkdirSync(SRC, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

const files = fs
  .readdirSync(SRC)
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .sort();

const items = [];
for (let i = 0; i < files.length; i++) {
  const base = files[i].replace(/\.(jpe?g|png|webp)$/i, "");
  const [issuer, ...rest] = base.split(" - ");
  const title = rest.length ? rest.join(" - ") : base;

  const outName = `cert-${String(i + 1).padStart(2, "0")}.webp`;
  const info = await sharp(path.join(SRC, files[i]))
    .rotate()
    .resize({ width: WIDTH, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(OUT, outName));
  const blur = await sharp(path.join(SRC, files[i]))
    .rotate()
    .resize({ width: 16 })
    .webp({ quality: 40 })
    .toBuffer();

  items.push({
    url: `/images/certificates/${outName}`,
    width: info.width,
    height: info.height,
    blurDataUrl: `data:image/webp;base64,${blur.toString("base64")}`,
    issuer: rest.length ? issuer.trim() : null,
    title: title.trim(),
  });
  console.error(`✓ ${files[i]} → ${outName} (${info.width}x${info.height})`);
}

fs.writeFileSync(MANIFEST, JSON.stringify(items, null, 1));
console.error(`\n${items.length} certificates → ${MANIFEST}`);
