import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/base/ui/tooltip";
import { useQueryBarContext } from "../QueryBar/QueryBar.Context";
import { Button } from "@/components/base/ui/button";
import AndOperator from "../Operator/AndOperator";
import OrOperator from "../Operator/OrOperator";
import { BooleanOperators } from "@/components/model/sqon";
import { useQueryBuilderDictContext } from "../QueryBuilder.Context";

const QueryCombiner = () => {
  const { query } = useQueryBarContext();
  const dict = useQueryBuilderDictContext();
  const isAndOperator = query.raw().op === BooleanOperators.and;

  return (
    <TooltipProvider>
      <div className="px-2" onClick={(e) => e.stopPropagation()}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="link"
              className="text-sm p-0 h-auto font-normal"
              onClick={() =>
                query.changeCombineOperator(
                  isAndOperator ? BooleanOperators.or : BooleanOperators.and
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
    </TooltipProvider>
  );
};

export default QueryCombiner;
