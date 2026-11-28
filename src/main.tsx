import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from '@/app/App';
import { redirectAuthLink } from '@/app/authLinks';
import { redirectLegacyHashUrl } from '@/app/legacyRedirects';
import AuthProvider from '@/shared/auth/AuthProvider';
import '@/styles/app.css';

// Keep old hash-based links (e.g. /#module-02) working before the router reads the URL.
redirectLegacyHashUrl();
// Invite and password-reset links land on the home page; send them to the set-password page.
redirectAuthLink();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App/>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
