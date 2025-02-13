import { cn } from "@/components/lib/utils";
import { EditIcon, RotateCcw, StarIcon } from "lucide-react";
import React from "react";

const SavedFiltersLeftActions = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("flex items-center gap-4", className)} {...props}>
      <div>My Filter</div>
      <EditIcon size={14} />
      <StarIcon size={14} />
      <RotateCcw size={14} />
    </div>
  );
};

export default SavedFiltersLeftActions;
