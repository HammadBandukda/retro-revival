# Client's July 2026 Carousel

The stock carousel the client made before ours. It's the reference for what they've posted before, not a template.

- **File:** `retro_revival_carousel.pdf`, 7 pages, in Hammad's Google Drive [RetroRevival folder](https://drive.google.com/drive/folders/1XfjbkPLQb81cQHnPF406G6Rd7NV5MOcL). Not in the repo.
- **Copy in the repo:** `assets/screenshots/2026-07-client-carousel.pdf`. Each page is a single flattened 1092 × 1092 image, with pillarboxed portrait designs on pages 2–7 and a "PhotoGrid" watermark.

## What's on it

| Page | Content |
| :- | :- |
| 1 | Cover: logo, "- Second Hand Clothing -", "July Stock Drop", "Fresh Container Arrival", category list, full warehouse address, "Updated July 2026", phone, LINE ID |
| 2–6 | Stock tables (Description · Stock · Packing), grouped by section, with the address, phone and LINE ID in the footer and a page number (2/7 to 6/7) |
| 7 | "Can't find what you're looking for?" with photos, videos, pricing, bale availability and worldwide shipping listed as things to ask for, then "Thank you for choosing" and the contacts |

## Claims it makes

These are the client's own words. None of them are confirmed for our posts, so they stay off the Stock Drop until confirmed ([open question 13](../client/open-questions.md)):

- "Worldwide shipping" (also see [open question 3](../client/open-questions.md))
- "Fresh stock every month" and "Fresh container arrival"
- "Premium quality, carefully sorted"
- "Bulk orders welcome"
- Pricing, photos and videos available on request

## Sections not in the October sheet

July had sections October doesn't: **Ladies Vintage Dress** (Ladies USA Dresses), **Children (0–14 years)** (Branded Baby Mix), **Face Caps** (RR Vintage Caps), **Shirts** (Chaps & Nautica, Cowboy, Hawaii, LLW, Polo RL, Tommy Hilfiger and others), **Sports T-shirts** (Football Jerseys, NBA/NFL Jerseys) and **Cotton Pants**. Expect some of these in future sheets. The Stock Drop build prints whatever sections the sheet has, so nothing needs changing for them.

## What we took from it

- **Section headings:** where July named the same section, the Stock Drop uses the client's heading: Baby → "Children (0–14 years)", Overall → "Overalls", Pants → "Cotton Pants", Winter → "Winter Mix" (`projects/stock-drop/src/corrections.mjs`).
- **Warehouse C5** on the cover location line, and the street address in the [caption](../../projects/stock-drop/captions/2026-10.md).
- The "ask for a category" invitation, moved into the caption.
- **The look:** near-black, gold and warm cream over the warehouse photo, gold-framed containers, gold highlight boxes ([colours](../strategy/brand-direction.md#colours)). The photo comes from page 1 with the text painted out (`projects/stock-drop/tools/make_backgrounds.py`).
- **Not taken:** the condensed all-caps headings and the icons. The Stock Drop keeps its serif headings and plain lists.

## How ours differs

| July (client) | Stock Drop (ours) | Why |
| :- | :- | :- |
| LINE ID and full address on every page | WhatsApp only, in a pill; location line on the cover | [Decision](../client/decisions.md): WhatsApp is the only contact |
| Page numbers, closing "can't find it?" slide | No page numbers or extra slides | [Decision](../client/decisions.md): less is more |
| Unconfirmed claims (shipping, fresh stock monthly) | None | [CLAUDE.md](../../CLAUDE.md): never invent shipping or stats |
| Sheet spellings as typed (Levis, Nascar, Harley Davidson) | Certain brand spellings fixed at build time | [Decision](../client/decisions.md) |

## Text-extraction caveats

Page 4's address came out scrambled ("38.9 Krunstvep Greltha Road"); the other pages read 36/8 Krungthep Kreetha Road. "Vintage Heavy 232" (Winter Mix) is plausible: October lists the same bale as Vintage Mix Heavy, 164 bales.
