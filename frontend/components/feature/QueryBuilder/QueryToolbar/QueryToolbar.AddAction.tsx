import { Button } from "@/components/base/ui/button";
import {
  useQueryBuilderContext,
  useQueryBuilderDictContext,
} from "../QueryBuilder.Context";
import { BooleanOperators } from "@/components/model/sqon";
import { PlusIcon } from "lucide-react";

const QueryToolbarAddAction = () => {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder } = useQueryBuilderContext();

  if (!queryBuilder.canCombine()) {
    return (
      <Button
        size="xs"
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
        {dict.toolbar.newQuery}
      </Button>
    );
  }

  return null;
};

export default QueryToolbarAddAction;
