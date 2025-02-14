import { useQueryBuilderContext } from "../QueryBuilder.Context";
import { cn } from "@/components/lib/utils";
import { TooltipProvider } from "@/components/base/tooltip";
import SavedFiltersDuplicateAction from "./SavedFilters.DuplicateAction";
import SavedFiltersNewAction from "./SavedFilters.NewAction";
import SavedFiltersSaveAction from "./SavedFilters.SaveAction";
import SavedFiltersDeleteAction from "./SavedFilters.DeleteAction";
import SavedFiltersShareAction from "./SavedFilters.ShareAction";
import SavedFiltersSelect from "./SavedFilters.Select";

const SavedFiltersRightActions = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <TooltipProvider>
      <div className={cn("flex", className)} {...props}>
        <div
          className="flex gap-4 items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <SavedFiltersNewAction />
          <SavedFiltersSaveAction />
          <SavedFiltersDuplicateAction />
          <SavedFiltersDeleteAction />
          <SavedFiltersShareAction />
          <SavedFiltersSelect />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SavedFiltersRightActions;
