import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip";
import { useQueryBarContext } from "../query-bar/query-bar-context";
import { Button } from "@/components/base/ui/button";
import AndOperator from "../operator/operator-and";
import OrOperator from "../operator/operator-or";
import { BooleanOperators } from "@/components/model/sqon";
import { useQueryBuilderDictContext } from "../query-builder-context";

function QueryCombiner() {
  const { query } = useQueryBarContext();
  const dict = useQueryBuilderDictContext();
  const isAndOperator = query.raw().op === BooleanOperators.And;

  return (
    <div className="px-2" onClick={(e) => e.stopPropagation()}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="link"
            className="text-sm p-0 h-auto font-normal"
            onClick={() =>
              query.changeCombineOperator(
                isAndOperator ? BooleanOperators.Or : BooleanOperators.And
              )
            }
          >
            {isAndOperator ? <AndOperator /> : <OrOperator />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {dict.queryPill.operator.changeOperatorTo} "
          {isAndOperator
            ? dict.queryPill.operator.or
            : dict.queryPill.operator.and}
          "
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export default QueryCombiner;
