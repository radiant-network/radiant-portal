import { IconButton } from "@/components/base/Buttons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/tooltip";
import { PlusIcon } from "lucide-react";
import { useQueryBuilderContext } from "../QueryBuilder.Context";
import SavedFiltersOvewriteDialog from "./SavedFilters.OverwriteDialog";
import { useState } from "react";

const SavedFiltersNewAction = () => {
  const [open, toggleOpen] = useState(false);
  const { queryBuilder } = useQueryBuilderContext();
  const isDirty = queryBuilder.getSelectedSavedFilter()?.isDirty();

  const handleNew = () => {
    if (isDirty) {
      toggleOpen(true);
    } else {
      // TODO create new filter
    }
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton icon={PlusIcon} onClick={handleNew} />
        </TooltipTrigger>
        <TooltipContent>New filter</TooltipContent>
      </Tooltip>
      <SavedFiltersOvewriteDialog open={open} onOpenChange={toggleOpen} />
    </>
  );
};

export default SavedFiltersNewAction;
