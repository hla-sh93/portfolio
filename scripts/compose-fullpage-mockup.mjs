/**
 * Full-page "rise from laptop" mockup composer — pixel-perfect, no AI drift.
 *
 * Reference composition:
 *   - flat pastel background tinted with the project's brand color
 *   - huge ghosted project word behind
 *   - the REAL full-page screenshot as one flat sheet with a browser bar,
 *     rising out of the laptop hinge. Sheet width == lid outer width by
 *     construction, so a screen gap is impossible.
 *   - laptop deck (below hinge) composited IN FRONT of the sheet bottom
 *   - laptop size is derived from the page aspect so the WHOLE page fits.
 *
 * Usage:
 *   node scripts/compose-fullpage-mockup.mjs <screenshot> <out.png> <GhostWord> [#brandHex]
 */
import sharp from "sharp";
import fs from "node:fs";

const LAPTOP = "scripts/assets/laptop-base.png"; // transparent cutout (full asset frame)
const CAL = JSON.parse(fs.readFileSync("scripts/assets/laptop-calibration.json", "utf8"));

const [, , srcPath, outPath, ghostWordArg, brandHexArg] = process.argv;
if (!srcPath || !outPath) {
  console.error("usage: node compose-fullpage-mockup.mjs <screenshot> <out.png> <GhostWord> [#brandHex]");
  process.exit(1);
}
const ghostWord = (ghostWordArg || "PORTFOLIO").toUpperCase();

const W = 2800, H = 2100;      // 4:3 landscape — Dribbble/Behance master (site exports 1600w)
const TOP = 140, BOTTOM = 64, BAR = 47, OVERLAP = 19; // TOP >= shadow pad (140)

const lighten = ({ r, g, b }, f) => ({
  r: Math.round(r + (255 - r) * f),
  g: Math.round(g + (255 - g) * f),
  b: Math.round(b + (255 - b) * f),
});
const hex = ({ r, g, b }) => "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");

(async () => {
  // ---- brand color ----
  const brand = brandHexArg
    ? { r: parseInt(brandHexArg.slice(1, 3), 16), g: parseInt(brandHexArg.slice(3, 5), 16), b: parseInt(brandHexArg.slice(5, 7), 16) }
    : (await sharp(srcPath).stats()).dominant;
  const bg = lighten(brand, 0.88);
  const ghost = lighten(brand, 0.76);

  // ---- deck strip (below hinge), trimmed tight ----
  const deckStrip = await sharp(LAPTOP).extract({
    left: 0, top: CAL.hingeY, width: CAL.assetW, height: CAL.assetH - CAL.hingeY,
  }).png().toBuffer();
  const deckBuf = await sharp(deckStrip).trim({ threshold: 8 }).png().toBuffer();
  const deckMeta = await sharp(deckBuf).metadata();

  // ---- derive sheet width so the FULL page + deck fit the canvas ----
  const pageMeta = await sharp(srcPath).metadata();
  const A = pageMeta.height / pageMeta.width;              // page aspect (h/w)
  const lidW = CAL.lidRight - CAL.lidLeft;
  const deckRatio = deckMeta.height / lidW;                // deck height per lid px
  let sheetW = Math.floor((H - TOP - BOTTOM - BAR + OVERLAP) / (A + deckRatio));
  sheetW = Math.min(sheetW, Math.floor(W * 0.72));         // clamp for short pages
  const scale = sheetW / lidW;

  const deckW = Math.round(deckMeta.width * scale);
  const deckH = Math.round(deckMeta.height * scale);
  const pageH = Math.round(A * sheetW);
  const sheetH = pageH + BAR;

  const sheetX = Math.round((W - sheetW) / 2);
  const deckX = Math.round((W - deckW) / 2);
  const contentH = sheetH + deckH - OVERLAP;
  const startY = Math.max(TOP, Math.round((H - contentH) / 2)); // vertical centering
  const sheetY = startY;
  const deckY = startY + sheetH - OVERLAP;

  // ---- page sheet ----
  const page = await sharp(srcPath).resize({ width: sheetW }).png().toBuffer();
  const barSvg = Buffer.from(`<svg width="${sheetW}" height="${BAR}">
    <rect width="${sheetW}" height="${BAR}" fill="#f4f5f7"/>
    <circle cx="24" cy="${BAR / 2}" r="5.5" fill="#ff5f57"/>
    <circle cx="44" cy="${BAR / 2}" r="5.5" fill="#febc2e"/>
    <circle cx="64" cy="${BAR / 2}" r="5.5" fill="#28c840"/>
    <rect x="${Math.round(sheetW * 0.32)}" y="${BAR / 2 - 8}" width="${Math.round(sheetW * 0.36)}" height="16" rx="8" fill="#e4e6ea"/>
  </svg>`);
  let sheet = await sharp({ create: { width: sheetW, height: sheetH, channels: 4, background: "#ffffff" } })
    .composite([
      { input: barSvg, left: 0, top: 0 },
      { input: page, left: 0, top: BAR },
    ])
    .png().toBuffer();
  const mask = Buffer.from(`<svg width="${sheetW}" height="${sheetH}"><rect width="${sheetW}" height="${sheetH}" rx="14" fill="#fff"/></svg>`);
  sheet = await sharp(sheet).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();

  // ---- soft shadow behind sheet ----
  const PAD = 140;
  let shadow = await sharp(
    Buffer.from(`<svg width="${sheetW + PAD * 2}" height="${sheetH + PAD * 2}">
      <rect x="${PAD}" y="${PAD + 14}" width="${sheetW}" height="${sheetH}" rx="20" fill="rgba(25,35,55,0.30)"/>
    </svg>`)
  ).blur(28).png().toBuffer();
  // clamp shadow to canvas (very long pages push it past the bottom edge)
  const shTop = startY - PAD;
  const shVisibleH = Math.min(sheetH + PAD * 2, H - shTop);
  if (shVisibleH < sheetH + PAD * 2) {
    shadow = await sharp(shadow)
      .extract({ left: 0, top: 0, width: sheetW + PAD * 2, height: shVisibleH })
      .png().toBuffer();
  }

  // ---- ghost word ----
  const fontSize = Math.min(653, Math.round((W * 1.35) / ghostWord.length));
  const ghostSvg = Buffer.from(`<svg width="${W}" height="${H}">
    <text x="50%" y="40%" text-anchor="middle" dominant-baseline="middle"
      font-family="Arial, sans-serif" font-weight="900" letter-spacing="10"
      font-size="${fontSize}" fill="${hex(ghost)}">${ghostWord}</text>
  </svg>`);

  const deck = await sharp(deckBuf).resize({ width: deckW }).png().toBuffer();

  await sharp({ create: { width: W, height: H, channels: 4, background: hex(bg) } })
    .composite([
      { input: ghostSvg, left: 0, top: 0 },
      { input: shadow, left: sheetX - PAD, top: sheetY - PAD },
      { input: sheet, left: sheetX, top: sheetY },
      { input: deck, left: deckX, top: deckY },
    ])
    .png()
    .toFile(outPath);

  console.log(`done: ${outPath}`);
  console.log(`  sheet ${sheetW}x${sheetH} @(${sheetX},${sheetY})  deck ${deckW}x${deckH} @(${deckX},${deckY})  bg ${hex(bg)}`);
})();
