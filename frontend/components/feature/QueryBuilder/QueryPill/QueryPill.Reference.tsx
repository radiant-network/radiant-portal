import { useQueryBarContext } from "../QueryBar/QueryBar.Context";
import { useQueryBuilderContext } from "../QueryBuilder.Context";
import QueryPillContainer from "./QueryPill.Container";
import QueryPillValuesContainer from "./QueryPill.ValuesContainer";

export type QueryPillReferenceProps = {
  refIndex: number;
};

function QueryPillReference({ refIndex }: QueryPillReferenceProps) {
  const { query } = useQueryBarContext();
  const { getQueryReferenceColor } = useQueryBuilderContext();
  const refColor = getQueryReferenceColor(refIndex);

  return (
    <QueryPillContainer
      onRemovePill={function () {
        query.removePillByFieldOrIndex(refIndex);
      }}
    >
      <QueryPillValuesContainer>
        <span style={{ color: refColor }}>{`Q${refIndex + 1}`}</span>
      </QueryPillValuesContainer>
    </QueryPillContainer>
  );
}

export default QueryPillReference;
