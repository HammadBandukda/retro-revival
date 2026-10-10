# Stock Drop Carousel

A monthly Instagram carousel that shows the latest inventory. It is meant to become the brand's signature visual.

**Status:** waiting on source files (logo, warehouse photo, inventory spreadsheet, layout reference).

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

## Folder layout

```
stock-drop/
├── data/      # one inventory file per month, e.g. 2026-10.xlsx
└── output/    # exported slides, one folder per month, e.g. 2026-10/
```

The logo and warehouse photos are shared with other projects, so they live in `assets/brand/` and `assets/photos/` at the repo root.
