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
  Share2Icon,
  TrashIcon,
} from "lucide-react";
import { cn } from "@/components/lib/utils";

const SavedFiltersRightActions = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { queryBuilder } = useQueryBuilderContext();

  return (
    <div className={cn("flex", className)} {...props}>
      <div
        className="flex gap-4 items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <PlusIcon size={14} />
        <SaveIcon size={14} />
        <CopyIcon size={14} />
        <TrashIcon size={14} />
        <Share2Icon size={14} />
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
      </div>
    </div>
  );
};

export default SavedFiltersRightActions;
