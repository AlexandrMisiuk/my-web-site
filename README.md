# Oleksandr Misiuk — Frontend Portfolio & Landing Page

Personal professional landing page and frontend portfolio for Oleksandr Misiuk, Senior Frontend Engineer. Designed and built with a static-first, high-craft editorial aesthetic emphasizing typography, responsiveness, accessibility, and performance.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Linting & Formatting**: ESLint 9 (flat config) + Prettier with `prettier-plugin-tailwindcss`

## Project Structure

```
.
├── docs/                   # Architecture, key decisions, and technical concerns
├── public/
│   ├── cv/                 # Curated CV documents
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
│   ├── App.tsx             # Application root
│   ├── main.tsx            # Application entry point
│   └── vite-env.d.ts       # Vite TypeScript declarations
├── eslint.config.js        # ESLint 9 flat configuration
├── index.html              # Entry HTML with pre-paint script
├── package.json            # Scripts and dependencies
├── tsconfig.app.json       # TypeScript app configuration with `@/*` aliases
├── tsconfig.node.json      # TypeScript tooling configuration
└── vite.config.ts          # Vite configuration
```

## Available Scripts

- `npm run dev`: Start Vite local development server with instant HMR.
- `npm run build`: Typecheck and build the production static bundle in `dist/`.
- `npm run preview`: Locally preview the production static build.
- `npm run lint`: Run ESLint across all TypeScript and React source files.
- `npm run format`: Format all files with Prettier.
- `npm run format:check`: Check repository formatting against Prettier rules.
- `npm run typecheck`: Run TypeScript compiler (`tsc -b --noEmit`) to verify types.

## Development Guidelines

1. **Static-First & Lightweight**: Avoid unnecessary runtime dependencies, state libraries, or heavy external UI packages.
2. **Data-Driven Content**: Content, copy, and links reside in `src/data/` to keep presentation components cleanly decoupled from data.
3. **Quality Gates**: All commits and PRs must pass `typecheck`, `lint`, and `format:check`.
