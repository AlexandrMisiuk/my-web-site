---
sessionId: session-260830-113836-13bu
---

# Requirements

### Overview & Goals
The goal of this task is to enhance the above-the-fold `Hero` section by replacing the current static statement paragraph with an interactive, retro-modern `TerminalWindow` component. The terminal component will simulate a macOS-style Unix terminal session featuring a top bar with three colored window control circles (red, yellow, green), a customizable window title (`Terminal - ${title}`), a bash prompt (`alex@${profile.role} ~ %`), a typewriter text animation for the profile statement, and a blinking block cursor powered by the GreenSock Animation Platform (GSAP).

### Scope
- **In Scope**:
  - Add `gsap` and `@gsap/react` dependencies for robust animation sequencing and React lifecycle cleanup.
  - Implement a reusable, decoupled `TerminalWindow` primitive in `src/components/ui/TerminalWindow.tsx`.
  - Design a Mac-style top bar containing three decorative circles (red, yellow, green) and a window title displaying `Terminal - ${title}` when the optional `title` prop is provided (falling back to `Terminal` when omitted).
  - Style the terminal using theme-dependent CSS variables and semantic tokens (`bg-surface`, `bg-canvas/60`, `border-hairline`, `text-ink`, `text-ink-muted`, `text-accent`, monospace typography) that cleanly adapt across light and dark modes.
  - Animate statement text character-by-character and provide an infinite blinking cursor effect using GSAP.
  - Support `prefers-reduced-motion` for instant rendering without typewriter delay or blinking distraction.
  - Integrate `TerminalWindow` into `src/components/sections/Hero.tsx`.
  - Co-locate unit tests maintaining 100% branch, statement, function, and line coverage.
  - Synchronize documentation across `docs/architecture.md`, `docs/decisions.md`, `docs/concerns.md`, and `docs/testing.md`.
- **Out of Scope**:
  - Interactive terminal input/command execution (this is a presentational typewriter display).
  - Introducing heavy terminal emulation packages or third-party UI widget libraries.

### User Stories
- **As a visitor**, I want to see an engaging, polished terminal window animation in the hero section with authentic Mac terminal chrome so that I get an immediate impression of Oleksandr's engineering craft and attention to detail.
- **As a visitor using assistive technologies or reduced-motion preferences**, I want the text inside the terminal window to be immediately accessible and legible without disorienting motion or repetitive screen-reader announcements.
- **As a developer**, I want `TerminalWindow` to be modular and reusable with an optional `title` prop so that terminal-style code/output snippets can be placed elsewhere across the site with custom window titles in the future.

### Functional Requirements
- **Mac-Style Top Bar & Window Chrome**:
  - The window must feature a top bar styled like macOS terminal windows with three circular buttons on the left: Red (`#ff5f56`), Yellow (`#ffbd2e`), and Green (`#27c93f`) with `aria-hidden="true"`.
  - **Window Title**: The top bar must display `Terminal - ${title}` when the optional `title` prop is passed (e.g. `Terminal - bio`), or `Terminal` when `title` is not provided.
  - The chrome must have subtle borders (`border-hairline`), rounded corners, and theme-dependent background and text styling utilizing semantic tokens (`bg-surface`, `bg-canvas/60`, `border-hairline`, `text-ink`, `text-ink-muted`).
- **Unix Bash Prompt**: The prompt must be displayed preceding the statement, formatted as `alex@${profile.role} ~ %` (or `alex ~ %` if role is omitted).
- **Typewriter Animation**: The statement text must be typed out smoothly using GSAP.
- **Blinking Cursor**: A cursor element must blink smoothly following the typed text.
- **Conditional Rendering**: If `profile.statement` (or both role and statement) is empty, the terminal should omit or gracefully handle the empty state matching the existing Hero contract.

