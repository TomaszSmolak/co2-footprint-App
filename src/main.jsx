/**
 * App-Bootstrap
 * - Bindet globale Styles & Vendor-CSS.
 * - Mountet die App in #root mit React StrictMode und React Router.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/variables.css';        
import './index.css';                   
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'flag-icons/css/flag-icons.min.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Router für Client-Side-Routing */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);