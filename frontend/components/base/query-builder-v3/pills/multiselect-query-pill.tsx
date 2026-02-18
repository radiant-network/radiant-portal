import { useContext } from 'react';

import { FacetComponent } from '@/components/base/query-builder-v3/facets/facet-container';
import { QBContext } from '@/components/base/query-builder-v3/hooks/use-query-builder';
import { getAggregationsByIValueFacet } from '@/components/base/query-builder-v3/libs/facet-libs';
import QueryPillContainer from '@/components/base/query-builder-v3/pills/containers/query-pill-container';
import LabelOperator from '@/components/base/query-builder-v3/pills/operators/label-operator';
import Operator from '@/components/base/query-builder-v3/pills/operators/operator';
import QueryPillValues from '@/components/base/query-builder-v3/pills/values/query-pill-values';
import { IValueFacet } from '@/components/base/query-builder-v3/type';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/base/shadcn/popover';

type MultiSelectPillProps = {
  content: IValueFacet;
};
function MultiSelectQueryPill({ content }: MultiSelectPillProps) {
  const { aggregations } = useContext(QBContext);
  const onRemovePill = () => {};
  const aggregation = getAggregationsByIValueFacet(aggregations, content);

  return (
    <QueryPillContainer onRemovePill={onRemovePill}>
      <div className="flex gap-2">
        <LabelOperator field={content.content.field} operator={<Operator size={14} type={content.op} />} />
        <Popover>
          <PopoverTrigger>
            <QueryPillValues valueFacet={content} />
          </PopoverTrigger>
          <PopoverContent align="start" className="p-2.5">
            <FacetComponent field={aggregation} isOpen />
          </PopoverContent>
        </Popover>
      </div>
    </QueryPillContainer>
  );
}
export default MultiSelectQueryPill;
