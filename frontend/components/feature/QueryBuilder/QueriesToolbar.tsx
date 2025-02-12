import { ActionButton, Button } from "@/components/base/Buttons";
import { useQueryBuilderContext } from "./QueryBuilder.Context";
import { BooleanOperators } from "@/components/model/sqon";
import { PlusIcon } from "lucide-react";

const QueriesToolbar = () => {
  const { queryBuilder } = useQueryBuilderContext();
  const hasEmptyQuery = queryBuilder
    .getQueries()
    .some((query) => query.isEmpty());

  return (
    <div>
      {!queryBuilder.canCombine() && (
        <Button
          size="xs"
          variant="primary"
          disabled={hasEmptyQuery}
          onClick={() =>
            queryBuilder.createQuery({
              op: BooleanOperators.and,
              content: [],
            })
          }
        >
          <PlusIcon />
          New Query
        </Button>
      )}
      {queryBuilder.canCombine() && (
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
          disabled={hasEmptyQuery}
        >
          Combine
        </ActionButton>
      )}
    </div>
  );
};

export default QueriesToolbar;
