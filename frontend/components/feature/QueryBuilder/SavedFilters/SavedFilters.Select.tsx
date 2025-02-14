import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
} from "@/components/base/select";
import { useQueryBuilderContext } from "../QueryBuilder.Context";
import { FolderIcon } from "lucide-react";
import SavedFiltersManageAction from "./SavedFilters.ManagerAction";

const SavedFiltersSelect = () => {
  const { queryBuilder } = useQueryBuilderContext();

  return (
    <Select
      value={queryBuilder.getSelectedSavedFilter()?.id}
      onValueChange={(savedFilterId) => {}}
    >
      <SelectTrigger className="w-[135px] h-7">
        <div className="flex items-center gap-2">
          <FolderIcon size={14} /> My Filters
        </div>
      </SelectTrigger>
      <SelectContent>
        {queryBuilder._getSavedFilters().map((filter) => (
          <SelectItem key={filter.id} value={filter.id}>
            {filter.raw().title}
          </SelectItem>
        ))}
        <SelectSeparator />
        <SavedFiltersManageAction />
      </SelectContent>
    </Select>
  );
};

export default SavedFiltersSelect;
