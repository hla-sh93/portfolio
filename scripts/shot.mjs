/**
 * Screenshot helper (verification): node scripts/shot.mjs <url> <out.png> [light|dark] [fullpage|WxH] [clickText]
 * Drives the installed Chrome via puppeteer-core; sets next-themes localStorage
 * before load so the requested theme is exact.
 */
import puppeteer from "puppeteer-core";

const [url, out, theme = "light", size = "1366x900", clickText] = process.argv.slice(2);
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--hide-scrollbars"],
});
const page = await browser.newPage();
const [w, h] = size === "fullpage" ? [1366, 900] : size.split("x").map(Number);
await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });

await page.evaluateOnNewDocument((t) => {
  localStorage.setItem("theme", t);
}, theme);

await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
if (clickText) {
  await page.evaluate((txt) => {
    const btn = [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === txt || b.getAttribute("aria-label") === txt);
    btn?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  }, clickText);
  await new Promise((r) => setTimeout(r, 900));
}
// let framer-motion whileInView animations settle
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise((r) => setTimeout(r, 600));

await page.screenshot({ path: out, fullPage: size === "fullpage" });
await browser.close();
console.log("shot:", out);
