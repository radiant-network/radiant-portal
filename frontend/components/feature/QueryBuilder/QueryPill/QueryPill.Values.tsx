import { FieldOperators, IValueFilter } from "@/components/model/sqon";
import { useState } from "react";
import take from "lodash/take";
import IntersectionOperator from "../Operator/IntersectionOperator";
import UnionOperator from "../Operator/UnionOperator";
import { ChevronRight, ChevronLeft } from "lucide-react";
import QueryPillValuesContainer from "./QueryPill.ValuesContainer";

export type QueryPillValuesProps = {
  valueFilter: IValueFilter;
};

function QueryPillValues({ valueFilter }: QueryPillValuesProps) {
  const [expanded, setExpanded] = useState(false);

  const canExpand = valueFilter.content.value.length > 3;
  const values = expanded
    ? valueFilter.content.value
    : take(valueFilter.content.value, 3);

  return (
    <QueryPillValuesContainer canExpand={canExpand}>
      {valueFilter.content.overrideValuesName ? (
        <div>
          <span>{valueFilter.content.overrideValuesName}</span>
        </div>
      ) : (
        values.map((val, i) => (
          <div key={`${val}-${i}`}>
            <span>{val}</span>
            {values.length - 1 > i &&
              (valueFilter.op === FieldOperators.all ? (
                <IntersectionOperator className="px-1" />
              ) : (
                <UnionOperator className="px-1" />
              ))}
          </div>
        ))
      )}
      {canExpand && (
        <div className="absolute right-1">
          {expanded ? (
            <ChevronLeft size={16} onClick={() => setExpanded(false)} />
          ) : (
            <ChevronRight size={16} onClick={() => setExpanded(true)} />
          )}
        </div>
      )}
    </QueryPillValuesContainer>
  );
}

export default QueryPillValues;
