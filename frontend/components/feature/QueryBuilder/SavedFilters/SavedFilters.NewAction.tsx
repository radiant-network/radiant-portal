import { IconButton } from "@/components/base/Buttons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/tooltip";
import { PlusIcon } from "lucide-react";

const SavedFiltersNewAction = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton icon={PlusIcon} />
      </TooltipTrigger>
      <TooltipContent>New filter</TooltipContent>
    </Tooltip>
  );
};

export default SavedFiltersNewAction;
