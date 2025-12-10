import { createContext, ReactNode, useContext, useMemo } from 'react';

import { VariantCasesFilters } from '@/api/api';

interface CasesFiltersContextType {
  filters: VariantCasesFilters | undefined;
  isLoading: boolean;
}

const CasesFiltersContext = createContext<CasesFiltersContextType | undefined>(undefined);

interface CasesFiltersProviderProps {
  children: ReactNode;
  filters: VariantCasesFilters | undefined;
  isLoading: boolean;
}

export function CasesFiltersProvider({ children, filters, isLoading }: CasesFiltersProviderProps) {
  const memoizedValue = useMemo(() => ({ filters, isLoading }), [filters, isLoading]);

  return <CasesFiltersContext.Provider value={memoizedValue}>{children}</CasesFiltersContext.Provider>;
}

export function useCasesFilters() {
  const context = useContext(CasesFiltersContext);
  if (context === undefined) {
    throw new Error('useCasesFilters must be used within a CasesFiltersProvider');
  }
  return context;
}
