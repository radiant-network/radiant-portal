import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/tooltip";
import { Share2Icon } from "lucide-react";

const SavedFiltersShareAction = () => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Share2Icon size={14} />
      </TooltipTrigger>
      <TooltipContent>Share (Copy url)</TooltipContent>
    </Tooltip>
  );
};

export default SavedFiltersShareAction;
