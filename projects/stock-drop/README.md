# Stock Drop Carousel

A monthly Instagram carousel that shows the latest inventory. It is meant to become the brand's signature visual.

**Status:** October 2026 built from the client's sheet: 8 slides, 80 bale lines, 641 bales. **Slides to post and a zip download: [output/2026-10](output/2026-10/README.md).** Open tasks are in [to-dos/stock-drop.md](../../to-dos/stock-drop.md).

## Brief

**Goals:**

- Show the latest monthly inventory
- Build trust with international buyers
- Make categories easy to browse
- Increase WhatsApp inquiries
- Present the warehouse as professional and reliable

**What changes each month:** the month, the inventory quantities, and any new categories. **Everything else stays the same.**

**Design requirements:** premium, modern, extremely easy to read, built for mobile, reusable, and consistent on every slide. The brand's feel and audience are in [brand direction](../../docs/strategy/brand-direction.md).

## Source rules

| Input | Rule |
| :- | :- |
| Inventory spreadsheet | **The only source of truth.** Never invent, rename, remove, merge, or change categories or quantities. The exceptions are approved brand-spelling fixes and section names in `src/corrections.mjs` |
| Logo | Official. Use the file as is. Never redraw it |
| Warehouse photos | Real photos in [assets/photos](../../assets/photos/README.md). `tools/make_backgrounds.py` crops them into `template/bg/`. Never use `bales-closeup-child.jpg` (a child is in the shot) |
| Layout reference | Layout inspiration only. Don't copy its colours, typography, or branding |

## Monthly workflow

1. Save the client's inventory sheet as `data/YYYY-MM.xlsx` (for example `data/2026-11.xlsx`). The month on the slides comes from the file name. A `.csv` export works too.
2. Run the build:
   ```
   npm install            # first time only
   npm run build -- data/2026-11.xlsx
   ```
3. Check `output/2026-11/overview.png`.
4. Run the `critique` skill (report in `reviews/`) and the `social` skill (caption in `captions/`), then build again so the caption goes into the download pack.
5. Commit and push. Open `output/2026-11/` on GitHub: it previews every slide and has one zip (`stock-drop-2026-11.zip`) with the slides and `caption.txt`. Post `01.png` onward in order, with the caption.

### Sheet format

The build reads the client's own layout. Columns are matched by header name, so their order doesn't matter.

| Header in the sheet | Used for | Required |
| :- | :- | :- |
| `Description` | Bale name | Yes |
| `Quantity` | Bales available | Yes |
| `Section` | Grouping on the slides | Yes |
| `Packing On Bale` | Packing column (for example `200 PCS`, `100 LBS`) | No |
| `Bales` | Unit label in the column header | No |

