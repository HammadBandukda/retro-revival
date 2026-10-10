# Retro Revival Thailand

Research, strategy, and website planning for **Retro Revival Co. Ltd.**, a B2B vintage clothing wholesaler in Lat Krabang, Bangkok. It sells sealed, pre-sorted bales to resellers in Thailand and overseas.

**Status:** research phase. The final deliverable (website, content plan, pitch, or a mix) is **not confirmed yet**. See [open questions](docs/client/open-questions.md).

## Structure

```
.
├── CLAUDE.md                  # Context and working rules for Claude Code sessions
├── docs/
│   ├── research/
│   │   ├── business-profile.md    # Company facts, products, brand
│   │   ├── online-presence.md     # Instagram, Facebook, other channels
│   │   ├── reel-analysis.md       # Breakdown of the warehouse location reel
│   │   └── competitors.md         # ZewGrags72, Wing999, Retro Vintage, SPS
│   ├── strategy/
│   │   ├── assessment.md          # Strengths and weaknesses
│   │   └── roadmap.md             # Recommended next steps, in priority order
│   ├── website/
│   │   └── scope.md               # Website scope draft (pending client sign-off)
│   └── client/
│       ├── open-questions.md      # Questions for the client
│       └── decisions.md           # Confirmed answers and decisions log
├── assets/                    # Source material from the client and research
│   ├── brand/                     # Logo files, palette
│   ├── screenshots/               # Instagram, Facebook, Maps, competitor captures
│   ├── photos/                    # Warehouse, bale, and container photos
│   └── video/                     # Reels and raw footage
└── content/                   # Produced deliverables
    ├── stock-lists/               # Weekly "Ready to Ship" bale lists
    └── social/                    # Post and reel drafts, captions, subtitles
```

## Conventions

- **File names:** lowercase kebab-case (`weekly-stock-list.md`, `ig-profile-2026-10.png`).
- **Dated files:** prefix with an ISO date when order matters (`2026-10-12-stock-list.png`).
- **Unverified facts:** mark them **[unverified]** inline. Move them to [decisions.md](docs/client/decisions.md) once the client confirms them.
- **Unknown values:** use placeholders like `[PRICE TBC]`. Never invent prices, ratings, shipping countries, or stats.
- **Single source of truth:** every fact lives in one doc. Other docs link to it instead of repeating it.

## Source

Built from the research handoff (Google Doc, *RETRO_REVIVAL_HANDOFF.md*, Oct 2026). The research drew on screenshots, a screen-recorded reel, and web search.
