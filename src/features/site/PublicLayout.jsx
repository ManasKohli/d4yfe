import { Outlet } from 'react-router';
import SiteFooter from '@/features/site/components/SiteFooter.jsx';
import SiteHeader from '@/features/site/components/SiteHeader.jsx';

export default function PublicLayout() {
  return (
    <>
      <SiteHeader/>
      <main id="main"><Outlet/></main>
      <SiteFooter/>
    </>
  );
}
