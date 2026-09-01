# Oleksandr Misiuk — Frontend Portfolio & Landing Page

Personal professional landing page and frontend portfolio for Oleksandr Misiuk, Sofrware Engineer. Designed and built with a static-first, high-craft editorial aesthetic emphasizing typography, responsiveness, accessibility, and performance.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Linting & Formatting**: ESLint 9 (flat config) + Prettier with `prettier-plugin-tailwindcss`
- **Testing**: Vitest 4 + jsdom + React Testing Library (unit/component), Playwright + axe-core (e2e and accessibility)

## Development Workflow

This repository follows **strict TDD**: write the failing test first, then the minimum code that makes it pass, then refactor. **Unit-test coverage is an enforced 100% gate** (`npm run test:coverage` is part of `npm run verify`). See [docs/testing.md](docs/testing.md) for the full workflow, coverage policy, and harness API.

## Project Structure

```
.
├── docs/
│   ├── architecture.md     # Architectural overview
│   ├── decisions.md        # Key technical decisions
│   ├── concerns.md         # Risks and mitigations
│   └── testing.md          # Testing architecture, TDD, coverage policy
├── e2e/                    # Playwright specs and axe fixture
├── public/
│   ├── cv/                 # Curated CV documents
│   ├── projects/           # Project assets
│   └── favicon.svg         # Site favicon
├── src/
│   ├── assets/             # Media and static graphics
│   ├── components/
│   │   ├── layout/         # Shell components (Header, MobileNav, Footer, Section)
│   │   ├── sections/       # Portfolio sections (Hero, SelectedWork, HowIWork, etc.)
│   │   └── ui/             # Reusable atomic UI primitives
│   ├── data/               # Type-safe content data modules
│   ├── hooks/              # Custom React hooks (theme, active section)
│   ├── styles/             # Global CSS and Tailwind design tokens
│   ├── test/               # Unit-test harness (setup, doubles, render helper)
│   ├── App.tsx             # Application root
│   ├── main.tsx            # Application entry point
│   └── vite-env.d.ts       # Vite TypeScript declarations
├── eslint.config.js        # ESLint 9 flat configuration
├── index.html              # Entry HTML with pre-paint script
├── package.json            # Scripts and dependencies
├── playwright.config.ts    # Playwright projects and preview webServer
├── tsconfig.app.json       # TypeScript app configuration with `@/*` aliases
├── tsconfig.e2e.json       # TypeScript project for e2e/ and playwright.config.ts
├── tsconfig.node.json      # TypeScript tooling configuration
└── vite.config.ts          # Vite + Vitest configuration
```

## Available Scripts

- `npm run dev`: Start Vite local development server with instant HMR.
- `npm run build`: Typecheck and build the production static bundle in `dist/`.
- `npm run preview`: Locally preview the production static build.
- `npm run lint`: Run ESLint across all TypeScript and React source files.
- `npm run format`: Format all files with Prettier.
- `npm run format:check`: Check repository formatting against Prettier rules.
- `npm run typecheck`: Run TypeScript compiler (`tsc -b --noEmit`) to verify types.
- `npm test`: Run the Vitest unit suite headlessly (no coverage thresholds).
- `npm run test:watch`: Interactive Vitest watch loop.
- `npm run test:coverage`: Run the unit suite with V8 coverage; fails below 100%.
- `npm run test:e2e`: Build the site, preview it, and run Playwright across 320 / 768 / 1440.
- `npm run test:e2e:ui`: Open the Playwright UI runner.
- `npm run verify`: Chain typecheck, lint, format:check, test:coverage, and build.

## Testing

Two tiers, documented in full in [docs/testing.md](docs/testing.md):

- **Unit / component** — Vitest 4 in jsdom with React Testing Library. Co-located `*.test.ts(x)` files. Browser APIs (`matchMedia`, `IntersectionObserver`) are driven from `src/test/`.
- **End-to-end** — Playwright against the real `vite build` + `vite preview` artifact. Three Chromium viewport projects (320 / 768 / 1440), WCAG 2.1 AA axe scans in both themes, and responsive overflow / tap-target guards.

Reports land in `coverage/` and `playwright-report/` (git-ignored). First e2e run needs `npx playwright install chromium`.

## Development Guidelines

1. **Test-Driven Development**: Write a failing test first. No production change ships without a prior test. Coverage must stay at 100%.
2. **Static-First & Lightweight**: Avoid unnecessary runtime dependencies, state libraries, or heavy external UI packages.
3. **Data-Driven Content**: Content, copy, and links reside in `src/data/` to keep presentation components cleanly decoupled from data.
4. **Quality Gates**: All commits and PRs must pass `npm run verify` (including `test:coverage` at 100%) and `npm run test:e2e`.

## Documentation

- [docs/architecture.md](docs/architecture.md) — system shape, data flow, component hierarchy.
- [docs/decisions.md](docs/decisions.md) — technical choices and rationales.
- [docs/concerns.md](docs/concerns.md) — risks, a11y/responsive pitfalls, performance guards.
- [docs/testing.md](docs/testing.md) — TDD mandate, two-tier architecture, coverage policy, harness API.
