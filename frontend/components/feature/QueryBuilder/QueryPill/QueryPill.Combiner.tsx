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

const QueryCombiner = () => {
  const { query } = useQueryBarContext();
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
            Change operator to "{isAndOperator ? "or" : "and"}"
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default QueryCombiner;
