# Architecture Overview

This document provides a condensed overview of the architecture, key concepts, and structure of Oleksandr Misiuk's portfolio website.

## Architectural Concepts

- **Static Single-Page Application (SPA)**: Zero backend, zero database, zero server runtimes. Bundled into static HTML, JS, and CSS chunks deployable to any static host (Cloudflare Pages, Vercel, Netlify, GitHub Pages).
- **Self-Hosted Variable Typography**: Self-hosted variable fonts `@fontsource-variable/instrument-sans` (proportional sans-serif) and `@fontsource-variable/jetbrains-mono` (monospace) bundled via Vite with zero external CDN dependencies or layout shifts.
- **CSS-First Design Tokens (Tailwind CSS v4)**: Theme tokens (cool ink & cobalt palette, fluid typography clamp scales, spacing rhythm, radius, header height) are declared via `@theme` in `src/styles/index.css`.
- **Zero-Flash `data-theme` Theming**: Initial color scheme (dark or light) is applied before first paint via an inline `<head>` script inspecting `sessionStorage.getItem('theme')` with OS `prefers-color-scheme` fallback. Theme overrides target `[data-theme="dark"]` on `document.documentElement` without modifying root class names.
- **Per-Tab Theme Persistence**: The user's manual color scheme choice is stored in `sessionStorage` (persisting across page reloads in the active tab), while new tabs or windows open cleanly with system defaults.
- **Unified Layout Grid Primitive (`Container`)**: A shared `layout/Container` primitive centralizes max-width (`80rem`), responsive gutters (`px-5 sm:px-8 lg:px-12 xl:px-16`), and optional 12-column grid (`lg:grid lg:grid-cols-12 lg:gap-x-6 xl:gap-x-8`) across `Header`, `Section`, and `Footer`.
- **Anchored Asymmetrical Sections (`Section`, `SectionBackground`, & `SectionHeader`)**: Every section standardizes vertical rhythm (`py-[var(--spacing-section)]`), scroll anchor offset (`scroll-mt-[var(--header-height)]`), and CSS `.reveal` animations. `Section` supports an optional full-bleed `background?: React.ReactNode` slot rendered in a decorative `aria-hidden="true"` wrapper with `relative isolate` and `-z-10`. `SectionBackground` provides a theme-aware dual-image helper with CSS switching (`dark:hidden` / `hidden dark:block`), priority loading controls, and a gradient scrim. Non-hero sections split into 3-column sticky headers (`Eyebrow` + index + hairline rule + `h2`) and 8-column content bodies.
- **Section Component Presentation (`Hero`, `SelectedWork`, `ProjectCard`, `HowIWork`, `About`, `Technologies`, `Contact`)**:
  - `Hero`: Renders above-the-fold profile statement, availability status indicator, and CTA links. Composed with `SectionBackground` in `App.tsx` for full-bleed theme-aware artwork (`hero-light-2026-08-30.jpeg` / `hero-dark-2026-08-30.jpeg`).
  - `SelectedWork`: Renders project case study articles (`ProjectCard`) with CLS-safe aspect ratio media containers, status pills, tech tags, and conditional action links with graceful empty-state handling.
  - `HowIWork`: Arranges 4 core engineering principles in an asymmetric responsive grid with mono indices, semantic `<h3>` titles, and body descriptions.
  - `About`: Renders biographical background paragraphs constrained to readable measure (`max-w-[62ch]`).
  - `Technologies`: Renders a compact semantic `<ul>` of mono `Tag` chips without proficiency bars, percentages, or external icons.
  - `Contact`: Renders closing statement ("Let's build something great."), status indicator, and interactive `ActionLink` CTAs (Email, LinkedIn, GitHub, CV) conditionally omitting unsupplied links.
- **Sticky Header with SVG Brand Identity (`Header`)**: Anchors top-level navigation with the SVG brand logo (`src/assets/brand-logo.svg`) linked to `#hero` and labeled via `aria-label={profile.name}` with explicit dimensions to prevent CLS, desktop navigation links with active indicator underlines driven by `useActiveSection`, `ThemeToggle`, and the mobile menu disclosure button.
- **Single-IntersectionObserver Scroll-Spy (`useActiveSection`)**: Exactly one `IntersectionObserver` instance watches `SECTION_IDS`, dynamically calculating its top root margin from the `--header-height` CSS token. It drives `aria-current` in header/mobile navigation.
- **Accessible Full-Screen Mobile Disclosure (`MobileNav`)**: Below the `md` (768px) breakpoint, a 44×44px hamburger trigger opens a full-screen overlay with focus trapping, Escape-to-close, body scroll lock with cleanup restoration, and auto-close upon expanding beyond `md`.
- **First-Class Accessibility & Keyboard Landmarks**: `SkipLink` provides the first keyboard tab stop to `#main`. Landmarks (`header`, `nav`, `main`, `section`, `footer`), single `h1`, ordered `h2`s with `aria-labelledby`, and visible `:focus-visible` rings across both light and dark themes ensure WCAG AA compliance.
- **Bespoke Atomic UI Primitives & SVG Icons**: Handcrafted, accessible UI primitives (`ActionLink`, `Tag`, `Eyebrow`, `StatusPill`) and self-contained SVG icons (`SunIcon`, `MoonIcon`, `MenuIcon`, `CloseIcon`, `ArrowUpRightIcon`, `ArrowRightIcon`, `GitHubIcon`, `LinkedInIcon`, `MailIcon`, `DocumentIcon`) eliminating heavy external icon or UI libraries.
- **Decoupled Data Layer**: All portfolio content (personal profile, navigation items, projects, principles, technologies, about text) is structured as type-safe TypeScript modules in `src/data/`. Components remain strictly presentational and consume data via `@/data`.
- **Empty String Omission Pattern**: Unsupplied contact or social links use empty strings (`''`) with `// TODO: replace` comments, enabling presentational components to conditionally omit anchor tags rather than rendering broken `#` links.
- **Native Scroll & Animation**: Scroll reveals leverage CSS scroll-driven animations (`animation-timeline: view()`) gated behind `@supports` with full `prefers-reduced-motion` fallbacks.
- **Two-Tier Testing Architecture**: Vitest 4 + jsdom + React Testing Library share the Vite pipeline for unit/component tests; Playwright exercises the built artifact via `vite preview` across 320 / 768 / 1440. Detail lives in `docs/testing.md`.
- **Centralized Browser API Doubles**: `src/test/` owns controllable `matchMedia` and `IntersectionObserver` fakes so unit tests drive intersections and media-query changes instead of asserting on mock internals.
- **Accessibility-as-a-Gate**: `@axe-core/playwright` runs WCAG 2.1 AA scans in both color schemes across the viewport matrix, making the WCAG AA commitment executable.

