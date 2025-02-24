import QueryPillContainer from "./QueryPill.Container";
import QueryPillValuesContainer from "./QueryPill.ValuesContainer";
import {
  QueryPillLabelContainer,
  QueryPillOperatorContainer,
} from "./QueryPill.LabelOperator";
import capitalize from "lodash/capitalize";
import { IValueFilter } from "@/components/model/sqon";
import ElementOperatorIcon from "@/components/base/Icons/ElementOperatorIcon";
import QueryPillValues from "./QueryPill.Values";
import { useQueryBarContext } from "../QueryBar/QueryBar.Context";
import { useQueryBuilderDictContext } from "../QueryBuilder.Context";

export type QueryPillSetProps = {
  valueFilter: IValueFilter;
};

function QueryPillSet({ valueFilter }: QueryPillSetProps) {
  const { query } = useQueryBarContext();
  const dict = useQueryBuilderDictContext();

  return (
    <QueryPillContainer
      onRemovePill={function () {
        query.removePillByFieldOrIndex(valueFilter.content.field);
      }}
    >
      <div className="flex items-center">
        <QueryPillLabelContainer>
          {valueFilter.content.index
            ? capitalize(valueFilter.content.index)
            : dict.queryPill.facet(valueFilter.content.field)}
        </QueryPillLabelContainer>
        <QueryPillOperatorContainer>
          <ElementOperatorIcon size={14} />
        </QueryPillOperatorContainer>
      </div>
      <QueryPillValuesContainer>
        <QueryPillValues valueFilter={valueFilter} />
      </QueryPillValuesContainer>
    </QueryPillContainer>
  );
}

export default QueryPillSet;
