// Builds the monthly Stock Drop carousel from the client's inventory sheet.
//
//   npm run build -- data/2026-10.xlsx   (or .csv)   -> output/2026-10/*.png
//
// The sheet is the only source of truth: descriptions, packing, and quantities
// are printed exactly as written (surrounding spaces trimmed), in sheet order.

import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ExcelJS from "exceljs";
import { chromium } from "playwright";
import { CONTACT } from "./brand.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPO = resolve(ROOT, "../..");

// Layout budget for inventory slides, in px. Must match template/styles.css.
const BODY_HEIGHT = 980;
const HEAD_HEIGHT = 112;
const ROW_HEIGHT = 66;
const SECTION_GAP = 44;
const IG_MAX_SLIDES = 20;

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
  return { items, sections, total, unit: units.length === 1 ? units[0] : "" };
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

function paginate(sections) {
  // Flow sections down the slides like a catalogue. A section that doesn't fit is split,
  // carrying at least 2 lines on each side so no line is stranded on its own.
  const MIN_ROWS = 2;
  const pages = [];
  let page = null, used = 0;
  const newPage = () => { pages.push((page = { blocks: [] })); used = 0; };
  newPage();
  sections.forEach((s) => {
    let i = 0;
    while (i < s.items.length) {
      const left = s.items.length - i;
      const gap = page.blocks.length ? SECTION_GAP : 0;
      let fit = Math.floor((BODY_HEIGHT - used - gap - HEAD_HEIGHT) / ROW_HEIGHT);
      if (fit < left && left - fit < MIN_ROWS) fit = left - MIN_ROWS; // leave 2+ for the next slide
      if (fit < Math.min(MIN_ROWS, left)) { newPage(); continue; }
      const rows = s.items.slice(i, i + Math.min(fit, left));
      page.blocks.push({ section: s, rows });
      used += gap + HEAD_HEIGHT + rows.length * ROW_HEIGHT;
      i += rows.length;
    }
  });
  return pages;
}

function buildSlides(inv, { month, year }, assets) {
  const pages = paginate(inv.sections);
  const total = pages.length + 2; // cover, ...inventory, contact
  if (total > IG_MAX_SLIDES) fail(`${total} slides is over Instagram's limit of ${IG_MAX_SLIDES}`);

  const label = `${month} ${year}`;
  const top = `
    <div class="chrome-top"><img class="logo" src="${assets.logo}" alt="Retro Revival Thailand"></div>`;
  const bottom = `
    <div class="chrome-bottom">
      <span><b>WHATSAPP</b>${esc(CONTACT.whatsapp)}</span>
      <span><b>LINE</b>${esc(CONTACT.line)}</span>
      <span>${esc(CONTACT.instagram)}</span>
    </div>`;
  const photo = assets.photo
    ? `<div class="photo" style="background-image:url('${assets.photo}')"></div>`
    : `<div class="photo none"></div>`;
  const plate = `<div class="plate"><img src="${assets.logo}" alt="Retro Revival Thailand"></div>`;
  const unitWord = inv.unit || "Qty";

  const slides = [];

  slides.push(`
  <section class="slide dark">${photo}<div class="shade"></div>${plate}
    <div class="cover-text">
      <div class="eyebrow">Monthly wholesale release</div>
      <h1>Stock<br>Drop</h1>
      <div class="month">${esc(label)}</div>
      <div class="rule"></div>
      <div class="pillars">Fresh containers every month<br>Sorted into categorized bales · Bangkok, Thailand</div>
    </div>
    <div class="swipe">SWIPE<span>→</span></div>
  </section>`);

  pages.forEach((p) => {
    slides.push(`
  <section class="slide">${top}
    <div class="body">${p.blocks.map((b) => `
      <div class="block">
        <div class="section-head"><h2>${esc(b.section.name)}</h2><span class="qt">${esc(unitWord)}</span></div>
        <ul class="rows">${b.rows.map((r) => `
          <li><span class="cat">${esc(r.category)}</span><span class="leader"></span><span class="pk">${esc(packingLabel(r.packing))}</span><span class="qty">${esc(r.quantity)}</span></li>`).join("")}
        </ul>
      </div>`).join("")}
    </div>${bottom}
  </section>`);
  });

  slides.push(`
  <section class="slide dark">${photo}<div class="shade"></div>${plate}
    <div class="contact-text">
      <div class="eyebrow">Wholesale enquiries</div>
      <h2>Reserve<br>your bales</h2>
      <p class="lede">Message us on WhatsApp or LINE with the bales you want.</p>
      <div class="channels">
        <div><div class="eyebrow">WhatsApp</div><div class="v">${esc(CONTACT.whatsapp)}</div></div>
        <div><div class="eyebrow">LINE ID</div><div class="v">${esc(CONTACT.line)}</div></div>
      </div>
      <div class="address"><span><strong>Visit the warehouse</strong><br>${esc(CONTACT.address)}</span>
        <span style="text-align:right"><strong>${esc(CONTACT.instagram)}</strong><br>${esc(CONTACT.locationPitch)}</span></div>
    </div>
  </section>`);

  return slides;
}

// ---------- Render ----------

const [fileArg] = process.argv.slice(2);
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
    ...[...s.querySelectorAll(".body")].filter((el) => el.scrollHeight > el.clientHeight + 1),
    ...[...s.querySelectorAll(".rows .cat, .rows .pk, .section-head h2")].filter((el) => el.scrollWidth > el.clientWidth + 1),
  ].map(() => i + 1)));
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

console.log(`${els.length} slides → ${relative(process.cwd(), outDir)}/  (${inventory.items.length} lines, ${inventory.total} ${inventory.unit || "units"})`);
if (!photoPath) console.log("Note: no assets/photos/warehouse.jpg, so the cover and contact slides use the plain navy background.");
