---
sessionId: session-260829-200608-jj3l
---

# Requirements

### Overview & Goals

The goal of this task is to remove the decorative `IndexRail` component from Oleksandr Misiuk's portfolio website. `IndexRail` was originally rendered as an `aria-hidden="true"` side rail in the left viewport margin at `xl+` (1280px+) displaying numbered section indicators. Removing it streamlines the layout, reduces visual noise and DOM complexity, eliminates redundant reading progress indicators, and simplifies the test and documentation surface while strictly maintaining 100% unit test coverage and WCAG 2.1 AA accessibility compliance.

### Scope

#### In Scope
- **Component Deletion**: Remove `src/components/layout/IndexRail.tsx`.
- **Application Shell Update**: Remove `IndexRail` import and JSX render from `src/App.tsx`.
- **Unit Test Cleanup**: Remove `IndexRail` tests from `src/components/layout/shell.test.tsx`.
- **E2E Test Cleanup**: Remove `IndexRail` assertions from `e2e/responsive.spec.ts`.
- **Documentation Governance**: Synchronize `docs/architecture.md`, `docs/concerns.md`, `docs/decisions.md`, and `docs/testing.md` in accordance with the mandatory documentation maintenance rule.
- **Quality Gates**: Pass all verification gates (`typecheck`, `lint`, `format:check`, `test:coverage`, `build`, `test:e2e`).

#### Out of Scope
- Modifying `useActiveSection` scroll-spy logic or header navigation (`Header`, `MobileNav` continue to receive `activeId` for `aria-current` state).
- Modifying other layout shell primitives (`Container`, `Section`, `SectionHeader`, `SkipLink`, `Footer`).
- Modifying section content or data models in `src/data/`.

### User Stories

- **As a portfolio visitor on wide viewports (1280px+)**, I want a clean, distraction-free reading experience without redundant side-rail markers in the left margin.
- **As a codebase maintainer**, I want the layout shell to stay minimal and free of unused or redundant UI components, ensuring fast tests, zero dead code, and 100% test coverage.

### Functional Requirements

1. **Clean Layout Shell**: The landing page must render without `IndexRail` across all viewports (320px mobile, 768px tablet, 1440px desktop).
2. **Navigation Intact**: The sticky `Header` and `MobileNav` must continue to track and highlight the currently visible section via `useActiveSection` without any regression.
3. **No Visual or Layout Degradation**: Removing `IndexRail` must not alter the horizontal alignment, responsive gutters, or max-width constraints of the main `Container` or `#main` content sections.

### Non-Functional Requirements

1. **100% Unit Coverage**: Unit-test coverage must remain at 100% across lines, statements, functions, and branches (`npm run test:coverage`).
2. **Accessibility**: Automated `@axe-core/playwright` accessibility scans must continue to pass with 0 WCAG 2.1 AA violations in both light and dark color schemes.
3. **Zero Lint and Type Errors**: `npm run typecheck`, `npm run lint`, and `npm run format:check` must pass with 0 errors and 0 warnings.
4. **Documentation Synchronization**: All architecture diagrams, technical concerns, architectural decisions, and testing guidelines in `docs/` must accurately reflect the removal of `IndexRail`.

# Technical Design

### Current Implementation

`IndexRail` is implemented in `src/components/layout/IndexRail.tsx` as a fixed, `aria-hidden="true"`, `pointer-events-none` `<aside>` element placed at `top-1/2 left-6 -translate-y-1/2 z-30 hidden xl:flex`. It imports `navItems` from `@/data/navigation` and highlights the item matching `activeId`.

In `src/App.tsx`, `IndexRail` is imported and mounted alongside `SkipLink`, `Header`, `main#main`, and `Footer`:
```tsx
export default function App() {
    const activeId = useActiveSection(SECTION_IDS);

    return (
        <div className="bg-canvas text-ink relative min-h-screen antialiased">
            <SkipLink />
            <Header activeId={activeId} />
            <IndexRail activeId={activeId} />

            <main id="main" tabIndex={-1} className="outline-none">
                {/* Sections */}
            </main>

            <Footer />
        </div>
    );
}
```

Unit testing for `IndexRail` is located in `src/components/layout/shell.test.tsx`, asserting `aria-hidden="true"` and zero tab stops. E2E testing is located in `e2e/responsive.spec.ts`, asserting absence below `xl` and `pointer-events: none` at 1440px. Documentation in `docs/` references `IndexRail` across multiple files.

