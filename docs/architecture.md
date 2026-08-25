# Architecture Overview

This document provides a condensed overview of the architecture, key concepts, and structure of Oleksandr Misiuk's portfolio website.

## Architectural Concepts

- **Static Single-Page Application (SPA)**: Zero backend, zero database, zero server runtimes. Bundled into static HTML, JS, and CSS chunks deployable to any static host (Cloudflare Pages, Vercel, Netlify, GitHub Pages).
- **Self-Hosted Variable Typography**: Self-hosted variable fonts `@fontsource-variable/instrument-sans` (proportional sans-serif) and `@fontsource-variable/jetbrains-mono` (monospace) bundled via Vite with zero external CDN dependencies or layout shifts.
- **CSS-First Design Tokens (Tailwind CSS v4)**: Theme tokens (cool ink & cobalt palette, fluid typography clamp scales, spacing rhythm, radius) are declared via `@theme` in `src/styles/index.css`.
- **Zero-Flash `data-theme` Theming**: Initial color scheme (dark or light) is applied before first paint via an inline `<head>` script inspecting `sessionStorage.getItem('theme')` with OS `prefers-color-scheme` fallback. Theme overrides target `[data-theme="dark"]` on `document.documentElement` without modifying root class names.
- **Per-Tab Theme Persistence**: The user's manual color scheme choice is stored in `sessionStorage` (persisting across page reloads in the active tab), while new tabs or windows open cleanly with system defaults.
- **KISS Theme State Hook**: Lightweight `useColorScheme` hook leveraging standard React `useState` (synchronous lazy initialization) and `useEffect` (OS `matchMedia` change subscription and cleanup), strictly avoiding external state managers.
- **Bespoke Atomic UI Primitives & SVG Icons**: Handcrafted, accessible UI primitives (`ActionLink`, `Tag`, `Eyebrow`) and self-contained SVG icons (`SunIcon`, `MoonIcon`, `ArrowUpRightIcon`, `ArrowRightIcon`, `GitHubIcon`, `LinkedInIcon`, `MailIcon`, `DocumentIcon`) eliminating heavy external icon or UI libraries.
- **Decoupled Data Layer**: All portfolio content (personal profile, navigation items, projects, principles, technologies, about text) is structured as type-safe TypeScript modules in `src/data/`. Components remain strictly presentational.
- **Native Scroll & Animation**: Scroll reveals leverage CSS scroll-driven animations (`animation-timeline: view()`) gated behind `@supports` with full `prefers-reduced-motion` fallbacks.

## Directory Layout & Responsibilities

```
src/
├── assets/             # Static graphics, SVG artwork, and media placeholders
├── components/
│   ├── layout/         # Application shell: Header, MobileNav, ThemeToggle, SkipLink, IndexRail, Section, Footer
│   ├── sections/       # Primary page sections: Hero, SelectedWork, ProjectCard, HowIWork, About, Technologies, Contact
│   └── ui/             # Atomic primitives: ActionLink, Tag, Eyebrow, and SVG icon primitives (icons/)
├── data/               # Content data layer: types.ts, site.ts, navigation.ts, projects.ts, principles.ts, technologies.ts, about.ts
├── hooks/              # Custom hooks: useColorScheme, useActiveSection
├── styles/             # Global styles: index.css (Tailwind CSS v4 `@theme`, `[data-theme="dark"]`, `@layer base`, keyframes)
├── App.tsx             # Root application shell assembling layout and sections
├── main.tsx            # Application entry point mounting React root and importing variable fonts
└── vite-env.d.ts       # Vite TypeScript client declarations
```

## Data Flow Diagram

```mermaid
graph TD
    DATA[src/data/*] --> SECTIONS[src/components/sections/*]
    DATA --> LAYOUT[src/components/layout/*]
    HOOKS[src/hooks/*] --> LAYOUT
    CSS[src/styles/index.css] --> APP[App.tsx]
    LAYOUT --> APP
    SECTIONS --> APP
    APP --> MAIN[main.tsx]
    MAIN --> DIST[dist/ static bundle]
```
