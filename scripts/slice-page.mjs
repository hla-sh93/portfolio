/**
 * Slice a tall full-page screenshot into N vertical segments (for duo/showcase
 * mockups of single-page projects — each segment reads as its own "page").
 * Segments overlap slightly so no content is lost at the cut lines.
 *
 * Usage: node scripts/slice-page.mjs <screenshot> <outDir> <n>
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const [, , src, outDir, nArg] = process.argv;
const n = Math.max(2, Math.min(3, parseInt(nArg || "3", 10)));
if (!src || !outDir) {
  console.error("usage: node slice-page.mjs <screenshot> <outDir> <n>");
  process.exit(1);
}
fs.mkdirSync(outDir, { recursive: true });

const meta = await sharp(src).metadata();
const overlap = Math.round(meta.height * 0.04);
const segH = Math.ceil((meta.height + overlap * (n - 1)) / n);

for (let i = 0; i < n; i++) {
  const top = Math.min(i * (segH - overlap), meta.height - segH);
  const out = path.join(outDir, `slice-${i + 1}.png`);
  await sharp(src)
    .extract({ left: 0, top: Math.max(0, top), width: meta.width, height: segH })
    .png()
    .toFile(out);
  console.log(`${out}  (${meta.width}x${segH} @y=${top})`);
}
