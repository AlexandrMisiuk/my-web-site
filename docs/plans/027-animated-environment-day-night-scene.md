# Living Environment Background — Day/Night GSAP Scene

## Context

The portfolio currently renders on a flat opaque `bg-canvas` surface (`src/App.tsx:19`, `body` in `src/styles/index.css:54`). It reads as static and constrained. The light/dark switch is an instantaneous token swap on `[data-theme]` — functional, but with no sense of place.

This change introduces a persistent, fixed-position landscape environment behind all page content: a sunny green field under blue sky by day, and the same field under deep navy sky, stars and a moon by night. The theme toggle stops being a colour swap and becomes a **sunset** (and, in reverse, a **sunrise**) — a real animated transition orchestrated by GSAP, using the existing `data-theme` attribute as the single source of truth. Ambient motion (drifting clouds, swaying grass, twinkling stars) keeps the world alive without ever competing with the content.

Chosen during planning: **frosted-glass surface treatment** (content surfaces become translucent so the landscape reads through), **ambient motion only** (no pointer or scroll parallax, so no ScrollTrigger dependency), and **amend `AGENTS.md`** to sanction GSAP.

---

## Rendering approach: CSS gradients + SVG, no Canvas

- **Sky = stacked CSS-gradient `<div>`s** (day / dusk / night), cross-faded on `opacity` only. Animating SVG `<stop>` colours or `background` values forces per-frame repaints and is not GPU-composited; opacity cross-fades between three static gradient layers are. The **dusk layer** — a warm amber/rose band that swells to peak opacity mid-transition and then fades — is what makes the change read as an actual sunset rather than a crossfade.
- **Everything with a shape = one inline SVG** (sun, glow, moon, clouds, hills, grass, stars). Roughly 110 nodes at desktop; GSAP animates only `transform` and `opacity` on them.
- **No Canvas / WebGL.** There is no particle count, no per-pixel effect, and no physics here that would justify a raster surface and its own render loop. SVG gives crisp scaling at every viewport for free, stays inspectable and themeable from CSS, and keeps the whole feature inside the GSAP + DOM model the repo already uses. Canvas would add a second rendering paradigm and a `requestAnimationFrame` loop for no visual gain.
- **No `filter` animation.** Darkening the landscape at night is done by cross-fading a second, pre-darkened hill layer (`opacity` only), never by tweening `filter: brightness()`.
- Single SVG with `viewBox="0 0 1600 900"` and `preserveAspectRatio="xMidYMax slice"` so the horizon anchors to the bottom edge and the scene covers any aspect ratio without JS measurement. Sun and moon sit in a horizontally safe band (x ≈ 900–1120) so `slice` cropping on narrow viewports never pushes them off-screen.

---

## Architecture

### New directory: `src/components/environment/`

| File | Responsibility |
|---|---|
| `AnimatedEnvironment.tsx` | Fixed `aria-hidden` layer. Owns `useGSAP`, subscribes to theme, builds and drives the timelines. The only stateful piece. |
| `Sky.tsx` | Three stacked gradient divs: `sky-day`, `sky-dusk`, `sky-night`. |
| `Sun.tsx` | Sun disc (`sun-core`) + radial glow (`sun-glow`) inside a `sun-group` wrapper. |
| `Moon.tsx` | Moon disc + soft halo inside a `moon-group` wrapper. |
| `Stars.tsx` | `star-field` `<g>` containing `<circle data-env="star">` elements from `starField.ts`. |
| `Clouds.tsx` | `cloud-band` `<g>` containing individual `<g data-env="cloud">` shapes. |
| `Landscape.tsx` | Day hills, pre-darkened night hills (`field-night`), and grass blades (`blade`). |
| `Scrim.tsx` | Readability overlay: base gradient + a `scrim-night` gradient faded in at night. |
| `environment.constants.ts` | Geometry, timing, counts, and the `data-env` attribute names. |
| `starField.ts` | Deterministic seeded-PRNG star generation (pure). |
| `timeline.ts` | `buildDayNightTimeline(scope)` and `buildAmbientTimeline(scope)` (pure builders). |

Each gets a co-located `*.test.ts(x)`.

