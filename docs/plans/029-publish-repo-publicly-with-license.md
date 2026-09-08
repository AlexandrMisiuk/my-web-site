# Publish MyWebSite as a public portfolio repo

## Context

The repo is currently private and deploys to Vercel on every push to `main`. Alex wants it public for
portfolio purposes, with two requirements: (1) nothing sensitive gets exposed that isn't already
public on the live site, and (2) a license that stops someone republishing his identity as their own
site.

The audit is done and the repo is clean. This plan covers the small set of files to add plus the
GitHub/Vercel settings to confirm before flipping visibility.

## Audit findings (complete — no blockers)

Checked: full working tree, all 80 commits across every branch, every file ever added in history.

**Clean:**

- No secrets. Regex sweep over all history for API keys, tokens, passwords, private keys, AWS/GitHub/Slack
  key formats: only false positives on Tailwind "design tokens".
- No env config to leak. Zero `.env` files, zero `import.meta.env` / `process.env` usage, no `vercel.json`,
  no `.vercel/` directory. A rogue build would find nothing.
- `.junie/mcp/mcp.json` — only the Chrome DevTools MCP command, no credentials.
- `.gitignore` already excludes `node_modules`, `dist`, `.idea`, `coverage`, `playwright-report`,
  `test-results`, and the agent skill/plan scratch dirs.
- `src/data/*` — everything there (name, email, LinkedIn, GitHub, bio, projects) already renders on the
  live site.
- `docs/` (architecture, decisions, concerns, 28 plans + archive) — purely technical. No employer-internal
  detail, no client names, no confidential material.
- Images carry no EXIF/GPS. `public/projects/zahara.png` is Zahara's marketing graphic with placeholder
  bars, not a real screenshot — no customer data.
- No absolute local paths committed.

**Decided, no action:** `public/cv/Oleksandr_Misiuk_CV.pdf` stays as-is (already downloadable from the
live site).

**Optional, Alex's call:** `src/data/README.md` has a stale code example showing
`status: 'Wrocław, Poland · open to new opportunities'`. The real `site.ts` says only
`'Open to new opportunities'`. The doc example is the only place the city appears.

## Changes

### 1. `LICENSE` (new) — verbatim MIT

Standard MIT text, unmodified so GitHub's detector shows the MIT badge:

```
MIT License

Copyright (c) 2026 Oleksandr Misiuk

Permission is hereby granted, free of charge, ... [standard MIT body]
```

### 2. `NOTICE.md` (new) — content carve-out

Short, plain-language. Covers:

- MIT applies to the **source code**: components, hooks, tests, config, styles.
- **Not** licensed for reuse — reserved, all rights: the name "Oleksandr Misiuk", the brand logo
  (`src/assets/brand-logo.svg`), biographical and contact prose (`src/data/about.ts`, `contact.ts`,
  `site.ts`, `principles.ts`), the CV (`public/cv/`), and project imagery (`public/projects/`).
- Third-party trademarks: the technology logos in `src/assets/tech/` are trademarks of their respective
  owners, included for identification only and not covered by this repo's license.
- One line on intent: fork the code, replace the content with your own.

### 3. `README.md` — two edits

- Add a **License** section near the bottom pointing at `LICENSE` and `NOTICE.md` (one short paragraph:
  code MIT, content reserved).
- Fix the typo on line 3: `Sofrware Engineer` → `Software Engineer`. First line a visitor reads.

### 4. `.gitignore` — one line

Add `.env*` under a `# Env` heading. Existing `*.local` catches `.env.local` but not `.env`. Cheap
insurance now that pushes are public.

## GitHub settings to confirm before going public

Not code — verify in the UI. From the ruleset screenshots, three settings will lock **you** out:

- **Add yourself (or the `Repository admin` role) to the ruleset Bypass list.** It is currently empty.
  This is the single change that resolves the lockouts below.
- **`Restrict updates` on `main` with an empty bypass** blocks every push and PR merge into `main`,
  including your own. Uncheck it, or rely on the bypass entry.
- **Required approvals: 1** — GitHub forbids self-approval, so as the only collaborator you can never
  satisfy it. Set to 0.
- **`Require code scanning results` (CodeQL)** needs CodeQL default setup actually enabled, or merges
  block forever. Free once the repo is public. **`Require code quality results`** is a Copilot preview
  feature with the same failure mode.
- **Keep:** `Restrict deletions`, `Block force pushes`, and
  `Pull requests → Creation allowed by: Collaborators only` (this last one is what prevents strangers
  opening PRs that would trigger Vercel preview builds).
- Rulesets are not enforced on private personal repos — they begin working the moment you go public.
- Optionally disable Issues if you don't want inbound noise.

Deployment is safe by construction: strangers get read access only, `main` is writable only by you, and
a fork deploys to its own URL — Vercel will not let a second project claim a domain already verified to
your account.

## Verification

```bash
npm run format:check   # new .md files must satisfy Prettier
npm run verify         # typecheck + lint + format + 100% coverage + build
git status             # confirm only LICENSE, NOTICE.md, README.md, .gitignore changed
```

Then, before flipping visibility, a last manual pass:

```bash
git log --all -p | grep -iE 'secret|password|api[_-]?key|BEGIN .*PRIVATE KEY'
```

After going public: confirm the repo page shows the **MIT** badge, open a throwaway PR from a second
account to confirm PR creation is blocked, and push a trivial commit to `main` to confirm the Vercel
deploy still fires (i.e. the ruleset didn't lock you out).
