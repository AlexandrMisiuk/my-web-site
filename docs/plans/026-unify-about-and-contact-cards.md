# Give About and Contact the same card treatment as How I Work

## Context

Five of the six page sections read as one system; two do not.

`HowIWork.tsx:29`, `ProjectCard.tsx:31` and `Technologies.tsx:74` all render their content inside the
same card shell — `border-hairline bg-surface rounded-sm border p-6 sm:p-8`. `About.tsx:21` and
`Contact.tsx:28` render bare text directly into the 8-column content track with no border and no
surface. Sitting between `How I Work` and `Technologies`, they look unfinished rather than
deliberately minimal.

`About` compounds it: six paragraphs totalling ~2,400 characters arrive as one undifferentiated wall
with no entry point for the eye.

**Outcome:** both sections adopt the established card shell, so the page reads as one consistent
system top to bottom. No copy changes, no new data fields, and Contact's four `ActionLink` buttons
stay exactly as they are.

## Approach

### 1. `src/components/sections/About.tsx` — lede card + bio card

Split the paragraph array into a promoted first paragraph and the remainder, each in its own card.

- Outer wrapper: `flex flex-col gap-6 sm:gap-8` plus the incoming `className`. **No `max-w`** — the
  cards fill the 8-column track exactly like `HowIWork`'s do.
- Lede card: card shell, single `<p>` at `text-lead text-ink max-w-[62ch] leading-relaxed`. Promoting
  it to `text-lead`/`text-ink` (from `text-body`/`text-ink-muted`) gives the section an anchor.
- Bio card: card shell, remaining paragraphs as `flex flex-col gap-4 sm:gap-6`, each
  `text-body text-ink-muted max-w-[62ch] leading-relaxed`. Rendered only when `rest.length > 0`, so a
  one-paragraph bio never produces an empty bordered box.
- Keep `max-w-[62ch]` on the paragraphs, not the cards — the card edge tracks the column, the text
  keeps its reading measure.
- Empty state (`paragraphs.length === 0`) is unchanged.

The card shell string is copied verbatim from `HowIWork.tsx:29` so Prettier's Tailwind plugin leaves
the ordering alone.

### 2. `src/components/sections/Contact.tsx` — one card, buttons untouched

Turn the current outer `<div className="space-y-8">` into the card shell itself:
`border-hairline bg-surface flex flex-col gap-6 rounded-sm border p-6 transition-colors sm:gap-8 sm:p-8`
plus the incoming `className`.

Inside, in order:

- The `"Let's build something great."` line. Change its classes from
  `text-lead text-ink sm:text-h3 font-medium` to `text-h3 text-ink font-semibold tracking-tight`, matching
  how card headings are treated in `HowIWork` and `ProjectCard`. It stays a `<p>` — no new `<h3>`, so
  the document outline and the e2e heading-order assertions are unaffected.
- The prose block, unchanged (`text-body text-ink-muted max-w-[62ch] ... leading-relaxed`).
- A `<div className="border-hairline border-t" />` divider, rendered inside the existing `hasAnyLink`
  branch so it never appears above an empty footer.
- The existing button row — `flex flex-wrap items-center gap-4` with the four `ActionLink`s
  (Email/primary, LinkedIn, GitHub, CV) **byte-for-byte unchanged**, including variants, icons,
  labels, `isExternal` and `download`.

No new conditional branches are introduced; `hasEmail` / `hasLinkedIn` / `hasGitHub` / `hasCv` /
`hasAnyLink` / `hasParagraphs` all keep their current shape.

## Files to modify

| File | Change |
|---|---|
| `src/components/sections/About.test.tsx` | New tests (written first) |
| `src/components/sections/About.tsx` | Two-card split |
| `src/components/sections/Contact.test.tsx` | New test (written first) |
| `src/components/sections/Contact.tsx` | Card wrap + divider + headline sizing |
| `docs/architecture.md` | `About` and `Contact` bullets under "Section Component Presentation" |
| `docs/decisions.md` | New entry for unifying the card shell across content sections |

No changes to `src/data/`, `src/components/layout/`, `src/components/ui/`, or `src/styles/index.css`.

## Tests (red first — AGENTS.md mandates TDD and 100% coverage)

Per `docs/testing.md`: query by role/name, never assert on Tailwind class strings.

**`About.test.tsx`** — the two-card split adds one branch (`rest.length > 0`) that the existing suite
does not reach. Existing cases cover 2 paragraphs and 0 paragraphs; add:

- `renders a lone paragraph without an empty second group` — render `{ paragraphs: ['Only one.'] }`,
  assert the text is present and `container.querySelectorAll('p')` has length 1. Counting elements is
  structural, not a class assertion, so it stays within the conventions.

The five existing About tests must keep passing unmodified — in particular
`applies custom className when provided`, since `className` still lands on `container.firstChild`.

**`Contact.test.tsx`** — no new branches, but the wrap is a real behavioural change worth pinning:

- `renders the closing statement and the action links inside a single container` — use `within()`
  scoped to `container.firstElementChild` and assert both the headline text and the email link
  resolve inside it. This is the regression guard against the card wrapper being dropped or the
  buttons drifting outside it.

All ten existing Contact tests must pass unmodified, including
`renders all action links when full profile is provided` (hrefs and the `download` attribute) and
`renders clean fallback or empty link state without crash when all links are empty`
(`queryAllByRole('link')` length 0 — the divider is a `<div>` and adds no link).

## Verification

```bash
npm run verify      # typecheck → lint → format:check → test:coverage (100%) → build
npm run test:e2e    # desktop-1440 / tablet-768 / mobile-320, incl. axe WCAG 2.1 AA in both themes
```

Then a visual pass — this is a styling change, so the gates alone are not sufficient evidence:

1. `npm run dev`, open `#about` and `#contact`.
2. Check at 320 / 768 / 1440 in **both** light and dark themes:
   - The About and Contact cards sit flush with the `HowIWork` and `Technologies` cards above and
     below them — same border colour, same radius, same padding rhythm, same left edge.
   - At 320px the card padding does not cause horizontal overflow (`docs/concerns.md` §4). Available
     width there is 320 − 40 gutter − 48 card padding = 232px; the existing `HowIWork` cards already
     run at this width, so it should hold.
   - `border-hairline` is visible against `bg-surface` in dark mode (`#232830` on `#14171c`) — this
     is the pairing most likely to disappear.
   - The Contact divider reads as a separator, not as a second card edge.
3. Tab through Contact — the four buttons keep their 44px targets and visible `:focus-visible` rings,
   and the card border does not clip them (`Section` deliberately avoids `overflow-hidden`).

## Deliberately out of scope

Two pre-existing issues I found in `Contact.tsx` that this change does **not** touch, each worth its
own commit:

- `"Let's build something great."` is hardcoded in JSX rather than living in `src/data/contact.ts`,
  which breaks the AGENTS.md decoupled-data-layer rule. Fixing it means adding a field to
  `ContactContent` in `src/data/types.ts` and updating the test fixtures that construct that type.
- After this change the card shell string is duplicated in six places. Extracting a
  `src/components/ui/Card.tsx` primitive would be the right cleanup, but it would touch four
  components and need its own tests to hold the 100% gate.
