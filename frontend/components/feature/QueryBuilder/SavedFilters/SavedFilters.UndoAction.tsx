import { IconButton } from "@/components/base/Buttons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip";
import { RotateCcw } from "lucide-react";
import {
  useQueryBuilderContext,
  useQueryBuilderDictContext,
} from "../QueryBuilder.Context";

const SavedFiltersUndoAction = () => {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder } = useQueryBuilderContext();
  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();

  if (!selectedSavedFilter?.isDirty()) {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton
          icon={RotateCcw}
          disabled={!selectedSavedFilter}
          onClick={() => selectedSavedFilter.discardChanges()}
        />
      </TooltipTrigger>
      <TooltipContent>{dict.savedFilter.discardTooltip}</TooltipContent>
    </Tooltip>
  );
};

export default SavedFiltersUndoAction;
