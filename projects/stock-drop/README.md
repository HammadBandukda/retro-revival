# Stock Drop Carousel

A monthly Instagram carousel that shows the latest inventory. It is meant to become the brand's signature visual.

**Status:** template v1 built and previewed on sample data ([overview](output/sample/overview.png)). Still waiting on the inventory spreadsheet (`ETA141026.xlsx`), the warehouse photo, and the layout reference.

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

1. Export the month's inventory to CSV and save it as `data/YYYY-MM.csv` (for example `data/2026-10.csv`). The month on the slides comes from the file name.
2. Run the build:
   ```
   npm install            # first time only
   npm run build -- data/2026-10.csv
   ```
3. Check `output/2026-10/overview.png`, then post `01.png` onward in order.

### CSV format

| Column | Required | Example |
| :- | :- | :- |
| `section` | Yes | `Outerwear` |
| `category` | Yes | `Carhartt Jackets` |
| `quantity` | Yes | `12` |
| `unit` | No | `bales` |

- Rows print exactly as written, in the same order. Sections appear in the order they first show up.
- The final column layout depends on the real spreadsheet. Adjust this format once it arrives.

### Built-in safeguards

- **Sample data:** `data/sample.csv` is made up, for layout testing only. Every slide built from it carries a red **SAMPLE DATA — NOT FOR POSTING** banner.
- **Overflow check:** the build stops if any text would be cut off.
- **Slide limit:** the build stops if the carousel goes over Instagram's limit of 20 slides.
- **No photo yet:** if `assets/photos/warehouse.jpg` is missing, the cover and contact slides use a labelled placeholder.

## Slides

| # | Slide | Content |
| :- | :- | :- |
| 1 | Cover | Warehouse photo, logo, "Stock Drop", month |
| 2 | Index | Sections, category counts, page numbers |
| 3+ | Inventory | Sections and categories with quantities. Long sections continue on the next slide |
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
├── data/        # one inventory CSV per month, plus sample.csv
├── src/         # build script and contact details
├── template/    # styles and fonts
└── output/      # built slides, one folder per month
```
