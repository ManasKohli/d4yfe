import { Link } from 'react-router';
import { modulePath, paths } from '@/app/paths';
import { modules } from '@/data/modules';
import { hero, homeRows } from '@/data/program';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { ButtonLink } from '@/shared/ui/Button';
import Eyebrow from '@/shared/ui/Eyebrow';
import Icon from '@/shared/ui/Icon';

/** Faint concentric rings behind the hero: the site's one decorative element (design doc, premise 2). */
function Rings() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 hidden h-full overflow-hidden md:block">
      {[36, 56, 76, 96].map(size => (
        <span
          key={size}
          className="absolute top-[45%] left-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-line"
          style={{ width: `${size}rem` }}
        />
      ))}
    </div>
  );
}

function Hero() {
  return (
    <section className="relative isolate">
      <Rings/>
      <div className="container-page animate-reveal pt-16 pb-14 md:pt-24 lg:pt-28 lg:pb-16 lg:text-center">
        <Eyebrow>{hero.eyebrow}</Eyebrow>
        <h1 className="text-hero leading-[1.05] md:text-6xl lg:mx-auto lg:max-w-4xl lg:text-7xl">
          {hero.headline}<br/><span className="text-heading-muted">{hero.headlineMuted}</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted lg:mx-auto">{hero.subline}</p>
        <div className="mt-8 flex flex-col gap-3 md:flex-row lg:justify-center">
          <ButtonLink to={paths.modulesSection}>Explore the modules</ButtonLink>
          <ButtonLink to={paths.howItWorksSection} variant="outline">How it works</ButtonLink>
        </div>
      </div>
    </section>
  );
}

/** Seven modules: a list of rows on phones, a grid from 680px (design review D3). */
function Modules() {
  return (
    <section id="modules" aria-labelledby="modules-title" className="scroll-mt-24 pb-16 md:pb-20">
      <div className="container-page">
        <h2 id="modules-title" className="sr-only">The seven modules</h2>
        <ol className="grid gap-2 md:grid-cols-2 md:gap-3 lg:grid-cols-4 xl:grid-cols-7">
          {modules.map(module => (
            <li key={module.slug}>
              <Link
                to={modulePath(module.slug)}
                className="group flex h-full min-h-14 items-center gap-4 rounded-card border border-line bg-card px-4 py-3 no-underline shadow-soft transition-colors hover:border-line-strong md:min-h-32 md:flex-col md:items-start md:justify-between md:p-4"
              >
                <span className="font-display text-sm font-bold text-subtle">{module.number}</span>
                <span className="flex-1 text-base leading-snug font-medium text-ink">{module.title}</span>
                <span className="text-muted transition-transform group-hover:translate-x-0.5 md:self-end"><Icon name="arrow" size={18}/></span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Three editorial rows instead of a card grid (design review D4). */
function Rows() {
  return (
    <section id="how-it-works" aria-label="About the program" className="scroll-mt-24 pb-8">
      <div className="container-page">
        <ul className="border-t border-line">
          {homeRows.map(row => (
            <li key={row.title}>
              <div className="grid gap-2 border-b border-line py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10 md:py-10">
                <h2 className="text-2xl md:text-3xl">{row.title}</h2>
                <div>
                  <p className="max-w-xl text-lg text-muted">{row.description}</p>
                  <Link to={paths[row.to]} className="mt-3 inline-flex min-h-11 items-center gap-1.5 font-medium text-green hover:underline">
                    {row.linkLabel} <Icon name="arrow" size={16}/>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function HomePage() {
  useDocumentTitle();
  return (
    <>
      <Hero/>
      <Modules/>
      <Rows/>
    </>
  );
}
