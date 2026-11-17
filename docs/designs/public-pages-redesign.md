# Public pages redesign: How it works, Packages, Mentors

Status: spec for three builders, one page each. Builders follow it literally. Home page, module pages and every portal page stay untouched except for the backward-compatible primitive changes in §2.5.

## 1. Diagnosis: why /program-details read as AI slop

1. **One template, nine times.** Every section was coral uppercase kicker, big h2, grey lede, hairline rows. When every block has the same shape, nothing has weight, and the page reads as generated rather than designed.
2. **Kickers that repeat the heading.** The eyebrow ("HOW IT WORKS") restated the h2 ("Learn, practice, then get feedback"). Two labels per idea is noise, and coral on every section turned the "small accent" into the dominant color.
3. **Layout ignored content shape.** A three-step sequence, a package matrix, a list of people and a list of goals all rendered as the same title/description rows. The comparison of three packages, the one thing a reader wants to scan, was prose.
4. **Check-icon bullets everywhere.** Goals, outcomes, pilot criteria all got a green check. A check means "included"; used on aspirations it means nothing.
5. **Rhythm came only from tint bands.** Alternating paper/tint was the only signal that a new section started, so the bands felt like stripes, not structure.
6. **Everything at the same volume.** h1 at 4xl, every h2 at 4xl, every lede at lg muted. No section was the clear anchor.
7. **A jump list instead of a page with a point.** "On this page" with nine links admitted the page had no single idea. It is now three routes; each needs one.

## 2. Shared system (all three pages)

### 2.1 Page intro
- `<PageHeader size="display" title={…intro.title} lede={…intro.lede}/>` inside `<div className="container-page pt-16 pb-4 md:pt-24 md:pb-8">`. No eyebrow, no buttons in the intro.
- Display size (new, §2.5): h1 `text-4xl leading-[1.05] md:text-5xl lg:text-6xl`; lede `mt-5 max-w-2xl text-lg text-muted md:text-xl`; header `max-w-3xl`, no bottom margin (`mb-0`).
- Left-aligned. Only the home hero is centered; inner pages are not.

### 2.2 Section heading
- `<Section title=… lede=…>` with **no `eyebrow` prop, ever**, on these pages.
- h2 stays `text-3xl md:text-4xl`; lede `mt-4 text-lg text-muted`. One line, one color.
- h3 inside sections: `text-xl` (Manrope via base styles). Never a coral or uppercase label.

### 2.3 Vertical rhythm and width
- Sections keep the primitive's `py-16 md:py-20`. Pages never add margins between sections.
- Separation between consecutive paper sections: the new `rule` prop (hairline `border-t border-line` at the top of the inner container, `pt-16 md:pt-20` replaces the top padding so the line sits at the section edge). Use `rule` on every section after the first, except a section on a tint band and the section directly after one.
- Widths: `container-page` (max-w-6xl) for everything. Reading text max `max-w-2xl`. Lists in split layouts fill the right column.
- Split layout (new `layout="split"`): from `lg` (900px) the header sits in a left column and children in the right: `lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16`, header `mb-10 lg:mb-0`. Same 1:2 ratio as the home page rows, so the inner pages echo the home page. Below 900px it stacks.

### 2.4 Tint bands
At most **one** `bg-tint` band per page, used for the section that is about people or the next step (Packages: pilot; Mentors: community; How it works: goals). Apply with `className="bg-tint"` on `Section`. Never alternate.

### 2.5 Primitive changes (owned by the **How it works builder**; the API below is fixed, so the other two builders code against it in parallel and do not edit these files)

`src/shared/ui/PageHeader.tsx`
```ts
interface PageHeaderProps {
  eyebrow?: string; title: string; lede?: ReactNode; children?: ReactNode;
  /** `default` (portal pages, unchanged) or `display` for public inner pages. */
  size?: 'default' | 'display';
}
```
`default` must render exactly the current classes. `display` uses §2.1 classes.

