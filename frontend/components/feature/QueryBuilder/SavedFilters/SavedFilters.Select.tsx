import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
} from "@/components/base/select";
import { useQueryBuilderContext } from "../QueryBuilder.Context";
import { Button } from "@/components/base/Buttons";

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
        <SelectSeparator />
        <Button variant="primary" className="hover:bg-red-950">
          New Filter
        </Button>
      </SelectContent>
    </Select>
  );
};

export default SavedFiltersSelect;
