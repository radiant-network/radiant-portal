import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/base/select";
import { useQueryBuilderContext } from "../QueryBuilder.Context";

const SavedFiltersSelect = () => {
  const { queryBuilder } = useQueryBuilderContext();

  return (
    <Select>
      <SelectTrigger className="w-[120px] h-6">
        <div>My Filters</div>
      </SelectTrigger>
      <SelectContent>
        {queryBuilder._getSavedFilters().map((filter) => (
          <SelectItem key={filter.id} value={filter.id}>
            {filter.raw().title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SavedFiltersSelect;
