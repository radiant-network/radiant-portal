import { useQueryBuilderContext } from "../QueryBuilder.Context";
import { ActionButton } from "@/components/base/Buttons";
import { BooleanOperators } from "@/components/model/sqon";

const QueryToolbarCombineAction = () => {
  const { queryBuilder, enableCombine } = useQueryBuilderContext();

  if (queryBuilder.canCombine() && enableCombine) {
    return (
      <ActionButton
        actions={[
          {
            label: "And",
            onClick: () =>
              queryBuilder.combineSelectedQueries(BooleanOperators.and),
          },
          {
            label: "Or",
            onClick: () =>
              queryBuilder.combineSelectedQueries(BooleanOperators.or),
          },
        ]}
        onDefaultAction={() =>
          queryBuilder.combineSelectedQueries(BooleanOperators.and)
        }
        size="xs"
        variant="primary"
        disabled={queryBuilder.hasEmptyQuery()}
      >
        Combine
      </ActionButton>
    );
  }

  return null;
};

export default QueryToolbarCombineAction;
