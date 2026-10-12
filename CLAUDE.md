# CLAUDE.md

Context for Claude Code sessions on this project. Read this first, then the docs it links to.

## Who I'm working with

- **Hammad** is a web developer, designer, and video producer based in Karachi. He works mainly in **Webflow**, plus UI/UX, video, and content strategy. He speaks English and Urdu/Hindi.
- **How he wants answers:** short and useful. No sugarcoating, no padding.
- **Assignment so far:** the first confirmed deliverable is the monthly Stock Drop carousel. Anything beyond that is unconfirmed, so ask before building anything large.

## The project in one paragraph

Retro Revival Co. Ltd. is a B2B vintage clothing wholesaler with a warehouse in Lat Krabang, Bangkok, 20 minutes from Suvarnabhumi Airport. It sells sealed bales (for example, Levi's 501 at 50 pcs) to local Thai resellers and international buyers. The operation is real and the video quality is good, but trust signals are weak online. It has no website, a dead Facebook profile, no TikTok, and no visible reviews. In this trade, **trust is the product**.

## Where things are

| Topic | Doc |
| :- | :- |
| Company facts, products, brand | [docs/research/business-profile.md](docs/research/business-profile.md) |
| Instagram, Facebook, other channels | [docs/research/online-presence.md](docs/research/online-presence.md) |
| Warehouse reel breakdown | [docs/research/reel-analysis.md](docs/research/reel-analysis.md) |
| Competitors | [docs/research/competitors.md](docs/research/competitors.md) |
| Client's July 2026 carousel (their previous design) | [docs/research/july-carousel.md](docs/research/july-carousel.md) |
| Installed Claude skills | [.claude/skills/README.md](.claude/skills/README.md) (review: [docs/research/claude-skills.md](docs/research/claude-skills.md)) |
| Strengths and weaknesses | [docs/strategy/assessment.md](docs/strategy/assessment.md) |
| Brand positioning, personality, audience | [docs/strategy/brand-direction.md](docs/strategy/brand-direction.md) |
| Recommended next steps | [docs/strategy/roadmap.md](docs/strategy/roadmap.md) |
| Stock Drop carousel | [projects/stock-drop/README.md](projects/stock-drop/README.md) |
| Website scope draft | [projects/website/scope.md](projects/website/scope.md) |
| Open tasks | [to-dos/](to-dos/README.md) |
| Questions for the client | [docs/client/open-questions.md](docs/client/open-questions.md) |
| Confirmed decisions | [docs/client/decisions.md](docs/client/decisions.md) |

## Working rules

- **Never invent prices, ratings, shipping countries, or stats.** Use placeholders like `[PRICE TBC]` until the client confirms.
- Treat every **[unverified]** item as an assumption until it is confirmed. When the client confirms something, record it in `docs/client/decisions.md` and update the source doc.
- Instagram and Facebook block automated access. Hammad must supply screenshots or exports for any new social research. Store them in `assets/screenshots/`.
- **Platform:** Webflow is the default for the website. Confirm with Hammad before scaffolding any code-based alternative.
- **Repo layout:** one repo for Retro Revival. Shared material goes in `docs/` and `assets/`, and each workstream gets its own folder under `projects/`. Put new work in the matching project folder, or create a new one with its own `README.md`.
- **Tasks:** track open work in `to-dos/` (rules in its README). Add tasks as they come up and delete them when done.
- Keep each fact in one doc and link to it instead of copying it (see conventions in [README.md](README.md)).
- **Skills:** the skills in `.claude/skills/` are generic. Where they conflict with these rules, these rules win.
- Keep updates to Hammad short and direct.
