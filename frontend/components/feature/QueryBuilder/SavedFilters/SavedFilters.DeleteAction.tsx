import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip";
import { IconButton } from "@/components/base/Buttons";
import { TrashIcon } from "lucide-react";
import {
  useQueryBuilderContext,
  useQueryBuilderDictContext,
} from "../QueryBuilder.Context";
import { openDeleteSavedFilterAlert } from "../alerts";

const SavedFiltersDeleteAction = () => {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder } = useQueryBuilderContext();

  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">
          <IconButton
            icon={TrashIcon}
            disabled={selectedSavedFilter?.isNew() || !selectedSavedFilter}
            onClick={() =>
              openDeleteSavedFilterAlert(selectedSavedFilter!, dict)
            }
          />
        </span>
      </TooltipTrigger>
      <TooltipContent>{dict.savedFilter.deleteTooltip}</TooltipContent>
    </Tooltip>
  );
};

export default SavedFiltersDeleteAction;
