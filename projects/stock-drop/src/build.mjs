// Builds the monthly Stock Drop carousel from an inventory CSV.
//
//   npm run build -- data/2026-10.csv          -> output/2026-10/*.png
//   npm run build -- data/sample.csv 2026-10   -> output/sample/*.png (flagged as sample)
//
// The CSV is the only source of truth: names and quantities are printed exactly as written.

import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { CONTACT } from "./brand.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPO = resolve(ROOT, "../..");
// Layout budget for inventory slides, in px. Must match template/styles.css.
const BODY_HEIGHT = 980;
const HEAD_HEIGHT = 132;
const ROW_HEIGHT = 82;
const SECTION_GAP = 56;
const MAX_ROWS = Math.floor((BODY_HEIGHT - HEAD_HEIGHT) / ROW_HEIGHT);
const IG_MAX_SLIDES = 20;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];

function fail(msg) {
  console.error(`Error: ${msg}`);
  process.exit(1);
}

// ---------- Data ----------

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
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

function loadInventory(file) {
  const [header, ...lines] = parseCsv(readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
  const cols = header.map((h) => h.trim().toLowerCase());
  for (const need of ["section", "category", "quantity"]) {
    if (!cols.includes(need)) fail(`${file} needs a "${need}" column. Found: ${header.join(", ")}`);
  }
  const at = (r, name) => (cols.includes(name) ? (r[cols.indexOf(name)] ?? "").trim() : "");
  const items = lines.map((r, i) => {
    const item = { section: at(r, "section"), category: at(r, "category"), quantity: at(r, "quantity"), unit: at(r, "unit") };
    if (!item.category) fail(`row ${i + 2} has no category`);
    if (!item.quantity) fail(`row ${i + 2} (${item.category}) has no quantity`);
    if (!item.section) fail(`row ${i + 2} (${item.category}) has no section`);
    return item;
  });
  // Keep sections in the order they first appear in the sheet.
  const sections = [];
  for (const item of items) {
    let s = sections.find((x) => x.name === item.section);
    if (!s) sections.push((s = { name: item.section, items: [] }));
    s.items.push(item);
  }
  return { items, sections };
}

function monthLabel(id) {
  const m = /^(\d{4})-(\d{2})$/.exec(id);
  if (!m || +m[2] < 1 || +m[2] > 12) fail(`month must look like 2026-10, got "${id}"`);
  return `${MONTHS[+m[2] - 1]} ${m[1]}`;
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

function buildSlides({ sections, items }, month, assets, isSample) {
  // Fit whole sections onto a slide while they fit. Long sections continue on the next slide.
  const pages = [];
  let page = null, used = 0;
  sections.forEach((s, si) => {
    for (let i = 0; i < s.items.length; i += MAX_ROWS) {
      const rows = s.items.slice(i, i + MAX_ROWS);
      const height = HEAD_HEIGHT + rows.length * ROW_HEIGHT;
      if (!page || used + SECTION_GAP + height > BODY_HEIGHT) {
        pages.push((page = { blocks: [] }));
        used = height;
      } else used += SECTION_GAP + height;
      page.blocks.push({ section: s, num: si + 1, rows, cont: i > 0 });
    }
  });
  const total = pages.length + 4; // cover, index, ...inventory, trust, contact
  if (total > IG_MAX_SLIDES) fail(`${total} slides is over Instagram's limit of ${IG_MAX_SLIDES}`);

  const firstPage = new Map();
  pages.forEach((p, i) => p.blocks.forEach((b) => { if (!firstPage.has(b.section)) firstPage.set(b.section, i + 3); }));

  const flag = isSample ? `<div class="sample-flag">SAMPLE DATA — NOT FOR POSTING</div>` : "";
  const top = (n) => `
    <div class="chrome-top">
      <img class="logo" src="${assets.logo}" alt="Retro Revival Thailand">
      <div class="meta"><div class="eyebrow">Stock Drop · ${esc(month)}</div><div class="page">${pad(n)} / ${pad(total)}</div></div>
    </div>`;
  const bottom = `
    <div class="chrome-bottom">
      <span><b>WHATSAPP</b>${esc(CONTACT.whatsapp)}</span>
      <span><b>LINE</b>${esc(CONTACT.line)}</span>
      <span>${esc(CONTACT.instagram)}</span>
    </div>`;
  const photo = assets.photo
    ? `<div class="photo" style="background-image:url('${assets.photo}')"></div>`
    : `<div class="photo placeholder"></div>`;
  const plate = `<div class="plate"><img src="${assets.logo}" alt="Retro Revival Thailand"></div>`;

  const slides = [];

  slides.push(`
  <section class="slide dark">${photo}<div class="shade"></div>${plate}${flag}
    <div class="cover-text">
      <div class="eyebrow">Monthly wholesale release</div>
      <h1>Stock<br>Drop</h1>
      <div class="month">${esc(month)}</div>
      <div class="rule"></div>
      <div class="pillars">Fresh containers every month<br>Sorted into categorized bales · Bangkok, Thailand</div>
    </div>
    <div class="swipe">SWIPE<span>→</span></div>
  </section>`);

  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  slides.push(`
  <section class="slide">${flag}${top(2)}
    <div class="body">
      <div class="eyebrow">In this drop</div>
      <h2>${esc(month.split(" ")[0])} <em>${esc(month.split(" ")[1])}</em></h2>
      <p class="lede">${plural(items.length, "category", "categories")} across ${plural(sections.length, "section", "sections")}, freshly sorted at our Bangkok warehouse.</p>
      <ul class="index">
        ${sections.map((s, i) => `
        <li><span class="num">${pad(i + 1)}</span><span class="name">${esc(s.name)}</span>
          <span class="count">${plural(s.items.length, "category", "categories")} · p.${pad(firstPage.get(s))}</span></li>`).join("")}
      </ul>
    </div>${bottom}
  </section>`);

  pages.forEach((p, i) => {
    slides.push(`
  <section class="slide">${flag}${top(i + 3)}
    <div class="body">${p.blocks.map((b) => `
      <div class="block">
        <div class="section-head"><span class="num">${pad(b.num)}</span><h2>${esc(b.section.name)}</h2>${b.cont ? `<span class="cont">continued</span>` : ""}</div>
        <ul class="rows">${b.rows.map((r) => `
          <li><span class="cat">${esc(r.category)}</span><span class="leader"></span><span class="qty">${esc(r.quantity)}</span><span class="unit">${esc(r.unit)}</span></li>`).join("")}
        </ul>
      </div>`).join("")}
    </div>${bottom}
  </section>`);
  });

  slides.push(`
  <section class="slide dark">${flag}
    <div class="chrome-top"><span class="wordmark-small">RETRO REVIVAL THAILAND</span>
      <div class="meta"><div class="eyebrow">Stock Drop · ${esc(month)}</div><div class="page">${pad(total - 1)} / ${pad(total)}</div></div></div>
    <div class="body">
      <div class="eyebrow">Why Retro Revival</div>
      <h2>A warehouse <em>you can rely on.</em></h2>
      <div class="pillar-grid">
        <div><span class="n">01</span><h3>Fresh containers, every month</h3><p>New stock imported and sorted monthly.</p></div>
        <div><span class="n">02</span><h3>Sorted into categorized bales</h3><p>Clear categories and consistent quality.</p></div>
        <div><span class="n">03</span><h3>Bangkok warehouse</h3><p>${esc(CONTACT.locationPitch)}</p></div>
        <div><span class="n">04</span><h3>Registered company</h3><p>${esc(CONTACT.legalName)}</p></div>
      </div>
    </div>${bottom}
  </section>`);

  slides.push(`
  <section class="slide dark">${photo}<div class="shade"></div>${plate}${flag}
    <div class="contact-text">
      <div class="eyebrow">Wholesale enquiries</div>
      <h2>Reserve<br>your bales</h2>
      <p class="lede">Message us on WhatsApp or LINE with the categories you want.</p>
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

const [csvArg, monthArg] = process.argv.slice(2);
if (!csvArg) fail("usage: npm run build -- data/2026-10.csv");
const csv = resolve(process.cwd(), csvArg);
if (!existsSync(csv)) fail(`can't find ${csv}`);

const id = basename(csv).replace(/\.csv$/i, "");
const isSample = id === "sample";
const month = monthLabel(isSample ? monthArg ?? "2026-10" : id);
const outDir = join(ROOT, "output", id);
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const rel = (p) => relative(outDir, p).split("\\").join("/");
const photoPath = findPhoto();
const assets = {
  logo: rel(join(REPO, "assets/brand/logo-primary-trimmed.png")),
  photo: photoPath ? rel(photoPath) : null,
};
const slides = buildSlides(loadInventory(csv), month, assets, isSample);

const html = `<!doctype html><html><head><meta charset="utf-8"><title>Stock Drop · ${esc(month)}</title>
<link rel="stylesheet" href="${rel(join(ROOT, "template/styles.css"))}"></head><body>${slides.join("\n")}</body></html>`;
const htmlPath = join(outDir, "carousel.html");
writeFileSync(htmlPath, html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
await page.goto(`file://${htmlPath}`);
await page.evaluate(() => document.fonts.ready);
// Guard: never post a slide with clipped text.
const overflow = await page.$$eval(".slide .body", (bodies) =>
  bodies.map((b, i) => (b.scrollHeight > b.clientHeight + 1 ? i : -1)).filter((i) => i >= 0));
if (overflow.length) fail(`content overflows on slide body ${overflow.map((i) => i + 1).join(", ")}. Adjust the layout budget in build.mjs`);
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

console.log(`${els.length} slides → ${relative(process.cwd(), outDir)}/`);
if (!photoPath) console.log("Note: no assets/photos/warehouse.jpg yet, so the cover uses a placeholder.");
if (isSample) console.log("Note: sample data. Every slide is flagged NOT FOR POSTING.");
