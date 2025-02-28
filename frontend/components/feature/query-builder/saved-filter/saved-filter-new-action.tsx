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
} from "../query-builder-context";
import { openOverwriteSavedFilterAlert } from "../alerts";

function SavedFiltersNewAction() {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder } = useQueryBuilderContext();

  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();

  const handleNew = function () {
    if (selectedSavedFilter?.isDirty()) {
      openOverwriteSavedFilterAlert(queryBuilder, dict);
    } else {
      queryBuilder.createSavedFilter();
    }
  };

  return (
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
  );
}

export default SavedFiltersNewAction;
