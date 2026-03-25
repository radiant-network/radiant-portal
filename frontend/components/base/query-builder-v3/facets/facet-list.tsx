import { useEffect, useState } from 'react';

import { FacetContainer } from '@/components/base/query-builder-v3/facets/facet-container';
import { SearchFacet } from '@/components/base/query-builder-v3/facets/search-facet';
import { Accordion } from '@/components/base/shadcn/accordion';
import { Button } from '@/components/base/shadcn/button';
import { AggregationConfig, FilterTypes } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';

import UploadIdModal from './modal/upload-id-modal';

/**
 * Create facets
 */
interface FacetListProps {
  groupKey?: string | null;
  aggregations: AggregationConfig;
}

export function FacetList({ groupKey, aggregations }: FacetListProps) {
  const { t } = useI18n();
  const [toggleExpandAll, setToggleExpandAll] = useState<boolean>(false);
  const [expandedFacets, setExpandedFacets] = useState<string[]>([]);
  const [prevGroupKey, setPrevGroupKey] = useState<string | null | undefined>(groupKey);

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
    setExpandedFacets([]);
  }, [groupKey]);

  // Detect sidebar closure (groupKey → null) OR content change (groupKey1 → groupKey2)
  useEffect(() => {
    setPrevGroupKey(groupKey);
  }, [groupKey, prevGroupKey]);

  return (
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
              setExpandedFacets(fields.map(field => field.key));
            } else {
              setExpandedFacets([]);
            }
          }}
        >
          {toggleExpandAll ? t('common.actions.collapse_all') : t('common.actions.expand_all')}
        </Button>
      </div>
      <Accordion
        className="flex flex-col gap-1"
        type="multiple"
        value={expandedFacets}
        onValueChange={value => setExpandedFacets(value)}
      >
        {fields.map((field, index) => (
          <FacetContainer key={`${field.key}-${index}`} isOpen={expandedFacets.includes(field.key)} field={field} />
        ))}
      </Accordion>
    </div>
  );
}
