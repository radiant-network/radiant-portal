import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/tooltip";
import { CopyIcon } from "lucide-react";

const SavedFiltersDuplicateAction = () => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <CopyIcon size={14} />
      </TooltipTrigger>
      <TooltipContent>Duplicate filter</TooltipContent>
    </Tooltip>
  );
};

export default SavedFiltersDuplicateAction;
