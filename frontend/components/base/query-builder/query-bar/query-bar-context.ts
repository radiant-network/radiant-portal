import { createContext, useContext } from 'react';

import { QueryInstance } from '@/components/cores/query-builder';

export type QueryBarContextType = {
  query: QueryInstance;
};
export const QueryBarContext = createContext<QueryBarContextType | null>(null);

export function useQueryBarContext() {
  const context = useContext(QueryBarContext);
  if (!context) {
    throw new Error('useQueryBarContext must be used within a QueryBarContextProvider');
  }
  return context;
}
