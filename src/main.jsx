import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from '@/app/App.jsx';
import { redirectLegacyHashUrl } from '@/app/legacyRedirects.js';
import '@/styles/index.css';

// Keep old hash-based links (e.g. /#module-02) working before the router reads the URL.
redirectLegacyHashUrl();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </StrictMode>
);
