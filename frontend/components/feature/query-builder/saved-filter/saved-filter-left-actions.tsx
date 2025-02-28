import { cn } from "@/components/lib/utils";
import React from "react";
import SavedFiltersEditAction from "./saved-filter-edit-action";
import SavedFiltersUndoAction from "./saved-filter-undo-action";
import SavedFiltersStarAction from "./saved-filter-star-action";
import { TooltipProvider } from "@/components/base/ui/tooltip";
import { useQueryBuilderContext } from "../query-builder-context";

function SavedFiltersLeftActions({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
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
        {selectedSavedFilter
          ? selectedSavedFilter.raw().title
          : queryBuilder.coreProps.savedFilterDefaultTitle}
      </div>
      <TooltipProvider>
        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
          <SavedFiltersEditAction />
          <SavedFiltersStarAction />
          <SavedFiltersUndoAction />
        </div>
      </TooltipProvider>
    </div>
  );
}

export default SavedFiltersLeftActions;
