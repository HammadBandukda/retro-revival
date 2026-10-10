# Claude Skills Review

Public GitHub skill packs reviewed for Retro Revival work: design review, social content, and winning customers. Reviewed 2026-10-10 by reading each `SKILL.md`, not just directory listings. **Installed:** `critique`, `social`, `sms`, `prospecting`, `product-marketing`, in [.claude/skills](../../.claude/skills/README.md).

## Shortlist

| Need | Skill | Repo (licence) | Fit |
| :- | :- | :- | :- |
| Review each Stock Drop before posting | `critique` | [nexu-io/open-design](https://github.com/nexu-io/open-design) (Apache-2.0) | **High.** Scores 5 dimensions (direction, hierarchy, detail, function, innovation) with evidence and Keep / Fix / Quick-win lists. Built for their app, but the rubric works on our PNGs |
| Review the website later | `design-review` | [julianoczkowski/designer-skills](https://github.com/julianoczkowski/designer-skills) (Apache-2.0) | **Medium, later.** Screenshots at phone, tablet, and desktop widths, then a Must / Should / Could fix list. Made for web pages, not carousels |
| Deeper visual audit | `ui-design-review` | [mastepanoski/claude-skills](https://github.com/mastepanoski/claude-skills) (MIT) | **Medium.** 10-dimension score (type, colour, spacing, hierarchy, branding). Long. Better for the website than a monthly post |
| Instagram posts, carousels, Reels, captions | `social` | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) (MIT) | **High.** Carousel frameworks, a production checklist, Reels scripts, caption rules, and a list of "AI tells" to avoid |
| WhatsApp broadcasts and ads | `sms` (WhatsApp reference) | coreyhaines31/marketingskills (MIT) | **High.** WhatsApp Business rules as of 2026-10: 24-hour window, templates, pricing, Click-to-WhatsApp ads, playbooks |
| Finding buyers | `prospecting` | coreyhaines31/marketingskills (MIT) | **High.** Separate playbooks for B2B buyers and local shops (e.g. vintage stores found via Google Maps). Includes compliance rules |
| Outreach to buyers | `cold-email` | coreyhaines31/marketingskills (MIT) | **Medium.** Email and LinkedIn cadences for importers and wholesalers |
| One shared brand brief for all skills | `product-marketing` | coreyhaines31/marketingskills (MIT) | **High.** Builds one context doc that the other marketing skills read first, so they stop re-asking about the business |
| Website build later | `frontend-design` | [anthropics/skills](https://github.com/anthropics/skills) (Apache-2.0) | **Medium, later.** Already available in Claude sessions. Only matters if the site is code, not Webflow |

**Skipped:**
- `marcolang/marketing-skills` → `instagram-carousel` has **no licence**, so it can't be copied. It also adds progress bars and swipe arrows, which goes against the minimal direction.
- Most of open-design (538 skills) depends on its own app.
- mastepanoski's security and AI-governance audits aren't relevant to this work.

**Safety check:** none of the shortlisted skills run code on their own. `social` contains example `curl` commands for Reddit and Hacker News, but they only run if asked. Third-party skills are prompts written by strangers, so pin a version and read them again before updating.

## What's useful now

**For the Stock Drop carousel** (from `social` → carousel frameworks and production checklist):
- **Slide 1 is the thumbnail.** It shows alone in the feed and on the profile grid, so it has to work as a post by itself. The cover already does this.
- **One template on every inner slide.** We already follow this.
- **Text size: we fall short here.** The checklist says text should be at least about 28pt on a 1080px slide. Our list lines are about 24px, because 80 lines are squeezed into 7 slides. More slides, or splitting the drop into two posts, would make room for bigger text.
- **The caption does the searching.** Instagram search reads the caption, not the slides. Write the caption as its own hook, with the words buyers search for.
- **Measure saves and completion, not likes.** Saves show a buyer kept the list for reference, which is what we want.
- **A number on the cover** (e.g. "641 bales") is a classic hook for list carousels. Optional, since the slides were kept free of totals on purpose.

**For winning customers** (from `sms` → WhatsApp, and `prospecting`):
- **The free WhatsApp Business app** is fine for answering buyers by hand. The paid API is only worth it for automated broadcasts at scale.
- **Click-to-WhatsApp ads** on Instagram and Facebook open a free 24-hour chat window. This fits a business whose call to action is "message us on WhatsApp."
- **Broadcasts:** keep marketing messages to opted-in buyers at about 1–2 a month, or blocks lower the number's rating. A monthly Stock Drop broadcast fits.
- **Market check:** in Thailand, LINE is used more than WhatsApp. Keep both on every post, as the slides already do.
- **Prospecting fits two ways:**
  - The B2B playbook covers importers and wholesalers.
  - The local-shop playbook covers vintage stores in the target markets, using Google Maps, directories, and Instagram.
  - Its rules: never scrape LinkedIn, and verify contacts before outreach.

## Installed

The starting set is in this repo at `.claude/skills/`, so every Claude Code session on Retro Revival gets it. Versions, licences, and house rules: [.claude/skills/README.md](../../.claude/skills/README.md). Candidates for later: `design-review` and `ui-design-review` once the website exists, and `cold-email` for outreach.

Versions reviewed:

| Repo | Commit | Date |
| :- | :- | :- |
| anthropics/skills | `dbd4588` | 2026-10-09 |
| coreyhaines31/marketingskills | `1efedbc` | 2026-10-08 |
| julianoczkowski/designer-skills | `c259656` | 2026-07-06 |
| mastepanoski/claude-skills | `b6457af` | 2026-10-10 |
| nexu-io/open-design | `17e2559` | 2026-10-10 |

Directories used to find these: [claudemarketplaces.com](https://claudemarketplaces.com/skills/julianoczkowski/designer-skills/design-review), [claudskills.com](https://claudskills.com/skills/design-critic/), [claudecodeformarketers.com](https://claudecodeformarketers.com/blog/claude-code-skills-for-marketers/).