### Key Decisions

1. **Complete Deletion of `IndexRail.tsx`**:
   - *Chosen Approach*: Completely delete `src/components/layout/IndexRail.tsx` rather than commenting it out or hiding it via CSS.
   - *Rationale*: Eliminates dead code, reduces production bundle size, prevents orphaned component maintenance, and upholds the KISS design principle.
2. **Retain `useActiveSection(SECTION_IDS)` in `App.tsx`**:
   - *Chosen Approach*: Retain `useActiveSection` in `src/App.tsx` and continue passing `activeId` to `<Header activeId={activeId} />`.
   - *Rationale*: `Header` (and subsequently `MobileNav`) relies on `activeId` to apply `aria-current="true"` to active navigation links. Only the `IndexRail` consumer is removed.
3. **Clean Up Tests and Documentation Concurrently**:
   - *Chosen Approach*: Delete the corresponding unit tests and e2e assertions, and update all `docs/` files in the same change.
   - *Rationale*: Complies with the mandatory documentation maintenance rule and keeps the 100% coverage gate strictly passing without orphaned tests.

### Proposed Changes

1. **Delete File**:
   - `src/components/layout/IndexRail.tsx`
2. **Modify `src/App.tsx`**:
   - Remove `import { IndexRail } from '@/components/layout/IndexRail';`
   - Remove `<IndexRail activeId={activeId} />` from the JSX tree.
3. **Modify `src/components/layout/shell.test.tsx`**:
   - Remove `import { IndexRail } from './IndexRail';`
   - Remove the `describe('IndexRail', ...)` block.
4. **Modify `e2e/responsive.spec.ts`**:
   - Remove `test('IndexRail is absent from the layout below xl', ...)`
   - Remove `test('IndexRail does not intercept pointer events at 1440', ...)`
5. **Update Documentation (`docs/`)**:
   - `docs/architecture.md`:
     - Update `useActiveSection` description (remove mention of index rail).
     - Remove `Decorative Index Rail (IndexRail)` concept item.
     - Remove `IndexRail` from directory layout listing.
     - Update the Mermaid component diagram to remove `IndexRail`.
   - `docs/concerns.md`:
     - Remove Concern 11 (`Index Rail Viewport Overlap at xl+`).
     - Renumber subsequent concerns (12–19 becoming 11–18).
     - Update Concern 5 (`Motion Sickness & Accessibility`) to remove mention of index rail animations.
   - `docs/decisions.md`:
     - Update Decision 12 (remove mention of index rail).
     - Remove Decision 13 (`Decorative aria-hidden Index Rail at xl+`) or record its removal, renumbering subsequent decisions.
     - Update Decision 19 & Decision 20 to remove references to `IndexRail`.
   - `docs/testing.md`:
     - Update E2E conventions section regarding axe fixture exclusion note.
     - Remove `Axe colour-contrast on IndexRail` troubleshooting item.

### Components

- `IndexRail` (`src/components/layout/IndexRail.tsx`): **Deleted**.
- `App` (`src/App.tsx`): **Modified** — removes `IndexRail` from component hierarchy.
- `Header` (`src/components/layout/Header.tsx`): **Unchanged** — continues to consume `activeId`.
- `Container` / `Section` / `SkipLink` / `Footer`: **Unchanged**.

### File Structure

```
src/components/layout/
├── Container.tsx
├── Footer.test.tsx
├── Footer.tsx
├── Header.test.tsx
├── Header.tsx
├── IndexRail.tsx               # DELETED
├── MobileNav.empty.test.tsx
├── MobileNav.test.tsx
├── MobileNav.tsx
├── Section.tsx
├── SectionHeader.tsx
├── SkipLink.tsx
├── ThemeToggle.test.tsx
├── ThemeToggle.tsx
└── shell.test.tsx             # MODIFIED (remove IndexRail suite)
```

### Architecture Diagram

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

### Risks & Mitigations

- **Risk**: Unit test coverage falls below 100% threshold.
  - *Mitigation*: Deleting `IndexRail.tsx` removes the module from coverage calculations, while deleting its test block in `shell.test.tsx` prevents orphan imports. Running `npm run test:coverage` ensures the remaining layout components retain 100% coverage.
- **Risk**: E2E test failures on remaining responsive/accessibility suites.
  - *Mitigation*: Only the two `IndexRail`-specific test cases in `e2e/responsive.spec.ts` are removed. All general layout, overflow, navigation, and axe accessibility tests remain in place and passing.
