import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/base/select";
import { useQueryBuilderContext } from "../QueryBuilder.Context";
import {
  CopyIcon,
  PlusIcon,
  SaveIcon,
  ShareIcon,
  TrashIcon,
} from "lucide-react";
import { cn } from "@/components/lib/utils";

const SavedFiltersRightActions = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { queryBuilder } = useQueryBuilderContext();

  return (
    <div className={cn("flex gap-4 items-center", className)} {...props}>
      <PlusIcon size={14} />
      <SaveIcon size={14} />
      <CopyIcon size={14} />
      <TrashIcon size={14} />
      <ShareIcon size={14} />
      <Select>
        <SelectTrigger className="w-[120px] h-6">My Filters</SelectTrigger>
        <SelectContent>
          {queryBuilder._getSavedFilters().map((filter) => (
            <SelectItem key={filter.id} value={filter.id}>
              {filter.raw().title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SavedFiltersRightActions;
