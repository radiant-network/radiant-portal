import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
} from "@/components/base/select";
import { useQueryBuilderContext } from "../QueryBuilder.Context";
import { Button } from "@/components/base/Buttons";
import { FolderIcon } from "lucide-react";

const SavedFiltersSelect = () => {
  const { queryBuilder } = useQueryBuilderContext();

  return (
    <Select>
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
        <Button size="sm" className="w-full pl-1">
          Manage filters
        </Button>
      </SelectContent>
    </Select>
  );
};

export default SavedFiltersSelect;
