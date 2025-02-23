import { IValueFilter } from "@/components/model/sqon";
import QueryPillContainer from "./QueryPill.Container";
import { useQueryBarContext } from "../QueryBar/QueryBar.Context";
import QueryPillLabelOperator from "./QueryPill.LabelOperator";
import ElementOperatorIcon from "@/components/base/Icons/ElementOperatorIcon";
import QueryPillValues from "./QueryPill.Values";

export type QueryPillUploadListProps = {
  valueFilter: IValueFilter;
};

function QueryPillUploadList({ valueFilter }: QueryPillUploadListProps) {
  const { query } = useQueryBarContext();

  return (
    <QueryPillContainer
      onRemovePill={function () {
        query.removePillByFieldOrIndex(valueFilter.content.field);
      }}
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
