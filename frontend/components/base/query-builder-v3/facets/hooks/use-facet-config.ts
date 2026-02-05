import { createContext, useContext } from 'react';

import { AggregationConfig, ApplicationId } from '@/components/cores/applications-config';

/**
 * Keep appId from ApplicationConfig in memory to be used by facet (multiselect, numeric etc.)
 * to prevent props propagation.
 */
type FacetListContextProps = {
  appId: ApplicationId;
  aggregations: AggregationConfig;
};

export const FacetConfigContext = createContext<FacetListContextProps>({
  appId: ApplicationId.variant_entity,
  aggregations: {},
});

export const useFacetConfig = (): FacetListContextProps => {
  const context = useContext(FacetConfigContext);
  if (!context) {
    throw new Error('useFilterConfig must be used within a FilterConfigProvider');
  }
  return context;
};

/**
 * Generate the global storage key for temporary facet selections
 */
export function getGlobalStorageKey(appId: ApplicationId): string {
  return `temp-filters-${appId}`;
}
