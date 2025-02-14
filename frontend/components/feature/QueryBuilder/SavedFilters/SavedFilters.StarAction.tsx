import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/tooltip";
import { StarIcon } from "lucide-react";

const SavedFiltersStarAction = () => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <StarIcon size={14} />
      </TooltipTrigger>
      {/* Unset default filter */}
      <TooltipContent>Set as default filter</TooltipContent>
    </Tooltip>
  );
};

export default SavedFiltersStarAction;
