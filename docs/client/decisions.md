# Decisions Log

Answers and decisions confirmed by the client or Hammad. Add new entries at the top, then update the source doc and remove any **[unverified]** tag there.

| Date | Decision | Source | Docs updated |
| :- | :- | :- | :- |
| 2026-10-10 | Fix certain brand misspellings from the sheet at build time: Carhart → Carhartt, Levis → Levi's, lee/wrangler → Lee/Wrangler, Harley Davidson → Harley-Davidson, Nascar → NASCAR. Wording and trade terms stay as the client wrote them | Hammad | projects/stock-drop/src/corrections.mjs |
| 2026-10-10 | A section is never split across slides. Sections may be rearranged to fit, and the emptiest slide always goes last. Numerals use lining figures (no dropped 3s) | Hammad | projects/stock-drop |
| 2026-10-10 | The carousel is 7 slides at most: the cover and the list. No contact slide (contacts sit in every footer and on the cover), index, totals, page numbers, section numbers, or "why us" slide | Hammad | projects/stock-drop |
| 2026-10-10 | October 2026 inventory received: `ETA141026.xlsx`, 80 bale lines in 17 sections, 641 bales. Quantities are in bales, and each line states its packing (pcs or lbs per bale) | Client sheet | projects/stock-drop |
| 2026-10-10 | The repo is organised as one repo for Retro Revival, with one folder per workstream under `projects/` | Hammad | README.md |
| 2026-10-10 | First confirmed deliverable: a reusable monthly **"Stock Drop"** Instagram carousel | Client brief | projects/stock-drop, roadmap.md |
| 2026-10-10 | The business imports fresh containers every month and sorts them into categorized bales | Client brief | brand-direction.md |
| 2026-10-10 | Brand positioning, personality, and target markets set | Client brief | brand-direction.md |
| 2026-10-10 | The logo is official and must not be redrawn. The trademark question stays open | Client brief | brand-direction.md |
