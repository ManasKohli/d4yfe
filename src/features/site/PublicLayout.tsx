import { Outlet } from 'react-router';
import SiteFooter from '@/features/site/components/SiteFooter';
import SiteHeader from '@/features/site/components/SiteHeader';
import SkipLink from '@/shared/ui/SkipLink';

export default function PublicLayout() {
  return (
    <>
      <SkipLink/>
      <SiteHeader/>
      <main id="main" tabIndex={-1} className="outline-none"><Outlet/></main>
      <SiteFooter/>
    </>
  );
}
