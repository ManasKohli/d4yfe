# D4Y Dental Pathway Program

Website for Dentistry for Youth's Dental Pathway Program: a modular, digital program that supports students through the dental school application process. Content follows the D4Y program development proposal; see `CLAUDE.md` for the content and design rules.

Live site: https://eduplatform-rosy.vercel.app/

## Tech stack

- [React 19](https://react.dev/) with hooks
- [React Router](https://reactrouter.com/) for client-side routing
- [Vite](https://vite.dev/) for development and production builds
- Plain CSS (custom properties, Grid, responsive breakpoints at 900px and 680px)
- Deployed on [Vercel](https://vercel.com/) (see `vercel.json`)

## Getting started

```sh
npm install
npm run dev       # start the dev server
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

## Routes

| Path | Page |
| --- | --- |
| `/` | Program overview (sections: `#modules`, `#how-it-works`, `#goals`) |
| `/modules/:slug` | A single module, e.g. `/modules/casper` |
| `/program-details` | How it works (sections: `#portal`, `#options`, `#mentors`, `#community`, `#pilot`) |
| `*` | 404 page |

Module slugs: `applicant-strategy`, `casper`, `personal-statement`, `application-entries`, `final-check-in`.

Old URLs (`/application-support`, `/#module-02`, `/#program-model`, …) redirect to the current pages.

## Project structure

```
src/
  main.jsx            Entry point: router, global styles, legacy URL redirect
  App.jsx             Layout (header, footer) and route table
  routes.js           Central list of URL paths
  pages/              One component per route
  components/         Reusable UI (Icon, Reveal, LessonCard, CurriculumSection, ...)
  data/modules.js     The five program modules
  data/program.js     Goals, portal, access options, mentors, community, pilot, outcomes
  hooks/              useDocumentTitle
  utils/              legacyHashRedirect
  styles/             Global and page-level CSS
```

## Editing content

Module content is in `src/data/modules.js`. Each module has `parts` (workshop, practice, review, …) and each part has `sections`. A section can use any of these optional fields, and `LessonCard` picks the matching layout:

- `intro`, `body`, `note`: paragraphs
- `bullets`: a list
- `chips`: pill labels

Adding a module to the array updates the hero list, module cards, module tabs, and previous/next links automatically.

Program-level content (goals, portal features, packages, mentor network, community, pilot) is in `src/data/program.js`.

## Deployment

The repository is connected to Vercel. `vercel.json` sets the Vite build and rewrites every path to `index.html`, so deep links like `/modules/casper` load correctly. Hashed files in `/assets` are cached for a long time.
