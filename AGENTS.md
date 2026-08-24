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

## Documentation Governance (`docs/`)

The repository contains a dedicated `docs/` directory housing condensed, high-signal project documentation:

- `docs/architecture.md`: Architectural overview, data flow, component hierarchy, and file layout.
- `docs/decisions.md`: Architectural decisions, technical choices, and rationales.
- `docs/concerns.md`: Critical technical concerns, responsive/accessibility pitfalls, and performance guards.

### Mandatory Documentation Maintenance Rule

- **Read First**: Agents must review `docs/` before implementing or modifying architecture.
- **Synchronize Always**: Whenever new features, components, or logic are introduced, or existing logic is altered or refactored, agents **must** update the corresponding documentation in `docs/` (`architecture.md`, `decisions.md`, or `concerns.md`) to reflect the changes.

## Code Style & Standards

- **TypeScript**: Strict mode enabled. No `any` types. Provide explicit interfaces/types for data structures and component props.
- **Styling**: Tailwind CSS v4 CSS-first utility classes and `@theme` tokens. Avoid inline styles or legacy `tailwind.config.js`.
- **Formatting**: Adhere to Prettier configuration (`tabWidth: 4`, `printWidth: 120`, single quotes, trailing commas, Tailwind plugin).
- **Accessibility**: Semantic HTML landmarks (`<header>`, `<main>`, `<section>`, `<footer>`), valid heading hierarchy (`<h1>` unique, ordered `<h2>`/`<h3>`), keyboard navigation, visible `:focus-visible` rings, and WCAG AA contrast compliance.

## Quality Gates

Before concluding any implementation task, agents must run and verify that all quality gates pass with zero errors:

```bash
npm run typecheck      # tsc -b --noEmit (0 TypeScript errors)
npm run lint           # eslint . (0 errors, 0 warnings)
npm run format:check   # prettier --check . (clean formatting)
npm run build          # vite build (successful production bundle)
```
