/**
 * Export "08 - Mockups" masters (2800×2100 Dribbble size) to the site:
 *   public/images/projects/<site-slug>/mockup-N.webp @1600w + watermark,
 * ordered [showcase, duo, fullpage], and refresh src/content/project-images.json
 * (dimensions + blur placeholders) for those slugs.
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = "my portfolio/08 - Mockups";
const OUT = "public/images/projects";
const WIDTH = 1600;
const ORDER = ["showcase.png", "duo.png", "fullpage.png"];

/* master folder -> site slug (matches src/content/projects.ts) */
const SLUGS = {
  "Jadarat Platform": "jadarat-platform",
  "SAAB Logistics": "saab-logistics",
  "Turki Butchery": "turki-butchery",
  "Kafoo": "kafoo-web",
  "Menu": "menu-web",
  "BigBoss": "bigboss-web",
  "Phoenitech Website": "phoenitech-website",
  "Emirates Sands": "emirates-sands",
};

function watermark(w) {
  const fontSize = Math.max(18, Math.round(w * 0.014));
  const pad = Math.round(fontSize * 0.9);
  return Buffer.from(`<svg width="${w}" height="${fontSize * 2 + pad}">
    <text x="${w - pad}" y="${fontSize + pad / 2}" text-anchor="end"
      font-family="Arial, sans-serif" font-weight="600" font-size="${fontSize}"
      fill="rgba(255,255,255,0.55)" stroke="rgba(0,0,0,0.18)" stroke-width="0.6"
      letter-spacing="1.5">HLA SHINDEAH</text>
  </svg>`);
}

const manifest = JSON.parse(
  fs.readFileSync("src/content/project-images.json", "utf8")
);

for (const [proj, slug] of Object.entries(SLUGS)) {
  const dir = path.join(SRC, proj);
  if (!fs.existsSync(dir)) {
    console.error(`missing masters: ${proj}`);
    continue;
  }
  const files = ORDER.filter((f) => fs.existsSync(path.join(dir, f)));
  if (files.length === 0) continue;

  const outDir = path.join(OUT, slug);
  fs.mkdirSync(outDir, { recursive: true });
  // clear stale mockup-N files so counts stay in sync
  for (const old of fs.readdirSync(outDir).filter((f) => /^mockup-\d\.webp$/.test(f))) {
    fs.rmSync(path.join(outDir, old));
  }

  manifest[slug] = [];
  for (let i = 0; i < files.length; i++) {
    const outName = `mockup-${i + 1}.webp`;
    const resized = await sharp(path.join(dir, files[i]))
      .resize({ width: WIDTH, withoutEnlargement: true })
      .toBuffer({ resolveWithObject: true });
    await sharp(resized.data)
      .composite([{ input: watermark(resized.info.width), gravity: "southeast" }])
      .webp({ quality: 84 })
      .toFile(path.join(outDir, outName));
    const blur = await sharp(resized.data)
      .resize({ width: 16 })
      .webp({ quality: 40 })
      .toBuffer();
    manifest[slug].push({
      url: `/images/projects/${slug}/${outName}`,
      width: resized.info.width,
      height: resized.info.height,
      blurDataUrl: `data:image/webp;base64,${blur.toString("base64")}`,
    });
  }
  console.error(`✓ ${slug}: ${files.length}`);
}

fs.writeFileSync(
  "src/content/project-images.json",
  JSON.stringify(manifest, null, 1)
);
console.error("SITE EXPORT DONE");
