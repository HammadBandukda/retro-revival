# Retro Revival Thailand

Research, strategy, and project work for **Retro Revival Co. Ltd.**, a B2B vintage clothing wholesaler in Lat Krabang, Bangkok. It sells sealed, pre-sorted bales to resellers in Thailand and overseas.

**Status:** the first confirmed deliverable is the monthly [Stock Drop carousel](projects/stock-drop/README.md). The rest of the scope is still open (see [open questions](docs/client/open-questions.md)).

## Structure

One repo for Retro Revival. Shared material sits at the top level, and each workstream has its own folder under `projects/`.

```
.
├── CLAUDE.md                  # Context and working rules for Claude Code sessions
├── .claude/                   # Claude skills and the shared brand context they read
├── to-dos/                    # Live task list: add as we go, delete when done
├── docs/                      # Shared knowledge, used by every project
│   ├── research/
│   │   ├── business-profile.md    # Company facts, products, brand
│   │   ├── online-presence.md     # Instagram, Facebook, other channels
│   │   ├── reel-analysis.md       # Breakdown of the warehouse location reel
│   │   ├── competitors.md         # ZewGrags72, Wing999, Retro Vintage, SPS
│   │   ├── july-carousel.md       # The client's own July 2026 stock carousel
│   │   └── claude-skills.md       # Public Claude skills worth installing
│   ├── strategy/
│   │   ├── assessment.md          # Strengths and weaknesses
│   │   ├── brand-direction.md     # Positioning, personality, audience
│   │   └── roadmap.md             # Recommended next steps, in priority order
│   └── client/
│       ├── open-questions.md      # Questions for the client
│       └── decisions.md           # Confirmed answers and decisions log
├── assets/                    # Shared source files from the client
│   ├── brand/                     # Official logo files
│   ├── photos/                    # Warehouse, bale, and container photos
│   ├── screenshots/               # Instagram, Facebook, Maps, competitor captures
│   └── video/                     # Reels and raw footage
└── projects/                  # One folder per workstream
    ├── stock-drop/                # Monthly Instagram stock carousel
    ├── website/                   # Webflow site scope
    └── social/                    # Reels, posts, captions
```

Each project folder has its own `README.md` with its status, brief, and layout. Open tasks for every project live in [to-dos/](to-dos/README.md).

## Projects

| Project | Status | Start here |
| :- | :- | :- |
| Stock Drop carousel | October 2026 built; final checks open | [projects/stock-drop](projects/stock-drop/README.md) |
| Website | Draft scope, not confirmed | [projects/website](projects/website/README.md) |
| Social content | Not started | [projects/social](projects/social/README.md) |

## Conventions

- **File names:** lowercase kebab-case (`brand-direction.md`, `ig-profile-2026-10.png`).
- **Dated files:** prefix with an ISO date when order matters (`2026-10-stock-drop.png`).
- **Unverified facts:** mark them **[unverified]** inline. Move them to [decisions.md](docs/client/decisions.md) once the client confirms them.
- **Unknown values:** use placeholders like `[PRICE TBC]`. Never invent prices, ratings, shipping countries, or stats.
- **Where files go:** a file used by more than one project goes in `docs/` or `assets/`. A file used by one project goes in that project's folder.
- **Single source of truth:** every fact lives in one doc. Other docs link to it instead of repeating it.

## Source

Built from the research handoff (Google Doc, *RETRO_REVIVAL_HANDOFF.md*, Oct 2026). The research drew on screenshots, a screen-recorded reel, and web search.
