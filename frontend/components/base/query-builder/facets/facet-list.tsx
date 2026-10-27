import { useEffect, useState } from 'react';

import Empty from '@/components/base/empties/empty';
import FacetFavouritesEmptyImage from '@/components/base/icons/facet-favourites-empty-image';
import { FacetContainer } from '@/components/base/query-builder/facets/facet-container';
import {
  FAVOURITES_GROUP_KEY,
  useFacetFavourites,
} from '@/components/base/query-builder/facets/hooks/use-facet-favourites';
import { SearchFacet } from '@/components/base/query-builder/facets/search-facet';
import { Accordion } from '@/components/base/shadcn/accordion';
import { Button } from '@/components/base/shadcn/button';
import { type Aggregation, type AggregationConfig, FilterTypes } from '@/components/cores/applications-config';
import { useI18n } from '@/components/hooks/i18n';

import UploadIdModal from './upload-id-facet';

/**
 * Create facets
 */
interface FacetListProps {
  groupKey?: string | null;
  aggregations: AggregationConfig;
  defaultExpanded?: boolean;
}

const FAVOURITABLE_TYPES: string[] = [FilterTypes.MULTIPLE, FilterTypes.NUMERICAL, FilterTypes.BOOLEAN];

export function FacetList({ groupKey, aggregations, defaultExpanded = false }: FacetListProps) {
  const { t } = useI18n();
  const favourites = useFacetFavourites();
  const isFavouritesGroup = groupKey === FAVOURITES_GROUP_KEY;
  const everyField = Object.values(aggregations).flatMap(group => group.items);

  // If groupKey is provided, use that group's aggregations, otherwise get all aggregations from all groups
  let allFields = groupKey ? aggregations[groupKey]?.items || [] : everyField;
  if (isFavouritesGroup) {
    allFields = (favourites?.favourites ?? [])
      .map(key => everyField.find(field => field.key === key))
      .filter((field): field is Aggregation => !!field && FAVOURITABLE_TYPES.includes(field.type));
  }

  // Separate search by filters from other filters
  const searchByFilters = allFields.filter(item => item.type === FilterTypes.SEARCH_BY);
  const uploadListFilters = allFields.filter(item => item.type === FilterTypes.UPLOAD_LIST);
  const fields = allFields.filter(item => item.type !== FilterTypes.SEARCH_BY && item.type !== FilterTypes.UPLOAD_LIST);

  const [toggleExpandAll, setToggleExpandAll] = useState<boolean>(defaultExpanded);
  const [expandedFacets, setExpandedFacets] = useState<string[]>(defaultExpanded ? fields.map(field => field.key) : []);
  const [prevGroupKey, setPrevGroupKey] = useState<string | null | undefined>(groupKey);

  useEffect(() => {
    setToggleExpandAll(defaultExpanded);
    setExpandedFacets(defaultExpanded ? fields.map(field => field.key) : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupKey, defaultExpanded]);

  // Detect sidebar closure (groupKey → null) OR content change (groupKey1 → groupKey2)
  useEffect(() => {
    setPrevGroupKey(groupKey);
  }, [groupKey, prevGroupKey]);

  if (isFavouritesGroup && fields.length === 0) {
    return (
      <Empty
        data-cy="facet-favourites-empty"
        size="mini"
        showIcon={false}
        contentTop={<FacetFavouritesEmptyImage />}
        classNames={{
          title: 'text-sm text-sidebar-foreground opacity-70',
          description: 'text-sidebar-foreground opacity-70',
        }}
        title={t('query_filters.favourites.empty.title')}
        description={t('query_filters.favourites.empty.description')}
        className="whitespace-normal"
      />
    );
  }

  return (
    <div>
      {(searchByFilters.length > 0 || uploadListFilters.length > 0) && (
        <div className="flex flex-col gap-3 mb-3">
          {searchByFilters.map((search, index) => (
            <SearchFacet key={`${search.key}-${index}`} search={search} />
          ))}
          {uploadListFilters.map((uploadList, index) => (
            <UploadIdModal key={`${uploadList.key}-${index}`} variant={uploadList.key.replace(/upload_list_/g, '')} />
          ))}
        </div>
      )}
      <div className="flex justify-end">
        <Button
          data-cy="expand-collapse-button"
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
