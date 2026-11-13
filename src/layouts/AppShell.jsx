import { Link, NavLink, Outlet } from 'react-router';
import Brand from '../components/Brand.jsx';
import { demoNotice } from '../data/demo.js';
import { areas } from '../data/portal.js';
import { paths } from '../routes.js';

/**
 * Layout for a signed-in area (student, mentor, admin): brand, area name, the person, and the area's tabs.
 * `user` is { name, initials } and will come from the Supabase session.
 */
export default function AppShell({ area, basePath, user }) {
  const { label, nav } = areas[area];
  return (
    <div className="app">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="app-bar">
        <div className="app-bar-left">
          <Brand aria-label="Dentistry for Youth, public site"/>
          <span className="app-area">{label}</span>
        </div>
        <div className="app-user">
          <span className="app-avatar" aria-hidden>{user.initials}</span>
          <span className="app-user-name">{user.name}</span>
          <Link to={paths.login} className="app-signout">Sign out</Link>
        </div>
      </header>
      <nav className="app-nav" aria-label={label}>
        <div className="app-nav-inner">
          {nav.map(item => (
            <NavLink key={item.label} to={item.to ? `${basePath}/${item.to}` : basePath} end={item.end}>{item.label}</NavLink>
          ))}
        </div>
      </nav>
      <div className="app-notice"><p className="section-wrap">{demoNotice}</p></div>
      <main id="main" className="app-main section-wrap"><Outlet/></main>
    </div>
  );
}
