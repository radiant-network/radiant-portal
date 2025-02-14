import { useQueryBuilderContext } from "../QueryBuilder.Context";
import { cn } from "@/components/lib/utils";
import { TooltipProvider } from "@/components/base/tooltip";
import SavedFiltersDuplicateAction from "./SavedFilters.DuplicateAction";
import SavedFiltersNewAction from "./SavedFilters.NewAction";
import SavedFiltersSaveAction from "./SavedFilters.SaveAction";
import SavedFiltersDeleteAction from "./SavedFilters.DeleteAction";
import SavedFiltersShareAction from "./SavedFilters.ShareAction";
import SavedFiltersSelect from "./SavedFilters.Select";
import { IconButton } from "@/components/base/Buttons";
import { TrashIcon } from "lucide-react";

const SavedFiltersRightActions = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("flex", className)} {...props}>
      <div
        className="flex gap-4 items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="whitespace-nowrap">
          <TooltipProvider>
            <SavedFiltersNewAction />
            <SavedFiltersSaveAction />
            <SavedFiltersDuplicateAction />
            <SavedFiltersDeleteAction
              trigger={<IconButton icon={TrashIcon} />}
            />
            <SavedFiltersShareAction />
          </TooltipProvider>
        </div>
        <SavedFiltersSelect />
      </div>
    </div>
  );
};

export default SavedFiltersRightActions;