### New hook: `src/hooks/useThemeObserver.ts`

`useColorScheme` is **instance-local state** — it is used only by `ThemeToggle.tsx:9`, so there is no shared theme context to consume. The genuine cross-app source of truth is the `data-theme` attribute on `<html>`, written by `useColorScheme.setTheme` (`src/hooks/useColorScheme.ts:52`), by the OS-preference listener (`:41`), and by the pre-paint script in `index.html:13`.

So: **do not build a theme context and do not touch `useColorScheme`.** Instead export

- `readThemeAttribute(): ColorScheme` — `'dark'` when the attribute is `dark`, else `'light'`.
- `useThemeObserver(onChange)` — a `MutationObserver` on `document.documentElement` with `attributeFilter: ['data-theme']`, holding `onChange` in a ref and firing only on an actual value change.

This adds **zero React re-renders** on theme change: the callback drives GSAP directly. `MutationObserver` is native in jsdom, so no new test double is needed.

---

## GSAP design

### Two timelines, one property-ownership rule

The single most important invariant, and the thing that makes the system modular:

> **One property, one owner, one layer.** The master timeline never touches a property the ambient timeline animates, and vice versa. Where both need to affect the same visual element, they act on *different DOM levels* — master on the wrapping group, ambient on the individual children.

| Element | Master (day↔night) owns | Ambient owns |
|---|---|---|
| Stars | `star-field` group `opacity` | each `star` circle `opacity` (twinkle) |
| Clouds | `cloud-band` group `opacity` | each `cloud` `x` (drift) |
| Sun | `sun-group` `y`/`opacity`, `sun-glow` `opacity`/`scale` | `sun-core` `scale` (slow breathe) |
| Grass | `field-night` `opacity` | each `blade` `rotation` |
| Sky | `sky-day` / `sky-dusk` / `sky-night` `opacity` | — |

### Master timeline — `buildDayNightTimeline(scope)`

A **single paused timeline** representing the whole arc: `progress(0)` = full day, `progress(1)` = full night. Roughly 2.4s, built with `gsap.utils.selector(scope)` so it never leaks outside the environment layer.

```
0.00  sky-day     opacity → 0            (1.0, none)
0.00  sky-dusk    opacity → 1            (0.45, sine.out)   ← warm band swells
0.45  sky-dusk    opacity → 0            (0.55, sine.in)    ← …and burns out
0.40  sky-night   opacity → 1            (0.60)
0.00  sun-group   y → horizon, x drift   (0.80, power1.in)
0.55  sun-group   opacity → 0            (0.25)             ← dips below the hills
0.00  sun-glow    opacity → .9, scale 1.25 (0.50)
0.60  sun-glow    opacity → 0            (0.35)
0.25  field-night opacity → 1            (0.70)             ← landscape mutes
0.30  scrim-night opacity → 1            (0.70)
0.45  cloud-band  opacity → .35          (0.60)             ← clouds recede
0.50  star-field  opacity → 1            (0.35, stagger random)
0.55  moon-group  opacity → 1, y rise    (0.50, power2.out)
```

### Driving it from the theme

```ts
theme === 'dark' ? tl.play() : tl.reverse();
```

That is the entire theme handler. **Rapid toggling is handled by construction** — GSAP reverses a running timeline from its current playhead, so a mid-sunset switch back becomes a partial sunrise from exactly where it was. No timeline is ever rebuilt, killed, or duplicated, and no conflicting tweens can exist because there is only ever one master timeline instance.

**Initial paint never animates.** On mount the timeline is set with `tl.progress(readThemeAttribute() === 'dark' ? 1 : 0).pause()` before any motion is armed. Only subsequent `useThemeObserver` callbacks call `play()`/`reverse()`.

### Ambient timeline — `buildAmbientTimeline(scope)`

A persistent `repeat: -1` timeline, created once:

