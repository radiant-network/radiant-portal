import { IconButton } from "@/components/base/Buttons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip";
import { Share2Icon } from "lucide-react";
import { useQueryBuilderContext } from "../QueryBuilder.Context";

const SavedFiltersShareAction = () => {
  const { queryBuilder } = useQueryBuilderContext();
  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();

  const handleShare = () => {
    // Share
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0} className="inline-flex">
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
          ? "Save filter to share"
          : "Share (Copy url)"}
      </TooltipContent>
    </Tooltip>
  );
};

export default SavedFiltersShareAction;
