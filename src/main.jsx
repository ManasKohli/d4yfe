import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
import { redirectLegacyHashUrl } from './utils/legacyHashRedirect.js';
import './styles/styles.css';
import './styles/portal.css';
import './styles/curriculum.css';
import './styles/pages.css';
import './styles/app.css';

// Keep old hash-based links (e.g. /#module-02) working before the router reads the URL.
redirectLegacyHashUrl();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
