import { IconButton } from "@/components/base/Buttons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip";
import { CopyIcon } from "lucide-react";
import { useState } from "react";
import {
  useQueryBuilderContext,
  useQueryBuilderDictContext,
} from "../QueryBuilder.Context";
import SavedFiltersOvewriteDialog from "./SavedFilters.OverwriteDialog";

const SavedFiltersDuplicateAction = () => {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder } = useQueryBuilderContext();
  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();

  const [open, toggleOpen] = useState(false);

  const handleDuplicate = () => {
    if (selectedSavedFilter?.isDirty()) {
      toggleOpen(true);
    } else {
      selectedSavedFilter?.duplicate();
    }
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">
            <IconButton
              icon={CopyIcon}
              disabled={selectedSavedFilter?.isNew() || !selectedSavedFilter}
              onClick={handleDuplicate}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent>{dict.savedFilter.duplicateTooltip}</TooltipContent>
      </Tooltip>
      <SavedFiltersOvewriteDialog open={open} onOpenChange={toggleOpen} />
    </>
  );
};

export default SavedFiltersDuplicateAction;
