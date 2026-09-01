---
sessionId: session-260901-131335-o2r3
---

# Requirements

### Overview & Goals
Update the call-to-action text for external project links in `ProjectCard` from "Live Demo" to "Visit Website" to better describe destination URLs that may be production sites, portfolios, or landing pages rather than interactive demos.

### Scope
- **In Scope**:
  - Update link copy in `src/components/sections/ProjectCard.tsx` for `<ActionLink href={project.externalUrl} ...>`.
  - Update corresponding unit tests in `src/components/sections/ProjectCard.test.tsx`.
  - Maintain 100% test coverage and satisfy all project quality gates (`npm run verify`).
- **Out of Scope**:
  - Modifying the underlying data schema (`Project` interface in `src/data/types.ts`).
  - Adding or modifying other project action links (`repoUrl` / "GitHub", `caseStudyUrl` / "Case Study").

### User Stories
- As a visitor viewing the Selected Work section, I want clear and accurate action link labels on project cards so that I know clicking the external link will take me to the project's website.

### Functional Requirements
- When `project.externalUrl` is provided, `ProjectCard` renders an external `ActionLink` with the text "Visit Website" (instead of "Live Demo").
- When `project.externalUrl` is empty or omitted, no "Visit Website" link is rendered.
- The link retains all existing behavior: `variant="ghost"`, `isExternal={true}` (opens in new tab with `target="_blank" rel="noreferrer"` and displays `ArrowUpRightIcon`).

### Non-Functional Requirements
- **Accessibility**: Maintain accessible link name and semantic role accessible to screen readers.
- **Test Coverage**: 100% code coverage across statements, branches, functions, and lines.
- **Code Quality**: Pass `typecheck`, `lint`, `format:check`, and `build`.

# Technical Design

### Current Implementation
In `src/components/sections/ProjectCard.tsx` (lines 88–92):
```tsx
{hasLiveDemo ? (
    <ActionLink href={project.externalUrl} variant="ghost" isExternal>
        Live Demo
    </ActionLink>
) : null}
```
In `src/components/sections/ProjectCard.test.tsx` (lines 120, 130, 151, 159, 169, 184):
Tests query for `screen.getByRole('link', { name: /Live Demo/i })` and verify omission via `queryByRole`.

### Key Decisions
- **Text Update Only**: Change the rendered text inside `<ActionLink>` from `Live Demo` to `Visit Website`. Keep `variant="ghost"` and `isExternal={true}` unchanged.
- **TDD Workflow**: Update `ProjectCard.test.tsx` first to assert on `/Visit Website/i` (failing test), then update `ProjectCard.tsx` to pass the tests.

### Proposed Changes
1. **`src/components/sections/ProjectCard.tsx`**:
   - Change link text child of `<ActionLink href={project.externalUrl}>` to `Visit Website`.
2. **`src/components/sections/ProjectCard.test.tsx`**:
   - Update test descriptions and regex queries matching the link text to `/Visit Website/i`.

### Components
- `ProjectCard` (`src/components/sections/ProjectCard.tsx`): Presentation component rendering project summary and action links.

### File Structure
- Modified: `src/components/sections/ProjectCard.tsx`
- Modified: `src/components/sections/ProjectCard.test.tsx`

### Risks
- **None**: Minimal, isolated copy change with zero structural or behavioral breaking changes.

# Delivery Steps

### ✓ Step 1: Update ProjectCard unit tests to assert on "Visit Website" link label
Unit tests in `src/components/sections/ProjectCard.test.tsx` fail against the current "Live Demo" label and define the contract for "Visit Website".

- Update test case descriptions in `src/components/sections/ProjectCard.test.tsx` from "Live Demo" to "Visit Website".
- Update link lookup queries and assertions from `getByRole('link', { name: /Live Demo/i })` and `queryByRole('link', { name: /Live Demo/i })` to check for `/Visit Website/i`.
- Run `npm test` to verify that the test suite fails predictably (red phase of TDD).

### ✓ Step 2: Update ProjectCard implementation and verify all quality gates
`ProjectCard` renders the "Visit Website" label for external project URLs and passes all quality gates with 100% test coverage.

- In `src/components/sections/ProjectCard.tsx`, update the external action link button text from `Live Demo` to `Visit Website`.
- Optionally update `hasLiveDemo` variable naming to `hasExternalUrl` / `hasWebsite` if needed for clarity.
- Run `npm run test:coverage` and `npm run verify` to confirm 100% unit test coverage, zero lint/formatting issues, zero TypeScript errors, and successful build.