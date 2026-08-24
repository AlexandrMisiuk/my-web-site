# Architectural Decisions

This document records the key architectural choices, technical decisions, and trade-offs made across the portfolio codebase.

## Key Decisions

### 1. Tailwind CSS v4 CSS-First Configuration

- **Decision**: Adopt Tailwind CSS v4 with `@tailwindcss/vite` and CSS-first `@theme` token definitions in `src/styles/index.css`.
- **Rationale**: Eliminates configuration overhead (`tailwind.config.js`, PostCSS configs), unifies token declarations with standard CSS variables, and enables lightning-fast compilation with Vite.

### 2. Session-Only Color Scheme Override

- **Decision**: Theme is derived from system preferences (`prefers-color-scheme`) on initial paint and can be manually toggled per session without saving to `localStorage` or cookies.
- **Rationale**: Honors OS settings seamlessly on every visit, avoids outdated stored states across devices, and prevents theme flash before first paint via an inline head script.

### 3. Type-Safe Data Layer over CMS/JSON

- **Decision**: Keep portfolio data in strongly typed TypeScript files (`src/data/`) rather than an external CMS or dynamic runtime JSON.
- **Rationale**: Zero API latency, full compile-time validation, automatic tree-shaking, and trivial editing ergonomics for a personal portfolio.

### 4. Zero External UI & State Libraries

- **Decision**: Avoid component frameworks (shadcn, MUI, Chakra) and state managers (Redux, Zustand).
- **Rationale**: Preserves micro-bundle footprint (< 100 kB gzipped), enforces bespoke design craft tailored to Oleksandr Misiuk's profile, and avoids dependency rot.

### 5. Native CSS Motion & Progressive Scroll Enhancement

- **Decision**: Use native CSS animations and `animation-timeline: view()` guarded by `@supports`, backed by `prefers-reduced-motion`.
- **Rationale**: Zero JavaScript animation overhead, runs off the main thread, and gracefully degrades to instant visibility on unsupported browsers or when reduced motion is preferred.

### 6. Strict Flat ESLint 9 + JSX A11y

- **Decision**: Standardize on flat `eslint.config.js` with TypeScript-ESLint, React Hooks, and JSX A11y rules.
- **Rationale**: Ensures accessible DOM structure and strict TypeScript best practices across all components from day one.