`src/shared/ui/Section.tsx`
```ts
interface SectionProps extends Omit<ComponentProps<'section'>, 'title'> {
  eyebrow?: string; title?: ReactNode; lede?: ReactNode; width?: 'page' | 'narrow';
  /** `stacked` (default, unchanged) or `split`: heading left, content right from 900px. */
  layout?: 'stacked' | 'split';
  /** Hairline at the top of the content column, for consecutive sections on paper. */
  rule?: boolean;
}
```
Also: when `title` is set, give the h2 an id from `useId()` and set `aria-labelledby` on the `<section>` (unless the caller passes its own `aria-labelledby`/`aria-label`). Defaults must leave every existing portal page pixel-identical. Add `Section.test.tsx` covering: split renders header and children; `aria-labelledby` points at the h2; defaults unchanged (no grid class, no border).

No other new primitives. Packages owns one site component (§3.2).

### 2.6 Links and buttons
- One solid `ButtonLink` per page, at the end (§3). Secondary links use the home page text-link style: `inline-flex min-h-11 items-center gap-1.5 font-medium text-green hover:underline` + `<Icon name="arrow" size={16}/>`.
- CTA labels and targets live in data as `cta: { label: string; to: keyof typeof paths }` on the page object (same pattern as `homeRows`), rendered `paths[cta.to]`.

### 2.7 Mobile (390px)
- `container-page` gives 16px gutters. Everything stacks single column; split headers sit above content.
- No horizontal page scroll. The Packages table must fit at 390px without its own scroll (§3.2).
- All interactive targets `min-h-11` (44px). List rows that link use `ListRow to=…` (already 56px).

### 2.8 Banned on these pages
Eyebrow/kicker above any heading · coral text or coral anything (the `accent`/`coral` tokens are not used on these pages) · icon-in-circle or icon-per-item feature grids · check-icon bullet lists (the only check icon allowed is an "Included" table cell) · `Card` wrapping prose or lists · alternating tint bands · centered section text · decorative numerals, glyphs, rings or illustrations · fake UI mockups of the portal · "Most popular"/recommended badges · stats, counts, prices, dates · a "Learn more" link under every block · "On this page" jump lists · more than one solid button.

## 3. Pages

### 3.1 How it works — `src/features/site/pages/HowItWorksPage.tsx`
Idea: every module runs Learn, Practice, Feedback. Anchor: the numbered three-step sequence.

| # | Section | Data | Layout |
|---|---|---|---|
| 1 | Intro | `howItWorksPage.intro` | §2.1 |
| 2 | Steps (anchor) | `howItWorksPage.steps.title`, `howItWorks` | stacked, see below |
| 3 | Portal | `howItWorksPage.portal` (title, lede, `dashboardTitle`, `submitTitle`), `portalDashboardItems`, `submissionTypes` | split, `rule` |
| 4 | Outcomes | `howItWorksPage.outcomes.title`, `studentOutcomes` | split, `rule` |
| 5 | Goals + CTA | `howItWorksPage.goals.title`, `programGoals`, `howItWorksPage.cta` | stacked, `bg-tint` |

**Steps.** `<ol className="grid gap-10 md:grid-cols-3 md:gap-8">`. Each `li`: `border-t-2 border-green pt-6`; then the step number (`index + 1`, not data) as `<span aria-hidden className="font-display text-5xl font-bold text-green">`; `h3` = `step.step` ("Learn") at `mt-6 text-2xl`; `p` = `step.title` `mt-2 font-medium text-ink`; `p` = `step.description` `mt-2 text-muted`. The `ol` already conveys order to screen readers, hence aria-hidden numbers. At 390px: single column, gap-10. This is the only big type on the page after the h1; give it room (it is the anchor).

**Portal.** Right column: `grid gap-10 md:grid-cols-2`. Two blocks, each an `h3` (`text-xl`) then a plain `<ul>` of strings: `className="mt-4 divide-y divide-line border-y border-line"`, each `li` `py-3`. No icons.

**Outcomes.** Right column: `<ul className="grid border-t border-line md:grid-cols-2 md:gap-x-10">`, each `li` `border-b border-line py-4 font-display text-xl font-bold tracking-[-0.01em]`. Outcomes are statements a student keeps, so they get display type; goals below do not.

