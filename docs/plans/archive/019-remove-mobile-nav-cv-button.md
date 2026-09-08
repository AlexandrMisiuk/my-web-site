---
sessionId: session-260830-190741-1h0i
---

# Requirements

### Overview & Goals
Remove the "Download CV" button and its top divider border container from the mobile navigation overlay (`MobileNav`), streamlining the mobile menu to focus purely on primary section navigation.

### Scope
- **In Scope**:
  - Remove the Download CV button container and `ActionLink` component from `src/components/layout/MobileNav.tsx`.
  - Remove unused `profile` prop and imports (`ActionLink`, `defaultProfile`, `SiteProfile`) from `MobileNav.tsx`.
  - Update `src/components/layout/Header.tsx` to no longer pass `profile` to `MobileNav`.
  - Update unit test suites (`MobileNav.test.tsx`, `MobileNav.empty.test.tsx`) following TDD.
  - Update architectural documentation in `docs/decisions.md`.
  - Validate all quality gates (typecheck, lint, format, 100% coverage, build, e2e).
- **Out of Scope**:
  - Modifying the CV download links in `Contact` (`src/components/sections/Contact.tsx`) or `Footer` (`src/components/layout/Footer.tsx`).
  - Altering the desktop header layout or navigation items data contracts.

### User Stories
- As a mobile visitor, I want a clean, distraction-free mobile navigation overlay focused on section navigation links, so that I can quickly jump to any part of the portfolio without clutter.
- As a recruiter or hiring manager, I can still access and download the CV from the dedicated Contact section and Footer.

### Functional Requirements
- When the mobile menu dialog is opened below the `md` breakpoint, only the primary section navigation links (`Selected Work`, `How I Work`, `About`, `Technologies`, `Contact`) are rendered.
- No "Download CV" action button or associated hairline border divider is rendered in the mobile navigation panel.
- Focus trapping, Escape-to-close, body scroll locking, and anchor navigation behavior within `MobileNav` remain intact and fully functional.

### Non-Functional Requirements
- **Accessibility**: Preserves WCAG AA compliance, semantic dialog structure (`role="dialog"`, `aria-modal="true"`, `aria-label="Navigation menu"`), and initial focus management.
- **Coverage**: 100% branch, statement, function, and line coverage maintained in Vitest.
- **Performance & Bundle**: Dead code and unused imports eliminated from `MobileNav`.

# Technical Design

### Current Implementation
In `src/components/layout/MobileNav.tsx`, the component receives an optional `profile` prop (defaulting to `siteProfile` from `@/data/site`) and renders a bottom action container below the navigation links:
```tsx
<div className="border-hairline flex flex-col gap-4 border-t pt-6">
    {profile.links.cv ? (
        <ActionLink
            href={profile.links.cv}
            variant="ghost"
            download
            onClick={onClose}
            className="w-full justify-center"
        >
            Download CV
        </ActionLink>
    ) : null}
</div>
```
`Header.tsx` passes `profile={profile}` down to `MobileNav`.

### Key Decisions
- **Remove `profile` prop from `MobileNavProps`**: Since `profile` was used exclusively to obtain `profile.links.cv` for the Download CV button, removing the button makes `profile` completely unused in `MobileNav`. Removing the prop keeps component interfaces minimal and decouples `MobileNav` from the profile data model.
- **Retain `profile` in `HeaderProps`**: `Header.tsx` still uses `profile.name` for the brand logo alt text and accessible label, so `HeaderProps` retains `profile` while simply not forwarding it to `<MobileNav />`.
- **Preserve CV Links on Contact & Footer**: CV download capability remains in dedicated contact landmarks (`Contact` section and `Footer`), maintaining user access while keeping persistent navigation overlays focused.

### Proposed Changes

#### 1. `src/components/layout/MobileNav.tsx`
- Remove unused imports:
  - `import { ActionLink } from '@/components/ui/ActionLink';`
  - `siteProfile as defaultProfile` from `@/data/site`
  - `SiteProfile` from `@/data/types`
- Update `MobileNavProps` interface:
  ```ts
  export interface MobileNavProps {
      isOpen: boolean;
      onClose: () => void;
      activeId: string;
      triggerRef: React.RefObject<HTMLButtonElement | null>;
      items?: readonly NavItem[];
  }
  ```
- Remove `profile = defaultProfile` from `MobileNav` component parameters.
- Remove the bottom `<div className="border-hairline flex flex-col gap-4 border-t pt-6">...</div>` containing `ActionLink`.
- Clean up layout container classes in `MobileNav.tsx` (`<Container className="flex h-full flex-col py-6">`).

#### 2. `src/components/layout/Header.tsx`
- Update `<MobileNav>` call to remove `profile={profile}`:
  ```tsx
  <MobileNav
      isOpen={isMenuOpen}
      onClose={closeMenu}
      activeId={activeId}
      triggerRef={triggerRef}
      items={items}
  />
  ```

#### 3. Documentation (`docs/decisions.md`)
- Synchronize Decision 35 (*Streamlined Header Action Area without CV ActionLink*) to document that CV download links are omitted from both the sticky Header and `MobileNav`, leaving `Contact` and `Footer` as the dedicated download surfaces.

### Components & Props Contracts
```ts
// src/components/layout/MobileNav.tsx
export interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
    activeId: string;
    triggerRef: React.RefObject<HTMLButtonElement | null>;
    items?: readonly NavItem[];
}
```

