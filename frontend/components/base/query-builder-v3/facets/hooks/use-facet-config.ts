import { createContext, useContext } from 'react';

import { IAggregationBuilder } from '@/components/base/query-builder-v3/hooks/use-aggregation-builder';
import { ApplicationId } from '@/components/cores/applications-config';

/**
 * Keep appId from ApplicationConfig in memory to be used by facet (multiselect, numeric etc.)
 * to prevent props propagation.
 */
type FacetListContextProps = {
  appId: ApplicationId;
  builderFetcher: (params: IAggregationBuilder) => any;
  statisticFetcher: (params: IAggregationBuilder) => any;
};

export const FacetConfigContext = createContext<FacetListContextProps>({
  appId: ApplicationId.snv_occurrence,
  builderFetcher: _params => undefined,
  statisticFetcher: _params => undefined,
});

export function useFacetConfig(): FacetListContextProps {
  const context = useContext(FacetConfigContext);
  if (!context) {
    throw new Error('useFilterConfig must be used within a FilterConfigProvider');
  }
  return context;
}

/**
 * Generate the global storage key for temporary facet selections
 */
export function useGlobalStorageKey(): string {
  const { appId } = useContext(FacetConfigContext);
  return `temp-filters-${appId}`;
}
