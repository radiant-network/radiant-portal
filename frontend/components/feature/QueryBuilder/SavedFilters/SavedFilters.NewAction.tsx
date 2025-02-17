import { IconButton } from "@/components/base/Buttons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip";
import { PlusIcon } from "lucide-react";
import {
  useQueryBuilderContext,
  useQueryBuilderDictContext,
} from "../QueryBuilder.Context";
import SavedFiltersOvewriteDialog from "./SavedFilters.OverwriteDialog";
import { useState } from "react";

const SavedFiltersNewAction = () => {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder } = useQueryBuilderContext();
  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();

  const [open, toggleOpen] = useState(false);

  const handleNew = () => {
    if (selectedSavedFilter?.isDirty()) {
      toggleOpen(true);
    } else {
      queryBuilder.createSavedFilter();
    }
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">
            <IconButton
              icon={PlusIcon}
              onClick={handleNew}
              disabled={selectedSavedFilter?.isNew() || !selectedSavedFilter}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent>{dict.savedFilter.newFilter}</TooltipContent>
      </Tooltip>
      <SavedFiltersOvewriteDialog open={open} onOpenChange={toggleOpen} />
    </>
  );
};

export default SavedFiltersNewAction;