### Non-Functional Requirements
- **Performance**: GSAP animations must run smoothly at 60fps without triggering layout recalculations or layout thrashing.
- **Accessibility**:
  - Full statement text must be accessible to screen readers via semantic text nodes.
  - Respect `prefers-reduced-motion`: When reduced motion is requested, render the full text immediately with zero animation duration.
  - Terminal text contrast must satisfy WCAG AA (minimum 4.5:1 on both light and dark canvas/surface pairings).
- **Zero Regressions**: 100% test coverage maintained via Vitest, clean ESLint, zero TypeScript errors, and passing Playwright axe-core accessibility checks.

# Technical Design

### Current Implementation
In `src/components/sections/Hero.tsx`, the profile statement is currently rendered as a plain paragraph:
```tsx
const statementText = [profile.role, profile.statement].filter(Boolean).join(' — ');

// ...
{statementText ? <p className="text-lead text-ink-muted max-w-2xl">{statementText}</p> : null}
```
The text is static, styled with `--text-lead` and `--color-ink-muted`, and inverts colors when the theme switches between light and dark.

### Key Decisions
1. **Package Adoption (`gsap` & `@gsap/react`)**:
   - *Choice*: Install `gsap` and `@gsap/react`.
   - *Rationale*: GSAP is the industry standard for performant, customizable timeline/tween animations. `@gsap/react` provides the `useGSAP` hook which handles automatic context scoping and cleanup on component unmount to prevent memory leaks and React 19 strict-mode issues.
2. **Component Architecture & Placement**:
   - *Choice*: Place `TerminalWindow` in `src/components/ui/TerminalWindow.tsx` as an atomic UI primitive.
   - *Rationale*: Follows the existing atomic design hierarchy (`ActionLink`, `StatusPill`, `Tag`), keeping the primitive decoupled from the `Hero` section and reusable for future terminal snippets.
3. **Mac-Style Top Bar & Optional Title**:
   - *Choice*: Render a Mac-style top bar with three colored circle indicators (red `#ff5f56`, yellow `#ffbd2e`, green `#27c93f`) on the left and a centered/formatted title `Terminal - ${title}` when `title` is supplied (or `Terminal` when omitted).
   - *Rationale*: Replicates familiar macOS terminal chrome while keeping the `title` prop optional and flexible for future site sections.
4. **Theme-Dependent Token Theming**:
   - *Choice*: Apply semantic Tailwind CSS v4 design tokens (`bg-surface`, `bg-canvas/60`, `text-ink`, `text-ink-muted`, `border-hairline`, `text-accent`) linked to CSS variables (`--color-surface`, `--color-canvas`, `--color-ink`, `--color-ink-muted`, `--color-hairline`, `--color-accent`) instead of hardcoded dark palette hex codes.
   - *Rationale*: Integrates directly with the project's CSS-first `@theme` design system in `src/styles/index.css`, dynamically adjusting the terminal chrome, background, borders, and text when toggling between light and dark themes (`[data-theme="dark"]`) while maintaining WCAG AA contrast compliance.
5. **Accessible Motion & Reduced Motion Fallback**:
   - *Choice*: Use `gsap.matchMedia()` or `window.matchMedia('(prefers-reduced-motion: reduce)')` inside `useGSAP` to bypass typing duration when reduced motion is requested.
   - *Rationale*: Adheres to `docs/concerns.md` and accessibility standards for users with vestibular sensitivities.

### Proposed Changes

