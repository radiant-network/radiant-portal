import { IconButton } from "@/components/base/Buttons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/tooltip";
import { SaveIcon } from "lucide-react";
import { useQueryBuilderContext } from "../QueryBuilder.Context";

const SavedFiltersSaveAction = () => {
  const { queryBuilder } = useQueryBuilderContext();
  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();
  const isDirty = selectedSavedFilter?.isDirty();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0} className="inline-flex">
          <IconButton
            icon={SaveIcon}
            color="orange-400"
            disabled={!selectedSavedFilter}
            className={isDirty ? "text-[--gold-7]" : ""}
          />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {isDirty ? "Save changes" : "Save filter"}
      </TooltipContent>
    </Tooltip>
  );
};

export default SavedFiltersSaveAction;
