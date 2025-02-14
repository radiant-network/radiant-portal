import { Button } from "@/components/base/Buttons";
import { useQueryBuilderContext } from "../QueryBuilder.Context";
import { BooleanOperators } from "@/components/model/sqon";
import { PlusIcon } from "lucide-react";

const QueryToolbarAddAction = () => {
  const { queryBuilder } = useQueryBuilderContext();

  if (!queryBuilder.canCombine()) {
    return (
      <Button
        size="sm"
        variant="primary"
        disabled={queryBuilder.hasEmptyQuery()}
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
    );
  }

  return null;
};

export default QueryToolbarAddAction;
