import { useEffect, useRef, useState } from 'react';

import Empty from '@/components/base/empties/empty';
import FacetFavoritesEmptyImage from '@/components/base/icons/facet-favorites-empty-image';
import { FacetContainer } from '@/components/base/query-builder/facets/facet-container';
import {
  FAVORITES_GROUP_KEY,
  useFacetFavorites,
} from '@/components/base/query-builder/facets/hooks/use-facet-favorites';
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

const FAVORITABLE_TYPES: string[] = [FilterTypes.MULTIPLE, FilterTypes.NUMERICAL, FilterTypes.BOOLEAN];
const UNSTARRED_REMOVAL_DELAY_MS = 500;
// Slide-out then collapse: keep in sync with duration-200 and delay-200 on the favorite row
const UNSTARRED_EXIT_DURATION_MS = 400;

/**
 * Removes each key after a short delay, flagging it as leaving for the exit animation first.
 * A key that drops out of `keys` before then is kept.
 */
function useDelayedRemoval(keys: string[], onRemove: (key: string) => void) {
  const [leavingKeys, setLeavingKeys] = useState<string[]>([]);
  const timers = useRef(new Map<string, number[]>());
  const onRemoveRef = useRef(onRemove);
  onRemoveRef.current = onRemove;
  const signature = keys.join('|');

  useEffect(() => {
    for (const [key, ids] of timers.current) {
      if (!keys.includes(key)) {
        ids.forEach(id => window.clearTimeout(id));
        timers.current.delete(key);
        setLeavingKeys(prev => prev.filter(k => k !== key));
      }
    }
    for (const key of keys) {
      if (timers.current.has(key)) continue;
      const leave = window.setTimeout(() => setLeavingKeys(prev => [...prev, key]), UNSTARRED_REMOVAL_DELAY_MS);
      const remove = window.setTimeout(() => {
        timers.current.delete(key);
        setLeavingKeys(prev => prev.filter(k => k !== key));
        onRemoveRef.current(key);
      }, UNSTARRED_REMOVAL_DELAY_MS + UNSTARRED_EXIT_DURATION_MS);
      timers.current.set(key, [leave, remove]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on the set of keys, not array identity
  }, [signature]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach(ids => ids.forEach(id => window.clearTimeout(id)));
      pending.clear();
    };
  }, []);

  return leavingKeys;
}

/**
 * Favorites listed during one visit of the Favorites panel: newly starred facets join,
 * unstarred ones linger briefly before sliding out, so a stray click is easy to undo.
 */
function useFavoritesVisit(groupKey: string | null | undefined, isFavoritesGroup: boolean, savedKeys: string[]) {
  const [visitFavoriteKeys, setVisitFavoriteKeys] = useState<string[]>(savedKeys);
  const [visitGroupKey, setVisitGroupKey] = useState(groupKey);
  if (visitGroupKey !== groupKey) {
    setVisitGroupKey(groupKey);
    setVisitFavoriteKeys(savedKeys);
  } else if (savedKeys.some(key => !visitFavoriteKeys.includes(key))) {
    setVisitFavoriteKeys([...new Set([...visitFavoriteKeys, ...savedKeys])]);
  }

  const unstarredKeys = isFavoritesGroup ? visitFavoriteKeys.filter(key => !savedKeys.includes(key)) : [];
  const leavingFavoriteKeys = useDelayedRemoval(unstarredKeys, key =>
    setVisitFavoriteKeys(prev => prev.filter(k => k !== key)),
  );

  return { visitFavoriteKeys, leavingFavoriteKeys };
}

export function FacetList({ groupKey, aggregations, defaultExpanded = false }: FacetListProps) {
  const { t } = useI18n();
  const favorites = useFacetFavorites();
  const isFavoritesGroup = groupKey === FAVORITES_GROUP_KEY;
  const everyField = Object.values(aggregations).flatMap(group => group.items);

  const { visitFavoriteKeys, leavingFavoriteKeys } = useFavoritesVisit(
    groupKey,
    isFavoritesGroup,
    favorites?.favorites ?? [],
  );

  // If groupKey is provided, use that group's aggregations, otherwise get all aggregations from all groups
  let allFields = groupKey ? aggregations[groupKey]?.items || [] : everyField;
  if (isFavoritesGroup) {
    const favoriteKeys = new Set(visitFavoriteKeys);
    const seen = new Set<string>();
    allFields = everyField.filter((field: Aggregation) => {
      if (!favoriteKeys.has(field.key) || seen.has(field.key) || !FAVORITABLE_TYPES.includes(field.type)) {
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

  if (isFavoritesGroup && favorites?.isLoading) {
    return (
      <div data-cy="facet-favorites-loading" aria-busy="true" className="flex flex-col gap-1">
        {['first', 'second', 'third'].map(row => (
          <Skeleton key={row} className="h-8 w-full bg-card" />
        ))}
      </div>
    );
  }

  if (isFavoritesGroup && fields.length === 0) {
    return (
      <Empty
        data-cy="facet-favorites-empty"
        size="mini"
        showIcon={false}
        contentTop={<FacetFavoritesEmptyImage />}
        classNames={{
          title: 'text-sm text-sidebar-foreground opacity-70',
          description: 'text-sidebar-foreground opacity-70',
        }}
        title={t('query_filters.favorites.empty.title')}
        description={t('query_filters.favorites.empty.description')}
        className="whitespace-normal"
      />
    );
  }

  return (
    <div data-facet-favorites-panel={isFavoritesGroup || undefined}>
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
        {fields.map((field, index) =>
          isFavoritesGroup ? (
            <div
              key={field.key}
              data-cy={`facet-favorite-row-${field.key}`}
              data-leaving={leavingFavoriteKeys.includes(field.key) || undefined}
              className="group/row grid grid-rows-[1fr] transition-all delay-200 duration-200 ease-out motion-reduce:transition-none data-leaving:-mb-1 data-leaving:grid-rows-[0fr]"
            >
              <div className="min-h-0 group-data-leaving/row:overflow-hidden">
                <div className="transition duration-200 ease-in motion-reduce:transition-none group-data-leaving/row:-translate-x-full group-data-leaving/row:opacity-0">
                  <FacetContainer isOpen={expandedFacets.includes(field.key)} field={field} />
                </div>
              </div>
            </div>
          ) : (
            <FacetContainer key={`${field.key}-${index}`} isOpen={expandedFacets.includes(field.key)} field={field} />
          ),
        )}
      </Accordion>
    </div>
  );
}
