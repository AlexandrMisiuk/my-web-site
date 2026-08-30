---
sessionId: session-260830-101048-mohy
---

# Requirements

### Overview & Goals
Set `--font-mono` (`JetBrains Mono Variable`) as the default typography across the entire portfolio website, while configuring `--font-sans` (`Instrument Sans Variable` / system sans-serif stack) strictly as a fallback.

### Scope
- **In Scope**:
  - Updating Tailwind CSS v4 `@theme` tokens in `src/styles/index.css` to define `--font-mono` with fallback to `--font-sans` / sans font stack.
  - Updating `@layer base` in `src/styles/index.css` so `body` applies `font-mono` instead of `font-sans`.
  - Removing explicit `font-sans` utility class from `src/components/layout/SectionHeader.tsx`.
  - Writing/updating unit tests under `src/components/layout/shell.test.tsx` to verify `SectionHeader` typography following TDD.
  - Updating documentation in `docs/architecture.md` and `docs/decisions.md` to reflect the typography architecture change.
  - Verifying all quality gates (`npm run verify` and `npm run test:e2e`).
- **Out of Scope**:
  - Removing the `@fontsource-variable/instrument-sans` dependency (retained for fallback).
  - Modifying data structures in `src/data/` or altering section layout hierarchy.

### User Stories
- As a visitor, I want all typography across headings, paragraphs, navigation, and controls to present a cohesive monospace aesthetic by default.
- As a developer, I want the typography tokens configured so that if the variable monospace font fails to load, the sans-serif font stack acts as a fallback without layout distortion.

### Functional Requirements
- The document `body` must default to `font-mono` (`var(--font-mono)`).
- The `--font-mono` token in `@theme` must list `'JetBrains Mono Variable'` as the primary font, followed by `'Instrument Sans Variable'`, `ui-monospace`, `system-ui`, `-apple-system`, `monospace`, and `sans-serif`.
- `SectionHeader`'s `<h2>` must not force `font-sans`, inheriting `--font-mono` from the base layer.
- All existing components (`Hero`, `SelectedWork`, `ProjectCard`, `HowIWork`, `About`, `Technologies`, `Contact`, `Header`, `Footer`, `MobileNav`, `ActionLink`, `Tag`, `StatusPill`, `Eyebrow`, `SkipLink`) must display with monospace typography by default.

### Non-Functional Requirements
- **Performance & CLS**: 0 Cumulative Layout Shift when variable font loads.
- **Accessibility**: 100% WCAG 2.1 AA contrast and readability compliance across both light and dark themes.
- **Quality Gates**: 100% unit test coverage across lines, statements, functions, and branches; 0 ESLint warnings; 0 TypeScript errors; all Playwright e2e and axe scans passing.

# Technical Design

### Current Implementation
- `src/styles/index.css` defines `--font-sans` and `--font-mono` under `@theme`.
- `body` in `@layer base` currently applies `@apply bg-canvas text-ink font-sans antialiased;`.
- `src/components/layout/SectionHeader.tsx` explicitly sets `font-sans` on the `<h2>` heading element (`className="text-h2 text-ink font-sans font-semibold tracking-tight"`).

### Key Decisions
1. **Base Layer Monospace Default**: Change `body` in `src/styles/index.css` to `@apply bg-canvas text-ink font-mono antialiased;`. All child elements inherit `--font-mono` naturally without needing repetitive utility classes.
2. **Fallback Font Chain in `@theme`**: Update `--font-mono` in `src/styles/index.css` to `'JetBrains Mono Variable', 'Instrument Sans Variable', ui-monospace, system-ui, -apple-system, monospace, sans-serif;`. This ensures that `--font-sans` (and its self-hosted variable font) serves directly as the fallback if JetBrains Mono is unavailable.
3. **Elimination of Explicit `font-sans` in SectionHeader**: Remove `font-sans` from `SectionHeader.tsx` so section headings align with the global monospace aesthetic.

### Proposed Changes

#### 1. Global Styles (`src/styles/index.css`)
```css
@theme {
    /* Color Palette - Light Default */
    --color-canvas: #f4f5f7;
    --color-surface: #ffffff;
    --color-ink: #14161a;
    --color-ink-muted: #5a6070;
    --color-hairline: #dde0e6;
    --color-accent: #2b4bff;
    --color-accent-hover: #1e3ce0;

    /* Typography */
    --font-sans: 'Instrument Sans Variable', system-ui, -apple-system, sans-serif;
    --font-mono: 'JetBrains Mono Variable', 'Instrument Sans Variable', ui-monospace, system-ui, -apple-system, monospace, sans-serif;

    /* Fluid Type Scale */
    ...
}

@layer base {
    body {
        @apply bg-canvas text-ink font-mono antialiased;
        min-height: 100vh;
    }
}
```

#### 2. Section Header (`src/components/layout/SectionHeader.tsx`)
```tsx
export function SectionHeader({ index, label, headingId, className = '' }: SectionHeaderProps) {
    return (
        <header className={`flex flex-col gap-3 ${className}`.trim()}>
            <Eyebrow as="p">
                {index} / {label}
            </Eyebrow>
            <div className="border-hairline border-t" />
            <h2 id={headingId} className="text-h2 text-ink font-semibold tracking-tight">
                {label}
            </h2>
        </header>
    );
}
```

