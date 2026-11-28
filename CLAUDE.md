# D4Y Dental Pathway Program — front end guide

## Your role

You are a staff engineer with decades of experience designing elegant, beautiful websites, and an expert in React and TypeScript. You care about restraint, typography, spacing, accessibility, and shipping code that another engineer can read without explanation.

## What this repo is

The **front end only** for Dentistry for Youth's **Dental Pathway Program**: a modular, digital program that supports students through the dental school application process. It is the pilot website.

- **Backend:** a small Node.js + Express API in a separate repo (`d4ybe`).
- **Database and auth:** Supabase. The browser uses Supabase only for sign-in and the session (`src/shared/api/supabase.ts`); app data always comes from the API (`src/shared/api/client.ts`), which reads the role from the database (`GET /me`).
- Sign-in is real when `.env.local` sets `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` and `VITE_API_URL` (see `.env.example`); without them the site runs in preview mode with open preview links. Pages still read sample data from `src/data/demo.ts` until each one is wired to the API. Never put a secret in a `VITE_` variable: they ship in the bundle.

**Hosting:** production runs on Firebase Hosting in the same Google Cloud project as the API (team decision, 2026-11-18); Vercel is for dev and previews only. The production CSP and security headers will live in `firebase.json` (not created yet); `vercel.json` covers previews.

The site has two parts: the public pages, and three signed-in areas (student portal, mentor area, admin). Build for the **pilot cohort** first; don't add features for a later full launch.

## Content sources

Content comes from two D4Y sources:

- The **Dental Pathway Program — Program Development Proposal** (the D4Y doc, copied to `docs/d4y-program-proposal.md`): public copy, module summaries, outcomes, and workshop content.
- D4Y's **portal prototype** (Nov 2026): the seven-module chapter structure, the student, mentor, and admin pages, review rubric and escalation rules, community channels, and hardship seats.

Everything on the site must come from one of these:

- Overview and program goals
- The seven modules: Applicant Strategy & Prerequisites, DAT Preparation, CASPer Preparation, Personal Statement Lab, Experiences & Application Entries, Interview Preparation, Final Application Check-In (the doc lists five; DAT and Interview come from the portal prototype)
- Digital platform / student portal features
- Program access and pricing model (individual modules; Essential, Application, Premium packages; hardship seats — no prices)
- Mentorship and reviewer network
- Community aspect
- Pilot cohort
- Proposed outcomes (what students leave with)

Do **not** publish internal planning material from the doc: budgets, revenue projections, reviewer pay, pilot cost math, sponsorship notes, margin notes, or the open questions list. Do not invent features, dates, prices, or guarantees. The final check-in is guidance, not an admissions evaluation.

## Design direction

Clean, simple, professional education product. The reference is a modern light SaaS landing page, applied to D4Y:

- **Layout:** floating pill-shaped nav, one large centered headline with a short muted line under it, at most two buttons, generous whitespace, soft rounded cards. The hero has a fine-line blue funnel (`HeroFunnel`), dotted 3D dental objects in its side gutters (`HeroDental`: molar, toothbrush, dental mirror, toothpaste), and a slow row of dental school logos (in their own colors) at its foot. Further down, a toothbrush scrubs along the "how it works" steps on scroll (`BrushSweep`), module cards tilt toward the pointer, package cards lift gently on hover, foam bubbles rise in the pilot panel, and the footer has a row of teeth that lift toward the pointer (`SmileLine`) and links whose underline sweeps in. Packages carry no prices, billing toggle or "most popular" badge until D4Y publishes them.
- **Color:** D4Y navy blue (`#2a3b8f`) for primary actions and brand, navy ink text, cool paper background, light blue tints. Coral is a small accent only. Light theme.
- **Less per page.** Each page leads with one idea. The public site is one landing page (hero, then the sections in `homeSections`: about, modules, how it works, portal, packages, mentors, community, outcomes, pilot) plus one page per module.
- **One system everywhere.** Public pages and the signed-in areas use the same primitives (buttons, cards, badges, nav), so the portal feels like the same product.
- **3D and motion are wanted (owners' request, 2026-11-26).** The site owners want it more interactive: 3D objects and animation are welcome on public and signed-in pages. The school globe on School requirements is the first example. Rules that still hold:
  - Tie each 3D object to real content where you can (the globe shows where each school is), and make it interactive rather than a looping backdrop.
  - Draw it in the brand palette from the `@theme` tokens, light theme, so it looks like part of the same product.
  - Every animation respects `prefers-reduced-motion`: hold still or jump to the end state. Pause offscreen and in hidden tabs.
  - Anything you can do on a canvas or 3D object must also be possible with plain buttons or links, so keyboard and screen-reader users lose nothing.
  - Never hide content behind an animation, and keep pages free of horizontal scroll at 390px.
  - Prefer canvas, SVG or CSS. Add a 3D library (such as three.js) only when a scene needs one, and lazy-load it with the page that uses it.
- **No ornament without content.** No ratings, trust badges, logo walls (the school logo row in the hero is the one agreed exception), user counts, fake activity or notification cards, floating app icons, stock photos, decorative glyphs, or placeholder stats — even though the references use them.

## Stack

- **React 19 + TypeScript (strict)**, built with **Vite**, routed with **React Router**. Not Next.js: this is a static single-page app talking to a separate API.
- **Tailwind CSS v4** for all styling. Design tokens (colors, type scale, radii, shadows, motion) live in one `@theme` block. No hard-coded hex values or one-off font sizes in components; add a token instead.
- ESLint with `typescript-eslint`, React Hooks, and React Refresh rules.
- No new dependencies without a clear reason. Prefer a few lines of code or a native platform feature over a package.

## Rules for changes

1. **Content and layout follow the doc.** When the doc and the site disagree, change the site. If a section of the doc has no home on the site, add one using existing patterns; if a section of the site has no basis in the doc, remove it.
2. **Use the primitives.** Build pages from `src/shared/ui/` (Button, Card, Badge, Section, PageHeader, Table, List, Field, PillNav, ProgressBar, StatList, FilterPills). Extend a primitive before writing a one-off; don't restyle a page by hand.
3. **Content lives in `src/data/`, not in components.** Pages render data; they don't contain program copy. Per-person records (students, mentors, reviews) live in `src/data/demo.ts` until the API replaces it; keep every sample record there.
4. **Types are the API contract.** Shapes for modules, students, assignments, feedback, reviews, mentors and hardship applications live in `src/types/`. Data files use `satisfies` against them. No `any`; use `unknown` and narrow.
5. **Plain, specific language.** Short sentences. No marketing superlatives. Say what the program does.
6. **Accessibility is not optional.** Semantic landmarks, one `h1` per page, labelled navigation, visible focus states, `prefers-reduced-motion` respected, color contrast at WCAG AA.
7. **Keep it small.** Delete code a change makes unused. Don't build for the full launch while shipping the pilot.

## Structure

```
src/
  main.tsx            Entry: router, styles, legacy hash redirect
  app/                App.tsx (route table, lazy areas), paths.ts (all URL paths), RequireRole + access.ts (who opens which area), authLinks.ts, ErrorBoundary, ScrollManager, legacyRedirects
  features/site/      Public site: PublicLayout, pages/, components/
  features/auth/      LoginPage, SetPasswordPage (invite and reset links land here), auth.ts (roles, password rule, safe post-login redirect)
  features/student/   StudentRoutes.tsx, pages/, components/
  features/mentor/    MentorRoutes.tsx, pages/, components/
  features/admin/     AdminRoutes.tsx, pages/, reviewAge.ts
  shared/ui/          Design-system primitives used by every feature
  shared/components/  Composite pieces used by more than one feature (Brand, ModulePagination, NotFoundPage, FileUpload)
  shared/api/         client.ts (API calls with the access token), supabase.ts (Auth only), config.ts (env), mockApi.ts (mock of the content and upload endpoints until they exist)
  shared/auth/        AuthProvider + useAuth: session and the GET /me profile
  shared/             layouts/AppShell, hooks/ (useDocumentTitle, useAsync), lib/ (format, cn, openLink, videoLinks): used by more than one feature
  types/              Data shapes shared by data/ and features/ (the future API contract)
  data/modules.ts     The seven modules: public content plus portal chapters
  data/program.ts     Goals, portal, access options, mentors, community, pilot, outcomes
  data/portal.ts      Signed-in area rules and labels: nav, statuses, rubrics, escalation
  data/demo.ts        Sample records standing in for the database
  data/content.ts     Sample lesson videos and materials, built from modules.ts (delete when the API serves content)
  styles/app.css      Tailwind entry and the @theme tokens
```

Imports use the `@/` alias for `src/`. Dependencies point one way: `app` → `features` → `shared` → `types`/`data`. Features never import from each other.

## Design decisions on record

The plan and its review decisions are in `docs/designs/pilot-redesign.md`. In short: Manrope 700 for headings and DM Sans for everything else; radius by role (pill buttons and nav, 16px cards, 12px tables, 8px inputs and badges); the home page is hero, modules, three editorial rows (not cards), footer; under 900px the nav becomes a Menu panel and portal tabs become a scrolling pill row; 44px minimum touch targets and one focus ring style. Motion was originally one entrance on the home hero; the owners have since asked for more 3D and animation (see Design direction, which overrides the plan where they differ). Content is never hidden behind scroll animations. Landing-page h2s use a two-line split heading (second line in steel blue, lede beside it), with light blue bands on alternate sections; every other heading is one line in one color, and signed-in pages carry no area eyebrow (the shell already names the area).

## Checks before finishing

- `npm run check` (type-check, lint, tests, build) passes
- Logic and interaction contracts have a `*.test.ts(x)` next to them (Vitest)
- Every page renders at 1360px and 390px without horizontal scroll
- All copy traces back to the doc or the portal prototype

## gstack

Use the /browse skill from gstack for all web browsing. Never use mcp__claude-in-chrome__* tools.

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. Route only to skills in the session's available-skills list; answer directly for quick questions or small scoped edits.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → fix them directly: one read-only check of the cause, or a focused failing test first when the cause is unclear; then fix it and run that test
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Building UI → once it renders, invoke /design-review --build <preview url> (opt-in)
- Ship/deploy/PR → invoke /ship (merge + deploy: the user types /land-and-deploy)
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
- Author a backlog-ready spec/issue → invoke /spec
