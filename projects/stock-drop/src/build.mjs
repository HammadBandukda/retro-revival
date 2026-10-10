// Builds the monthly Stock Drop carousel from the client's inventory sheet.
//
//   npm run build -- data/2026-10.xlsx   (or .csv)   -> output/2026-10/*.png
//   add --no-cover-art to leave the line drawing of bales off the cover
//
// The sheet is the only source of truth: descriptions, packing, and quantities
// are printed exactly as written (surrounding spaces trimmed), in sheet order.

import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ExcelJS from "exceljs";
import { chromium } from "playwright";
import { CONTACT } from "./brand.mjs";
import { correct, correctSection } from "./corrections.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPO = resolve(ROOT, "../..");

// Layout budget for inventory slides, in px. Must match template/styles.css.
const BODY_HEIGHT = 1130;
const HEAD_HEIGHT = 88;
const SECTION_GAP = 26;
// Row heights to try, most readable first. The build uses the first one that fits the cap.
const ROW_HEIGHTS = [80, 76, 72, 68, 64, 60];
const MIN_ROW = 50; // floor for a section so long it fills a slide on its own (e.g. Jeans)
const TWO_COL_MAX_ROW = 104; // two-column rows are taller: name above packing
const ONE_COL_MIN_ROW = 66; // below this, a long section switches to two columns
const MAX_SLIDES = 9; // cover + list slides

// Sheet headers we read, matched case-insensitively. First match wins.
const COLUMNS = {
  category: ["description", "category"],
  quantity: ["quantity"],
  unit: ["bales", "unit"],
  packing: ["packing on bale", "packing"],
  section: ["section"],
};
const REQUIRED = ["category", "quantity", "section"];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];

function fail(msg) {
  console.error(`Error: ${msg}`);
  process.exit(1);
}

// ---------- Reading the sheet ----------

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function cellText(v) {
  if (v == null) return "";
  if (typeof v === "object") {
    if ("result" in v) return cellText(v.result);
    if ("richText" in v) return v.richText.map((t) => t.text).join("");
    if ("text" in v) return String(v.text);
  }
  return String(v);
}

