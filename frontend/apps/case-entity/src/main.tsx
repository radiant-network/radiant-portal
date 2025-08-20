import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

import '@/themes/tailwind.base.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
