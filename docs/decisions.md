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

### 10. Shared `Container` Grid Primitive

- **Decision**: Centralize max-width (`80rem`), responsive gutters (`px-5 sm:px-8 lg:px-12 xl:px-16`), and optional 12-column grid (`lg:grid lg:grid-cols-12 lg:gap-x-6 xl:gap-x-8`) into a polymorphic `Container` component (`src/components/layout/Container.tsx`).
- **Rationale**: Eliminates duplicated breakpoint measurements across `Header`, `Section`, and `Footer`, guarantees identical horizontal alignment across all viewport sizes, and provides an ergonomic container interface.

### 11. Full-Screen Overlay Mobile Navigation

- **Decision**: Implement `MobileNav` as a full-screen overlay disclosure beneath the sticky header with focus trap, Escape-to-close, body scroll lock with cleanup restoration, and auto-closing on expanding beyond `md` (768px).
- **Rationale**: Maximizes touch ergonomics on mobile devices with large (≥ 44×44px) tap targets, satisfies accessibility requirements for keyboard and screen-reader users, and avoids layout shifts or pushed content.

### 12. Single-`IntersectionObserver` Scroll-Spy Keyed to CSS Variables

- **Decision**: Drive active section state with a single `IntersectionObserver` in `useActiveSection` attached to `SECTION_IDS`, computing the top root margin from `--header-height` (`getComputedStyle` with fallback) and `-55%` bottom margin.
- **Rationale**: Avoids continuous scroll event listeners and layout recalculations, synchronizes `aria-current` across navigation links, and adapts automatically to fluid header heights.

### 13. Vitest 4 over Jest

- **Decision**: Use Vitest 4 as the unit runner.
- **Rationale**: Reuses the Vite 8 pipeline, `@/*` alias, and Oxc transform. `vitest@4.1.11` peer-supports `vite@^8`.

### 14. Vitest Config Colocated in `vite.config.ts`

- **Decision**: Import `defineConfig` from `vitest/config` and keep the `test` block next to the Vite config.
- **Rationale**: One alias definition, no parallel build config. Vite ignores `test` during production builds.

### 15. jsdom + React Testing Library over Browser Mode

- **Decision**: Run the unit tier in jsdom with Testing Library, not Vitest Browser Mode.
- **Rationale**: Fast, dependency-light, well-understood. DOM-API gaps are covered by centralized doubles in `src/test/`.

### 16. Explicit Vitest Imports over `globals: true`

- **Decision**: Import `describe` / `it` / `expect` from `vitest` in every test file.
- **Rationale**: Keeps the ESLint flat config free of injected globals and keeps test intent explicit.

### 17. Playwright Against the Production Preview Build

- **Decision**: Playwright `webServer` runs `npm run build && npm run preview`.
- **Rationale**: E2E validates the shipped artifact, including the inline pre-paint theme script in `index.html`.

### 18. Viewport Projects over Per-Test Resizing

