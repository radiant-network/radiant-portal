import { IconButton } from "@/components/base/Buttons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip";
import { Share2Icon } from "lucide-react";
import {
  useQueryBuilderContext,
  useQueryBuilderDictContext,
} from "../QueryBuilder.Context";

function SavedFiltersShareAction() {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder } = useQueryBuilderContext();

  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();

  const handleShare = function () {
    // Share
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">
          <IconButton
            icon={Share2Icon}
            disabled={
              selectedSavedFilter?.isDirty() ||
              selectedSavedFilter?.isNew() ||
              !selectedSavedFilter
            }
            onClick={handleShare}
          />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {selectedSavedFilter?.isDirty() || !selectedSavedFilter
          ? dict.savedFilter.shareTooltip.whenNotSaved
          : dict.savedFilter.shareTooltip.default}
      </TooltipContent>
    </Tooltip>
  );
}

export default SavedFiltersShareAction;
