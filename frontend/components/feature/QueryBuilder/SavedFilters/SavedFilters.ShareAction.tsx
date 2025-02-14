import { IconButton } from "@/components/base/Buttons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/tooltip";
import { Share2Icon } from "lucide-react";

const SavedFiltersShareAction = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton icon={Share2Icon} />
      </TooltipTrigger>
      <TooltipContent>Share (Copy url)</TooltipContent>
    </Tooltip>
  );
};

export default SavedFiltersShareAction;