## Directory Layout & Responsibilities

```
e2e/                    # Playwright specs, axe fixture, viewport matrix
docs/testing.md         # Testing architecture, TDD workflow, coverage policy

src/
├── assets/             # Static graphics, SVG artwork, and media placeholders
├── components/
│   ├── layout/         # Application shell: Header, MobileNav, ThemeToggle, SkipLink, Section (and SectionBackground), SectionHeader, Container, Footer
│   ├── sections/       # Primary page sections: Hero, SelectedWork, ProjectCard, HowIWork, About, Technologies, Contact
│   └── ui/             # Atomic primitives: ActionLink, Tag, Eyebrow, StatusPill, and SVG icon primitives (icons/)
├── data/               # Decoupled content data layer
│   ├── types.ts        # TypeScript data contracts & interfaces
│   ├── site.ts         # Profile identity, status, role, and social links
│   ├── navigation.ts   # 5 indexed sections (01-05) and 6 section IDs
│   ├── projects.ts     # Showcase projects & case study models
│   ├── principles.ts   # 4 core engineering principles
│   ├── technologies.ts # 10 core technical stack skills
│   ├── about.ts        # Biographical prose copy
│   ├── index.ts        # Unified barrel export
│   └── README.md       # Content maintainer guide
├── hooks/              # Custom hooks: useColorScheme, useActiveSection
├── test/               # Unit harness: setup, matchMedia / IntersectionObserver doubles, renderWithUser
├── styles/             # Global styles: index.css (Tailwind CSS v4 `@theme`, `[data-theme="dark"]`, `@layer base`, keyframes)
├── App.tsx             # Root application shell assembling layout and sections
├── main.tsx            # Application entry point mounting React root and importing variable fonts
└── vite-env.d.ts       # Vite TypeScript client declarations
```

## Component Hierarchy & Shell Structure

```mermaid
graph TD
    APP[App.tsx] --> SKIP[SkipLink (#main)]
    APP --> HEADER[Header (sticky)]
    APP --> MAIN[main#main]
    APP --> FOOTER[Footer]

    HEADER --> CONT_H[Container]
    HEADER --> THEME[ThemeToggle]
    HEADER --> MOBILE[MobileNav (overlay, md:hidden)]

    MAIN --> S_HERO[Section id='hero' variant='plain']
    MAIN --> S_WORK[Section id='work' 01 / Selected Work]
    MAIN --> S_HOW[Section id='how-i-work' 02 / How I Work]
    MAIN --> S_ABOUT[Section id='about' 03 / About]
    MAIN --> S_TECH[Section id='technologies' 04 / Technologies]
    MAIN --> S_CONTACT[Section id='contact' 05 / Contact]

    S_HERO --> HERO[Hero]
    S_WORK --> SH_WORK[SectionHeader]
    S_WORK --> CONT_W[Container 12-col grid]
    CONT_W --> WORK[SelectedWork]
    WORK --> CARD[ProjectCard]

    S_HOW --> SH_HOW[SectionHeader]
    S_HOW --> CONT_HOW[Container 12-col grid]
    CONT_HOW --> HOW[HowIWork]

    S_ABOUT --> SH_ABOUT[SectionHeader]
    S_ABOUT --> CONT_ABOUT[Container 12-col grid]
    CONT_ABOUT --> ABOUT[About]

    S_TECH --> SH_TECH[SectionHeader]
    S_TECH --> CONT_TECH[Container 12-col grid]
    CONT_TECH --> TECH[Technologies]

    S_CONTACT --> SH_CONTACT[SectionHeader]
    S_CONTACT --> CONT_CONTACT[Container 12-col grid]
    CONT_CONTACT --> CONTACT[Contact]

    FOOTER --> CONT_F[Container]

    HOOK[useActiveSection(SECTION_IDS)] -.->|activeId| APP
    APP -.->|activeId| HEADER
    HEADER -.->|activeId| MOBILE
```
