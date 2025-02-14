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
  const isDirty = queryBuilder.getSelectedSavedFilter()?.isDirty();

  const handleShare = () => {
    // Share
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild={!isDirty}>
        <IconButton
          icon={Share2Icon}
          disabled={isDirty}
          onClick={handleShare}
        />
      </TooltipTrigger>
      <TooltipContent>
        {isDirty ? "Save filter to share" : "Share (Copy url)"}
      </TooltipContent>
    </Tooltip>
  );
};

export default SavedFiltersShareAction;
