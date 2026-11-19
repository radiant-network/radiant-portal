import { createContext, useContext } from 'react';

import type { CNVProfileFocus } from './libs/focus';

export type CNVProfileContextValue = {
  available: boolean;
  open: (focus?: CNVProfileFocus) => void;
  /** Tells the CNV table that a CNV changed in the profile, such as its comments. */
  occurrenceChanged: () => void;
};

export const CNVProfileContext = createContext<CNVProfileContextValue>({
  available: false,
  open: () => {},
  occurrenceChanged: () => {},
});

/**
 * Opens the CNV profile of the sequencing, on the whole genome or on a CNV. Outside a
 * CNVProfileProvider, the profile is unavailable.
 */
export const useCNVProfile = () => useContext(CNVProfileContext);
