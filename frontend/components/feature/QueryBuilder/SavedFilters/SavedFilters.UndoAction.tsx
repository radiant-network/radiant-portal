import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/tooltip";
import { RotateCcw } from "lucide-react";

const SavedFiltersUndoAction = () => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <RotateCcw size={14} />
      </TooltipTrigger>
      <TooltipContent>Discard unsaved changes</TooltipContent>
    </Tooltip>
  );
};

export default SavedFiltersUndoAction;
