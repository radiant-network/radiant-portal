import { cn } from "@/components/lib/utils";
import { RotateCcw, StarIcon } from "lucide-react";
import React from "react";
import SavedFiltersEditAction from "./SavedFilters.EditAction";
import SavedFiltersUndoAction from "./SavedFilters.UndoAction";
import SavedFiltersStarAction from "./SavedFilters.StarAction";
import { TooltipProvider } from "@/components/base/tooltip";

const SavedFiltersLeftActions = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex items-center gap-4 whitespace-nowrap text-ellipsis overflow-hidden",
          className
        )}
        {...props}
      >
        <div className="text-ellipsis overflow-hidden">My Filter</div>
        <div className="flex gap-4" onClick={(e) => e.stopPropagation()}>
          <SavedFiltersEditAction />
          <SavedFiltersStarAction />
          <SavedFiltersUndoAction />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SavedFiltersLeftActions;