#### 1. `src/components/ui/TerminalWindow.tsx`
Create the `TerminalWindow` component accepting props:
```tsx
export interface TerminalWindowProps {
    prompt?: string;
    text: string;
    title?: string; // Optional title: renders `Terminal - ${title}` if provided, or `Terminal` if omitted
    typingSpeed?: number;
    className?: string;
}
```
- Structure:
  - Outer container: `rounded-lg border border-hairline bg-surface text-ink font-mono shadow-xs sm:shadow-sm overflow-hidden`
  - Top bar (Mac-style): `flex items-center justify-between px-4 py-2.5 bg-canvas/60 border-b border-hairline`
    - Left button group: `flex items-center gap-2` (marked `aria-hidden="true"`)
      - Red circle: `w-3 h-3 rounded-full bg-[#ff5f56]`
      - Yellow circle: `w-3 h-3 rounded-full bg-[#ffbd2e]`
      - Green circle: `w-3 h-3 rounded-full bg-[#27c93f]`
    - Title text: `text-xs text-ink-muted font-mono select-none truncate px-2` displaying `{title ? \`Terminal - \${title}\` : 'Terminal'}`
    - Right spacer: `w-14 shrink-0 hidden sm:block` (or balancing spacer marked `aria-hidden="true"`) to center title
  - Content area: `p-4 sm:p-5 text-sm sm:text-base leading-relaxed`
    - Prompt span: `text-accent font-semibold select-none`
    - Text span: `text-ink` (animated via GSAP)
    - Cursor span: `inline-block w-2 h-4.5 bg-accent align-middle ml-1` (blinking animation via GSAP)

#### 2. `src/components/sections/Hero.tsx`
Update `Hero.tsx`:
- Compute the prompt: `const prompt = profile.role ? \`alex@\${profile.role} ~ %\` : 'alex ~ %';`
- Render `TerminalWindow`:
```tsx
{profile.statement ? (
    <TerminalWindow
        prompt={prompt}
        text={profile.statement}
        className="max-w-2xl"
    />
) : null}
```

### Architecture Diagram
```mermaid
graph TD
    HERO[Hero.tsx] -->|prompt, text, optional title| TERM[TerminalWindow.tsx]
    TERM --> HDR[Mac-style Top Bar]
    HDR --> DOTS[Three Circles: Red, Yellow, Green]
    HDR --> TITLE[Title: Terminal - title or Terminal]
    TERM --> BODY[Terminal Body (bg-surface)]
    BODY --> PRMPT[Prompt: alex@Role ~ %]
    BODY --> TYPE[Typewriter Text: profile.statement]
    BODY --> CURSOR[GSAP Blinking Cursor]
    GSAP[useGSAP Hook] -.->|animates| TYPE
    GSAP -.->|blinks| CURSOR
```

### File Structure
- Modified: `package.json` (add `gsap`, `@gsap/react`)
- Created: `src/components/ui/TerminalWindow.tsx`
- Created: `src/components/ui/TerminalWindow.test.tsx`
- Modified: `src/components/sections/Hero.tsx`
- Modified: `src/components/sections/Hero.test.tsx`
- Modified: `docs/architecture.md`
- Modified: `docs/decisions.md`
- Modified: `docs/concerns.md`
- Modified: `docs/testing.md`

### Risks & Mitigations
- **Risk: React 19 / StrictMode double invocation causing GSAP animation leaks or stutter.**
  - *Mitigation*: Utilize `useGSAP` hook from `@gsap/react` with a defined `scope` ref, ensuring full cleanup and context reversion on unmount or re-render.
- **Risk: jsdom environment lacking animation frame timing.**
  - *Mitigation*: Ensure unit tests assert on component structure, accessible text, and DOM roles; guard GSAP execution or use immediate rendering in test environments so unit test coverage remains 100%.

# Testing

### Validation Approach
Verification follows the mandatory Test-Driven Development (TDD) workflow and the strict 100% coverage gate (`npm run verify`) alongside end-to-end accessibility and cross-viewport checks (`npm run test:e2e`).

### Key Scenarios
1. **Terminal Window Rendering**:
   - `TerminalWindow` renders with correct semantic structure, Mac-style top bar with three circles (red, yellow, green), prompt text, and statement.
   - Top bar renders default title `Terminal` when `title` prop is omitted.
   - Top bar renders formatted title `Terminal - ${title}` when optional `title` prop is provided (e.g., `Terminal - bash`).
   - Text is displayed legibly with theme-appropriate background, border, and contrasting text in both light and dark modes.
2. **Hero Section Integration**:
   - Hero renders `TerminalWindow` when `profile.statement` is provided.
   - The prompt dynamically incorporates `profile.role` (`alex@${profile.role} ~ %`).
