import { useQueryBuilder } from '../../model/query-builder-core';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/base/ui/accordion';
import QueryBar from './query-bar/query-bar';
import QueryToolbar from './query-toolbar/query-toolbar';
import { QueryBuilderContext, QueryBuilderDictContext } from './query-builder-context';
import SavedFiltersRightActions from './saved-filter/saved-filter-right-actions';
import SavedFiltersLeftActions from './saved-filter/saved-filter-left-actions';
import { useCallback, useMemo, useState } from 'react';
import { QueryBuilderContextType, QueryBuilderProps } from './types';
import { defaultQueryReferenceColors, useQueryBuilderDictionary } from './data';
import { deepMerge } from '@/components/lib/merge';

function QueryBuilder({
  className,
  enableCombine = true,
  enableFavorite = false,
  enableShowHideLabels,
  initialShowHideLabels = true,
  queryReferenceColors = defaultQueryReferenceColors,
  queryCountIcon,
  fetchQueryCount,
  dictionary,
  customPillConfig,
  queryPillFacetFilterConfig,
  resolveSyntheticSqon,
  ...hookProps
}: QueryBuilderProps) {
  const queryBuilder = useQueryBuilder(hookProps);
  const defaultDictionary = useQueryBuilderDictionary();

  const mergeDictionary = useMemo(
    () => deepMerge(defaultDictionary, dictionary || {}),
    [dictionary, defaultDictionary],
  );
  const [showLabels, toggleLabels] = useState(initialShowHideLabels);

  const getQueryReferenceColor = useCallback(
    (refIndex: number) => {
      return queryReferenceColors[refIndex % queryReferenceColors.length];
    },
    [queryReferenceColors],
  );

  const memoedContextValue = useMemo<QueryBuilderContextType>(
    () => ({
      queryBuilder,
      enableCombine,
      enableFavorite,
      enableShowHideLabels,
      showLabels,
      toggleLabels,
      queryCountIcon,
      getQueryReferenceColor,
      fetchQueryCount,
      dictionary,
      customPillConfig,
      queryPillFacetFilterConfig,
      resolveSyntheticSqon,
    }),
    [
      queryBuilder,
      enableCombine,
      enableFavorite,
      enableShowHideLabels,
      showLabels,
      toggleLabels,
      queryCountIcon,
      getQueryReferenceColor,
      fetchQueryCount,
      dictionary,
      customPillConfig,
      queryPillFacetFilterConfig,
      resolveSyntheticSqon,
    ],
  );

  return (
    <QueryBuilderDictContext.Provider value={mergeDictionary}>
      <QueryBuilderContext.Provider value={memoedContextValue}>
        <Accordion type="multiple" defaultValue={['query-builder']} className={className}>
          <AccordionItem value="query-builder" className="border-none">
            <AccordionTrigger
              asChild
              className="border py-0 px-5 rounded-t data-[state=closed]:rounded-sm hover:cursor-pointer"
            >
              <SavedFiltersLeftActions className="py-4 pr-4" />
              <SavedFiltersRightActions className="ml-auto py-4" />
            </AccordionTrigger>
            <AccordionContent className="border-l border-b border-r py-4 px-5 space-y-4 rounded-b">
              <div className="flex flex-col gap-2 max-h-[30vh] overflow-y-scroll">
                {queryBuilder.getQueries().map(query => (
                  <QueryBar key={query.id} query={query} />
                ))}
              </div>
              <QueryToolbar />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </QueryBuilderContext.Provider>
    </QueryBuilderDictContext.Provider>
  );
}

export default QueryBuilder;
