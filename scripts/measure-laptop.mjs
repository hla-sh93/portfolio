/**
 * One-time calibration: find the green chroma screen + lid outer bounds
 * in the laptop asset, write scripts/assets/laptop-calibration.json.
 * Usage: node scripts/measure-laptop.mjs scripts/assets/laptop-green.png
 */
import sharp from "sharp";
import fs from "node:fs";

const src = process.argv[2] || "scripts/assets/laptop-green.png";
const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;

const isGreen = (i) => data[i + 1] > 160 && data[i] < 120 && data[i + 2] < 120;
const isDark = (i) => data[i] < 150 && data[i + 1] < 150 && data[i + 2] < 150;

let gL = W, gR = 0, gT = H, gB = 0;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * C;
    if (isGreen(i)) {
      if (x < gL) gL = x;
      if (x > gR) gR = x;
      if (y < gT) gT = y;
      if (y > gB) gB = y;
    }
  }
}

// lid outer edges: from green bbox midline, walk outward through the dark bezel
const midY = Math.round((gT + gB) / 2);
let lidLeft = gL, lidRight = gR;
for (let x = gL - 1; x >= 0; x--) {
  const i = (midY * W + x) * C;
  if (isDark(i) || isGreen(i)) lidLeft = x; else break;
}
for (let x = gR + 1; x < W; x++) {
  const i = (midY * W + x) * C;
  if (isDark(i) || isGreen(i)) lidRight = x; else break;
}
// lid top: walk up from green top at center x
const midX = Math.round((gL + gR) / 2);
let lidTop = gT;
for (let y = gT - 1; y >= 0; y--) {
  const i = (y * W + midX) * C;
  if (isDark(i) || isGreen(i)) lidTop = y; else break;
}
// hinge: walk down from green bottom through bezel until non-dark (deck silver)
let hingeY = gB;
for (let y = gB + 1; y < H; y++) {
  const i = (y * W + midX) * C;
  if (isDark(i) || isGreen(i)) hingeY = y; else break;
}

const cal = {
  assetW: W, assetH: H,
  green: { left: gL, right: gR, top: gT, bottom: gB },
  lidLeft, lidRight, lidTop, hingeY,
};
fs.writeFileSync("scripts/assets/laptop-calibration.json", JSON.stringify(cal, null, 2));
console.log(JSON.stringify(cal, null, 2));