async function readTable(file) {
  if (extname(file).toLowerCase() === ".csv") {
    return parseCsv(readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
  }
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(file);
  const ws = wb.worksheets[0];
  const rows = [];
  ws.eachRow({ includeEmpty: false }, (r) => {
    const out = [];
    for (let c = 1; c <= ws.columnCount; c++) out.push(cellText(r.getCell(c).value));
    rows.push(out);
  });
  return rows;
}

async function loadInventory(file) {
  const table = (await readTable(file)).map((r) => r.map((v) => v.trim()));
  const headerAt = table.findIndex((r) => r.some((v) => v.toLowerCase() === "section"));
  if (headerAt < 0) fail(`no header row with a "Section" column in ${file}`);
  const header = table[headerAt].map((h) => h.toLowerCase());
  const col = {};
  for (const [key, names] of Object.entries(COLUMNS)) {
    col[key] = header.findIndex((h) => names.includes(h));
    if (col[key] < 0 && REQUIRED.includes(key)) fail(`no "${names[0]}" column. Found: ${table[headerAt].join(", ")}`);
  }
  const get = (r, key) => (col[key] >= 0 ? r[col[key]] ?? "" : "");

  const items = [];
  let sheetTotal = null;
  const corrected = [];
  table.slice(headerAt + 1).forEach((r, i) => {
    const item = Object.fromEntries(Object.keys(COLUMNS).map((k) => [k, get(r, k)]));
    const line = headerAt + i + 2;
    if (!item.category && !item.section) {
      // A totals row: remember it so we can check the sum.
      if (/^\d+$/.test(item.quantity)) sheetTotal = Number(item.quantity);
      return;
    }
    if (!item.category) fail(`line ${line} has no description`);
    if (!item.section) fail(`line ${line} (${item.category}) has no section`);
    if (!/^\d+$/.test(item.quantity)) fail(`line ${line} (${item.category}) has quantity "${item.quantity}", expected a whole number`);
    for (const key of ["category", "section"]) {
      const fixed = key === "section" ? correctSection(item[key]) : correct(item[key]);
      if (fixed !== item[key]) corrected.push(`${item[key]} → ${fixed}`);
      item[key] = fixed;
    }
    items.push(item);
  });
  if (!items.length) fail(`no inventory lines in ${file}`);

  const total = items.reduce((n, it) => n + Number(it.quantity), 0);
  if (sheetTotal !== null && sheetTotal !== total) {
    fail(`quantities add up to ${total}, but the sheet's total row says ${sheetTotal}`);
  }

  // Sections keep the order they first appear in the sheet.
  const sections = [];
  for (const item of items) {
    let s = sections.find((x) => x.name === item.section);
    if (!s) sections.push((s = { name: item.section, items: [] }));
    s.items.push(item);
  }
  const units = [...new Set(items.map((it) => it.unit).filter(Boolean))];
  return { items, sections, total, corrected, unit: units.length === 1 ? units[0] : "" };
}

function monthLabel(id) {
  const m = /^(\d{4})-(\d{2})$/.exec(id);
  if (!m || +m[2] < 1 || +m[2] > 12) fail(`name the file after the month, like data/2026-10.xlsx (got "${id}")`);
  return { month: MONTHS[+m[2] - 1], year: m[1] };
}

function findPhoto() {
  for (const ext of ["jpg", "jpeg", "png", "webp"]) {
    const p = join(REPO, "assets/photos", `warehouse.${ext}`);
    if (existsSync(p)) return p;
  }
  return null;
}

// ---------- Slides ----------

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const pad = (n) => String(n).padStart(2, "0");
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
// Display-only spacing fix for packing such as "200Pcs" -> "200 Pcs". The words are not changed.
const packingLabel = (p) => p.replace(/^(\d+)\s*/, "$1 ");

// Sections are never split across slides. They are packed onto slides largest first
// (first-fit decreasing) at the target row height. A section too long for one slide at
// that height gets a slide to itself: one column if rows stay near full size, else two
// columns with taller rows (name above packing).
// Each slide lists its sections in sheet order; slides run in the order of their first
// section in the sheet, except the emptiest slide, which always goes last.
function paginate(sections, rowHeight) {
  const height = (s) => HEAD_HEIGHT + s.items.length * rowHeight;
  const order = sections.map((s, i) => ({ s, i })).sort((a, b) => height(b.s) - height(a.s));
  const pages = [];
  for (const entry of order) {
    const h = height(entry.s);
    if (h > BODY_HEIGHT) {
      // Keep one column if its rows stay close to full size; otherwise use two columns.
      const oneCol = Math.floor((BODY_HEIGHT - HEAD_HEIGHT) / entry.s.items.length);
      if (oneCol >= ONE_COL_MIN_ROW) {
        pages.push({ entries: [entry], used: BODY_HEIGHT, row: oneCol, solo: true });
        continue;
      }
      const perColumn = Math.ceil(entry.s.items.length / 2);
      const row = Math.min(TWO_COL_MAX_ROW, Math.floor((BODY_HEIGHT - HEAD_HEIGHT) / perColumn));
      if (row < MIN_ROW) return null;
      pages.push({ entries: [entry], used: BODY_HEIGHT, row, solo: true, twoCol: true });
      continue;
    }
    const page = pages.find((p) => !p.solo && p.used + SECTION_GAP + h <= BODY_HEIGHT);
    if (page) { page.entries.push(entry); page.used += SECTION_GAP + h; }
    else pages.push({ entries: [entry], used: h, row: rowHeight });
  }
  const ordered = pages
    .map((p) => ({ ...p, entries: p.entries.sort((a, b) => a.i - b.i) }))
    .sort((a, b) => a.entries[0].i - b.entries[0].i);
  // The emptiest slide goes last, so the carousel doesn't look finished early.
  const emptiest = ordered.reduce((m, p, i) => (p.used < ordered[m].used ? i : m), 0);
  ordered.push(...ordered.splice(emptiest, 1));
  return ordered.map((p) => ({ row: p.row, fill: p.used / BODY_HEIGHT, blocks: p.entries.map(({ s }) => ({ section: s, rows: s.items, twoCol: !!p.twoCol })) }));
}

// Use the biggest row height that fits the cap, unless it leaves a slide less than half
// full (e.g. one line alone at the end); then step down to a size that packs evenly.
const MIN_FILL = 0.5;
function fitPages(sections) {
  const fits = ROW_HEIGHTS.map((row) => paginate(sections, row))
    .filter((pages) => pages && pages.length + 1 <= MAX_SLIDES);
  const even = fits.find((pages) => Math.min(...pages.map((p) => p.fill)) >= MIN_FILL);
  if (even || fits.length) return even ?? fits[0];
  const biggest = sections.reduce((a, b) => (b.items.length > a.items.length ? b : a));
  fail(`can't fit every section whole within ${MAX_SLIDES} slides, even at the smallest row size. ` +
    `The largest section is "${biggest.name}" (${biggest.items.length} lines). Raise MAX_SLIDES in build.mjs, or split the post`);
}

function buildSlides(inv, { month, year }, assets) {
  const pages = fitPages(inv.sections);

  const label = `${month} ${year}`;
  const footer = `
    <div class="footer">
      <span class="wa"><b>WHATSAPP</b>${esc(CONTACT.whatsapp)}</span>
      <span class="ig">${esc(CONTACT.instagram)}</span>
    </div>`;
  const photo = assets.photo
    ? `<div class="photo" style="background-image:url('${assets.photo}')"></div>`
    : `<div class="photo none"></div>`;
  const unitWord = inv.unit || "Qty";

  const slides = [];

  slides.push(`
  <section class="slide dark">${photo}<div class="shade"></div>
    <div class="plate"><img src="${assets.logo}" alt="Retro Revival Thailand"></div>${assets.coverArt ? `
    <div class="cover-art">${assets.coverArt}</div>` : ""}
    <div class="cover-text">
      <h1>Stock Drop</h1>
      <div class="month">${esc(label)}</div>
      <div class="pills">${inv.sections.map((x) => `<span>${esc(x.name)}</span>`).join("")}</div>
      <div class="pillars">Lat Krabang, Bangkok · ${esc(CONTACT.locationPitch)}</div>
      <div class="cover-contacts"><span class="wa"><b>WHATSAPP</b>${esc(CONTACT.whatsapp)}</span></div>
    </div>
    <div class="swipe">SWIPE<span>→</span></div>
  </section>`);

  pages.forEach((p) => {
    slides.push(`
  <section class="slide">
    <div class="body" style="--row:${p.row}px">${p.blocks.map((b, bi) => `
      <div class="block">
        <div class="section-head${b.twoCol ? " two" : ""}"><h2>${esc(b.section.name)}</h2>${bi === 0 ? `<span class="qt">${esc(unitWord)}</span>` : ""}</div>
        <ul class="rows${b.twoCol ? " two" : ""}" style="--n:${Math.ceil(b.rows.length / 2)}">${b.rows.map((r) => `
          <li><span class="item"><span class="cat">${esc(r.category)}</span><span class="pk">${esc(packingLabel(r.packing))}</span></span><span class="qty">${esc(r.quantity)}</span></li>`).join("")}
        </ul>
      </div>`).join("")}
    </div>${footer}
  </section>`);
  });

  return slides;
}

// ---------- Render ----------

const args = process.argv.slice(2);
const fileArg = args.find((a) => !a.startsWith("--"));
const coverArt = !args.includes("--no-cover-art"); // line drawing of bales on the cover (on by default)
if (!fileArg) fail("usage: npm run build -- data/2026-10.xlsx");
const file = resolve(process.cwd(), fileArg);
if (!existsSync(file)) fail(`can't find ${file}`);

const id = basename(file).replace(/\.(csv|xlsx)$/i, "");
const when = monthLabel(id);
const inventory = await loadInventory(file);
const outDir = join(ROOT, "output", id);
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const rel = (p) => relative(outDir, p).split("\\").join("/");
const photoPath = findPhoto();
const assets = {
  logo: rel(join(REPO, "assets/brand/logo-primary-trimmed.png")),
  photo: photoPath ? rel(photoPath) : null,
  coverArt: coverArt ? readFileSync(join(ROOT, "template/art/bales-line.svg"), "utf8") : null,
};
const slides = buildSlides(inventory, when, assets);

const html = `<!doctype html><html><head><meta charset="utf-8"><title>Stock Drop · ${esc(`${when.month} ${when.year}`)}</title>
<link rel="stylesheet" href="${rel(join(ROOT, "template/styles.css"))}"></head><body>${slides.join("\n")}</body></html>`;
const htmlPath = join(outDir, "carousel.html");
writeFileSync(htmlPath, html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
await page.goto(`file://${htmlPath}`);
await page.evaluate(() => document.fonts.ready);

// Guard: never post a slide with clipped text.
const clipped = await page.$$eval(".slide", (slides) =>
  slides.flatMap((s, i) => [
    ...[...s.querySelectorAll(".body, .rows.two .cat, .rows.two .item")].filter((el) => el.scrollHeight > el.clientHeight + 1),
    ...[...s.querySelectorAll(".rows .cat, .rows .pk, .section-head h2, .cover-text h1")].filter((el) => el.scrollWidth > el.clientWidth + 1),
  ].map(() => i + 1)));
const coverClash = await page.$eval(".slide", (c) => {
  const top = c.querySelector(".cover-text").getBoundingClientRect().top;
  const marks = [...c.querySelectorAll(".plate, .cover-art")].map((el) => el.getBoundingClientRect().bottom);
  return top < Math.max(...marks) + 24;
});
if (coverClash) fail("the cover text runs into the logo or drawing. Shorten the section names or adjust the cover layout");
if (clipped.length) fail(`text is cut off on slide ${[...new Set(clipped)].join(", ")}. Adjust the layout in build.mjs and styles.css`);

const els = await page.$$(".slide");
for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: join(outDir, `${pad(i + 1)}.png`) });

// Overview sheet of every slide, for review before posting.
const cols = Math.min(els.length, 5);
const overviewPath = join(outDir, "overview.html");
writeFileSync(overviewPath, `<!doctype html><body style="margin:0;padding:10px;background:#3a3a3a;display:grid;grid-template-columns:repeat(${cols},360px);gap:10px;width:max-content">
  ${els.map((_, i) => `<img style="width:360px;display:block" src="${pad(i + 1)}.png">`).join("")}</body>`);
await page.setViewportSize({ width: cols * 370 + 10, height: 400 });
await page.goto(`file://${overviewPath}`);
await page.screenshot({ path: join(outDir, "overview.png"), fullPage: true });
rmSync(overviewPath);
await browser.close();

console.log(`${els.length} slides (max ${MAX_SLIDES}) → ${relative(process.cwd(), outDir)}/  (${inventory.items.length} lines, ${inventory.total} ${inventory.unit || "units"})`);
if (inventory.corrected.length) console.log(`Fixes (src/corrections.mjs):\n  ${[...new Set(inventory.corrected)].join("\n  ")}`);
