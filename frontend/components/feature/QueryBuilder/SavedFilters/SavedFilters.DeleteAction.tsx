import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/tooltip";
import { TrashIcon } from "lucide-react";

const SavedFiltersDeleteAction = () => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <TrashIcon size={14} />
      </TooltipTrigger>
      <TooltipContent>Delete filter</TooltipContent>
    </Tooltip>
  );
};

export default SavedFiltersDeleteAction;