### File Structure & Affected Files
- Modified: `src/components/layout/MobileNav.tsx`
- Modified: `src/components/layout/Header.tsx`
- Modified: `src/components/layout/MobileNav.test.tsx`
- Modified: `src/components/layout/MobileNav.empty.test.tsx`
- Modified: `docs/decisions.md`

# Testing

### Validation Approach
Following mandatory Test-Driven Development (TDD):
1. **Red phase**: Update unit tests in `src/components/layout/MobileNav.test.tsx` and `src/components/layout/MobileNav.empty.test.tsx` first to reflect the removal of the Download CV button and prop changes.
2. **Green phase**: Implement the code removal in `MobileNav.tsx` and `Header.tsx`.
3. **Refactor & Verify**: Ensure 100% test coverage across all metrics and execute all repository quality gates.

### Key Scenarios
- **Overlay contains only navigation links**: When the mobile navigation is open, only links for section navigation (`Selected Work`, `How I Work`, `About`, `Technologies`, `Contact`) are present within the dialog.
- **Absence of Download CV action**: Searching for `screen.queryByRole('link', { name: 'Download CV' })` or `screen.queryByText(/Download CV/i)` within `MobileNav` returns `null`.
- **Keyboard navigation & focus trapping**: Initial focus targets the first navigation link; Tab and Shift+Tab cycle cleanly through available section links without error.
- **Empty navigation items handling**: When `items={[]}` is provided, opening the menu handles focus gracefully without crashing (validated by `MobileNav.empty.test.tsx`).

### Edge Cases
- Opening mobile nav when viewport expands to desktop (`matchMedia` listener triggers `onClose`).
- Escape key closes overlay and restores focus to the hamburger trigger button.
- Body scroll locking and restoration on unmount remain fully operational.

### Test Changes
- **`src/components/layout/MobileNav.test.tsx`**:
  - Remove test `renders the CV action inside the overlay when a cv link is provided`.
  - Remove test `omits the CV action inside the overlay when cv link is empty`.
  - Add test asserting that `Download CV` link is not present in the dialog.
  - Remove `profile` prop from `renderOpenNav` helper.
- **`src/components/layout/MobileNav.empty.test.tsx`**:
  - Remove `emptyProfile` and `profile` prop from `<MobileNav />`.
- **E2E & Accessibility**:
  - Run Playwright mobile navigation suite (`e2e/mobile-nav.spec.ts`) and axe accessibility checks (`e2e/a11y.spec.ts`) to ensure zero regressions.

# Delivery Steps

### ✓ Step 1: Update MobileNav unit tests to assert absence of CV button
Unit test suite in `MobileNav.test.tsx` and `MobileNav.empty.test.tsx` specifies the updated interface and absence of the Download CV action link.

- Update `src/components/layout/MobileNav.test.tsx` by removing the CV-specific tests (`renders the CV action inside the overlay when a cv link is provided` and `omits the CV action inside the overlay when cv link is empty`).
- Add a unit test in `src/components/layout/MobileNav.test.tsx` verifying that no "Download CV" action link or button is rendered within the mobile navigation dialog.
- Clean up test helper `renderOpenNav` in `src/components/layout/MobileNav.test.tsx` to eliminate the `mockProfile` and `profile` prop passing.
- Update `src/components/layout/MobileNav.empty.test.tsx` to remove `emptyProfile` and `profile` prop from `<MobileNav />`.

### ✓ Step 2: Remove Download CV button, profile prop, and unused imports from MobileNav and Header
`MobileNav` renders exclusively section navigation links, and unused `profile` props and `ActionLink` imports are removed from `MobileNav.tsx` and `Header.tsx`.

- Remove the bottom divider container and `ActionLink` Download CV block (`<div className="border-hairline flex flex-col gap-4 border-t pt-6">...</div>`) from `src/components/layout/MobileNav.tsx`.
- Remove unused imports (`ActionLink`, `defaultProfile` from `@/data/site`, and `SiteProfile` from `@/data/types`) from `src/components/layout/MobileNav.tsx`.
- Remove `profile` from `MobileNavProps` interface and default parameter `profile = defaultProfile` in `MobileNav` component function signature in `src/components/layout/MobileNav.tsx`.
- Streamline container classes in `src/components/layout/MobileNav.tsx` removing unnecessary flex spacing/alignment for the omitted bottom action.
- Update `src/components/layout/Header.tsx` to remove the `profile={profile}` prop passed to `<MobileNav />`.

### ✓ Step 3: Update documentation and verify quality gates
Documentation in `docs/decisions.md` is synchronized with the change, and all project quality gates pass with 100% test coverage.

- Update `docs/decisions.md` (Decision 35: *Streamlined Header Action Area without CV ActionLink*) to document that the CV action link is excluded from both the sticky header actions and `MobileNav`, while remaining available in dedicated contact surfaces (`Contact`, `Footer`).
- Run `npm run typecheck` to verify zero TypeScript errors.
- Run `npm run lint` and `npm run format:check` to ensure ESLint and Prettier compliance.
- Run `npm run test:coverage` to verify all Vitest tests pass with 100% code coverage across statements, branches, functions, and lines.
- Run `npm run build` and `npm run test:e2e` to confirm bundle creation and end-to-end accessibility/mobile navigation tests pass.