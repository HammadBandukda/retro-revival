# Stock Drop Carousel

A monthly Instagram carousel that shows the latest inventory. It is meant to become the brand's signature visual.

**Status:** October 2026 built from the client's sheet: 14 slides, 80 bale lines, 641 bales ([overview](output/2026-10/overview.png)). Waiting on the warehouse photo for the cover and contact slides.

## Brief

**Goals:**

- Show the latest monthly inventory
- Build trust with international buyers
- Make categories easy to browse
- Increase WhatsApp and LINE inquiries
- Present the warehouse as professional and reliable

**What changes each month:** the month, the inventory quantities, and any new categories. **Everything else stays the same.**

**Design requirements:** premium, modern, extremely easy to read, built for mobile, reusable, and consistent on every slide. The brand's feel and audience are in [brand direction](../../docs/strategy/brand-direction.md).

## Source rules

| Input | Rule |
| :- | :- |
| Inventory spreadsheet | **The only source of truth.** Never invent, rename, remove, merge, or change categories or quantities |
| Logo | Official. Use the file as is. Never redraw it |
| Warehouse photo | The real warehouse. Use it as the background to show authenticity |
| Layout reference | Layout inspiration only. Don't copy its colours, typography, or branding |

## Monthly workflow

1. Save the client's inventory sheet as `data/YYYY-MM.xlsx` (for example `data/2026-11.xlsx`). The month on the slides comes from the file name. A `.csv` export works too.
2. Run the build:
   ```
   npm install            # first time only
   npm run build -- data/2026-11.xlsx
   ```
3. Check `output/2026-11/overview.png`, then post `01.png` onward in order.

### Sheet format

The build reads the client's own layout. Columns are matched by header name, so their order doesn't matter.

| Header in the sheet | Used for | Required |
| :- | :- | :- |
| `Description` | Bale name | Yes |
| `Quantity` | Bales available | Yes |
| `Section` | Grouping on the slides | Yes |
| `Packing On Bale` | Packing column (for example `200 PCS`, `100 LBS`) | No |
| `Bales` | Unit label in the column header | No |

- Descriptions, sections, packing, and quantities print exactly as written, in sheet order. Sections appear in the order they first show up. The only change is display spacing: `200Pcs` shows as `200 PCS`.
- A totals row (a quantity with no description or section) is checked against the sum of the lines. The build stops if they don't match.

### Built-in safeguards

- **Totals check:** the build stops if the lines don't add up to the sheet's total row.
- **Overflow check:** the build stops if any text would be cut off.
- **Slide limit:** the build stops if the carousel goes over Instagram's limit of 20 slides.
- **No photo yet:** if `assets/photos/warehouse.jpg` is missing, the cover and contact slides use a labelled placeholder.

### Data on file

| Month | File | Source | Lines | Bales |
| :- | :- | :- | :- | :- |
| October 2026 | `data/2026-10.csv` | `ETA141026.xlsx` (Google Drive), rebuilt as CSV and checked line by line against the sheet's total | 80 | 641 |

## Slides

| # | Slide | Content |
| :- | :- | :- |
| 1 | Cover | Warehouse photo, logo, "Stock Drop", month |
| 2 | Index | Total bales, bale types, and sections, plus a two-column section index with page numbers |
| 3+ | Inventory | Table of description, packing, and bales. Sections flow across slides, with at least 2 lines on each side of a split |
| n-1 | Why Retro Revival | Four confirmed facts: monthly containers, sorted bales, Bangkok location, registered company |
| n | Contact | WhatsApp, LINE, address, Instagram |

Contact details come from `src/brand.mjs`. Keep that file in sync with the [business profile](../../docs/research/business-profile.md).

## Design system

- **Colours:** taken from the logo (see [brand direction](../../docs/strategy/brand-direction.md#colours)).
- **Type:** Cormorant Garamond for headings and numbers, Inter for everything else. Both use the SIL Open Font License, and the files are bundled in `template/fonts/`.
- **Logo:** `assets/brand/logo-primary-trimmed.png` is the official file, cropped only. It sits on an off-white plate because the file has no transparent background.
- **Format:** 1080 × 1350 px (Instagram 4:5).

## Folder layout

```
stock-drop/
├── data/        # one inventory sheet per month (.xlsx or .csv)
├── src/         # build script and contact details
├── template/    # styles and fonts
└── output/      # built slides, one folder per month
```
