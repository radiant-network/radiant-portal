import { IValueFilter } from '@/components/model/sqon';
import { SqonOpEnum } from '@/api/api';
import { useState } from 'react';
import take from 'lodash/take';
import IntersectionOperator from '../operator/operator-intersection';
import UnionOperator from '../operator/operator-union';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import QueryPillValuesContainer, { QueryPillValuesContainerProps } from './query-pill-values-container';
import { useI18n } from '@/components/hooks/i18n';
import { replaceUnderscore } from '@/components/lib/string-format';


export type QueryPillValuesProps = Exclude<QueryPillValuesContainerProps, 'canExpand'> & {
  valueFilter: IValueFilter;
};

function QueryPillValues({ valueFilter, ...props }: QueryPillValuesProps) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useI18n('common');

  const canExpand = valueFilter.content.value.length > 3;
  const values = expanded ? valueFilter.content.value : take(valueFilter.content.value, 3);

  return (
    <QueryPillValuesContainer canExpand={canExpand} {...props}>
      {valueFilter.content.overrideValuesName ? (
        <div>
          <span>{valueFilter.content.overrideValuesName}</span>
        </div>
      ) : (
        values.map((val, i) => (
          <div key={`${val}-${i}`}>
            <span>
              {
                t(
                  `common.filters.labels.${valueFilter.content.field}_value.${val}`,
                  { defaultValue: replaceUnderscore(String(val)).toLowerCase().replace(/^\w/, c => c.toUpperCase()) }
                )
              }
            </span>
            {values.length - 1 > i &&
              (valueFilter.op === SqonOpEnum.All ? (
                <IntersectionOperator className="px-1" />
              ) : (
                <UnionOperator className="px-1" />
              ))}
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
