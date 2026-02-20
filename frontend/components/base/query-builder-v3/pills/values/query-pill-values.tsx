import { useState } from 'react';
import take from 'lodash/take';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { SqonOpEnum } from '@/api/api';
import QueryPillValuesContainer, {
  QueryPillValuesContainerProps,
} from '@/components/base/query-builder-v3/pills/containers/query-pill-values-container';
import { IValueFacet } from '@/components/base/query-builder-v3/type';
import { useI18n } from '@/components/hooks/i18n';

const MAX_VALUES = 3;
const UNION_OPERATOR = ',';
const ALL_OPERATOR = '&';

export type QueryPillValuesProps = Exclude<QueryPillValuesContainerProps, 'canExpand'> & {
  valueFacet: IValueFacet;
};

/**
 * QueryPillValues display the selected values from the facets.
 * - Display the first 3 selected values
 * - Clicking on [>] or [ < ] change the expand state
 *
 *                         ┌──────────┐
 * ┌───────┌──────────────────────────────────────────┐─────────────────┐
 * | [] Q1 | Loremp Ipsum = [1,2, 3 >] [X]     | 389K | [copy] [trash]  |
 * └───────└──────────────────────────────────────────┘─────────────────┘
 *                         └──────────┘
 *
 */
function QueryPillValues({ valueFacet, ...props }: QueryPillValuesProps) {
  const [expanded, setExpanded] = useState(false);
  const { t, sanitize, lazyTranslate } = useI18n();

  const canExpand = valueFacet.content.value.length > MAX_VALUES;
  // Reduce to the MAX_VALUES to display
  const values = expanded ? valueFacet.content.value : take(valueFacet.content.value, MAX_VALUES);

  return (
    <QueryPillValuesContainer canExpand={canExpand} {...props}>
      {valueFacet.content.overrideValuesName ? (
        <div>
          <span>{valueFacet.content.overrideValuesName}</span>
        </div>
      ) : (
        values.map((val, index) => (
          <div key={`${val}-${index}`}>
            <span>
              {t(`common.filters.values.${valueFacet.content.field}.${sanitize(val)}`, {
                defaultValue: lazyTranslate(val),
              })}
            </span>
            {values.length - 1 > index && (
              <span className="px-1">{valueFacet.op === SqonOpEnum.All ? ALL_OPERATOR : UNION_OPERATOR}</span>
            )}
          </div>
        ))
      )}
      {canExpand && (
        <div className="absolute right-1 hover:cursor-pointer">
          {expanded ? (
            <ChevronLeft
              size={16}
              onClick={e => {
                e.preventDefault();
                setExpanded(false);
              }}
            />
          ) : (
            <ChevronRight
              size={16}
              onClick={e => {
                e.preventDefault();
                setExpanded(true);
              }}
            />
          )}
        </div>
      )}
    </QueryPillValuesContainer>
  );
}

export default QueryPillValues;
