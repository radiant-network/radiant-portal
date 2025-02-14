import { IconButton } from "@/components/base/Buttons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip";
import { SaveIcon } from "lucide-react";
import { useQueryBuilderContext } from "../QueryBuilder.Context";

const SavedFiltersSaveAction = () => {
  const { queryBuilder } = useQueryBuilderContext();
  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();
  const isDisabled = selectedSavedFilter
    ? !selectedSavedFilter.isDirty() || queryBuilder.isEmpty()
    : queryBuilder.isEmpty();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0} className="inline-flex">
          <IconButton
            icon={SaveIcon}
            color="orange-400"
            disabled={isDisabled}
            className={selectedSavedFilter?.isDirty() ? "text-[--gold-6]" : ""}
          />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {queryBuilder.isEmpty()
          ? "Add a query to save"
          : selectedSavedFilter?.isDirty()
            ? "Save changes"
            : "Save filter"}
      </TooltipContent>
    </Tooltip>
  );
};

export default SavedFiltersSaveAction;
