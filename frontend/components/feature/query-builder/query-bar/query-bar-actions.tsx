import QueryBarDuplicateAction from "./query-bar-duplicate-action";
import QueryBarDeleteAction from "./query-bar-delete-action";
import QueryBarSaveAction from "./query-bar-save-action";
import { useQueryBuilderContext } from "../query-builder-context";
import { TooltipProvider } from "@/components/base/ui/tooltip";

function QueryBarActions() {
  const { customPillConfig } = useQueryBuilderContext();

  return (
    <TooltipProvider>
      <div
        className="
flex gap-2 items-center py-2 px-4 border-r border-t border-b 
border-[--gray-5] bg-[--gray-2]
group-data-[query-active=true]/query:border-[--query-bar-border-color-active]
group-data-[query-active=true]/query:bg-[--query-bar-bg-active]
"
        onClick={(e) => e.stopPropagation()}
      >
        {customPillConfig && <QueryBarSaveAction />}
        <QueryBarDuplicateAction />
        <QueryBarDeleteAction />
      </div>
    </TooltipProvider>
  );
}

export default QueryBarActions;
