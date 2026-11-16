import { paths } from '@/app/paths';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { ButtonLink } from '@/shared/ui/Button';
import PageHeader from '@/shared/ui/PageHeader';

export default function NotFoundPage() {
  useDocumentTitle('Page not found');
  return (
    <div className="container-page py-20">
      <PageHeader eyebrow="Page not found" title="We couldn’t find" muted="that page." lede="The link may be out of date. Head back to the program overview or browse the modules.">
        <ButtonLink to={paths.modulesSection}>Explore the modules</ButtonLink>
        <ButtonLink to={paths.home} variant="outline">Back to overview</ButtonLink>
      </PageHeader>
    </div>
  );
}