**Goals + CTA.** `<ol className="grid gap-x-10 gap-y-4 md:grid-cols-2 lg:grid-cols-3">`, each `li` `text-muted` with a leading `<span className="mr-2 font-medium text-subtle tabular-nums">{n}</span>` (two-digit, `01`–`09`; order is the proposal's). Then `mt-12` the one solid `ButtonLink` from `howItWorksPage.cta`, followed by a text link to `paths.modulesSection` labelled `howItWorksPage.modulesLink`.

Data to add to `howItWorksPage`: `portal.dashboardTitle: 'Your dashboard shows'`, `portal.submitTitle: 'Work you can submit for review'`, `cta: { label: 'Compare packages', to: 'packages' }`, `modulesLink: 'See the seven modules'`. Widen the `satisfies` type accordingly (add an explicit type for the page object rather than loosening to `unknown`).
Delete from `program.ts` if no consumer remains: `portalFeatures`, `overview` (grep first).
Headings: h1 → h2 ×4 → h3 under Steps and Portal only.

### 3.2 Packages — `src/features/site/pages/PackagesPage.tsx`
Idea: pay only for what you need. Anchor: a real comparison table.

| # | Section | Data | Layout |
|---|---|---|---|
| 1 | Intro | `packagesPage.intro`, `packagesPage.pricingNote` | §2.1; pricing note as `<p className="mt-4 text-sm text-subtle">` passed as part of the lede node |
| 2 | Compare (anchor) | `packagesPage.compare.title`, `programPackages`, `packageFeatures`, `packagesPage.table` | stacked |
| 3 | Single modules | `packagesPage.modules`, `modules` | split, `rule` |
| 4 | Hardship seats | `packagesPage.hardship` | split, `rule`; lede rendered as body `text-xl text-ink max-w-2xl` in the right column (pass no `lede` to Section; put the text in children) |
| 5 | Pilot + CTA, `id="pilot"` | `packagesPage.pilot`, `pilotFocusTitle`, `pilotFocus`, `pilotCta`, `packagesPage.cta` | split, `bg-tint` |

**Compare table** — new `src/features/site/components/PackageComparison.tsx` (a feature-by-package matrix with row headers is not the records `Table` primitive; it reuses its frame tokens). Props: `{ packages: ProgramPackage[]; features: PackageFeature[]; labels: { feature: string; included: string; notIncluded: string }; labelledBy: string }`.
- Markup: `<div className="rounded-table border border-line bg-card">` › `<table aria-labelledby={labelledBy} className="w-full table-fixed text-left">`. `<colgroup>`: first col `w-[34%]`, others equal.
- `thead`: first `th scope="col"` = `labels.feature` (`text-sm font-medium text-muted`). Each package `th scope="col"`: name `font-display text-lg md:text-xl font-bold text-ink`, then summary `mt-1 hidden text-sm font-normal text-muted md:block`. Padding `px-3 py-4 md:px-5 md:py-5`, `align-bottom`, `border-b border-line`.
- `tbody` rows `divide-y divide-line`: `th scope="row"` feature label `font-medium text-ink text-sm md:text-base`; cells `px-3 py-4 md:px-5`:
  - `true` → `<Icon name="check" size={20}/>` in `text-green`, plus `<span className="sr-only">{labels.included}</span>`.
  - `false` → `<span aria-hidden className="text-subtle">–</span>` + sr-only `labels.notIncluded`.
  - string → `<span className="text-sm font-medium text-ink">{value}</span>`.
- No highlighted column, no prices, no buttons in the table.
- 390px: fits without scrolling (`table-fixed`, 34% label column, qualifiers wrap). Because summaries hide below 680px, render the three summaries above the table on phones only: `<dl className="mb-6 grid gap-3 md:hidden">`, `dt` name `font-medium`, `dd` summary `text-muted`.
- Test `PackageComparison.test.tsx`: row headers are `th[scope=row]`; boolean cells expose "Included"/"Not included" text; string cells render the qualifier.

**Single modules.** Right column: `<List>` of `<ListRow to={modulePath(m.slug)} title={<><span className="mr-3 font-display text-subtle">{m.number}</span>{m.title}</>} trailing={<Icon name="arrow" size={18}/>}/>`. No summaries (the module pages hold them).

**Pilot.** Left: title + lede. Right: `h3` `pilotFocusTitle`, then `<ul className="mt-4 grid border-t border-line md:grid-cols-2 md:gap-x-10">` with `li` `border-b border-line py-3`. Then `<p className="mt-8 text-muted">{pilotCta}</p>` and `mt-6` the one solid `ButtonLink` from `packagesPage.cta`. Keep `id="pilot"` on the `Section` (paths.pilotSection depends on it; `scroll-mt-24` is already on Section).

Data to add to `packagesPage`: `table: { feature: 'What’s included', included: 'Included', notIncluded: 'Not included' }`, `cta: { label: 'Explore the modules', to: 'modulesSection' }`.
Delete from `program.ts` if no consumer remains: `accessOptions` (fully covered by packages, single modules and hardship).
Headings: h1 → h2 Compare / Single modules / Hardship / Pilot → h3 pilot focus.

### 3.3 Mentors — `src/features/site/pages/MentorsPage.tsx`
Idea: real people who have been through it review your work. Anchor: the typographic roles list.

| # | Section | Data | Layout |
|---|---|---|---|
| 1 | Intro | `mentorsPage.intro` | §2.1 |
| 2 | Network (anchor) | `mentorsPage.network.title`, `mentorNetwork` | stacked |
| 3 | How reviews work | `mentorsPage.howItWorks.title`, `mentorNetworkNotes` | split, `rule` |
| 4 | Community + CTA, `id="community"` | `mentorsPage.community`, `communityItems`, `mentorsPage.cta` | split, `bg-tint` |

**Network.** `<ul className="grid border-t border-line md:grid-cols-2 lg:grid-cols-3 md:gap-x-10">`; each `li` `border-b border-line py-6 md:py-8 font-display text-2xl md:text-3xl font-bold tracking-[-0.02em] text-ink`. Text only: no avatars, no icons, no names or photos (none exist in the proposal). The size is the design; this is the page's biggest type after the h1.

**How reviews work.** Right column: `<ul className="divide-y divide-line border-y border-line">`, each `li` `py-5 text-lg md:text-xl text-ink`. Three plain statements, no numbers (they are not steps).

**Community.** Left: title + lede. Right: `<ul className="grid gap-8 md:grid-cols-2">`; each `li` `border-t border-line-strong pt-4` with `h3` `text-lg` = title and `p` `mt-1 text-muted` = description. Then `mt-12` the one solid `ButtonLink` from `mentorsPage.cta`. Keep `id="community"` on the `Section`.

Data to add to `mentorsPage`: `cta: { label: 'Compare packages', to: 'packages' }`.
Headings: h1 → h2 ×3 → h3 under Community.

## 4. Copy rules
- Every visible string comes from `src/data/program.ts` or `src/data/modules.ts`. Components contain no program copy, labels included. Only exception: step numbers derived from array index.
- The only new strings allowed are the ones listed above, added by the page's builder to **its own page object** in `program.ts`: `howItWorksPage.portal.dashboardTitle`, `howItWorksPage.portal.submitTitle`, `howItWorksPage.cta`, `howItWorksPage.modulesLink`, `packagesPage.table`, `packagesPage.cta`, `mentorsPage.cta`. Each restates proposal §8/§9 wording or an existing site label; nothing else is added.
- `useDocumentTitle` stays as in the placeholders ('How it works', 'Packages', 'Mentors').
- Do not edit another builder's page object or page file. Add a shared `PageCta` type (`{ label: string; to: keyof typeof paths }`) to `src/types/` only if `paths` can be referenced without breaking the `types` → no-`app` dependency rule; otherwise declare `to` as a string-literal union of the needed keys (`'packages' | 'modulesSection'`) in `src/types/` like `homeRows` does. The How it works builder adds this type; the others import it.

## 5. Done when
- `npm run check` passes; new tests next to `Section` and `PackageComparison`.
- Each page renders at 1360px and 390px with no horizontal scroll; one h1; heading order has no skips; `#pilot` and `#community` deep links land on their sections.
- Portal pages and the home page are visually unchanged (spot-check `/portal` and `/`).
