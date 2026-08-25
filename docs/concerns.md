# Technical Concerns & Considerations

This document highlights critical implementation concerns, potential pitfalls, responsive/accessibility guards, and constraints to monitor as the portfolio evolves.

## Key Concerns & Mitigations

### 1. Cumulative Layout Shift (CLS) on Images & Media

- **Concern**: Async loading of project media can introduce layout shifts if intrinsic dimensions are missing.
- **Mitigation**: All project media items must supply explicit `width` and `height` attributes (enforced by the `ProjectMedia` contract in `src/data/types.ts`) or fixed aspect ratio containers (`aspect-video`, `aspect-[16/10]`), along with `loading="lazy"` and `decoding="async"`.

### 2. Missing or Broken Anchor Targets

- **Concern**: Navigating to sections via header or mobile menu can fail or misalign if section IDs deviate from `src/data/navigation.ts`.
- **Mitigation**: Single source of truth in `navigation.ts` (`navItems` and `SECTION_IDS`). Use CSS `scroll-padding-top: var(--header-height)` on `html` so sticky headers never cover anchor headings.

### 3. Contrast Compliance in Both Color Schemes

- **Concern**: Subtle text or borders may fail WCAG AA contrast (4.5:1 for body, 3:1 for large text/UI) in dark or light mode.
- **Mitigation**: Palette is defined semantically with tuned dark mode variants (e.g., cobalt accent shifts to `#7D95FF` under `[data-theme="dark"]`, paired with dark canvas text). Validate all foreground/background pairings.

### 4. Narrow Viewports (320px) Horizontal Overflow

- **Concern**: Unbroken URLs, code tags, or tight padding can cause horizontal scrollbars on small mobile devices.
- **Mitigation**: Test mobile layouts down to 320px. Use `break-words`, `overflow-hidden` where needed, and ensure minimum touch target size of 44×44px for interactive buttons and links (`ThemeToggle`, `ActionLink`).

### 5. Motion Sickness & Accessibility

- **Concern**: Animations may cause disorientation for users sensitive to motion.
- **Mitigation**: All transitions and scroll-driven keyframes must be wrapped inside `@media (prefers-reduced-motion: no-preference)`.

### 6. Unpopulated Placeholders & Empty Anchor Links

- **Concern**: Missing data (e.g., unpublished CV, GitHub link, or case study URL) could produce broken `#` links.
- **Mitigation**: Unsupplied links in `src/data/site.ts` and `src/data/projects.ts` use empty strings (`''`) or optional fields. UI components must strictly verify `Boolean(link)` before rendering clickable action buttons or anchor tags.

### 7. Storage Unavailability & Privacy Sandboxes

- **Concern**: Browser private browsing modes or sandboxed iframes can throw security errors on `sessionStorage` access.
- **Mitigation**: All `sessionStorage` read and write calls are guarded by `try/catch` blocks in both the pre-paint script and `useColorScheme` hook, gracefully falling back to DOM attributes and `matchMedia`.

### 8. Schema Drift in Data Layer

- **Concern**: Introducing new section components or properties in `src/data/` could result in silent contract divergence or broken runtime assumptions.
- **Mitigation**: All data modules are validated against strict TypeScript interfaces in `src/data/types.ts` with `readonly` modifiers to enforce immutability, validated on every build via `npm run typecheck`.
