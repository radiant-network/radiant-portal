import { useEffect, useState } from 'react';

import UploadIdModal from '@/components/base/modals/upload-id-modal';
import { FacetContainer } from '@/components/base/query-builder-v3/facets/facet-container';
import {
  FacetConfigContext,
  getGlobalStorageKey,
} from '@/components/base/query-builder-v3/facets/hooks/use-facet-config';
import { SearchFacet } from '@/components/base/query-builder-v3/facets/search-facet';
import { Accordion } from '@/components/base/shadcn/accordion';
import { Button } from '@/components/base/shadcn/button';
import { AggregationConfig, ApplicationId, FilterTypes } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';

/**
 * Create facets
 */
interface FacetListProps {
  groupKey?: string | null;
  aggregations: AggregationConfig;
  appId: ApplicationId;
}

export function FacetList({ groupKey, appId, aggregations }: FacetListProps) {
  const { t } = useI18n();
  const [toggleExpandAll, setToggleExpandAll] = useState<boolean>(false);
  const [expandedFilters, setExpandedFilters] = useState<string[]>([]);
  const [prevGroupKey, setPrevGroupKey] = useState<string | null | undefined>(groupKey);

  // Unique key for all temporary selections
  const globalStorageKey = getGlobalStorageKey(appId);

  // Simple function to clean all temporary selections
  const clearUnappliedFilters = () => {
    sessionStorage.removeItem(globalStorageKey);
  };

  // If groupKey is provided, use that group's aggregations, otherwise get all aggregations from all groups
  const allFields = groupKey
    ? aggregations[groupKey]?.items || []
    : Object.values(aggregations).flatMap(group => group.items);

  // Separate search by filters from other filters
  const searchByFilters = allFields.filter(item => item.type === FilterTypes.SEARCH_BY);
  const uploadListFilters = allFields.filter(item => item.type === FilterTypes.UPLOAD_LIST);
  const fields = allFields.filter(item => item.type !== FilterTypes.SEARCH_BY && item.type !== FilterTypes.UPLOAD_LIST);

  useEffect(() => {
    setToggleExpandAll(false);
    setExpandedFilters([]);
  }, [groupKey]);

  // Detect sidebar closure (groupKey → null) OR content change (groupKey1 → groupKey2)
  useEffect(() => {
    // Closure: groupKey goes from a value to null
    if (prevGroupKey && prevGroupKey !== null && groupKey === null) {
      clearUnappliedFilters();
    }
    // Change: groupKey goes from one value to another value
    else if (prevGroupKey && prevGroupKey !== null && groupKey && groupKey !== null && prevGroupKey !== groupKey) {
      clearUnappliedFilters();
    }

    setPrevGroupKey(groupKey);
  }, [groupKey, prevGroupKey]);

  return (
    <FacetConfigContext value={{ appId, aggregations }}>
      <div>
        <div className="flex flex-col gap-3 mb-3">
          {searchByFilters.map((search, index) => (
            <SearchFacet key={`${search.key}-${index}`} search={search} />
          ))}
          {uploadListFilters.map((uploadList, index) => (
            <UploadIdModal key={`${uploadList.key}-${index}`} variant={uploadList.key.replace(/upload_list_/g, '')} />
          ))}
        </div>
        <div className="flex justify-end">
          <Button
            variant="link"
            size="xs"
            onClick={() => {
              const newToggleExpandAll = !toggleExpandAll;
              setToggleExpandAll(newToggleExpandAll);

              if (newToggleExpandAll) {
                setExpandedFilters(fields.map(field => field.key));
              } else {
                setExpandedFilters([]);
              }
            }}
          >
            {toggleExpandAll ? t('common.actions.collapse_all') : t('common.actions.expand_all')}
          </Button>
        </div>
        <Accordion
          className="flex flex-col gap-1"
          type="multiple"
          value={expandedFilters}
          onValueChange={value => setExpandedFilters(value)}
        >
          {fields.map((field, index) => (
            <FacetContainer key={`${field.key}-${index}`} isOpen={expandedFilters.includes(field.key)} field={field} />
          ))}
        </Accordion>
      </div>
    </FacetConfigContext>
  );
}