- **Decision**: Three Chromium projects at 320 / 768 / 1440 rather than resizing inside individual tests.
- **Rationale**: Clean, parallel coverage across mobile, tablet, and desktop breakpoints (including narrow-viewport overflow in concern #4).

### 19. Automated axe-core Accessibility Gate

- **Decision**: `@axe-core/playwright` scans WCAG 2.0/2.1 A + AA in both themes, including the open mobile-nav dialog.
- **Rationale**: Makes the WCAG AA commitment in `AGENTS.md` executable rather than aspirational. Decorative `aria-hidden` nodes are excluded from contrast so the scan stays honest.

### 20. 100% Unit Coverage as a Failing Gate

- **Decision**: V8 thresholds of 100 on lines, statements, functions, and branches, with `coverage.include` covering every runtime module under `src/` and a short, justified exclusion list.
- **Rationale**: Affordable because the codebase is small, and it makes the TDD mandate mechanically enforceable via `npm run test:coverage` inside `verify`.

### 21. Test-Driven Development Mandated for All Future Work

- **Decision**: Red / green / refactor is the required workflow, recorded in `AGENTS.md` and `README.md` rather than enforced by hooks.
- **Rationale**: CI is out of scope. The coverage gate is the practical backstop: untested production code cannot pass `verify`.

### 22. Dedicated `docs/testing.md`

- **Decision**: Testing gets its own document instead of growing `architecture.md`.
- **Rationale**: It now spans two runners, a harness, a coverage policy, and a workflow mandate. The other `docs/` files link to it rather than duplicating it.

### 23. No Visual Regression, No CI Yet

- **Decision**: Do not add `toHaveScreenshot()` baselines or a `.github/` workflow in this change.
- **Rationale**: Visual snapshots are high-maintenance and font-rendering flaky. CI was explicitly deferred; local scripts and `verify` are the gate for now.

### 24. Section Encapsulation vs. Composition

- **Decision**: Retain `Section` as the structural layout container in `App.tsx` and encapsulate presentational components (`Hero`, `SelectedWork`) inside section children.
- **Rationale**: Preserves uniform layout grid alignment, section IDs, scroll anchors, and `IntersectionObserver` scroll-spy registration without duplicating section headers.

### 25. CLS-Safe Media Container with Aspect Ratio Wrapping

- **Decision**: Wrap project media previews in `ProjectCard` inside fixed aspect-ratio containers (`aspect-[16/10] sm:aspect-[16/9]`) and enforce `width`, `height`, `loading="lazy"`, and `decoding="async"` on all images/videos.
- **Rationale**: Prevents Cumulative Layout Shift (CLS) as assets load over the network and guarantees visual alignment across project cards.

### 26. Graceful Empty State for Project Showcase

- **Decision**: Provide an explicit empty state branch in `SelectedWork` when `projects.length === 0`.
- **Rationale**: Prevents awkward layout gaps if projects are temporarily unpopulated or filtered, and provides an accessible, testable UI fallback.

### 27. Purely Presentational Section Components with Data Injections

- **Decision**: Design `Hero` and `SelectedWork` to accept optional props (`profile?: SiteProfile`, `projects?: readonly Project[]`) defaulted to imports from `@/data`.
- **Rationale**: Enables frictionless consumption in `App.tsx` while facilitating isolated unit testing for edge cases and permutations.

### 28. Reusable `StatusPill` UI Primitive

- **Decision**: Extract availability status indicators and project phase badges into a dedicated, reusable `StatusPill` primitive (`src/components/ui/StatusPill.tsx`) with color variants (`emerald`, `amber`, `accent`, `muted`), background variants (`canvas`, `surface`), size variants (`sm`, `md`), and optional ping animation (`pulse`).
- **Rationale**: Eliminates CSS duplication between `Hero` and `ProjectCard`, standardizes font metrics and dot indicator dimensions, encapsulates status animation and reduced-motion fallbacks, and keeps presentational section components clean and declarative.

### 29. Theme-Aware SVG Favicon

- **Decision**: Provide `public/favicon.svg` as the primary site favicon with embedded CSS `@media (prefers-color-scheme: dark)` styling and update `index.html` to reference `href="/favicon.svg"`.
- **Rationale**: Eliminates raster scaling artifacts across high-DPI viewports, matches the monogram geometry from the brand assets, and dynamically adjusts canvas background and ink foreground to the user's OS color scheme.

### 30. Presentational Section Decoupling with Data Injections & Empty Fallbacks

- **Decision**: Implement `HowIWork`, `About`, `Technologies`, and `Contact` section components accepting optional typed props defaulted to imports from `src/data/`, with accessible empty-state fallbacks.
- **Rationale**: Keeps all section components purely presentational and decoupled from runtime state, allowing frictionless consumption in `App.tsx` and deterministic unit testing across mock data fixtures and edge cases.

### 31. Semantic Monospace Technology Chips

- **Decision**: Render the `Technologies` skill matrix as a semantic `<ul>`/`<li>` list of `Tag` components with JetBrains Mono styling, wrapping cleanly at all screen widths without proficiency meters, percentages, or third-party logos.
- **Rationale**: Conforms to the editorial, low-temperature aesthetic while preserving proper accessibility tree semantics for assistive technologies.

### 32. Resilient Contact Action Dispatcher

- **Decision**: Implement `Contact` using `ActionLink` with self-contained SVG icon primitives (`MailIcon`, `LinkedInIcon`, `GitHubIcon`, `DocumentIcon`) and conditional omission of unpopulated links.
- **Rationale**: Ensures interactive touch targets satisfy the 44×44px accessibility threshold, provides screen reader cues for external tabs (`(opens in a new tab)`), handles direct CV downloads, and eliminates broken `#` anchor tags.

### 33. Decoupling Unit Tests from Data Layer Content and Real Network/API Calls

- **Decision**: Unit tests must run completely hermetically in jsdom without making real network or API calls, and must not import runtime data from `@/data` or assert on literal portfolio copy or links. Tests supply isolated mock fixtures or test props directly to components and hooks.
- **Rationale**: Prevents edits to personal bio, project showcases, skills, or contact links in `src/data/` from breaking unit test suites or causing false regressions, while ensuring tests remain fast, deterministic, and isolated.

### 34. Full-Bleed Section Background Composition & `SectionBackground` Helper

- **Decision**: Provide `Section` with an optional `background?: React.ReactNode` slot rendered inside a decorative full-bleed wrapper (`absolute inset-0 -z-10 overflow-hidden pointer-events-none aria-hidden="true"`) with `relative isolate` applied to `<section>` when the slot is populated. Export `SectionBackground` from `src/components/layout/SectionBackground.tsx` for dual theme images (`dark:hidden` / `hidden dark:block`), `priority` loading control (`loading="eager"`, `fetchPriority="high"`, `decoding="async"`), and contrast gradient scrim overlay. Hero background assets are composed at the root in `App.tsx`.
- **Rationale**: Preserves the structural landmark role of `Section` without introducing complex multi-attribute config objects, and avoids clipping focus rings or `.reveal` translate animations by keeping `overflow-hidden` scoped exclusively to the decorative wrapper. Hero component remains purely presentational and free of asset dependencies. Dual-image CSS visibility switching synchronizes immediately with `[data-theme]` without runtime JavaScript state or re-render flashes.

### 35. Streamlined Header Action Area without CV ActionLink

- **Decision**: Remove the CV `ActionLink` button from the sticky `Header` actions container and the `MobileNav` navigation overlay, keeping only the `ThemeToggle` and mobile menu trigger button (`md:hidden`) in the header and primary section navigation in the mobile overlay, while retaining CV download links in dedicated contact surfaces (`Contact`, `Footer`).
- **Rationale**: Streamlines persistent navigation headers and overlays to primary section navigation and theme switching without visual clutter or redundant action links, while preserving CV access in appropriate context sections (`Contact`, `Footer`).

### 36. Header Brand Identity SVG Asset

- **Decision**: Render the SVG brand logo (`src/assets/brand-logo.svg`) inside the `#hero` anchor in `Header` with `aria-label={profile.name}` and decorative `alt=""` on the `<img>` tag with explicit `32x32px` dimensions.
- **Rationale**: Replaces plain text brand name with vector monogram asset to reinforce visual identity while preserving accessible naming for assistive technologies and preventing Cumulative Layout Shift (CLS).

### 37. Default Monospace Typography with Proportional Sans-Serif Fallback

- **Decision**: Configure `--font-mono` (`JetBrains Mono Variable`) as the global default typography applied to `body` in `@layer base` within `src/styles/index.css`, establish `--font-sans` (`Instrument Sans Variable` / system sans-serif stack) strictly as a fallback within the `--font-mono` token definition, and eliminate explicit `font-sans` overrides from `SectionHeader`.
- **Rationale**: Establishes a cohesive editorial monospace identity across all headers, body prose, navigation elements, and UI controls. Retaining `Instrument Sans Variable` in the fallback chain ensures graceful visual degradation without layout shifts if variable monospace font loading is interrupted.

### 38. Interactive TerminalWindow UI Primitive with GSAP Typewriter Animation and Theme-Dependent Token Theming

- **Decision**: Implement a decoupled, reusable `TerminalWindow` primitive (`src/components/ui/TerminalWindow.tsx`) powered by GSAP (`gsap` and `@gsap/react` `useGSAP`), featuring macOS-style window chrome (red `#ff5f56`, yellow `#ffbd2e`, green `#27c93f` controls), optional title (`Terminal - ${title}` with fallback to `Terminal`), dynamic bash prompt (`alex@${profile.role} ~ %`), typewriter text animation, and blinking cursor, styled with semantic Tailwind CSS v4 design tokens (`bg-surface`, `bg-canvas/60`, `border-hairline`, `text-ink`, `text-accent`) that dynamically adapt across light and dark modes.
- **Rationale**: Replaces the static profile statement with an engaging retro-modern terminal display while preserving atomic modularity, WCAG AA contrast across themes, automatic animation lifecycle cleanup in React via `@gsap/react`, and instantaneous rendering when reduced motion is preferred (`prefers-reduced-motion`).

### 39. Hero Section Monospace Focus and Asset Streamlining

- **Decision**: Remove the decorative full-bleed background images (`hero-light.jpeg` and `hero-dark.jpeg`) and `SectionBackground` composition from the Hero section in `src/App.tsx`, rendering `<Section id="hero" variant="plain"><Hero /></Section>` without background imagery.
- **Rationale**: Eliminates ~1.37MB of uncompressed raster image assets from the build output, reduces above-the-fold network payload and Largest Contentful Paint (LCP) overhead, and establishes immediate, distraction-free visual focus on the terminal window, status pill, and typography.

### 40. Removal of Numeric Section Indexing

- **Decision**: Remove numeric index prefixes (`'01'`, `'02'`, etc.) from `NavItem` data contracts, desktop `Header`, fullscreen `MobileNav`, `SectionHeader`, and `Section` component props, simplifying `SectionHeader` to render a top hairline rule divider and `<h2>` heading.
- **Rationale**: Eliminates redundant visual repetition (such as "01 / Selected Work" rendered immediately above "Selected Work"), streamlines the `Section` and `SectionHeader` component APIs, and creates a cleaner, editorial typographic aesthetic across navigation and section landmarks.

### 41. Thinner Fluid Section Padding and Full-Viewport Section Minimum Height

- **Decision**: Update the fluid `--spacing-section` token in `@theme` to `clamp(2.5rem, 1.5rem + 3.5vw, 5rem)`, introduce `--section-min-height: calc(100dvh - var(--header-height))`, apply `min-h-(--section-min-height) flex flex-col` to the `Section` primitive, apply `justify-center` specifically to the Hero section while letting other sections default to top alignment, and remove redundant nested vertical padding (`py-12 sm:py-20 lg:py-28`) from `Hero`.
- **Rationale**: Replaces excessive 10rem section padding with a compact 5rem maximum ceiling while ensuring every `<section>` occupies at least the full visible viewport height minus the header bar on desktop/tablet devices. Hero is vertically centered cleanly above the fold, content in subsequent sections aligns naturally to the top with consistent vertical rhythm, and taller sections expand without clipping.

### 42. Hero Heading Hierarchy Scale and Decoupled Static Terminal Prompt

- **Decision**: Scale down the primary `<h1>` heading in `Hero` from `text-display` to a balanced fluid scale (`text-4xl sm:text-5xl lg:text-6xl`), introduce a conditional semantic `<h2>` heading displaying `profile.role` (`text-lead sm:text-h3 text-ink-muted font-mono font-medium tracking-tight`), and pass a static `prompt="alex ~ %"` to `TerminalWindow` rather than dynamically interpolating `profile.role`.
- **Rationale**: Refines the above-the-fold typographic hierarchy, improves editorial readability on desktop and mobile viewports, establishes a proper document heading outline for screen readers (`<h1>` author name followed by `<h2>` professional title), and eliminates redundant repetition of the role string between the heading and terminal prompt.

### 43. Removal of Principle Card Index Badges

- **Decision**: Remove numeric index badges (`'01'`, `'02'`, etc.) from principle cards in `HowIWork.tsx` and streamline mapping callback signature to `(principle)`.
- **Rationale**: Creates a consistent, uncluttered editorial aesthetic across portfolio cards and sections, eliminating redundant visual index clutter and focusing attention directly on principle titles and descriptions.
