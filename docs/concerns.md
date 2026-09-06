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

- **Concern**: Integrating remaining sections or heading changes could disrupt the document outline or introduce duplicate/invalid headings.
- **Mitigation**: All sections standardize on a single `<h1>` in `Hero` for author name, an `<h2>` for author role in `Hero`, `<h2>` headings inside `SectionHeader` for each content section, and `<h3>` tags for sub-items (principles, project cards). E2E tests and integration tests validate structural roles, section IDs, heading hierarchy, and ARIA attributes.

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

### 22. Technology Icon Contrast, Fallback Resilience, & Filter Edge Cases

- **Concern**: Branded SVG technology icons might encounter contrast issues against varying theme backgrounds, missing icon keys for future additions, or produce broken UI layouts if a category filter yields zero matches.
- **Mitigation**: All technology cards utilize semantic `bg-surface` and `border-hairline` tokens ensuring strong contrast for multi-color brand SVGs across light and dark modes. The `TechIcon` dispatcher component includes an accessible terminal/code fallback SVG primitive when unmapped icon identifiers are encountered. The `Technologies` component renders explicit, accessible empty-state feedback if the entire technologies dataset is empty or if no technologies match an active category filter.

### 23. Analytics Environment Gating, Test Isolation, & Privacy Safeguards

- **Concern**: Integrating third-party analytics telemetry could pollute local development and automated test runs with network requests, leak user personal identifiers, require cookie consent banners, or introduce Cumulative Layout Shift (CLS).
- **Mitigation**: `@vercel/analytics` operates completely cookie-free and anonymized out of the box, fulfilling GDPR and CCPA privacy standards without consent banners. The SDK defaults to inert mode in non-production environments (`NODE_ENV === 'development'` and `NODE_ENV === 'test'`), preventing outbound beacons during unit tests, Playwright runs, or local development. The `<Analytics />` component renders `null` in the DOM tree, guaranteeing zero layout shift and zero impact on accessibility tree scanning or landmark hierarchies.

### 24. Content Readability Over a Live Animated Background

- **Concern**: A permanently animated landscape behind every section could reduce text contrast below WCAG AA, particularly where the bright day field or the sun's glow sits behind body copy, and could make the page feel busy rather than calm.
- **Mitigation**: Contrast is carried by two independent layers. `Scrim` renders a fixed base gradient plus a night gradient that GSAP fades in, both authored from theme-independent tokens so they never snap. On top of that, every content surface is frosted (`bg-surface/75 backdrop-blur-sm`, `bg-canvas/70 backdrop-blur-md` for the footer), which keeps prose sitting on a near-opaque plate regardless of what is behind it. The `@axe-core/playwright` WCAG 2.1 AA scan runs in both colour schemes across 320 / 768 / 1440 and gates the change. The `MobileNav` overlay stays fully opaque so the disclosure panel is never competing with the scene.

### 25. Competing GSAP Timelines Animating the Same Property

- **Concern**: Two independent timelines (the day/night arc and the persistent ambient loop) writing the same property of the same element would fight each frame, producing flicker or values that snap when one timeline restarts.
- **Mitigation**: A strict **one property, one owner, one layer** invariant. The master timeline owns group-level properties (`star-field` opacity, `cloud-band` opacity, `sun-group` transform, `field-night` opacity); the ambient timeline owns the individual children (`star` opacity, `cloud` x, `blade` rotation, `sun-core` scale). `timeline.test.ts` asserts the intersection of the two timelines' `(element, property)` sets is empty, so the invariant cannot silently rot.

### 26. Mobile Animation Budget and Fixed-Layer Scroll Cost

- **Concern**: A full-viewport fixed layer with ~130 SVG nodes and several always-running tweens could regress scroll performance or drain battery on phones, and a responsive design that reduced the node count would force React re-renders on resize.
- **Mitigation**: Every tween animates only `transform` and `opacity`; cloud drift works in SVG user units with a `modifiers` wrap, so no layout is read per frame. `gsap.matchMedia()` arms a reduced `AMBIENT_MOBILE` budget below 768px — fewer twinkling stars, no grass sway, slower cloud drift — while the **rendered markup stays identical at every breakpoint**, so responsiveness costs no React state and no re-render. Measured at a sustained 60 fps through a full-page scroll plus a theme transition, with CLS 0.00.

### 27. First-Paint Flash and Mid-Transition Theme Toggling

- **Concern**: The environment could play a spurious sunrise or sunset on load, flash night-only layers before the first animation frame, or stack conflicting animations if the theme is toggled repeatedly during a transition.
- **Mitigation**: On mount the master timeline is posed with `progress(readThemeAttribute() === 'dark' ? 1 : 0).pause()` inside `useGSAP`'s layout effect, before any motion is armed, so the initial state is correct without animating. Night-only layers carry the `.env-night-layer` class (`opacity: 0`) in CSS *and* are set to zero by the timeline builder, so they cannot appear before the first frame. Rapid toggling is safe by construction: there is exactly one timeline instance and the handler only calls `play()` / `reverse()`, which resume from the current playhead. Under reduced motion the handler jumps to `progress(target).pause()` instead.

### 28. GSAP Folds SVG `transform` Attributes, and jsdom Cannot See It

- **Concern**: A GSAP tween on an SVG element that already carries `transform="translate(x y)"` does **not** animate an offset on top of that attribute — GSAP parses the attribute and folds it in, so the tweened `x` is the element's *absolute* position in the scene. jsdom resolves no SVG transforms at all, so GSAP silently no-ops there and reports `x` starting at `0`. A unit test whose fixture omits the authored `transform` therefore models geometry the browser never produces, and can pass while the real page is visibly broken. This shipped once: the cloud drift loop biased its wrap window by each cloud's authored x, double-counting it, so clouds vanished mid-sky and reappeared far off-screen.
- **Mitigation**: The cloud wrap window is a single absolute range shared by every cloud — `-CLOUD_WRAP_MARGIN` to `ENV_VIEWBOX_WIDTH + CLOUD_WRAP_MARGIN` — never biased per element. The `timeline.test.ts` fixture renders each cloud with its real `translate(...)` and explicitly seeds `gsap.set(cloud, { x: authoredX })` to reproduce what a browser hands GSAP, with a comment stating why. Because that seeding is a model rather than the real thing, `e2e/environment.spec.ts` opts back into motion (`contextOptions: { reducedMotion: 'no-preference' }`) and asserts the invariants against rendered transform matrices: every cloud stays within one margin of the scene, never steps backwards while on screen, and holds a constant authored altitude. Both tiers were confirmed to fail against the original defect.

### 29. An `<svg>` Clips Scaled Artwork to Its Own Viewport

- **Concern**: An `<svg>` clips its contents to its viewport, so artwork that GSAP scales up can be cut off at the element's rectangular bounds. The sun's glow was authored at `r = 100` in a `200x200` viewBox — exactly half the box — and the sunset scales it to `1.25`, so the swell was sliced off square and the sun visibly rose and set inside a box.
- **Mitigation**: The glow artwork now carries headroom for its own peak swell: `SUN_GLOW_RADIUS` (78) x `SUN_GLOW_PEAK_SCALE` (1.25) = 97.5, inside the 100-unit half-viewBox, with the gradient reaching fully transparent exactly at the circle's edge so there is no boundary to reveal however far it scales. All four values live in `environment.constants.ts` and `scene.test.tsx` asserts the invariant directly, so raising the peak scale without widening the artwork fails the suite rather than shipping a visible box. `timeline.ts` reads `SUN_GLOW_PEAK_SCALE` instead of a literal, keeping the animation and the geometry in one place.
