import { IconButton } from "@/components/base/Buttons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip";
import { SaveIcon } from "lucide-react";
import {
  useQueryBuilderContext,
  useQueryBuilderDictContext,
} from "../query-builder-context";
import { SavedFilterTypeEnum } from "@/components/model/saved-filter";

function SavedFiltersSaveAction() {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder } = useQueryBuilderContext();

  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();
  const isDisabled = selectedSavedFilter
    ? !selectedSavedFilter.isDirty()
    : queryBuilder.isEmpty();

  const handleSave = function () {
    if (selectedSavedFilter) {
      selectedSavedFilter.save(SavedFilterTypeEnum.Filter);
    } else {
      queryBuilder.saveNewFilter();
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">
          <IconButton
            icon={SaveIcon}
            disabled={isDisabled}
            className={selectedSavedFilter?.isDirty() ? "text-gold-500" : ""}
            onClick={handleSave}
          />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {queryBuilder.isEmpty()
          ? dict.savedFilter.saveTooltip.whenEmpty
          : selectedSavedFilter?.isDirty()
          ? dict.savedFilter.saveTooltip.whenDirty
          : dict.savedFilter.saveTooltip.default}
      </TooltipContent>
    </Tooltip>
  );
}

export default SavedFiltersSaveAction;
