import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/theme.css';

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

// GitHub Pages sends unknown paths to public/404.html. That page preserves
// the requested route in the query string; restore it before React Router
// reads the location.
const githubPagesRoute = window.location.search.slice(1);
if (githubPagesRoute.startsWith('/')) {
  const restoredRoute = githubPagesRoute.replace(/~and~/g, '&');
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  window.history.replaceState(null, '', `${basePath}${restoredRoute}`);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={routerBasename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
