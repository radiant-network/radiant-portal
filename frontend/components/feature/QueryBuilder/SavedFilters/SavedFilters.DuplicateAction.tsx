import { IconButton } from "@/components/base/Buttons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip";
import { CopyIcon } from "lucide-react";
import { useState } from "react";
import { useQueryBuilderContext } from "../QueryBuilder.Context";
import SavedFiltersOvewriteDialog from "./SavedFilters.OverwriteDialog";

const SavedFiltersDuplicateAction = () => {
  const [open, toggleOpen] = useState(false);
  const { queryBuilder } = useQueryBuilderContext();
  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();
  const isDirty = selectedSavedFilter?.isDirty();

  const handleDuplicate = () => {
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
          <span tabIndex={0} className="inline-flex">
            <IconButton
              icon={CopyIcon}
              disabled={!selectedSavedFilter}
              onClick={handleDuplicate}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent>Duplicate filter</TooltipContent>
      </Tooltip>
      <SavedFiltersOvewriteDialog open={open} onOpenChange={toggleOpen} />
    </>
  );
};

export default SavedFiltersDuplicateAction;