- **Risk**: Documentation drift.
  - *Mitigation*: Perform a comprehensive update across all four `docs/` files to keep documentation strictly in sync with the codebase.

# Testing

### Validation Approach

Validation will follow the established testing architecture:
1. **Unit Testing & Coverage**: Run `npm run test:coverage` via Vitest 4 to confirm all remaining layout and section components pass and maintain 100% line, statement, function, and branch coverage.
2. **Static Analysis & Type Checking**: Run `npm run typecheck`, `npm run lint`, and `npm run format:check` to ensure 0 TypeScript errors, 0 ESLint warnings/errors, and clean Prettier formatting.
3. **End-to-End Testing**: Run `npm run test:e2e` against the production preview build across all three Playwright viewport projects (`desktop-1440`, `tablet-768`, `mobile-320`) to verify navigation, mobile menu, responsive overflow, and WCAG AA axe accessibility.

### Key Scenarios

- **App Composition**: `App.tsx` renders `SkipLink`, `Header`, `main#main` (with all 6 sections), and `Footer` without errors.
- **Active Section Highlighting**: `Header` navigation continues to highlight the active section via `aria-current="true"` as the user scrolls.
- **Responsive Layout Stability**: The layout renders without horizontal overflow or misalignments at 320px, 768px, and 1440px.
- **Accessibility Gate**: `@axe-core/playwright` automated scans report 0 accessibility violations across light and dark themes.

### Edge Cases

- **Clean Imports**: Verify no unused imports of `IndexRail` remain anywhere in `src/` or `e2e/`.
- **Pre-paint & Build Artifact**: Confirm `npm run build` succeeds and produces the production bundle without missing module errors.

### Test Changes

- **Modified Unit Tests**: `src/components/layout/shell.test.tsx`
  - Remove `describe('IndexRail', () => { ... })`.
  - Remove `import { IndexRail } from './IndexRail';`.
- **Modified E2E Tests**: `e2e/responsive.spec.ts`
  - Remove `test('IndexRail is absent from the layout below xl', ...)`.
  - Remove `test('IndexRail does not intercept pointer events at 1440', ...)`.

# Delivery Steps

### ✓ Step 1: Remove IndexRail component, App integration, and unit tests
`IndexRail.tsx` is deleted, its usage in `App.tsx` is removed, and unit tests in `shell.test.tsx` are cleaned up while preserving 100% unit coverage.

- Delete `src/components/layout/IndexRail.tsx`.
- Remove the `IndexRail` import and `<IndexRail activeId={activeId} />` invocation from `src/App.tsx`.
- Remove the `IndexRail` test suite (`describe('IndexRail', ...)` and `IndexRail` import) from `src/components/layout/shell.test.tsx`.
- Run `npm run test:coverage` to confirm all unit tests pass with 100% coverage across lines, statements, functions, and branches.

### ✓ Step 2: Update responsive E2E test suite
Playwright E2E test suite in `e2e/responsive.spec.ts` is updated to remove assertions on the deleted `IndexRail` element.

- Remove the `IndexRail is absent from the layout below xl` test case from `e2e/responsive.spec.ts`.
- Remove the `IndexRail does not intercept pointer events at 1440` test case from `e2e/responsive.spec.ts`.
- Execute `npm run test:e2e` across all three viewport projects (`desktop-1440`, `tablet-768`, `mobile-320`) to verify all specs pass.

### ✓ Step 3: Synchronize documentation and execute quality gates
All documentation files under `docs/` are updated to remove references to `IndexRail`, and all quality gates pass with zero errors.

- Update `docs/architecture.md` to remove `IndexRail` from architectural concepts, directory layout, and the Mermaid component hierarchy diagram.
- Update `docs/concerns.md` to remove Concern 11 (`Index Rail Viewport Overlap at xl+`) and adjust animation/reduced-motion references.
- Update `docs/decisions.md` to update/remove Decision 13 (`Decorative aria-hidden Index Rail at xl+`) and remove references in decisions 12, 19, and 20.
- Update `docs/testing.md` to remove references to `IndexRail` in the axe accessibility fixtures and troubleshooting sections.
- Execute full `npm run verify` (`typecheck`, `lint`, `format:check`, `test:coverage`, `build`) and `npm run test:e2e` to confirm all quality gates pass.