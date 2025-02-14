import { IconButton } from "@/components/base/Buttons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/tooltip";
import { CopyIcon } from "lucide-react";

const SavedFiltersDuplicateAction = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton icon={CopyIcon} />
      </TooltipTrigger>
      <TooltipContent>Duplicate filter</TooltipContent>
    </Tooltip>
  );
};

export default SavedFiltersDuplicateAction;
