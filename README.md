# D4Y Dental Pathway Program — frontend

The web frontend for Dentistry for Youth's Dental Pathway Program: a modular, digital program that supports students through the dental school application process.

**This repository is the frontend only.** The API (FastAPI) and the database (Supabase) live elsewhere. Until they are connected, the signed-in areas run on sample data (see [Backend](#backend)).

Content follows two D4Y sources: the *Dental Pathway Program — Program Development Proposal* and D4Y's portal prototype. See `CLAUDE.md` for the content and design rules.

Live site: https://eduplatform-rosy.vercel.app/

## What's built

**Public site**

- Program overview: the seven modules, how the program works, and program goals
- A page for each module: Applicant Strategy & Prerequisites, DAT Preparation, CASPer Preparation, Personal Statement Lab, Experiences & Application Entries, Interview Preparation, Final Application Check-In
- Program details: student portal, access options and packages, mentor network, community, pilot cohort
- Sign-in page (a stub, with preview links into each signed-in area)

**Student portal** (`/portal`)

- Home with enrolment and progress
- Module chapters, assignments, and mentor feedback (rubric scores, strengths, priorities, follow-up question)
- Sessions, resources, school requirements, and community channels

**Mentor area** (`/mentor`)

- Dashboard and review queue, with escalation by days open
- Review page with the module rubric
- Availability and volunteer hours

**Admin** (`/admin`)

- Overview of the pilot cohort
- Students, mentors, open reviews, and hardship seat applications

## Tech stack

- [React 19](https://react.dev/) with hooks
- [React Router](https://reactrouter.com/) for client-side routing
- [Vite](https://vite.dev/) for development and production builds
- Plain CSS (custom properties, Grid, responsive breakpoints at 900px and 680px)
- [ESLint](https://eslint.org/) with the React Hooks and React Refresh rules
- Deployed on [Vercel](https://vercel.com/) (see `vercel.json`)

## Getting started

Requires Node 20.19 or later (`.nvmrc` pins the version; run `nvm use`).

```sh
npm install
npm run dev       # start the dev server
npm run lint      # ESLint
npm run build     # production build into dist/
npm run check     # lint, then build; run before every push
npm run preview   # serve the production build locally
```

No environment variables are needed yet. Every page works against the sample data in `src/data/demo.js`.

## Backend

The full app has three parts:

| Part | Technology | Where |
| --- | --- | --- |
| Frontend | React + Vite | This repository |
| API | FastAPI (Python) | Separate repository |
| Database, auth, file storage | Supabase (Postgres) | Supabase project |

Neither the API nor Supabase is connected yet. The planned flow:

1. The user signs in with Supabase Auth from the frontend.
2. The frontend reads the user's role (student, mentor, admin) and sends them to that role's home (`roles` in `src/features/auth/auth.js`).
3. The frontend calls the FastAPI service for data, passing the Supabase session token. FastAPI checks the token and reads and writes Postgres.

To connect it, this repo needs:

- **Sign-in:** replace `signIn` in `src/features/auth/auth.js` with Supabase Auth, and guard `/portal`, `/mentor`, and `/admin` by role. Each area mounts through one component (`StudentRoutes`, `MentorRoutes`, `AdminRoutes`), so a role guard wraps that component's `AppShell` route.
- **Data:** replace imports from `src/data/demo.js` with API calls. Every per-person record (students, enrolment, assignments, feedback, sessions, reviews, availability, hours, roster, hardship applications) lives in that one file, so it doubles as a list of what the API must return.
- **Config:** add the Supabase URL, the Supabase anon key, and the API base URL as `VITE_` environment variables, locally and in Vercel. Never put the Supabase service role key in this repo; only the API should hold it.

Program content (modules, rubrics, statuses, escalation rules) stays in `src/data/` and does not move to the database.

## Routes

| Path | Page |
| --- | --- |
| `/` | Program overview (sections: `#modules`, `#how-it-works`, `#goals`) |
| `/modules/:slug` | A single module, e.g. `/modules/casper` |
| `/program-details` | How it works (sections: `#portal`, `#options`, `#mentors`, `#community`, `#pilot`) |
| `/login` | Sign in (stub until Supabase), with preview links to each area |
| `/portal` | Student portal: home, `modules/:slug`, `assignments`, `feedback`, `feedback/:id`, `sessions`, `resources`, `schools`, `community` |
| `/mentor` | Mentor area: dashboard, `reviews`, `reviews/:id`, `availability`, `hours` |
| `/admin` | Admin: overview, `students`, `mentors`, `reviews`, `hardship` |
| `*` | 404 page |

Module slugs: `applicant-strategy`, `dat`, `casper`, `personal-statement`, `application-entries`, `interview`, `final-check-in`.

Old URLs (`/application-support`, `/modules`, `/#module-02`, `/#program-model`, …) redirect to the current pages.

## Project structure

The code is organised by feature: each part of the product owns its pages and components, and anything used by more than one feature lives in `shared/`.

```
src/
  main.jsx                 Entry: router, styles, legacy hash redirect
  app/                     App-wide wiring
    App.jsx                Top-level route table; lazy-loads each signed-in area
    paths.js               Every URL path in one place
    ErrorBoundary.jsx      Recovery page for render errors and failed chunk loads
    ScrollManager.jsx      Scroll to top or to the #section on navigation
    legacyRedirects.js     Old hash URLs (/#module-02) to current paths
  features/
    site/                  Public site: PublicLayout, pages/ (home, module, program details), components/
    auth/                  LoginPage and the sign-in stub (auth.js)
    student/               StudentRoutes.jsx, pages/, components/
    mentor/                MentorRoutes.jsx, pages/, components/
    admin/                 AdminRoutes.jsx, pages/, reviewAge.js
  shared/
    components/            UI used by more than one feature (Panel, StatusPill, PageHeader, Icon, Reveal, ...)
    layouts/AppShell.jsx   Shell for the signed-in areas
    hooks/                 useDocumentTitle
    lib/format.js          Dates, numbers, plurals
  data/                    Program content and sample records (no code imports here)
    modules.js             The seven modules: public content and portal chapters
    program.js             Goals, portal, access options, mentors, community, pilot, outcomes
    portal.js              Signed-in area rules and labels: nav, statuses, rubrics, escalation
    demo.js                Sample records until the API is connected
  styles/
    index.css              Imports every stylesheet in cascade order
    tokens.css, base.css   Design tokens; element defaults and the page container
    public/                site.css, portal.css, curriculum.css, pages.css
    app/app.css            Signed-in areas and the login page
```

## Conventions

- **Imports use the `@/` alias** for anything under `src/` (`import Panel from '@/shared/components/Panel.jsx'`). Only packages use bare names. Configured in `vite.config.js` and mirrored in `jsconfig.json` for editors.
- **Dependencies point one way:** `app/` → `features/` → `shared/` → `data/`. A feature never imports from another feature; if two features need something, move it to `shared/`. `shared/` never imports from `features/`.
- **Content stays in `src/data/`.** Components render data; they don't hold program copy.
- **Each signed-in area is a separate chunk.** `App.jsx` mounts `/portal/*`, `/mentor/*`, and `/admin/*` with `React.lazy`, and each area's `*Routes.jsx` owns its route table. Public pages load up front.
- **Adding a page:** create it in the feature's `pages/`, add its route to that feature's route table (or `App.jsx` for public pages), add its path to `app/paths.js` if other pages link to it, and call `useDocumentTitle`.
- **Adding styles:** reuse classes in `src/styles/` first. A new stylesheet goes into `styles/index.css` at the right place in the cascade, not at the end by default.
- **No barrel files** (`index.js` re-exports). Import from the file itself, so bundles stay small and imports stay searchable.

## Editing content

Module content is in `src/data/modules.js`. Each module has `parts` (workshop, practice, review, …) and each part has `sections`. A section can use any of these optional fields, and `LessonCard` picks the matching layout:

- `intro`, `body`, `note`: paragraphs
- `bullets`: a list
- `chips`: pill labels

Adding a module to the array updates the hero list, module cards, module tabs, portal chapters, and previous/next links automatically.

Program-level content (goals, portal features, packages, mentor network, community, pilot) is in `src/data/program.js`. Rules for the signed-in areas (rubrics, statuses, escalation, session and mentor rules) are in `src/data/portal.js`.

## Deployment

The repository is connected to Vercel. `vercel.json` sets the Vite build and rewrites every path to `index.html`, so deep links like `/modules/casper` and `/portal/assignments` load correctly. Hashed files in `/assets` are cached for a long time. Every response also gets basic security headers (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`).
