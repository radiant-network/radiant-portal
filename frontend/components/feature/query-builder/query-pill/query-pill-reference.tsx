import { useQueryBarContext } from "../query-bar/query-bar-context";
import { useQueryBuilderContext } from "../query-builder-context";
import QueryPillContainer from "./query-pill-container";
import QueryPillValuesContainer from "./query-pill-values-container";

export type QueryPillReferenceProps = {
  refIndex: number;
};

function QueryPillReference({ refIndex }: QueryPillReferenceProps) {
  const { query } = useQueryBarContext();
  const { getQueryReferenceColor } = useQueryBuilderContext();
  const refColor = getQueryReferenceColor(refIndex);

  return (
    <QueryPillContainer
      onRemovePill={() => query.removePillByFieldOrIndex(refIndex)}
    >
      <QueryPillValuesContainer>
        <span style={{ color: refColor }}>{`Q${refIndex + 1}`}</span>
      </QueryPillValuesContainer>
    </QueryPillContainer>
  );
}

export default QueryPillReference;
