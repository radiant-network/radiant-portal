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
import { Skeleton } from '@/components/base/shadcn/skeleton';
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

  // Unstarred facets stay listed until the panel is left, so a stray click is easy to undo
  const savedFavouriteKeys = favourites?.favourites ?? [];
  const [visitFavouriteKeys, setVisitFavouriteKeys] = useState<string[]>(savedFavouriteKeys);
  const [visitGroupKey, setVisitGroupKey] = useState(groupKey);
  if (visitGroupKey !== groupKey) {
    setVisitGroupKey(groupKey);
    setVisitFavouriteKeys(savedFavouriteKeys);
  } else if (savedFavouriteKeys.some(key => !visitFavouriteKeys.includes(key))) {
    setVisitFavouriteKeys([...new Set([...visitFavouriteKeys, ...savedFavouriteKeys])]);
  }

  // If groupKey is provided, use that group's aggregations, otherwise get all aggregations from all groups
  let allFields = groupKey ? aggregations[groupKey]?.items || [] : everyField;
  if (isFavouritesGroup) {
    const favouriteKeys = new Set(visitFavouriteKeys);
    const seen = new Set<string>();
    allFields = everyField.filter((field: Aggregation) => {
      if (!favouriteKeys.has(field.key) || seen.has(field.key) || !FAVOURITABLE_TYPES.includes(field.type)) {
        return false;
      }
      seen.add(field.key);
      return true;
    });
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

  if (isFavouritesGroup && favourites?.isLoading) {
    return (
      <div data-cy="facet-favourites-loading" aria-busy="true" className="flex flex-col gap-1">
        {['first', 'second', 'third'].map(row => (
          <Skeleton key={row} className="h-8 w-full" />
        ))}
      </div>
    );
  }

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
    <div data-facet-favourites-panel={isFavouritesGroup || undefined}>
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