### Components
- `src/styles/index.css`: Theme token definition and base layer typography.
- `src/components/layout/SectionHeader.tsx`: Removed `font-sans` override on section headings.
- `docs/architecture.md`: Updated variable typography architecture section.
- `docs/decisions.md`: Added architectural decision record for monospace typography default.

### File Structure
- `src/styles/index.css` (modified)
- `src/components/layout/SectionHeader.tsx` (modified)
- `src/components/layout/shell.test.tsx` (modified)
- `docs/architecture.md` (modified)
- `docs/decisions.md` (modified)

### Architecture Diagram
```mermaid
graph TD
    CSS[src/styles/index.css] -->|@theme token| MONO_TOKEN[--font-mono: JetBrains Mono Variable]
    MONO_TOKEN -.->|fallback| SANS_FALLBACK[--font-sans: Instrument Sans Variable / system-ui]
    CSS -->|@layer base| BODY[body: @apply font-mono]
    BODY -->|inherits font-mono| APP[Application Shell]
    APP --> HERO[Hero Section]
    APP --> SH[SectionHeader: no font-sans override]
    APP --> WORK[SelectedWork & ProjectCards]
    APP --> ABOUT[About Section]
    APP --> HOW[How I Work Section]
    APP --> TECH[Technologies Section]
    APP --> CONTACT[Contact & Footer]
```

### Risks & Mitigations
- **Risk**: Monospace glyph metrics could cause line-wrapping variations on small screens (320px).
  - *Mitigation*: Existing fluid typography clamp scales and max-width constraints (`max-w-[62ch]`, `max-w-2xl`) accommodate monospace rhythm cleanly; validated by Playwright responsive specs at 320px.
- **Risk**: Unit test coverage regression below 100%.
  - *Mitigation*: Test assertions written first (TDD) in `shell.test.tsx` and validated via `npm run test:coverage`.

# Testing

### Validation Approach
- **TDD Unit Testing**: Vitest 4 + React Testing Library unit tests in `src/components/layout/shell.test.tsx` to verify that `SectionHeader` does not render `font-sans`.
- **Coverage Enforcement**: Run `npm run test:coverage` to ensure 100% coverage on statements, branches, functions, and lines.
- **End-to-End & A11y Gate**: Playwright test suite with axe-core scans across 320px, 768px, and 1440px viewports in both light and dark themes.

### Key Scenarios
1. **SectionHeader Typography**: Verify `SectionHeader` renders `<h2>` heading without the `font-sans` class so it inherits `--font-mono`.
2. **Global Base Styling**: Verify `body` in `index.css` specifies `font-mono`.
3. **Responsive Visual Integrity**: Verify that headings and body copy wrap without overflow across all 320px / 768px / 1440px viewports.
4. **Theme Compatibility**: Verify that monospace text maintains WCAG 2.1 AA contrast compliance in light and dark modes.

### Edge Cases
- Viewport width at 320px with long section titles.
- Fallback font rendering if `JetBrains Mono Variable` fails to load.

### Test Changes
- Update `src/components/layout/shell.test.tsx` with a test case asserting that `SectionHeader` heading does not include `font-sans`.

# Delivery Steps

### ✓ Step 1: Update CSS design tokens and base typography to use --font-mono by default with --font-sans fallback
The global stylesheet configures `--font-mono` as the primary font family with `--font-sans` in its fallback chain, and sets `body` to `font-mono`.

- Update `@theme` in `src/styles/index.css` so that `--font-mono` includes `'JetBrains Mono Variable'`, `'Instrument Sans Variable'`, `ui-monospace`, `system-ui`, `-apple-system`, `monospace`, and `sans-serif`.
- Update `@layer base` in `src/styles/index.css` to replace `@apply ... font-sans` with `@apply ... font-mono` on the `body` element.
- Preserve `--font-sans` definition for explicit fallback references.

### ✓ Step 2: Remove explicit font-sans styling from SectionHeader and verify component typography
`SectionHeader` headings inherit the default monospace typography without conflicting sans overrides.

- Add failing unit test assertions in `src/components/layout/shell.test.tsx` verifying that `SectionHeader` heading element does not contain `font-sans`.
- Update `src/components/layout/SectionHeader.tsx` to remove `font-sans` from the `<h2>` class list.
- Run `npm run test:coverage` to verify all unit tests pass with 100% coverage across lines, statements, branches, and functions.

### ✓ Step 3: Synchronize project documentation and execute full quality gate validation
Project documentation in `docs/` is updated and all repository quality gates pass with zero errors.

- Update `docs/architecture.md` to describe the default monospace typography and fallback font chain.
- Add an architectural decision record in `docs/decisions.md` detailing the rationale for default monospace typography across the site.
- Run `npm run verify` (`typecheck`, `lint`, `format:check`, `test:coverage`, `build`) and `npm run test:e2e` to validate zero type errors, zero lint warnings, formatting cleanliness, 100% unit coverage, successful production build, and all Playwright e2e/axe accessibility checks.