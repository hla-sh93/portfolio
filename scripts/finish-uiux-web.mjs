/**
 * Compress the already-designed mockups (codxeon, KRSY) into public/,
 * then merge everything (existing manifest + generated mockups + these)
 * into src/content/project-images.json.
 */
import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = "public/images/projects";

const premade = {
  "codxeon-website": [
    "my portfolio/UIUX-web/codxeon/1.jpg",
    "my portfolio/UIUX-web/codxeon/2.jpg",
  ],
  "krsy-web": [
    "my portfolio/UIUX-web/KRSY/1.jpg",
    "my portfolio/UIUX-web/KRSY/132.jpg",
    "my portfolio/UIUX-web/KRSY/185.jpg",
  ],
};

const merged = JSON.parse(
  await readFile("src/content/project-images.json", "utf8")
);

// 1) compress pre-made mockups
for (const [slug, files] of Object.entries(premade)) {
  const dir = path.join(OUT, slug);
  await mkdir(dir, { recursive: true });
  merged[slug] = [];
  for (let i = 0; i < files.length; i++) {
    const outName = `mockup-${i + 1}.webp`;
    const info = await sharp(files[i])
      .rotate()
      .resize({ width: 2800, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(dir, outName));
    const blur = await sharp(files[i])
      .resize({ width: 16 })
      .webp({ quality: 40 })
      .toBuffer();
    merged[slug].push({
      url: `/images/projects/${slug}/${outName}`,
      width: info.width,
      height: info.height,
      blurDataUrl: `data:image/webp;base64,${blur.toString("base64")}`,
    });
  }
  console.error(`✓ ${slug}: ${files.length} images`);
}

// 2) merge generated browser mockups
const mockups = JSON.parse(
  await readFile(process.argv[2], "utf8")
);
Object.assign(merged, mockups);

await writeFile(
  "src/content/project-images.json",
  JSON.stringify(merged, null, 1)
);
console.error(`\nManifest now has ${Object.keys(merged).length} projects`);
