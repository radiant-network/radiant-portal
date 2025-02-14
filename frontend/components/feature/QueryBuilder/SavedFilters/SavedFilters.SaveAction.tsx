import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/tooltip";
import { SaveIcon } from "lucide-react";

const SavedFiltersSaveAction = () => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <SaveIcon size={14} />
      </TooltipTrigger>
      <TooltipContent>Save filter</TooltipContent>
    </Tooltip>
  );
};

export default SavedFiltersSaveAction;