- **Clouds** — `x` drift in viewBox units with `modifiers: { x: gsap.utils.unitize(gsap.utils.wrap(...)) }` for a seamless infinite loop. Because it works in SVG user units, there are **no per-frame layout reads or DOM measurements**. Durations 60–120s, `ease: 'none'`, staggered so bands desync.
- **Grass** — `rotation: ±2.5deg`, `transformOrigin: 'bottom center'`, `yoyo`, `sine.inOut`, `stagger: { each: 0.15, from: 'random' }`.
- **Stars** — `opacity: 'random(0.25, 1)'`, `duration: 'random(1.4, 3.2)'`, `repeat: -1`, `yoyo`, `repeatRefresh: true`, random stagger.
- **Sun** — a very slow `scale` breathe on `sun-core` only.

### Reduced motion & responsive, via `gsap.matchMedia()`

Static state is applied **outside** `matchMedia` (so the scene is always correctly posed even if no condition matches); `matchMedia` only arms motion:

```ts
const mm = gsap.matchMedia();
mm.add(
  { full: '(prefers-reduced-motion: no-preference) and (min-width: 768px)',
    lite: '(prefers-reduced-motion: no-preference) and (max-width: 767px)' },
  (ctx) => { /* ambient timeline; lite → fewer twinkling stars, slower clouds, no grass sway */ }
);
```

- **`prefers-reduced-motion: reduce`** → neither condition matches: no ambient timeline at all, and the theme handler uses `tl.progress(target).pause()` for an instant, non-animated state change. The scene is still fully rendered and correct — just still.
- **Mobile** → same scene, reduced animation budget (subset of stars twinkling, no grass sway, slower cloud drift). Star *markup* is identical at every breakpoint; only how many are animated changes, so no React state and no re-render is involved in responsiveness.
- Lifecycle is `useGSAP(..., { scope: containerRef })` exactly as in `TerminalWindow.tsx:30`, and `mm.revert()` in the cleanup return. Everything unwinds on unmount.

---

## Layering & readability (frosted glass)

`<AnimatedEnvironment />` mounts as the first child of the `App` root: `fixed inset-0 -z-10 pointer-events-none` with `aria-hidden="true"`. Because it is fixed, the world stays put while content scrolls over it — cheap, and it sells the "site inside a place" feeling.

| File | Change |
|---|---|
| `src/App.tsx:19` | Drop `bg-canvas` from the root div (it would otherwise paint over the layer); mount `<AnimatedEnvironment />`. |
| `src/styles/index.css:54` | Keep `body { bg-canvas }` as the pre-hydration paint underneath the layer. |
| `src/components/layout/Footer.tsx:14` | `bg-canvas` → `bg-canvas/70 backdrop-blur-md`. |
| `src/components/sections/About.tsx:22`, `Contact.tsx:27`, `HowIWork.tsx:26`, `ProjectCard.tsx:36`, `Technologies.tsx:71` | `bg-surface` → `bg-surface/75 backdrop-blur-sm`. |
| `src/components/ui/TerminalWindow.tsx:74` | Same treatment, so the hero terminal floats over the field. |
| `src/components/layout/Header.tsx:30` | Unchanged — already `bg-canvas/80 backdrop-blur-md`. |
| `src/components/layout/MobileNav.tsx:102` | Unchanged — the full-screen overlay stays opaque for legibility. |

None of these break tests: per `docs/testing.md:100`, the suite never asserts on Tailwind class strings.

**Environment colour tokens must not be theme-scoped.** New `@theme` tokens (`--color-sky-day-*`, `--color-sky-dusk-*`, `--color-sky-night-*`, `--color-field-*`) are defined **once, unconditionally** — they must *not* be redefined under `[data-theme='dark']`. If they flipped with the attribute, CSS would snap the colours instantly while GSAP was still mid-sunset. The night palette is derived from the existing dark tokens (`#0d0f12`, `#14171c`, `#232830`) so the night sky belongs to the established navy/graphite identity rather than introducing new hues. Contrast is carried by `Scrim.tsx` (`from-canvas/70 via-canvas/35 to-canvas/85`), reusing the scrim idea already proven in `SectionBackground.tsx:35`.

---

## TDD sequence

Red → green → refactor for each step, per `AGENTS.md`. Every new module reaches 100% coverage in this same change.

