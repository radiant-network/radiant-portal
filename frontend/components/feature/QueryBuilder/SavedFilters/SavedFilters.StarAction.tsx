import { IconButton } from "@/components/base/Buttons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip";
import { StarIcon } from "lucide-react";
import { useQueryBuilderContext } from "../QueryBuilder.Context";

const SavedFiltersStarAction = () => {
  const { queryBuilder, enableFavorite } = useQueryBuilderContext();
  const selectedSavedFilter = queryBuilder.getSelectedSavedFilter();

  if (!enableFavorite) {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton
          icon={StarIcon}
          iconClassName={
            selectedSavedFilter?.isFavorite()
              ? "stroke-[--gold-6] fill-[--gold-6]"
              : ""
          }
          disabled={!selectedSavedFilter}
          onClick={() => selectedSavedFilter?.toggleFavorite()}
        />
      </TooltipTrigger>
      {/* Unset default filter */}
      <TooltipContent>Set as default filter</TooltipContent>
    </Tooltip>
  );
};

export default SavedFiltersStarAction;
