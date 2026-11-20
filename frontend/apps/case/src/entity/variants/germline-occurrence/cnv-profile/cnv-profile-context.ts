import { createContext, useContext } from 'react';

import type { CNVProfileFocus } from './libs/focus';

export type CNVProfileContextValue = {
  available: boolean;
  open: (focus?: CNVProfileFocus) => void;
  occurrenceChanged: () => void;
};

export const CNVProfileContext = createContext<CNVProfileContextValue>({
  available: false,
  open: () => {},
  occurrenceChanged: () => {},
});

export const useCNVProfile = () => useContext(CNVProfileContext);
