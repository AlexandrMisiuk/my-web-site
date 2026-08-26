# Agent Guidelines & Operational Constraints

This document defines core architectural constraints, coding standards, quality gates, and documentation governance policies for AI coding agents working on Oleksandr Misiuk's portfolio website.

## Architectural Boundaries

1. **Static SPA Only**: The application is a static, single-page React application bundled via Vite. Do not introduce server-side frameworks (Next.js, Remix, Astro), server runtimes, backends, databases, CMS integrations, or authentication systems.
2. **Zero External UI & State Libraries**:
    - Do NOT introduce external UI component libraries (shadcn, Radix, MUI, Chakra, Headless UI, etc.) unless explicitly instructed by the user.
    - Do NOT introduce state management libraries (Redux, Zustand, MobX, Jotai) or animation libraries (Framer Motion, GSAP). State must remain minimal, leveraging React built-in hooks and native CSS animations.
    - Do NOT introduce third-party icon libraries (Lucide, React Icons, FontAwesome). Keep icons as small, self-contained SVG primitives in `src/components/ui/icons/` or `src/components/ui/`.
3. **Decoupled Data Layer**:
    - All portfolio content (personal details, project descriptions, principles, tech lists, contact links) must be structured inside `src/data/`.
    - UI components must remain purely presentational and consume data from `src/data/` modules.
    - Any unsupplied personal information or links must use empty strings and be conditionally omitted from the UI (never render empty `#` anchor links).
4. **Testing Stack**: Vitest 4 + jsdom + React Testing Library are the sanctioned unit/component tools. Playwright + `@axe-core/playwright` are the sanctioned e2e and accessibility-scanning tools. Do not introduce Jest, Cypress, Enzyme, Karma, or additional runners.

## Test-Driven Development (Mandatory)

All development from this point forward is test-driven. Write a failing test first (**red**), implement the minimum code to pass it (**green**), then **refactor** with the suite green.

- No production code may be added or changed without a test written beforehand. "Tests will follow later" is not permitted.
- Bug fixes start with a regression test that reproduces the bug and fails.
- **Unit-test coverage must remain at 100%** (lines, statements, functions, branches). `npm run test:coverage` enforces this and is part of `npm run verify`.
- Coverage exclusions are a closed set defined in `vite.config.ts`; adding one requires documented justification in `docs/testing.md`.
- Never lower a threshold, never add a blanket ignore, and never write assertion-free tests to inflate coverage.
- Read `docs/testing.md` before writing any test.

## Documentation Governance (`docs/`)

The repository contains a dedicated `docs/` directory housing condensed, high-signal project documentation:

- `docs/architecture.md`: Architectural overview, data flow, component hierarchy, and file layout.
- `docs/decisions.md`: Architectural decisions, technical choices, and rationales.
- `docs/concerns.md`: Critical technical concerns, responsive/accessibility pitfalls, and performance guards.
- `docs/testing.md`: Testing architecture, TDD workflow, coverage policy, harness API, and troubleshooting.

### Mandatory Documentation Maintenance Rule

- **Read First**: Agents must review `docs/` before implementing or modifying architecture.
- **Synchronize Always**: Whenever new features, components, or logic are introduced, or existing logic is altered or refactored, agents **must** update the corresponding documentation in `docs/` (`architecture.md`, `decisions.md`, `concerns.md`, or `testing.md`) to reflect the changes.

## Code Style & Standards

- **TypeScript**: Strict mode enabled. No `any` types. Provide explicit interfaces/types for data structures and component props.
- **Styling**: Tailwind CSS v4 CSS-first utility classes and `@theme` tokens. Avoid inline styles or legacy `tailwind.config.js`.
- **Formatting**: Adhere to Prettier configuration (`tabWidth: 4`, `printWidth: 120`, single quotes, trailing commas, Tailwind plugin).
- **Accessibility**: Semantic HTML landmarks (`<header>`, `<main>`, `<section>`, `<footer>`), valid heading hierarchy (`<h1>` unique, ordered `<h2>`/`<h3>`), keyboard navigation, visible `:focus-visible` rings, and WCAG AA contrast compliance.
- **Testing Standards**:
    - Unit tests are co-located as `*.test.ts(x)` beside the source module; e2e specs live in `e2e/`.
    - Query by accessible role and name (`getByRole`) before test IDs; never assert on Tailwind class strings.
    - Use `user-event` over raw `fireEvent` for interaction.
    - Browser API doubles come from `src/test/` — no inline `IntersectionObserver` or `matchMedia` mocks.
    - E2E uses web-first assertions and role locators; `page.waitForTimeout` is banned (enforced by `eslint-plugin-playwright`).
    - New behavior must ship with tests written first; new components need at least a render plus a11y-contract test.
    - Every new runtime module must reach 100% coverage in the same change that introduces it.

## Quality Gates

Before concluding any implementation task, agents must run and verify that all quality gates pass with zero errors:

```bash
npm run typecheck      # tsc -b --noEmit (0 TypeScript errors)
npm run lint           # eslint . (0 errors, 0 warnings)
npm run format:check   # prettier --check . (clean formatting)
npm run test:coverage  # vitest run --coverage (all unit tests green, 100% coverage)
npm run build          # vite build (successful production bundle)
npm run test:e2e       # playwright test (all e2e projects green)
```

`npm run verify` chains the non-e2e gates including the 100% coverage gate. `npm test` is the fast, threshold-free inner-loop variant. `npx playwright install chromium` is a one-time prerequisite for e2e.