3. **Graceful Fallbacks**:
   - When `profile.role` is empty, prompt falls back gracefully (e.g. `alex ~ %`).
   - When `profile.statement` is empty, terminal window is omitted gracefully without breaking the layout.
4. **Accessibility & Reduced Motion**:
   - Screen readers can read the full statement and prompt without degradation.
   - Decorative top bar circles have `aria-hidden="true"`.
   - axe-core accessibility scanner reports 0 WCAG 2.1 AA violations in both light and dark themes.

### Edge Cases
- Empty statement / empty role in `SiteProfile`.
- Optional `title` omitted vs. custom `title` provided.
- Long statement text wrapping onto multiple lines on small viewports (320px).
- Rapid component unmount / remount in React 19.

### Test Changes
- `src/components/ui/TerminalWindow.test.tsx`:
  - Test default rendering with prompt, text, and 3 decorative circles.
  - Test top bar title with default fallback (`Terminal`) and when custom `title` prop is passed (`Terminal - ${title}`).
  - Test custom className and prompt prop variations.
  - Test reduced-motion mode and immediate render branches.
- `src/components/sections/Hero.test.tsx`:
  - Update tests to verify `TerminalWindow` output and prompt format.
  - Verify role/statement empty state branches.

# Delivery Steps

### ✓ Step 1: Implement TerminalWindow UI primitive with GSAP typewriter animation
`gsap` and `@gsap/react` are installed, and the `TerminalWindow` component is fully implemented with 100% unit test coverage.

- Add `gsap` and `@gsap/react` to `package.json` dependencies.
- Create `src/components/ui/TerminalWindow.tsx` featuring a Mac-style top bar with three colored window control circles (red, yellow, green), dynamic window title displaying `Terminal - ${title}` (with optional `title` prop, falling back to `Terminal`), theme-dependent terminal styling (`bg-surface` body, `bg-canvas/60` top bar, `border-hairline`, monospace font), customizable unix prompt (`alex@${role} ~ %`), typewriter text container, and blinking cursor indicator.
- Implement GSAP animations via `@gsap/react` (`useGSAP`) with lifecycle cleanup, scoped refs, and `prefers-reduced-motion` handling (instant text display when motion is reduced).
- Write co-located unit tests in `src/components/ui/TerminalWindow.test.tsx` covering all prop variations (including optional `title` and prompt), 3 circle window controls, empty text handling, and accessibility attributes.

### ✓ Step 2: Integrate TerminalWindow into the Hero component
The `Hero` section renders the statement inside `TerminalWindow` and all Hero unit tests pass with 100% coverage.

- Update `src/components/sections/Hero.tsx` to replace the static `<p className="text-lead ...">` with `<TerminalWindow>` when statement content is present.
- Construct the prompt string dynamically using `profile.role` (e.g. `alex@${profile.role} ~ %`) and pass `profile.statement` as the animated text.
- Update `src/components/sections/Hero.test.tsx` to assert on terminal window rendering, prompt contents, statement text, and graceful handling of empty or missing fields.
- Verify that `npm run test:coverage` and `npm run verify` pass with 100% coverage across all thresholds.

### ✓ Step 3: Synchronize documentation and execute full verification suite
Project documentation in `docs/` is synchronized and all quality gates including e2e and accessibility scans pass with zero errors.

- Update `docs/architecture.md` with the new `TerminalWindow` UI component and GSAP animation layer in the component hierarchy.
- Update `docs/decisions.md` documenting the adoption of GSAP for typewriter and cursor animation, theme-dependent CSS variable token styling (`bg-surface`, `bg-canvas`, `text-ink`, `border-hairline`), and component reusability.
- Update `docs/concerns.md` and `docs/testing.md` with accessibility safeguards (WCAG contrast, screen-reader compatibility, reduced-motion behavior) and GSAP testing conventions.
- Run the full suite of quality gates: `npm run verify` (typecheck, lint, format check, coverage, build) and `npm run test:e2e` (Playwright cross-viewport specs and axe-core WCAG AA scans).