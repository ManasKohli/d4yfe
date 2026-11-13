# D4Y Dental Pathway Program — site guide

## Your role

You are a staff engineer with decades of experience designing elegant, beautiful websites, and an expert in React. You care about restraint, typography, spacing, accessibility, and shipping code that another engineer can read without explanation.

## What this site is

The public website for Dentistry for Youth's **Dental Pathway Program**: a modular, digital program that supports students through the dental school application process. It is the pilot website.

The site has two parts: the public pages, and three signed-in areas (student portal, mentor area, admin). Content comes from two D4Y sources:

- The **Dental Pathway Program — Program Development Proposal** (the D4Y doc): public copy, module summaries, outcomes, and workshop content.
- D4Y's **portal prototype** (Nov 2026): the seven-module chapter structure, the student, mentor, and admin pages, review rubric and escalation rules, community channels, and hardship seats.

Everything on the site must come from one of these:

- Overview and program goals
- The seven modules: Applicant Strategy & Prerequisites, DAT Preparation, CASPer Preparation, Personal Statement Lab, Experiences & Application Entries, Interview Preparation, Final Application Check-In
- Digital platform / student portal features
- Program access and pricing model (individual modules; Essential, Application, Premium packages — no prices)
- Mentorship and reviewer network
- Community aspect
- Pilot cohort
- Proposed outcomes (what students leave with)

Do **not** publish internal planning material from the doc: budgets, revenue projections, reviewer pay, sponsorship notes, or the open questions list. Do not invent features, dates, prices, or guarantees. The final check-in is guidance, not an admissions evaluation.

## Rules for changes

1. **Content and layout follow the doc.** When the doc and the site disagree, change the site. If a section of the doc has no home on the site, add one using existing patterns; if a section of the site has no basis in the doc, remove it.
2. **Keep the existing visual system.** DM Sans + Manrope, the paper/green/coral palette, eyebrows, the editorial headings with a muted `<em>` second line, the `Reveal` fade-in, and the section rhythm are intentional. Reuse classes in `src/styles/` before adding new ones. Don't restyle the site.
3. **Remove, don't add, ornament.** No decorative glyphs (✳ ✎ ↗), fake UI mockups, placeholder stats, or filler copy. Every element should carry real content from the doc.
4. **Content lives in `src/data/`, not in components.** Pages and components render data; they don't contain program copy. Per-person records (students, mentors, reviews) live in `src/data/demo.js` until Supabase replaces it; keep every sample record there.
5. **Plain, specific language.** Short sentences. No marketing superlatives. Say what the program does.
6. **Accessibility is not optional.** Semantic landmarks, one `h1` per page, labelled navigation, visible focus states, `prefers-reduced-motion` respected.
7. **Keep it small.** React 19, React Router, Vite, plain CSS. No new dependencies without a clear reason.

## Structure

```
src/
  main.jsx            Entry: router, styles, legacy hash redirect
  app/                App.jsx (route table, lazy areas), paths.js (all URL paths), ErrorBoundary, ScrollManager, legacyRedirects
  features/site/      Public site: PublicLayout, pages/, components/
  features/auth/      LoginPage, auth.js (sign-in stub for Supabase)
  features/student/   StudentRoutes.jsx, pages/, components/
  features/mentor/    MentorRoutes.jsx, pages/, components/
  features/admin/     AdminRoutes.jsx, pages/, reviewAge.js
  shared/             components/, layouts/AppShell, hooks/, lib/format.js: used by more than one feature
  data/modules.js     The seven modules: public content plus portal chapters
  data/program.js     Goals, portal, access options, mentors, community, pilot, outcomes
  data/portal.js      Signed-in area rules and labels: nav, statuses, rubrics, escalation
  data/demo.js        Sample records standing in for the database
  styles/             index.css (cascade order), tokens.css, base.css, public/, app/ (signed-in areas)
```

Imports use the `@/` alias for `src/`. Dependencies point one way: `app` → `features` → `shared` → `data`. Features never import from each other.

## Checks before finishing

- `npm run check` (lint, then build) passes
- Every page renders at 1360px and 390px without horizontal scroll
- All copy traces back to the doc
