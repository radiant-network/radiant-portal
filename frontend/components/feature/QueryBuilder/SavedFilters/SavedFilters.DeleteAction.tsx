import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip";
import { useState } from "react";
import SavedFiltersDeleteDialog from "./SavedFilters.DeleteDialog";
import { IconButton } from "@/components/base/Buttons";
import { TrashIcon } from "lucide-react";
import {
  useQueryBuilderContext,
  useQueryBuilderDictContext,
} from "../QueryBuilder.Context";

const SavedFiltersDeleteAction = () => {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder } = useQueryBuilderContext();
  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();

  const [open, toggleOpen] = useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">
            <IconButton
              icon={TrashIcon}
              disabled={selectedSavedFilter?.isNew() || !selectedSavedFilter}
              onClick={() => toggleOpen(true)}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent>{dict.savedFilter.deleteTooltip}</TooltipContent>
      </Tooltip>
      {selectedSavedFilter && (
        <SavedFiltersDeleteDialog
          open={open}
          onOpenChange={toggleOpen}
          savedFilter={selectedSavedFilter}
        />
      )}
    </>
  );
};

export default SavedFiltersDeleteAction;
