/**
 * Showcase mockup — three overlapping tilted browser windows (reference style 2).
 * Flat pixel-perfect composite: brand-tinted background, three top-cropped
 * page panels with browser chrome, rotated as a group, diagonal cascade.
 *
 * Usage:
 *   node scripts/compose-showcase-mockup.mjs <pageA> <pageB> <pageC> <out.png> [#brandHex]
 * (pageB is the front/center panel)
 */
import sharp from "sharp";

// usage: node compose-showcase-mockup.mjs <page...> <out.png> [#brandHex]
// accepts 1-3 pages; last non-hex arg is the output path
const argv = process.argv.slice(2);
const brandHexArg = argv.at(-1)?.startsWith("#") ? argv.pop() : undefined;
const outPath = argv.pop();
const pages = argv; // 1-3 screenshot paths
if (!outPath || pages.length < 1 || pages.length > 3) {
  console.error("usage: node compose-showcase-mockup.mjs <page1> [page2] [page3] <out.png> [#brandHex]");
  process.exit(1);
}
const [aPath, bPath, cPath] = pages.length === 3 ? pages
  : pages.length === 2 ? [pages[0], pages[1], undefined]
  : [undefined, pages[0], undefined];

const W = 2800, H = 2100; // Dribbble/Behance standard
const PANEL_W = 887, PANEL_H = 1750, BAR = 54, RADIUS = 16, ANGLE = -8;

const lighten = ({ r, g, b }, f) => ({
  r: Math.round(r + (255 - r) * f),
  g: Math.round(g + (255 - g) * f),
  b: Math.round(b + (255 - b) * f),
});
const hex = ({ r, g, b }) => "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");

async function browserPanel(src) {
  const page = await sharp(src).resize({ width: PANEL_W }).png().toBuffer();
  const meta = await sharp(page).metadata();
  const bodyH = Math.min(meta.height, PANEL_H - BAR);
  const body = await sharp(page).extract({ left: 0, top: 0, width: PANEL_W, height: bodyH }).png().toBuffer();
  const h = bodyH + BAR;
  const barSvg = Buffer.from(`<svg width="${PANEL_W}" height="${BAR}">
    <rect width="${PANEL_W}" height="${BAR}" fill="#f5f6f8"/>
    <circle cx="26" cy="${BAR / 2}" r="6" fill="#ff5f57"/>
    <circle cx="48" cy="${BAR / 2}" r="6" fill="#febc2e"/>
    <circle cx="70" cy="${BAR / 2}" r="6" fill="#28c840"/>
    <rect x="${Math.round(PANEL_W * 0.3)}" y="${BAR / 2 - 9}" width="${Math.round(PANEL_W * 0.4)}" height="18" rx="9" fill="#e5e7eb"/>
  </svg>`);
  let panel = await sharp({ create: { width: PANEL_W, height: h, channels: 4, background: "#ffffff" } })
    .composite([
      { input: barSvg, left: 0, top: 0 },
      { input: body, left: 0, top: BAR },
    ]).png().toBuffer();
  const mask = Buffer.from(`<svg width="${PANEL_W}" height="${h}"><rect width="${PANEL_W}" height="${h}" rx="${RADIUS}" fill="#fff"/></svg>`);
  panel = await sharp(panel).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();

  // add its own soft shadow onto a padded transparent tile (so rotation keeps it)
  const PAD = 90;
  const shadow = await sharp(
    Buffer.from(`<svg width="${PANEL_W + PAD * 2}" height="${h + PAD * 2}">
      <rect x="${PAD}" y="${PAD + 10}" width="${PANEL_W}" height="${h}" rx="${RADIUS + 4}" fill="rgba(25,30,50,0.28)"/>
    </svg>`)
  ).blur(22).png().toBuffer();
  const tile = await sharp({ create: { width: PANEL_W + PAD * 2, height: h + PAD * 2, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      { input: shadow, left: 0, top: 0 },
      { input: panel, left: PAD, top: PAD },
    ]).png().toBuffer();
  return { tile, w: PANEL_W + PAD * 2, h: h + PAD * 2 };
}

(async () => {
  const brand = brandHexArg
    ? { r: parseInt(brandHexArg.slice(1, 3), 16), g: parseInt(brandHexArg.slice(3, 5), 16), b: parseInt(brandHexArg.slice(5, 7), 16) }
    : (await sharp(bPath).stats()).dominant;
  const bg = lighten(brand, 0.88);

  const pb = await browserPanel(bPath);
  const pa = aPath ? await browserPanel(aPath) : null;
  const pc = cPath ? await browserPanel(cPath) : null;

  // group canvas: back-left low, front-center, back-right high (diagonal cascade)
  const n = 1 + (pa ? 1 : 0) + (pc ? 1 : 0);
  const groupW = Math.round(pb.w * (n === 3 ? 2.45 : n === 2 ? 1.75 : 1.15));
  const groupH = Math.round(pb.h * (n === 1 ? 1.05 : 1.35));
  const positions = [];
  if (pa) positions.push({ p: pa, x: 0, y: Math.round(groupH * 0.16) });      // back left, lower
  if (pc) positions.push({ p: pc, x: groupW - pc.w, y: 0 });                  // back right, higher
  positions.push({ p: pb, x: Math.round((groupW - pb.w) / 2), y: Math.round(groupH * (n === 1 ? 0.02 : 0.07)) }); // front center
  let group = await sharp({ create: { width: groupW, height: groupH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(positions.map(({ p, x, y }) => ({ input: p.tile, left: x, top: y })))
    .png().toBuffer();

  group = await sharp(group).rotate(ANGLE, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const gMeta = await sharp(group).metadata();

  // scale group to fit canvas generously (slight overflow like the reference)
  const scaled = n === 1
    ? await sharp(group).resize({ height: Math.round(H * 0.96) }).png().toBuffer()
    : await sharp(group).resize({ width: Math.round(W * 1.06) }).png().toBuffer();
  const sMeta = await sharp(scaled).metadata();

  // crop the group to canvas (overflow bleeds off edges like the reference)
  const cropX = Math.round((sMeta.width - W) / 2);
  const cropY = Math.max(0, Math.round((sMeta.height - H) / 2));
  const view = await sharp(scaled).extract({
    left: Math.max(0, cropX), top: cropY,
    width: Math.min(W, sMeta.width), height: Math.min(H, sMeta.height),
  }).png().toBuffer();
  const vMeta = await sharp(view).metadata();

  await sharp({ create: { width: W, height: H, channels: 4, background: hex(bg) } })
    .composite([{ input: view, left: Math.round((W - vMeta.width) / 2), top: Math.round((H - vMeta.height) / 2) }])
    .png()
    .toFile(outPath);

  console.log(`done: ${outPath}  bg ${hex(bg)}`);
})();
