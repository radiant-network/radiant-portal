import { IconButton } from "@/components/base/Buttons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/tooltip";
import { TrashIcon } from "lucide-react";

const SavedFiltersDeleteAction = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton icon={TrashIcon} />
      </TooltipTrigger>
      <TooltipContent>Delete filter</TooltipContent>
    </Tooltip>
  );
};

export default SavedFiltersDeleteAction;
