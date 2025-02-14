import { IconButton } from "@/components/base/Buttons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip";
import { PlusIcon } from "lucide-react";
import { useQueryBuilderContext } from "../QueryBuilder.Context";
import SavedFiltersOvewriteDialog from "./SavedFilters.OverwriteDialog";
import { useState } from "react";

const SavedFiltersNewAction = () => {
  const [open, toggleOpen] = useState(false);
  const { queryBuilder } = useQueryBuilderContext();
  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();

  const handleNew = () => {
    if (selectedSavedFilter?.isDirty()) {
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
              icon={PlusIcon}
              onClick={handleNew}
              disabled={selectedSavedFilter?.isNew() || !selectedSavedFilter}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent>New filter</TooltipContent>
      </Tooltip>
      <SavedFiltersOvewriteDialog open={open} onOpenChange={toggleOpen} />
    </>
  );
};

export default SavedFiltersNewAction;
