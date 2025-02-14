import { cn } from "@/components/lib/utils";
import { PencilLineIcon } from "lucide-react";
import React from "react";
import SavedFiltersEditAction from "./SavedFilters.EditAction";
import SavedFiltersUndoAction from "./SavedFilters.UndoAction";
import SavedFiltersStarAction from "./SavedFilters.StarAction";
import { TooltipProvider } from "@/components/base/tooltip";
import { IconButton } from "@/components/base/Buttons";
import { useQueryBuilderContext } from "../QueryBuilder.Context";

const SavedFiltersLeftActions = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { queryBuilder } = useQueryBuilderContext();
  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();

  return (
    <div
      className={cn(
        "flex items-center gap-4 whitespace-nowrap text-ellipsis overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="text-ellipsis overflow-hidden">
        {selectedSavedFilter ? selectedSavedFilter.raw().title : "My Filter"}
      </div>
      <TooltipProvider>
        <div className="flex" onClick={(e) => e.stopPropagation()}>
          <SavedFiltersEditAction
            trigger={<IconButton icon={PencilLineIcon} />}
            savedFilter={selectedSavedFilter}
          />
          <SavedFiltersStarAction />
          <SavedFiltersUndoAction />
        </div>
      </TooltipProvider>
    </div>
  );
};

export default SavedFiltersLeftActions;
