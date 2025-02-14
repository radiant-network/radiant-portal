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
    <div
      className={cn(
        "flex items-center gap-4 whitespace-nowrap text-ellipsis overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="text-ellipsis overflow-hidden">My Filter</div>
      <TooltipProvider>
        <div className="flex" onClick={(e) => e.stopPropagation()}>
          <SavedFiltersEditAction />
          <SavedFiltersStarAction />
          <SavedFiltersUndoAction />
        </div>
      </TooltipProvider>
    </div>
  );
};

export default SavedFiltersLeftActions;
