# Technical Concerns & Considerations

This document highlights critical implementation concerns, potential pitfalls, responsive/accessibility guards, and constraints to monitor as the portfolio evolves.

## Key Concerns & Mitigations

### 1. Cumulative Layout Shift (CLS) on Images & Media

- **Concern**: Async loading of project media can introduce layout shifts if intrinsic dimensions are missing.
- **Mitigation**: All project media items must supply explicit `width` and `height` attributes (enforced by the `ProjectMedia` contract in `src/data/types.ts`) or fixed aspect ratio containers (`aspect-video`, `aspect-[16/10]`), along with `loading="lazy"` and `decoding="async"`.

### 2. Missing or Broken Anchor Targets

- **Concern**: Navigating to sections via header or mobile menu can fail or misalign if section IDs deviate from `src/data/navigation.ts`.
- **Mitigation**: Single source of truth in `navigation.ts` (`navItems` and `SECTION_IDS`). Use CSS `scroll-padding-top: var(--header-height)` on `html` so sticky headers never cover anchor headings and scroll-spy active section thresholds remain aligned.

### 3. Contrast Compliance in Both Color Schemes

- **Concern**: Subtle text or borders may fail WCAG AA contrast (4.5:1 for body, 3:1 for large text/UI) in dark or light mode.
- **Mitigation**: Palette is defined semantically with tuned dark mode variants (e.g., cobalt accent shifts to `#7D95FF` under `[data-theme="dark"]`, paired with dark canvas text). Validate all foreground/background pairings.

### 4. Narrow Viewports (320px) Horizontal Overflow

- **Concern**: Unbroken URLs, code tags, or tight padding can cause horizontal scrollbars on small mobile devices.
- **Mitigation**: Test mobile layouts down to 320px. Use `break-words`, `overflow-hidden` where needed, and ensure minimum touch target size of 44×44px for interactive buttons and links (`ThemeToggle`, `ActionLink`, hamburger toggle, mobile nav links).

### 5. Motion Sickness & Accessibility

- **Concern**: Animations may cause disorientation for users sensitive to motion.
- **Mitigation**: All transitions and scroll-driven keyframes must be wrapped inside `@media (prefers-reduced-motion: no-preference)` with `motion-reduce:transition-none`.

### 6. Unpopulated Placeholders & Empty Anchor Links

- **Concern**: Missing data (e.g., unpublished CV, GitHub link, or case study URL) could produce broken `#` links.
- **Mitigation**: Unsupplied links in `src/data/site.ts` and `src/data/projects.ts` use empty strings (`''`) or optional fields. UI components must strictly verify `Boolean(link)` before rendering clickable action buttons or anchor tags.

### 7. Storage Unavailability & Privacy Sandboxes

- **Concern**: Browser private browsing modes or sandboxed iframes can throw security errors on `sessionStorage` access.
- **Mitigation**: All `sessionStorage` read and write calls are guarded by `try/catch` blocks in both the pre-paint script and `useColorScheme` hook, gracefully falling back to DOM attributes and `matchMedia`.

### 8. Schema Drift in Data Layer

- **Concern**: Introducing new section components or properties in `src/data/` could result in silent contract divergence or broken runtime assumptions.
- **Mitigation**: All data modules are validated against strict TypeScript interfaces in `src/data/types.ts` with `readonly` modifiers to enforce immutability, validated on every build via `npm run typecheck`.

### 9. Body Scroll Lock & Focus Trap Leaking

- **Concern**: Unmounting the mobile navigation during fast resize or navigation transitions could leave `document.body.style.overflow = 'hidden'` or trap focus inappropriately.
- **Mitigation**: `MobileNav` implements cleanup routines that restore previous body overflow and return focus to `triggerRef`. Additionally, a `matchMedia('(min-width: 48rem)')` listener automatically triggers `onClose()` if the viewport widens past the mobile breakpoint while open.

### 10. Scroll-Spy Ambiguity & Flutter on Short Sections

- **Concern**: Small adjacent sections or rapid viewport scrolling could cause scroll-spy index fluttering or empty intersecting sets.
- **Mitigation**: `useActiveSection` evaluates intersections against `SECTION_IDS` in strict document order (first matching ID wins), maintains a persistent Set of visible IDs in a ref, and provides edge guards for top of document (`scrollY < 100` -> `hero`) and bottom of page (`window.innerHeight + scrollY >= scrollHeight - 50` -> last section).

### 11. jsdom Browser API Gaps

- **Concern**: jsdom has no `IntersectionObserver` / `matchMedia`, and `getComputedStyle` returns empty custom properties, so `--header-height` silently exercises only the 64px fallback.
- **Mitigation**: Centralized doubles in `src/test/` plus tests that explicitly set `--header-height` (or stub `getComputedStyle`) to cover rem, px, invalid, and fallback branches.

