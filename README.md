# gta6-trophy-guide-01

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Dandelion-sys/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Dandelion-sys/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Leonida Ledger is an offline, open-source guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI: a checklist saved in your browser with export and import, filters by kind and grade, a spoiler setting that hides story trophies until you earn them, a three-step roadmap to the platinum, the one missable trophy flagged with its warning, and a guide to every trophy written in our own words with its sources named beside it.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. No build step and no network: every file the app loads ships under `app/`, and your progress lives in localStorage. Add `?demo=1` to the URL to preview it with 13 trophies already earned, or `?spoilers=off` to reveal the story trophies.

## What is inside

- `app/index.html` — the guide: roadmap, missable warning, filters, trophy list, sources.
- `app/app.js` — the tracker: localStorage progress, per-trophy notes, export/import, search, kind and grade filters, spoiler mode.
- `app/style.css` — the look: a dark Vice City sunset theme, no Rockstar artwork.
- `app/data/trophies.json` — all 55 official trophies with their names, descriptions, grades, guides and cited sources.
- `screenshots/` — four real renders of the app in Chromium.

## Sources

Names, descriptions and grades are the official PlayStation 5 list as published on 18 November 2026. The guides draw on the PowerPyx trophy guide and roadmap, the PowerPyx 100% completion checklist, the Exophase trophy list, PSNProfiles and GTABase, and name them beside each trophy. Two trophies (Bad Luck, I Guess and Ten Pin) were still unsolved by every source on launch day, 19 November 2026, and their guides say so instead of guessing. The hidden-trophy flags follow the PSN list as published (28 hidden, including the 12 story trophies).

---

<sub>Entered on [make.fun](https://make.fun/?ref=9y382syd&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
