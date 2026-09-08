# Centralize agent plans in `docs/plans/`

## Context

Plans are currently scattered per-agent. Junie writes to `.junie/plans/` (25 files, all committed). Claude Code writes to `~/.claude/plans/` with random slugs (`giggly-dancing-iverson.md`) — outside the repo, never committed, unfindable later. Neither `README.md` nor `AGENTS.md` mentions plans at all, so nothing tells a new agent where a plan belongs.

Outcome: one canonical, ordered, committed plan archive at `docs/plans/`, named `<NNN>-<task-title>.md`. Each agent keeps its own native plan mode untouched — the rule is only that a **copy** of the approved plan lands in `docs/plans/` as the first implementation step.

## Changes

### 1. Create `docs/plans/` and copy the 27 existing plans

Copy (not move) all 25 files from `.junie/plans/` plus the 2 Claude plans from `~/.claude/plans/`, renamed to `<NNN>-<slug>.md`. Numbering is chronological by first-commit date (`git log --diff-filter=A --format=%aI -1 -- <file>`), zero-padded to 3 digits so lexical sort = chronological sort. Existing slugs are preserved verbatim; only the two Claude files get real names (their current slugs are auto-generated nonsense).

| # | Source | Date |
|---|---|---|
| 001 | `personal-landing-portfolio-mvp.md` | 08-24 |
| 002 | `deliver-step-1-scaffold-toolchain.md` | 08-24 |
| 003 | `step-2-design-tokens-theme-primitives.md` | 08-25 |
| 004 | `step-3-typed-content-data-layer.md` | 08-25 |
| 005 | `layout-shell-and-navigation.md` | 08-26 |
| 006 | `add-unit-and-e2e-testing.md` | 08-26 |
| 007 | `deliver-step-5-hero-and-selected-work.md` | 08-28 |
| 008 | `implement-step-6-remaining-sections.md` | 08-28 |
| 009 | `hero-background-images.md` | 08-29 |
| 010 | `remove-index-rail.md` | 08-29 |
| 011 | `remove-cv-actionlink-from-header.md` | 08-29 |
| 012 | `update-header-brand-logo.md` | 08-30 |
| 013 | `default-mono-typography.md` | 08-30 |
| 014 | `extract-section-background-component.md` | 08-30 |
| 015 | `hero-terminal-typewriter-gsap.md` | 08-30 |
| 016 | `remove-hero-section-background.md` | 08-30 |
| 017 | `remove-section-indexes.md` | 08-30 |
| 018 | `reduce-section-paddings-and-set-viewport-min-height.md` | 08-30 |
| 019 | `remove-mobile-nav-cv-button.md` | 08-30 |
| 020 | `hero-heading-scale-and-terminal-prompt.md` | 09-01 |
| 021 | `update-project-external-link-label.md` | 09-01 |
| 022 | `remove-how-i-work-indexes.md` | 09-01 |
| 023 | `redesign-technologies-section-with-visual-cards.md` | 09-01 |
| 024 | `refactor-contact-section.md` | 09-01 |
| 025 | `install-vercel-analytics.md` | 09-06 |
| 026 | `~/.claude/plans/i-m-currently-have-two-tingly-balloon.md` → `026-unify-about-and-contact-cards.md` | 09-06 |
| 027 | `~/.claude/plans/giggly-dancing-iverson.md` → `027-animated-environment-day-night-scene.md` | 09-06 |

File contents are copied byte-for-byte; the Junie `sessionId` front matter stays as-is.

### 2. Untrack `.junie/plans/` and ignore it

- `git rm -r --cached .junie/plans` — stops tracking, leaves the files on disk so Junie keeps working as before.
- `.gitignore`, under the existing `# Agents` block: add `.junie/plans/` and `.claude/plans/` (the second guards against a future project-local Claude plan dir).

### 3. `AGENTS.md` — new "Plan Governance (`docs/plans/`)" section

Placed immediately before the existing `## Documentation Governance (docs/)` section. Content:

- `docs/plans/` is the single, canonical home for every implementation plan, regardless of which agent produced it.
- Agent-native plan directories (`~/.claude/plans/`, `.junie/plans/`) are **scratch only** — git-ignored, never the source of truth. Agents keep their default plan mode behavior; no agent config changes.
- **Mandatory rule**: once a plan is approved, the *first* implementation step is to write a copy to `docs/plans/<NNN>-<task-title>.md` before any production code changes.
- Naming: `<NNN>` is the next free 3-digit number (see the lookup command in step 5); `<task-title>` is a short kebab-case description of the task.
- Plans are append-only history: never renumber or delete an existing plan. If a plan changes materially mid-flight, update that same file.

Also add `docs/plans/` to the file list in the existing Documentation Governance bullet list.

### 4. `README.md` — surface the folder

- Project Structure tree (line ~21): add `│   └── plans/              # Implementation plans, one per task, numbered` under `docs/`.
- Documentation section (line ~88-91): add `- [docs/plans/](docs/plans/) — numbered implementation plans, one file per task.`

Keep both edits Prettier-clean (`tabWidth: 4`, `printWidth: 120`) — `README.md` and `AGENTS.md` are *not* in `.prettierignore`, though `docs/` is, so the copied plan files themselves are exempt.

### 5. Retention: `docs/plans/archive/`

Added after the initial approval, on user request.

- `docs/plans/archive/` (kept in git via `.gitkeep`) holds retired plans.
- **Agents must ignore `archive/` by default** — no reading, searching, indexing, or citing archived plans while working on a task. It is historical record; open a file there only when the user points at it explicitly.
- **Archiving is user-initiated only.** An agent never moves a plan to `archive/` on its own judgment, however stale or superseded the plan looks.
- Archived plans keep their original `<NNN>-<task-title>.md` name and their numbers are never reused, so the "next free number" lookup scans both directories:
  `ls docs/plans docs/plans/archive | grep -oE '^[0-9]{3}' | sort -n | tail -1`
- First retention pass: plans `001`–`020` moved into `archive/`, leaving `021`–`027` active.

Both policy bullets live in the AGENTS.md Plan Governance section; README.md carries the short form in the structure tree, Development Guidelines bullet 5, and the Documentation list.

## Verification

```bash
ls docs/plans docs/plans/archive           # 021…027 active, 001…020 archived, 27 total
git status --short                # 27 additions under docs/, 25 deletions under .junie/, .gitignore + 2 docs edits
git check-ignore .junie/plans/install-vercel-analytics.md   # prints the path = ignored
ls .junie/plans | wc -l           # still 25 on disk — Junie unaffected
npm run format:check              # README.md / AGENTS.md edits are Prettier-clean
```

No source, test, or build changes — the existing test and coverage gates are untouched by this task.
