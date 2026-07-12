/**
 * Studio mockup generator — UIUX-web batch
 *
 * Composites Hla's raw full-page screenshots (pixel-perfect, no AI) into
 * branded browser-frame mockups on the studio backdrop (burgundy-black
 * gradient + blueprint grid + wine glow), matching the site's design system.
 *
 * Templates:
 *   T1 "hero" — one centered browser window (top crop of the page)
 *   T2 "duo"  — two overlapping browser windows (two different pages)
 *
 * Output: public/images/projects/<slug>/mockup-N.webp (1600×1200)
 * Usage:  node scripts/make-mockups.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "my portfolio/UIUX-web";
const OUT = "public/images/projects";
const W = 2800;  // Dribbble/Behance standard (4:3)
const H = 2100;
const BAR = 91; // browser chrome height
const RADIUS = 24;

/* slug -> { dir, label, t1: file, t2?: [fileA, fileB] } */
const plan = {
  "jadarat-platform": {
    dir: "Jadarat",
    label: "jadarat",
    t1: "1.png",
    t2: ["13.png", "31.png"],
  },
  "saab-logistics": {
    dir: "SAAB logistics",
    label: "saab-logistics",
    t1: "Home.jpg",
    t2: ["Services.jpg", "About Us.jpg"],
  },
  "turki-butchery": {
    dir: "تركي للذبائج",
    label: "turki",
    t1: "1.jpg",
    t2: ["22.jpg", "6.jpg"],
  },
  "kafoo-web": {
    dir: "Kafoo",
    label: "kafoo",
    t1: "Home Page.jpg",
  },
  "menu-web": {
    dir: "Menu",
    label: "menu",
    t1: "Home-2.jpg",
    t2: ["Item with offer.jpg", "Home-2-1.jpg"],
  },
  "bigboss-web": {
    dir: "bigboss",
    label: "bigboss",
    t1: "Home.jpg",
  },
};

/* ── Studio backdrop ── */
function backdropSVG() {
  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#170a0f"/>
      <stop offset="1" stop-color="#070607"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.18" cy="0.95" r="0.9">
      <stop offset="0" stop-color="#B91942" stop-opacity="0.32"/>
      <stop offset="1" stop-color="#B91942" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.9" cy="0.05" r="0.6">
      <stop offset="0" stop-color="#6D061F" stop-opacity="0.4"/>
      <stop offset="1" stop-color="#6D061F" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="98" height="98" patternUnits="userSpaceOnUse">
      <path d="M98 0H0V98" fill="none" stroke="rgba(255,255,255,0.045)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>
  <text x="${W - 63}" y="${H - 52}" text-anchor="end" font-family="Arial, sans-serif"
        font-size="33" letter-spacing="10" fill="rgba(255,255,255,0.22)" font-weight="700">HLA.SH DESIGN</text>
</svg>`);
}

/* ── Browser window (chrome bar + top-crop of the page) ── */
async function browserWindow(srcPath, width, viewportH, urlLabel) {
  const winH = BAR + viewportH;

  const screen = await sharp(srcPath)
    .resize({ width })
    .toBuffer()
    .then((buf) =>
      sharp(buf).extract({ left: 0, top: 0, width, height: viewportH }).toBuffer()
    );

  const chrome = Buffer.from(`<svg width="${width}" height="${winH}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${BAR}" fill="#1d1418"/>
    <circle cx="46" cy="${BAR / 2}" r="11.5" fill="#FF5F57"/>
    <circle cx="84" cy="${BAR / 2}" r="11.5" fill="#FEBC2E"/>
    <circle cx="122" cy="${BAR / 2}" r="11.5" fill="#28C840"/>
    <rect x="${width * 0.24}" y="${BAR / 2 - 24}" width="${width * 0.52}" height="48" rx="24" fill="#2a1e24"/>
    <text x="${width * 0.5}" y="${BAR / 2 + 9}" text-anchor="middle" font-family="Arial, sans-serif"
          font-size="26" fill="#9a8d92">${urlLabel}</text>
  </svg>`);

  const win = await sharp({
    create: {
      width,
      height: winH,
      channels: 4,
      background: { r: 29, g: 20, b: 24, alpha: 1 },
    },
  })
    .composite([
      { input: chrome, top: 0, left: 0 },
      { input: screen, top: BAR, left: 0 },
    ])
    .png()
    .toBuffer();

  // Round the whole window
  const mask = Buffer.from(
    `<svg width="${width}" height="${winH}"><rect width="${width}" height="${winH}" rx="${RADIUS}" fill="#fff"/></svg>`
  );
  return sharp(win)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

function shadowSVG(width) {
  const h = 210;
  return Buffer.from(`<svg width="${width + 280}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="s" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#000" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#000" stop-opacity="0"/>
    </radialGradient></defs>
    <ellipse cx="${(width + 280) / 2}" cy="${h / 2}" rx="${(width + 245) / 2}" ry="${h / 2 - 10}" fill="url(#s)"/>
  </svg>`);
}

async function renderT1(slug, cfg) {
  const winW = 2030;
  const vpH = 1418;
  const win = await browserWindow(
    path.join(SRC, cfg.dir, cfg.t1),
    winW,
    vpH,
    `hla.sh  /  ${cfg.label}`
  );
  const x = Math.round((W - winW) / 2);
  const y = 245;

  return sharp(backdropSVG())
    .composite([
      { input: shadowSVG(winW), top: y + BAR + vpH - 70, left: x - 140 },
      { input: win, top: y, left: x },
    ])
    .webp({ quality: 84 })
    .toBuffer();
}

async function renderT2(slug, cfg) {
  const [fileA, fileB] = cfg.t2;
  const wA = 1540;
  const vpA = 1085;
  const wB = 1540;
  const vpB = 1155;

  const winA = await browserWindow(
    path.join(SRC, cfg.dir, fileA),
    wA,
    vpA,
    `hla.sh  /  ${cfg.label}`
  );
  const winB = await browserWindow(
    path.join(SRC, cfg.dir, fileB),
    wB,
    vpB,
    `hla.sh  /  ${cfg.label}`
  );

  return sharp(backdropSVG())
    .composite([
      { input: shadowSVG(wA), top: 192 + BAR + vpA - 70, left: 175 - 140 },
      { input: winA, top: 192, left: 175 },
      { input: shadowSVG(wB), top: 578 + BAR + vpB - 70, left: 1085 - 140 },
      { input: winB, top: 578, left: 1085 },
    ])
    .webp({ quality: 84 })
    .toBuffer();
}

let totalOut = 0;
const manifest = {};

for (const [slug, cfg] of Object.entries(plan)) {
  const dir = path.join(OUT, slug);
  await mkdir(dir, { recursive: true });
  manifest[slug] = [];

  const outputs = [["mockup-1.webp", await renderT1(slug, cfg)]];
  if (cfg.t2) outputs.push(["mockup-2.webp", await renderT2(slug, cfg)]);

  for (const [name, buf] of outputs) {
    const outPath = path.join(dir, name);
    await sharp(buf).toFile(outPath);
    const meta = await sharp(buf).metadata();
    const blur = await sharp(buf).resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
    manifest[slug].push({
      url: `/images/projects/${slug}/${name}`,
      width: meta.width,
      height: meta.height,
      blurDataUrl: `data:image/webp;base64,${blur.toString("base64")}`,
    });
    totalOut += buf.length;
  }
  console.error(`✓ ${slug}: ${outputs.length} mockups`);
}

console.log(JSON.stringify(manifest, null, 1));
console.error(`\nTotal output: ${(totalOut / 1e6).toFixed(1)}MB`);
