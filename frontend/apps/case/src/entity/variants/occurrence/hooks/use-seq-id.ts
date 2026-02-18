import { createContext, useContext } from 'react';

export const SeqIDContext = createContext<number>(-1);

export function useSeqIdContext() {
  const context = useContext(SeqIDContext);
  if (!context) {
    throw new Error('useSeqIdContext must be used within a SeqIDContext');
  }
  return context;
}
