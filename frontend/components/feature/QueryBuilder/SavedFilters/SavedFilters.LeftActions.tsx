import { cn } from "@/components/lib/utils";
import { RotateCcw, StarIcon } from "lucide-react";
import React from "react";
import SavedFiltersEditAction from "./SavedFilters.EditAction";

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
      <div className="flex gap-4" onClick={(e) => e.stopPropagation()}>
        <SavedFiltersEditAction />
        <StarIcon size={14} />
        <RotateCcw size={14} />
      </div>
    </div>
  );
};

export default SavedFiltersLeftActions;
