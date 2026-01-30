import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import QuerybuidlerV3 from './entity';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QuerybuidlerV3 />
  </StrictMode>,
);