1. `starField.test.ts` → `starField.ts` — determinism for a fixed seed, count, all coordinates inside the viewBox.
2. `timeline.test.ts` → `timeline.ts` — master builds paused; `progress(0)` poses day (`star-field` 0, `moon-group` 0, `sky-day` 1); `progress(1)` poses night; ambient repeats infinitely; and an explicit **ownership test** asserting the master timeline targets no property the ambient timeline targets.
3. `useThemeObserver.test.ts` → hook — fires on `data-theme` change, ignores unrelated attributes, no fire when the value is unchanged, disconnects on unmount.
4. Leaf component tests → `Sky`/`Sun`/`Moon`/`Stars`/`Clouds`/`Landscape`/`Scrim` — render, `aria-hidden`, expected `data-env` hooks and node counts.
5. `AnimatedEnvironment.test.tsx` — decorative contract (`aria-hidden`, `pointer-events-none`); **mounting under `data-theme="dark"` lands at night with no transition**; flipping the attribute runs the sunset (assert via `gsap.globalTimeline.seek()`, per `docs/testing.md:102`, that `star-field` opacity reaches 1); flipping back reverses; reduced-motion is instant with no ambient timeline; mobile branch; unmount reverts cleanly.
6. `App.test.tsx` — the environment layer is present exactly once.
7. `e2e/environment.spec.ts` — layer exists, is `aria-hidden`, does not intercept clicks on the Hero CTAs, and survives a theme toggle across all three viewport projects. Existing `e2e/a11y.spec.ts` must stay green (its axe builder already excludes `[aria-hidden="true"]`, `e2e/fixtures/axe.ts`).

**jsdom caveat to encode in the tests and in `docs/testing.md`:** the `matchMedia` double defaults every unseen query to `false`, so `gsap.matchMedia` branches only run when a test explicitly calls `setMediaMatches(...)` for that exact query string. Each of the three motion branches needs its own test to hold the 100% branch threshold.

---

## Documentation updates (mandatory per `AGENTS.md`)

- **`AGENTS.md`** — amend the "Zero External UI & State Libraries" bullet: GSAP is the sanctioned animation engine (as Vitest and Playwright are the sanctioned test tools); the ban stands for Framer Motion, Lottie, Three.js and others.
- **`docs/decisions.md`** — append #49 (environment architecture: SVG + gradient layers, why not Canvas), #50 (single reversible master timeline as the theme-transition mechanism), #51 (frosted-glass surface treatment), #52 (AGENTS.md GSAP amendment).
- **`docs/concerns.md`** — append #24 (contrast and readability over a live background), #25 (animation property-ownership conflicts and the one-property-one-owner rule), #26 (mobile animation budget and fixed-layer scroll cost), #27 (no transition on first paint; graceful mid-flight theme reversal).
- **`docs/architecture.md`** — new concept bullet, `src/components/environment/` in the directory layout, and the environment layer added to the component-hierarchy mermaid diagram.

---

## Verification

```bash
npm run verify      # typecheck → lint → format:check → test:coverage (100%) → build
npm run test:e2e    # all three viewport projects + axe
```

Then confirm the actual experience, which the automated gates cannot judge:

1. `npm run dev`, load in light theme — sunny field, drifting clouds, gentle grass. Confirm no transition plays on first paint.
2. Toggle to dark — watch the full sunset: sun sinks, dusk band burns and fades, stars stagger in, moon rises. Toggle back for the sunrise.
3. **Toggle rapidly mid-transition** — must interpolate smoothly from the current playhead, never jump or stack.
4. Reload with `data-theme="dark"` already set — must land at night instantly, no sunrise-then-sunset flash.
5. Chrome DevTools MCP: record a performance trace while scrolling. Confirm a stable frame rate, no layout/recalc entries attributable to the environment, and that the fixed layer does not regress scroll performance. Run a Lighthouse pass to check LCP has not regressed.
6. Check 320 / 768 / 1440 — sun and moon stay on-screen, the horizon sits sensibly, text stays readable over every part of the scene.
7. Emulate `prefers-reduced-motion: reduce` — scene fully rendered and correctly posed, zero motion, theme change instant.

---

## Out of scope

Pointer and scroll parallax (and therefore the ScrollTrigger dependency) — deliberately excluded. The `data-env` layer wrappers are structured so a parallax pass could be added later without reworking the timelines.
