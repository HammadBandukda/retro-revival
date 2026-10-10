# Claude Skills

Third-party skills installed for this repo. Claude Code loads them in every session here. Review: [docs/research/claude-skills.md](../../docs/research/claude-skills.md).

| Skill | Use it for | Source | Version | Licence |
| :- | :- | :- | :- | :- |
| `critique` | Score a carousel or page on 5 dimensions before posting | [nexu-io/open-design](https://github.com/nexu-io/open-design) `design-templates/critique` | `17e2559` (2026-10-10) | Apache-2.0 |
| `social` | Instagram posts, carousels, Reels, captions, content calendar | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) `skills/social` | `1efedbc` (2026-10-08) | MIT |
| `sms` | WhatsApp broadcasts, Click-to-WhatsApp ads, message flows | same repo, `skills/sms` | `1efedbc` | MIT |
| `prospecting` | Building lists of importers, wholesalers, and vintage shops | same repo, `skills/prospecting` | `1efedbc` | MIT |
| `product-marketing` | Keeping the shared brand context up to date | same repo, `skills/product-marketing` | `1efedbc` | MIT |

Files are copied unchanged (dev-only `evals/` folders left out), with each repo's licence kept in the skill folder.

## House rules win

These skills are generic. Where they conflict with [CLAUDE.md](../../CLAUDE.md), CLAUDE.md wins:

- **Never invent numbers, results, prices, ratings, or shipping countries.** Several hook formulas ask for a "specific result". Use only confirmed facts from `docs/`.
- **The Stock Drop design rules stay fixed** ([projects/stock-drop](../../projects/stock-drop/README.md)): 7 slides at most, no progress bars, page numbers, or totals.
- **Nothing gets posted, sent, or scheduled without Hammad's go-ahead.**

## Local notes

- **Brand context:** the marketing skills read [.claude/product-marketing.md](../product-marketing.md) first. It points to the docs that hold each fact. Update the docs, not that file.
- **`critique`:** it was written for the OpenDesign app. Here, point it at the slide PNGs in `projects/stock-drop/output/<month>/` and save the report as `critique.html` in the same folder.

## Updating

Copy the new version from the source repo, read the diff before committing, and update the version column above.
