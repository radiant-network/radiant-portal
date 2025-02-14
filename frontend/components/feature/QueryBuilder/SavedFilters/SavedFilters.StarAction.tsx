import { IconButton } from "@/components/base/Buttons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/tooltip";
import { StarIcon } from "lucide-react";

const SavedFiltersStarAction = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton icon={StarIcon} />
      </TooltipTrigger>
      {/* Unset default filter */}
      <TooltipContent>Set as default filter</TooltipContent>
    </Tooltip>
  );
};

export default SavedFiltersStarAction;
