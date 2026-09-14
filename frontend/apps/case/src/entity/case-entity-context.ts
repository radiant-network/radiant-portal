import { createContext } from 'react';

import type { CaseEntity } from '@/api/api';

/**
 * The case being displayed. It lives apart from the page component so cells and sliders deep in
 * the variants tab can read it without importing the page back, which would be an import cycle.
 */
export const CaseEntityContext = createContext<CaseEntity | undefined>(undefined);
