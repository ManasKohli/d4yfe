# D4Y Dental Research Program

Website for Dentistry 4 Youth's Dental Research Program, a three-module program that teaches pre-dental students to read scientific literature, develop a research question, and write scoping review objectives.

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
| `/` | Program overview (sections: `#modules`, `#approach`) |
| `/modules/:moduleNumber` | A single curriculum module, e.g. `/modules/01` |
| `/application-support` | Dental school application support modules |
| `/program-details` | Program model (sections: `#community`, `#goals`) |
| `*` | 404 page |

Old hash links (e.g. `/#module-02`, `/#program-model`) are redirected to the new paths on load by `src/utils/legacyHashRedirect.js`.

## Project structure

```
src/
  main.jsx            Entry point: router, global styles, legacy URL redirect
  App.jsx             Layout (header, footer) and route table
  routes.js           Central list of URL paths
  pages/              One component per route
  components/         Reusable UI (Icon, Reveal, LessonCard, CurriculumSection, ...)
  data/               Page content, separated from the UI
  hooks/              useDocumentTitle
  utils/              legacyHashRedirect
  styles/             Global and page-level CSS
```

## Editing curriculum content

All research curriculum content is stored in `src/data/curriculum.js`. Each module has `days`, and each day has `sections`. A section can use any of these optional fields, and `LessonCard` picks the matching layout:

- `intro`, `body`, `note`: paragraphs
- `bullets`: a list
- `chips`: pill labels
- `threeCols`, `fourCs`, `comparison`: grids of `[title, text]` pairs

To add a module, add an object to the `curriculum` array. The overview cards, module tabs, previous/next links and the `/modules/:moduleNumber` page update automatically.

## Deployment

The repository is connected to Vercel. `vercel.json` sets the Vite build and rewrites every path to `index.html`, so deep links like `/modules/02` load correctly. Hashed files in `/assets` are cached for a long time.
