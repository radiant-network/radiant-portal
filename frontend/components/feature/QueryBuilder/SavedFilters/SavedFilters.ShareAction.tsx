import { IconButton } from "@/components/base/Buttons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/tooltip";
import { Share2Icon } from "lucide-react";
import { useQueryBuilderContext } from "../QueryBuilder.Context";

const SavedFiltersShareAction = () => {
  const { queryBuilder } = useQueryBuilderContext();
  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();
  const isDirty = selectedSavedFilter?.isDirty();

  const handleShare = () => {
    // Share
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0} className="inline-flex">
          <IconButton
            icon={Share2Icon}
            disabled={isDirty || !selectedSavedFilter}
            onClick={handleShare}
          />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {isDirty || !selectedSavedFilter
          ? "Save filter to share"
          : "Share (Copy url)"}
      </TooltipContent>
    </Tooltip>
  );
};

export default SavedFiltersShareAction;
