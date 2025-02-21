import { IValueFilter } from "@/components/model/sqon";
import QueryPillOperator from "./QueryPill.Operator";
import QueryPillValues from "./QueryPill.Values";
import QueryPillContainer from "./QueryPill.Container";
import QueryPillLabelOperator from "./QueryPill.LabelOperator";
import { useQueryBarContext } from "../QueryBar/QueryBar.Context";

export type QueryPillFieldProps = {
  valueFilter: IValueFilter;
};

const QueryPillField = ({ valueFilter }: QueryPillFieldProps) => {
  const { query } = useQueryBarContext();

  return (
    <QueryPillContainer
      onRemovePill={() =>
        query.removePillByFieldOrIndex(valueFilter.content.field)
      }
    >
      <QueryPillLabelOperator
        valueFilter={valueFilter}
        operator={<QueryPillOperator size={14} type={valueFilter.op} />}
      />
      <QueryPillValues valueFilter={valueFilter} />
    </QueryPillContainer>
  );
};

export default QueryPillField;
