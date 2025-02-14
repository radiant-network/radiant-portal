import { IconButton } from "@/components/base/Buttons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/tooltip";
import { SaveIcon } from "lucide-react";

const SavedFiltersSaveAction = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton icon={SaveIcon} />
      </TooltipTrigger>
      <TooltipContent>Save filter</TooltipContent>
    </Tooltip>
  );
};

export default SavedFiltersSaveAction;
