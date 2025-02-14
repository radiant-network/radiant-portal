import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip";
import { useState } from "react";
import SavedFiltersDeleteDialog from "./SavedFilters.DeleteDialog";
import { IconButton } from "@/components/base/Buttons";
import { TrashIcon } from "lucide-react";
import { useQueryBuilderContext } from "../QueryBuilder.Context";

const SavedFiltersDeleteAction = () => {
  const [open, toggleOpen] = useState(false);
  const { queryBuilder } = useQueryBuilderContext();
  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={0} className="inline-flex">
            <IconButton
              icon={TrashIcon}
              disabled={!selectedSavedFilter}
              onClick={() => toggleOpen(true)}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent>Delete filter</TooltipContent>
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
