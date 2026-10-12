# Stock Drop · October 2026 — ChatGPT output

Post slides in order, `01.png` through `08.png`. Each is 1080 × 1350 px (Instagram 4:5).

This is the ChatGPT-rendered archive for the [October 2026 prompt](../../../../projects/stock-drop/prompts/chatgpt-2026-10.md), redesigned to follow the client's July cover and inner-page patterns. The cover uses the large condensed month/title stack, official logo, generated gold paint strip, and two-column icon list. The inside slides use darkened real warehouse photos, icon-led section headings, and gold-framed stock tables. October's approved copy and data rules still apply. The canonical project build remains under `projects/stock-drop/output/2026-10/`.

## Files

- `01.png`–`08.png` — final slides in posting order
- `overview.png` — contact sheet preview
- [carousel.html](carousel.html) — responsive carousel for viewing the eight slides
- [slide-plan.md](slide-plan.md) — slide sections and line counts
- [line-check.csv](line-check.csv) — each source inventory row mapped to the slide text
- [qa-report.json](qa-report.json) — count reconciliation and export checks
- [render_carousel.py](render_carousel.py) — reproducible Pillow renderer
- `assets/` — the generated gold paint texture and a rasterized copy of the official light logo for rendering

## Verification

All 80 inventory lines and 641 bales reconcile to the October source CSV. Each slide is 1080 × 1350 px. The line check records the source row, displayed section, bale name, quantity, and packing. Only the approved spelling and section-label corrections were applied. The existing caption was not rewritten.

Sources: [October inventory](../../../../projects/stock-drop/data/2026-10.csv), [approved corrections](../../../../projects/stock-drop/src/corrections.mjs), and [project brand direction](../../../../docs/strategy/brand-direction.md).