### 12. E2E Flakiness from Scroll-Driven Animation

- **Concern**: `animation-timeline: view()` reveals and transitions make scroll assertions flake.
- **Mitigation**: Global Playwright `reducedMotion: 'reduce'`, web-first attribute assertions, and a lint-enforced ban on `waitForTimeout`.

### 13. Test State Leakage

- **Concern**: `sessionStorage`, `data-theme`, and `body.style.overflow` are process-global in jsdom.
- **Mitigation**: A global `afterEach` in `src/test/setup.ts` resets all three, plus both browser-API doubles.

### 14. Semantic Structure & Heading Order Across All 6 Sections

- **Concern**: Integrating remaining sections (`how-i-work`, `about`, `technologies`, `contact`) could disrupt the document outline or introduce duplicate headings.
- **Mitigation**: All 6 sections are fully implemented, standardizing on a single `<h1>` in `Hero`, `<h2>` headings inside `SectionHeader` for each section, and `<h3>` tags for sub-items (principles, project cards). E2E tests validate structural roles, section IDs, and ARIA attributes.

### 15. Playwright Binary and Build Cost

- **Concern**: E2E rebuilds the bundle per run and needs a Chromium download.
- **Mitigation**: `reuseExistingServer`, Chromium-only projects, and documenting `npx playwright install chromium` as a one-off.

### 16. 100% Coverage Can Incentivise Hollow Tests

- **Concern**: A numeric target invites assertion-free renders and creeping exclusions.
- **Mitigation**: Role-based behavioural assertions, a closed exclusion list enumerated in `vite.config.ts`, and the rule in `docs/testing.md` that any new exclusion needs written justification.

### 17. Coverage Gate Friction as the Codebase Grows

- **Concern**: Once `src/components/sections/` is built, holding 100% costs real effort.
- **Mitigation**: Accepted deliberately. TDD means the test exists first, so the gate is never met in a red state at commit time.

### 18. Media Accessibility & Video Element Captions

- **Concern**: Video previews in `ProjectCard` may trigger accessibility audits if missing controls, labels, or captions tracks.
- **Mitigation**: `<video>` elements include explicit `aria-label` mapped from `media.alt`, `controls`, `preload="none"`, and empty `<track kind="captions">` tags for valid WCAG AA compliance.

### 19. Full-Bleed Section Background Contrast, Bandwidth & Stacking Isolation

- **Concern**: Large background artwork in section slots can delay LCP, consume duplicate bandwidth across themes, slip behind canvas backgrounds in stacking contexts, clip `.reveal` animations or focus rings if `overflow-hidden` is placed on `<section>`, or reduce foreground text readability.
- **Mitigation**: The Hero section renders cleanly without raster background artwork, eliminating above-the-fold image payload. For sections utilizing the reusable `background` slot in `Section`, clipping is strictly confined to the decorative background wrapper, avoiding `overflow-hidden` on the `<section>` landmark so focus rings and translate animations remain unclipped. The landmark applies `relative isolate` when a background is present to keep `-z-10` layers bounded. The `SectionBackground` primitive supports theme switching and a multi-stop gradient scrim (`from-canvas/75 via-canvas/20 to-canvas`) to maintain WCAG AA contrast across light and dark themes.

### 20. GSAP Typewriter Animation Lifecycle & Reduced Motion Safeguards

- **Concern**: JavaScript-driven typewriter and cursor animations in `TerminalWindow` could cause animation frame leaks across component unmounts, trigger React 19 strict-mode double-run stutter, or cause vestibular disorientation for motion-sensitive users.
- **Mitigation**: Use `@gsap/react` `useGSAP` with scoped container refs (`scope: containerRef`) and `revertOnUpdate: true` to guarantee automatic cleanup and context reversion on unmount or dependency change. The component inspects `window.matchMedia('(prefers-reduced-motion: reduce)')` to render full statement text and static cursor immediately without typewriter delays or blinking animations. Decorative top bar controls are marked `aria-hidden="true"` to prevent screen reader noise.

### 21. Responsive Vertical Rhythm, Short Viewports, & Section Minimum Heights

- **Concern**: Enforcing full-viewport minimum section heights (`min-h-[calc(100dvh-var(--header-height))]`) could cause overflow or clipping on short laptop screens/mobile landscape modes, or trigger scroll-spy intersection observer fluttering if multiple sections intersect during rapid scrolling.
- **Mitigation**: `Section` applies `min-height` rather than fixed `height` with `py-section` padding preserved, allowing content taller than the viewport to expand naturally without clipping. Flex column layout defaults to top alignment (`justify-start`) across content sections for natural reading flow, while the Hero section applies `justify-center` for balanced viewport centering. `useActiveSection` enforces a top offset matching `--header-height` and document-order precedence to guarantee robust, jitter-free scroll-spy navigation.
