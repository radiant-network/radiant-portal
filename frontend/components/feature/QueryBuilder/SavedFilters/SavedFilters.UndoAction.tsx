import { IconButton } from "@/components/base/Buttons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/tooltip";
import { RotateCcw } from "lucide-react";

const SavedFiltersUndoAction = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton icon={RotateCcw} />
      </TooltipTrigger>
      <TooltipContent>Discard unsaved changes</TooltipContent>
    </Tooltip>
  );
};

export default SavedFiltersUndoAction;
