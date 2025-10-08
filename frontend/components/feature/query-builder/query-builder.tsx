import { useCallback, useMemo, useState } from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/base/ui/accordion';
import { Card } from '@/components/base/ui/card';
import { Skeleton } from '@/components/base/ui/skeleton';
import { deepMerge } from '@/components/lib/merge';

import { useQueryBuilder } from '../../model/query-builder-core';

import QueryBar from './query-bar/query-bar';
import QueryToolbar from './query-toolbar/query-toolbar';
import SavedFiltersLeftActions from './saved-filter/saved-filter-left-actions';
import SavedFiltersRightActions from './saved-filter/saved-filter-right-actions';
import { defaultQueryReferenceColors, useQueryBuilderDictionary } from './data';
import { QueryBuilderContext, QueryBuilderDictContext } from './query-builder-context';
import { QueryBuilderContextType, QueryBuilderProps } from './types';
import { Separator } from '@/components/base/ui/separator';

function QueryBuilder({
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
  loading,
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
    (refIndex: number) => queryReferenceColors[refIndex % queryReferenceColors.length],
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
      loading,
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
      loading,
    ],
  );

  if (loading) {
    return <QueryBuilderSkeleton />;
  }

  return (
    <QueryBuilderDictContext.Provider value={mergeDictionary}>
      <QueryBuilderContext.Provider value={memoedContextValue}>
        <Card className="py-0">
          <Accordion type="multiple" defaultValue={['query-builder']}>
            <AccordionItem value="query-builder" className="border-none">
              <AccordionTrigger
                className="border-b py-0 px-6 data-[state=closed]:rounded-sm data-[state=closed]:border-none hover:cursor-pointer"
                asChild
              >
                <SavedFiltersLeftActions className="py-4 pr-4" />
                <SavedFiltersRightActions className="ml-auto py-4" />
              </AccordionTrigger>
              <AccordionContent className="py-4 px-6 space-y-4">
                <div className="flex flex-col gap-2 max-h-[30vh] overflow-y-scroll">
                  {queryBuilder.getQueries().map(query => (
                    <QueryBar key={query.id} query={query} />
                  ))}
                </div>
                <QueryToolbar />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </QueryBuilderContext.Provider>
    </QueryBuilderDictContext.Provider>
  );
}

function QueryBuilderSkeleton() {
  return (
    <Card className="py-0">
      <div className="flex flex-col">
        <div className="py-4 px-6 flex justify-between">
          <div className="flex gap-4">
            <Skeleton className="h-8 w-32" />
            {new Array(2).fill(0).map((_, index) => (
              <Skeleton key={index} className="size-8" />
            ))}
          </div>
          <div className="flex gap-2">
            {new Array(5).fill(0).map((_, index) => (
              <Skeleton key={index} className="size-8" />
            ))}
            <Skeleton className="h-8 w-36" />
          </div>
        </div>
        <Separator />
        <div className="flex flex-col py-4 gap-4">
          <div className="px-6 flex flex-col gap-2">
            <Skeleton className="h-[50px] w-full" />
            <Skeleton className="h-[50px] w-full" />
          </div>
          <div className="px-6 flex gap-3">
            <Skeleton className="h-7 w-26" />
            <Skeleton className="h-7 w-16" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default QueryBuilder;
