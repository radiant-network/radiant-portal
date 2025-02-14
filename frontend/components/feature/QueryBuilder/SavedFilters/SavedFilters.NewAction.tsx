import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/tooltip";
import { PlusIcon } from "lucide-react";

const SavedFiltersNewAction = () => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <PlusIcon size={14} />
      </TooltipTrigger>
      <TooltipContent>New filter</TooltipContent>
    </Tooltip>
  );
};

export default SavedFiltersNewAction;
