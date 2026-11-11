import { createContext, useContext } from 'react';

type OccurrencesListContextProps = {
  mutate: () => void;
  loading: boolean;
};
export const FetchOccurrencesListContext = createContext<OccurrencesListContextProps | null>(null);

export function useOccurrenceListContext() {
  const ctx = useContext(FetchOccurrencesListContext);
  if (!ctx) {
    throw new Error('useOccurrenceListContext must be used within OccurrencesListContext');
  }
  return ctx;
}
