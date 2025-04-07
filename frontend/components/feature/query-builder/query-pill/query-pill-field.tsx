import { IValueFilter } from '@/components/model/sqon';
import QueryPillOperator from './query-pill-operator';
import QueryPillValues from './query-pill-values';
import QueryPillContainer from './query-pill-container';
import QueryPillLabelOperator from './query-pill-label-operator';
import { useQueryBarContext } from '../query-bar/query-bar-context';
import { useQueryBuilderContext } from '../query-builder-context';
import ConditionalWrapper from '@/components/base/conditional-wrapper';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/base/ui/popover';
import { ReactNode, useCallback, useState } from 'react';

export type QueryPillFieldProps = {
  valueFilter: IValueFilter;
  customPillEditEnabled?: boolean;
};

function QueryPillField({ valueFilter, customPillEditEnabled }: QueryPillFieldProps) {
  const { query } = useQueryBarContext();
  const { queryPillFacetFilterConfig } = useQueryBuilderContext();

  const [facetFilterComponent, setFacetFilterComponent] = useState<ReactNode>();

  const isFacetFilterEnabled = Boolean(
    !customPillEditEnabled &&
      queryPillFacetFilterConfig?.enable &&
      !queryPillFacetFilterConfig?.blacklistedFacets?.includes(valueFilter.content.field),
  );

  const handleFacetClick = useCallback(() => {
    if (queryPillFacetFilterConfig?.onFacetClick && !facetFilterComponent) {
      setFacetFilterComponent(queryPillFacetFilterConfig.onFacetClick(valueFilter));
    }
  }, [facetFilterComponent, queryPillFacetFilterConfig?.onFacetClick]);

  return (
    <QueryPillContainer onRemovePill={() => query.removePillByFieldOrIndex(valueFilter.content.field)}>
      <QueryPillLabelOperator
        valueFilter={valueFilter}
        operator={<QueryPillOperator size={14} type={valueFilter.op} />}
      />
      <ConditionalWrapper
        condition={isFacetFilterEnabled}
        wrapper={children => (
          <Popover>
            <PopoverTrigger onClick={handleFacetClick}>{children}</PopoverTrigger>
            <PopoverContent align="start" className="p-2.5">
              {facetFilterComponent}
            </PopoverContent>
          </Popover>
        )}
      >
        <QueryPillValues valueFilter={valueFilter} clickable={isFacetFilterEnabled} />
      </ConditionalWrapper>
    </QueryPillContainer>
  );
}

export default QueryPillField;
