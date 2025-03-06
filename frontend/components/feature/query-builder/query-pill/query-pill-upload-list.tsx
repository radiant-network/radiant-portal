import { IValueFilter } from "@/components/model/sqon";
import QueryPillContainer from "./query-pill-container";
import { useQueryBarContext } from "../query-bar/query-bar-context";
import QueryPillLabelOperator from "./query-pill-label-operator";
import ElementOperatorIcon from "@/components/base/icons/element-operator-icon";
import QueryPillValues from "./query-pill-values";

export type QueryPillUploadListProps = {
  valueFilter: IValueFilter;
};

function QueryPillUploadList({ valueFilter }: QueryPillUploadListProps) {
  const { query } = useQueryBarContext();

  return (
    <QueryPillContainer
      onRemovePill={() =>
        query.removePillByFieldOrIndex(valueFilter.content.field)
      }
    >
      <QueryPillLabelOperator
        valueFilter={valueFilter}
        operator={<ElementOperatorIcon size={14} type={valueFilter.op} />}
      />
      <QueryPillValues valueFilter={valueFilter} />
    </QueryPillContainer>
  );
}

export default QueryPillUploadList;