- Descriptions, sections, packing, and quantities print as written. Two exceptions:
  - **Spelling fixes:** brand names that are certainly misspelled are corrected at build time from `src/corrections.mjs` (for example Carhart → Carhartt, Levis → Levi's). The sheet itself is never edited, and the build lists every fix it makes. Add only certain fixes, never wording changes.
  - **Section names:** the same file renames sections Hammad has approved (for example "3 button" → "Collar T-shirts (3 buttons)"), including the headings the client used in their [July carousel](../../docs/research/july-carousel.md) (Baby → "Children (0–14 years)").
  - **Spacing:** `200Pcs` shows as `200 PCS`.
- A totals row (a quantity with no description or section) is checked against the sum of the lines. The build stops if they don't match.

### Built-in safeguards

- **Totals check:** the build stops if the lines don't add up to the sheet's total row.
- **Overflow check:** the build stops if any text would be cut off.
- **Slide cap:** the build stops if every section can't fit whole within 9 slides.
- **Backgrounds:** the cover shows the real warehouse, with the "Welcome to vintage world · Retro Revival" banner top right and bales behind the text. The list slides show the labelled jeans bales, darkened (`template/bg/`, made by `tools/make_backgrounds.py`).
- **Cover art:** the gold line drawing of bales (`template/art/bales-line.svg`) is off now that the cover shows real bales. Add `--cover-art` to the build to bring it back.

### Data on file

| Month | File | Source | Lines | Bales |
| :- | :- | :- | :- | :- |
| October 2026 | `data/2026-10.csv` | `ETA141026.xlsx` (Google Drive), rebuilt as CSV and checked line by line against the sheet's total | 80 | 641 |

## Slides

Less is more: **9 slides at most** (cover plus up to 8 list slides), built mobile-first. Nothing else.

| # | Slide | Content |
| :- | :- | :- |
| 1 | Cover | Warehouse photo, logo top left, "Stock Drop" on one line, month, every section as a pill, location, WhatsApp in a gold pill |
| 2–7 | List | Section name, then one row per bale: a container with the description and packing, and a separate box with the number of bales. One "BALES" label per slide sits above the boxes. **A section is never split across slides** |

- List slides carry only the list, plus a footer with WhatsApp (in a gold pill) and the Instagram handle. LINE is not shown. The logo appears on the cover only. No index, totals, page numbers, or section numbers.
- **Packing:** sections are rearranged to fit, largest first, so the slides don't follow sheet order. Within a slide, sections keep sheet order.
- **Emptiest slide last:** the slide with the most free space always goes at the end, so the carousel never looks finished early.
- **Auto-fit:** the build tries row heights from 80px down to 60px and uses the biggest where every section fits whole within 9 slides and no slide is less than half full. Bale names are capped at 32px so long names never cut off.
- **Long sections:** a section too long for one slide at that size gets a slide to itself, so it never splits. If one column still gives near-full-size rows (66px or more), it stays one column (October: Printed T-shirts). Otherwise it switches to two columns, with the name above its packing and long names wrapping to two lines (October: Jeans, 19 lines). If a section can't fit even then, the build stops and names it. Raise `MAX_SLIDES` in `src/build.mjs` only if you accept more slides.

Contact details come from `src/brand.mjs`. Keep that file in sync with the [business profile](../../docs/research/business-profile.md).

## Design system

- **Look:** follows the client's July carousel, so buyers who saw July recognise it: near-black, gold and warm cream over a darkened warehouse photo. Before/after: [reviews/2026-10-july-restyle.png](reviews/2026-10-july-restyle.png).
- **List rows:** each bale line sits in a dark glass container with a thin gold edge, with the bale count in a gold box beside it (like July's gold banners). No rules or dotted leaders: the containers guide the eye.
- **Cover pills:** the build checks that the pills never run into the logo (or the drawing, if it's on).
- **Colours:** taken from the logo (see [brand direction](../../docs/strategy/brand-direction.md#colours)).
- **Type:** Cormorant Garamond for headings, always with lining figures (its default old-style numerals drop below the line). Inter for descriptions, packing, and bale quantities. Both use the SIL Open Font License, and the files are bundled in `template/fonts/`.
- **Logo:** the traced light SVG (`assets/brand/logo-traced-light.svg`, cream wordmark), straight on the photo as in July. It's a trace of the official PNG, not a redraw ([brand assets](../../assets/brand/README.md)). If the client sends the original vector, it replaces the trace.
- **Format:** 1080 × 1350 px (Instagram 4:5).
- **Figma:** slide 06 is rebuilt as editable layers in [Quick Projects → Retro Revival → Stock Drop](https://www.figma.com/design/fmHPTOHu3ddCyy2toFmtS3/Quick-Projects?node-id=3012-191), with a `Bale Row` component (Name, Packing, Bales text properties) and a "Retro Revival" colour variable collection. The build script is still the source of the posted slides.

## Folder layout

```
stock-drop/
├── data/        # one inventory sheet per month (.xlsx or .csv)
├── src/         # build script, contact details, spelling fixes
├── template/    # styles, fonts, backgrounds (bg/)
├── tools/       # make_backgrounds.py: backgrounds from the warehouse photos
├── output/      # built slides, caption and zip, one folder per month (rebuilt each run)
├── captions/    # Instagram caption per month (social skill)
└── reviews/     # design critique per month (critique skill)
```
