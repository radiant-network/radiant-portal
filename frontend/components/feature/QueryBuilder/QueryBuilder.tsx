import { useQueryBuilder } from "../../model/query-builder-core";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/base/ui/accordion";
import QueryBar from "./QueryBar/QueryBar";
import QueryToolbar from "./QueryToolbar/QueryToolbar";
import {
  QueryBuilderContext,
  QueryBuilderDictContext,
} from "./QueryBuilder.Context";
import SavedFiltersRightActions from "./SavedFilters/SavedFilters.RightActions";
import SavedFiltersLeftActions from "./SavedFilters/SavedFilters.LeftActions";
import { useCallback, useMemo, useState } from "react";
import { QueryBuilderContextType, QueryBuilderProps } from "./types";
import { defaultQueryReferenceColors, defaultDictionnary } from "./data";

const QueryBuilder = ({
  className,
  enableCombine = true,
  enableFavorite = false,
  enableShowHideLabels,
  initialShowHideLabels = true,
  queryReferenceColors = defaultQueryReferenceColors,
  queryCountIcon,
  fetchQueryCount,
  dictionnary = defaultDictionnary,
  ...hookProps
}: QueryBuilderProps) => {
  const queryBuilder = useQueryBuilder(hookProps);
  const [showLabels, toggleLabels] = useState(initialShowHideLabels);

  const getQueryReferenceColor = useCallback(
    (refIndex: number) =>
      queryReferenceColors[refIndex % queryReferenceColors.length],
    [queryReferenceColors]
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
      dictionnary,
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
      dictionnary,
    ]
  );

  return (
    <QueryBuilderDictContext.Provider value={dictionnary}>
      <QueryBuilderContext.Provider value={memoedContextValue}>
        <Accordion
          type="multiple"
          defaultValue={["query-builder"]}
          className={className}
        >
          <AccordionItem value="query-builder" className="border-none">
            <AccordionTrigger
              asChild
              className="border py-0 px-5 rounded-t-sm data-[state=closed]:rounded-sm hover:cursor-pointer"
            >
              <SavedFiltersLeftActions className="py-4 pr-4" />
              <SavedFiltersRightActions className="ml-auto py-4" />
            </AccordionTrigger>
            <AccordionContent className="border-l border-b border-r py-4 px-5 space-y-4 rounded-b-sm">
              <div className="flex flex-col gap-2">
                {queryBuilder.getQueries().map((query) => (
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
};

export default QueryBuilder;
