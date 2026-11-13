import { Outlet } from 'react-router';
import SiteFooter from '../components/SiteFooter.jsx';
import SiteHeader from '../components/SiteHeader.jsx';

export default function PublicLayout() {
  return (
    <>
      <SiteHeader/>
      <main id="main"><Outlet/></main>
      <SiteFooter/>
    </>
  );
}
