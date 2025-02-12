import { Button } from "@/components/base/Buttons";
import React from "react";
import { useQueryBuilderContext } from "./QueryBuilder.Context";
import { getDefaultSyntheticSqon } from "@/components/model/query-builder-core";
import { BooleanOperators } from "@/components/model/sqon";
import { PlusIcon } from "lucide-react";

const QueriesToolbar = () => {
  const { queryBuilder } = useQueryBuilderContext();
  const hasEmptyQuery = queryBuilder
    .getQueries()
    .some((query) => query.isEmpty());

  return (
    <div>
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
    </div>
  );
};

export default QueriesToolbar;
