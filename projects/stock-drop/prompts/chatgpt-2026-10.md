# ChatGPT prompt: October 2026 Stock Drop

Paste everything below the line into ChatGPT, with GitHub access to `HammadBandukda/retro-revival`.

---

You're designing the **October 2026 "Stock Drop" Instagram carousel** for Retro Revival Thailand, a B2B vintage clothing wholesaler in Bangkok that sells sealed bales to resellers. Use the GitHub repo `HammadBandukda/retro-revival`, branch `claude/lucid-wozniak-xf0gkn` (or `main` once that branch is merged). Read the files below before you design anything.

## Visual reference: the client's July post

- `assets/screenshots/2026-07-client-carousel.pdf`: the client's own July 2026 carousel, 7 pages. **Match its look:** near-black backgrounds over a darkened warehouse photo, gold and warm cream lettering, gold-framed panels, gold highlight bars, bold condensed all-caps headings, clean stock tables.
- `docs/research/july-carousel.md`: notes on that post: what it contains, which claims are unconfirmed, and how ours must differ.

## Content: the only source of truth

- `projects/stock-drop/data/2026-10.csv`: the October inventory, 80 lines, 641 bales in total. Columns: Quantity (number of bales), Description (bale name), Packing On Bale, Section. **Every line must appear exactly once, with its exact quantity and packing.** Don't invent, merge, drop or reword anything.
- `projects/stock-drop/src/corrections.mjs`: the only allowed changes:
  - brand spelling fixes (Levis → Levi's, Carhart → Carhartt, Nascar → NASCAR, Harley Davidson → Harley-Davidson, lee/wrangler → Lee/Wrangler)
  - section renames ("3 button" → "Collar T-shirts (3 buttons)", Baby → "Children (0–14 years)", Overall → "Overalls", Pants → "Cotton Pants", Winter → "Winter Mix")
- `projects/stock-drop/output/2026-10/`: our current build of the same carousel (`01.png`–`08.png`, `overview.png`). Use it to check content and slide grouping, not style.

## Brand assets

- **Logo:** `assets/brand/logo-traced-light.svg` (cream wordmark, for dark backgrounds). The official raster is `assets/brand/logo-primary.png`. Use the logo as is. Never redraw, restyle or recolour it, and never replace it with AI-generated lettering. Put it on the cover only.
- **Photos:** `assets/photos/` (read its `README.md`). These are real photos of the warehouse. Use `warehouse-banner-bales.jpg`, `warehouse-banner-jeans.jpg` and `warehouse-banner-roof.jpg`, darkened, as backgrounds. The banner reading "Welcome to vintage world · Retro Revival Thailand" is a strong trust signal, so keep it visible on the cover. **Never use `bales-closeup-child.jpg`** (a child is in the shot).
- **Colours:** see `docs/strategy/brand-direction.md` → Colours, "Social posts":
  - near-black `#0D0F0E`
  - gold `#C9993F`
  - gold light `#E0BB68`
  - warm cream `#F1E6CF`

## Rules (from `CLAUDE.md` and `docs/client/decisions.md`)

1. **Format:** 1080 × 1350 px (4:5). At most 9 slides: one cover plus list slides. Build it mobile-first, with large, readable type.
2. **Sections never split across slides.** Sections can be rearranged to fit, the slide with the most empty space goes last, and Jeans (19 lines) may use two columns on its own slide.
3. **Cover:**
   - logo
   - "Stock Drop" and "October 2026"
   - every section name (pills or a list, like July's)
   - "Warehouse C5, Lat Krabang, Bangkok · 20 minutes from Suvarnabhumi Airport"
   - WhatsApp **+66 94 395 4613**, highlighted
4. **List slides:** a section heading, then one row per bale showing the name, the packing and the number of bales. Use one clear "BALES" (or "STOCK") label per table.
5. **Contact:** only WhatsApp +66 94 395 4613 and the Instagram handle @retrorevival.thailand. **No LINE ID, no phone-call icon, no full street address on list slides.**
6. **No unconfirmed claims.** Don't write "worldwide shipping", "fresh stock every month", "fresh container arrival", "premium quality, carefully sorted", "bulk orders welcome", "updated [date]", or anything about prices, ratings or countries. They appear in July but aren't confirmed.
7. **Keep it minimal:** no page numbers, no table of contents, no totals or stats, no "Can't find what you're looking for?" slide, no icons that add nothing.

## What to deliver

1. A slide plan: for each slide, the sections it holds and their line counts. The counts must add up to 80 lines and 641 bales.
2. The slides as 1080 × 1350 PNGs, in posting order.
3. A check table for every slide listing each bale name, packing and quantity exactly as shown on the slide, so it can be compared line by line with the CSV. If any text on an image comes out garbled, fix it before delivering.

The caption is already written: `projects/stock-drop/captions/2026-10.md`. Don't rewrite it.
