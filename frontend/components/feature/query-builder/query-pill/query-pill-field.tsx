import { IValueFilter } from "@/components/model/sqon";
import QueryPillOperator from "./query-pill-operator";
import QueryPillValues from "./query-pill-values";
import QueryPillContainer from "./query-pill-container";
import QueryPillLabelOperator from "./query-pill-label-operator";
import { useQueryBarContext } from "../query-bar/query-bar-context";

export type QueryPillFieldProps = {
  valueFilter: IValueFilter;
};

function QueryPillField({ valueFilter }: QueryPillFieldProps) {
  const { query } = useQueryBarContext();

  return (
    <QueryPillContainer
      onRemovePill={function () {
        return query.removePillByFieldOrIndex(valueFilter.content.field);
      }}
    >
      <QueryPillLabelOperator
        valueFilter={valueFilter}
        operator={<QueryPillOperator size={14} type={valueFilter.op} />}
      />
      <QueryPillValues valueFilter={valueFilter} />
    </QueryPillContainer>
  );
}

export default QueryPillField;
