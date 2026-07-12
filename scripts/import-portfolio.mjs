/**
 * Portfolio asset pipeline
 * Reads selected originals from "my portfolio/" (1.8GB, git-ignored),
 * writes compressed WebP copies to public/images/projects/<slug>/,
 * and prints a JSON manifest (dimensions + blur placeholders) used
 * to build src/content/projects.ts.
 *
 * Usage: node scripts/import-portfolio.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "my portfolio";
const OUT = "public/images/projects";
const MAX_WIDTH = 1600;
const QUALITY = 80;

/** slug -> source files (first one becomes the cover) */
const manifest = {
  "zanqa-education-platform": [
    "zanqa/1.jpg",
    "zanqa/2.jpg",
    "zanqa/3.jpg",
    "zanqa/4.jpg",
    "zanqa/5.jpg",
    "zanqa/6.jpg",
    "zanqa/7.jpg",
  ],
  "e-liefer-delivery-platform": [
    "E-liefer/Home.jpg",
    "E-liefer/products.jpg",
    "E-liefer/product details.jpg",
    "E-liefer/stores.jpg",
    "E-liefer/register.jpg",
    "E-liefer/favorits.jpg",
  ],
  "living-app-ui": [
    "Living App/devices8.jpg",
    "Living App/minimal_ui_mobile_app_mockup.jpg",
    "Living App/132.jpg",
    "Living App/25.jpg",
    "Living App/302.jpg",
    "Living App/2377.jpg",
  ],
  "nana-gelato-packaging": [
    "packaging/فريز.jpg",
    "packaging/مانجو.jpg",
    "packaging/1.jpg",
    "packaging/2.jpg",
    "packaging/3.jpg",
    "packaging/5.jpg",
    "packaging/mock-back-1.jpg",
  ],
  "believe-in-syria-campaign": [
    "Beleive in syria/BIS.jpg",
    "Beleive in syria/Believe in Syria formal.jpg",
    "Beleive in syria/Book cover 1.jpg",
    "Beleive in syria/Book cover 2.jpg",
    "Beleive in syria/invitations.jpg",
    "Beleive in syria/T-Shirts4.jpg",
    "Beleive in syria/visitcards.jpg",
  ],
  "travel-agency-branding": [
    "Travel Agency/Cover.jpg",
    "Travel Agency/Cover-Front.jpg",
    "Travel Agency/Home-vision.jpg",
    "Travel Agency/IDBlue.jpg",
    "Travel Agency/page-sample.jpg",
    "Travel Agency/travelTent/logoShowcase.jpg",
  ],
};

const result = {};
let totalIn = 0;
let totalOut = 0;

for (const [slug, files] of Object.entries(manifest)) {
  const dir = path.join(OUT, slug);
  await mkdir(dir, { recursive: true });
  result[slug] = [];

  for (let i = 0; i < files.length; i++) {
    const srcPath = path.join(SRC, files[i]);
    const outName = `${i + 1}.webp`;
    const outPath = path.join(dir, outName);

    const img = sharp(srcPath).rotate();
    const meta = await img.metadata();
    const width = Math.min(meta.width ?? MAX_WIDTH, MAX_WIDTH);

    const info = await img
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outPath);

    // Tiny blur placeholder (16px wide)
    const blurBuf = await sharp(srcPath)
      .rotate()
      .resize({ width: 16 })
      .webp({ quality: 40 })
      .toBuffer();

    const { size: inSize } = await import("node:fs").then((fs) =>
      fs.promises.stat(srcPath)
    );
    totalIn += inSize;
    totalOut += info.size;

    result[slug].push({
      url: `/images/projects/${slug}/${outName}`,
      width: info.width,
      height: info.height,
      blurDataUrl: `data:image/webp;base64,${blurBuf.toString("base64")}`,
    });
  }
}

console.log(JSON.stringify(result, null, 1));
console.error(
  `\nIN: ${(totalIn / 1e6).toFixed(1)}MB → OUT: ${(totalOut / 1e6).toFixed(1)}MB`
);
