/**
 * Duo mockup — two full pages side by side (reference style 1).
 * Flat pixel-perfect composite: brand-tinted background, two full-length
 * page sheets with rounded corners + soft shadows, slight vertical offset.
 *
 * Usage:
 *   node scripts/compose-duo-mockup.mjs <pageA> <pageB> <out.png> [#brandHex]
 */
import sharp from "sharp";

const [, , pageAPath, pageBPath, outPath, brandHexArg] = process.argv;
if (!pageAPath || !pageBPath || !outPath) {
  console.error("usage: node compose-duo-mockup.mjs <pageA> <pageB> <out.png> [#brandHex]");
  process.exit(1);
}

const W = 2800, H = 2100;      // 4:3 landscape — Dribbble/Behance standard
const MARGIN = 128, GAP = 105, OFFSET = 64, RADIUS = 19;

const lighten = ({ r, g, b }, f) => ({
  r: Math.round(r + (255 - r) * f),
  g: Math.round(g + (255 - g) * f),
  b: Math.round(b + (255 - b) * f),
});
const hex = ({ r, g, b }) => "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");

async function sheet(src, targetH) {
  const m = await sharp(src).metadata();
  const w = Math.round((m.width / m.height) * targetH);
  const buf = await sharp(src).resize({ height: targetH }).png().toBuffer();
  const mask = Buffer.from(`<svg width="${w}" height="${targetH}"><rect width="${w}" height="${targetH}" rx="${RADIUS}" fill="#fff"/></svg>`);
  const rounded = await sharp(buf).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
  return { buf: rounded, w, h: targetH };
}

async function shadowFor(w, h) {
  const PAD = 100;
  return {
    pad: PAD,
    buf: await sharp(
      Buffer.from(`<svg width="${w + PAD * 2}" height="${h + PAD * 2}">
        <rect x="${PAD}" y="${PAD + 12}" width="${w}" height="${h}" rx="${RADIUS + 4}" fill="rgba(25,35,55,0.25)"/>
      </svg>`)
    ).blur(24).png().toBuffer(),
  };
}

(async () => {
  const brand = brandHexArg
    ? { r: parseInt(brandHexArg.slice(1, 3), 16), g: parseInt(brandHexArg.slice(3, 5), 16), b: parseInt(brandHexArg.slice(5, 7), 16) }
    : (await sharp(pageAPath).stats()).dominant;
  const bg = lighten(brand, 0.9);

  // fit: pick the tallest height whose combined width still leaves side margins
  const mA = await sharp(pageAPath).metadata();
  const mB = await sharp(pageBPath).metadata();
  const aspSum = mA.width / mA.height + mB.width / mB.height;
  const hFit = Math.floor((W - MARGIN * 2 - GAP) / aspSum);
  const targetH = Math.min(H - MARGIN * 2 - OFFSET, hFit);
  const A = await sheet(pageAPath, targetH);
  const B = await sheet(pageBPath, targetH);

  const totalW = A.w + GAP + B.w;
  const startX = Math.round((W - totalW) / 2);
  const startY = Math.max(MARGIN, Math.round((H - targetH - OFFSET) / 2));
  const aX = startX, aY = startY;
  const bX = startX + A.w + GAP, bY = startY + OFFSET;

  const shA = await shadowFor(A.w, A.h);
  const shB = await shadowFor(B.w, B.h);

  await sharp({ create: { width: W, height: H, channels: 4, background: hex(bg) } })
    .composite([
      { input: shA.buf, left: aX - shA.pad, top: aY - shA.pad },
      { input: shB.buf, left: bX - shB.pad, top: bY - shB.pad },
      { input: A.buf, left: aX, top: aY },
      { input: B.buf, left: bX, top: bY },
    ])
    .png()
    .toFile(outPath);

  console.log(`done: ${outPath}  A ${A.w}x${A.h}  B ${B.w}x${B.h}  bg ${hex(bg)}`);
})();
