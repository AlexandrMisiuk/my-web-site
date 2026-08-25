# Architectural Decisions

This document records the key architectural choices, technical decisions, and trade-offs made across the portfolio codebase.

## Key Decisions

### 1. Tailwind CSS v4 CSS-First Configuration

- **Decision**: Adopt Tailwind CSS v4 with `@tailwindcss/vite` and CSS-first `@theme` token definitions in `src/styles/index.css`.
- **Rationale**: Eliminates configuration overhead (`tailwind.config.js`, PostCSS configs), unifies token declarations with standard CSS variables, and enables lightning-fast compilation with Vite.

### 2. Semantic `data-theme` Theming & `sessionStorage` Persistence

- **Decision**: Apply dark/light theme overrides using `[data-theme="dark"]` DOM attributes on `document.documentElement` rather than styling classes. Persist manual user toggles in `sessionStorage` while new tabs/windows initialize from OS preferences (`prefers-color-scheme`).
- **Rationale**: Keeps HTML class names clean, separates state semantics from styling, preserves user intent across page reloads in the active tab without cross-tab/stale device contamination, and eliminates pre-paint theme flash via an inline `<head>` script.

### 3. Self-Hosted Variable Typography

- **Decision**: Bundle `@fontsource-variable/instrument-sans` and `@fontsource-variable/jetbrains-mono` locally through Vite.
- **Rationale**: Eliminates external font CDN roundtrips (Google Fonts), avoids layout shift (CLS), ensures offline/reliable font asset caching, and unlocks fluid variable weights across headings and mono tags.

### 4. Zero External UI & State Libraries (KISS Architecture)

- **Decision**: Avoid component frameworks (shadcn, Radix, MUI), external icon libraries (Lucide, FontAwesome), and third-party state managers (Redux, Zustand, RxJS).
- **Rationale**: Adheres strictly to KISS (Keep It Simple, Stupid). Preserves micro-bundle footprint (< 100 kB gzipped), keeps state management 100% native with standard React hooks (`useState` + `useEffect`), and delivers pixel-perfect accessible SVG primitives tailored to the editorial design.

### 5. Type-Safe Data Layer over CMS/JSON

- **Decision**: Keep portfolio data in strongly typed TypeScript files (`src/data/`) exposed through a barrel export (`src/data/index.ts`) rather than an external CMS or dynamic runtime JSON.
- **Rationale**: Zero API latency, full compile-time validation, automatic tree-shaking, and trivial editing ergonomics for a personal portfolio.

### 6. Empty String Omission Pattern for Contact Links

- **Decision**: Represent unsupplied personal contact links (GitHub, email, CV) as empty strings (`''`) paired with explicit `// TODO: replace` comments.
- **Rationale**: Distinguishes intentional empty states from undefined properties, allows quick searchability via grep, and gives presentational components a simple `Boolean(link)` condition to omit anchor tags without ever rendering broken `#` links.

### 7. Layout Stability via Mandatory Media Dimensions

- **Decision**: Mandate explicit `width` and `height` properties in the `ProjectMedia` contract.
- **Rationale**: Forces all project screenshots, mockups, and preview videos to declare intrinsic dimensions, preventing Cumulative Layout Shift (CLS) when assets load asynchronously.

### 8. Native CSS Motion & Progressive Scroll Enhancement

- **Decision**: Use native CSS animations and `animation-timeline: view()` guarded by `@supports`, backed by `prefers-reduced-motion`.
- **Rationale**: Zero JavaScript animation overhead, runs off the main thread, and gracefully degrades to instant visibility on unsupported browsers or when reduced motion is preferred.

### 9. Strict Flat ESLint 9 + JSX A11y

- **Decision**: Standardize on flat `eslint.config.js` with TypeScript-ESLint, React Hooks, and JSX A11y rules.
- **Rationale**: Ensures accessible DOM structure, semantic HTML landmarks, and strict TypeScript best practices across all components from day one.
