/** Probe dimensions of every image in "my portfolio/UIUX-web" */
import sharp from "sharp";
import { readdir } from "node:fs/promises";
import path from "node:path";

const ROOT = "my portfolio/UIUX-web";
const exts = new Set([".jpg", ".jpeg", ".png", ".webp"]);

for (const dir of await readdir(ROOT, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  const folder = path.join(ROOT, dir.name);
  const rows = [];
  for (const f of await readdir(folder)) {
    if (!exts.has(path.extname(f).toLowerCase())) continue;
    try {
      const m = await sharp(path.join(folder, f)).metadata();
      rows.push(`${f}: ${m.width}x${m.height} (${(m.height / m.width).toFixed(2)})`);
    } catch {
      rows.push(`${f}: unreadable`);
    }
  }
  console.log(`\n### ${dir.name} (${rows.length})`);
  console.log(rows.slice(0, 40).join("\n"));
}
