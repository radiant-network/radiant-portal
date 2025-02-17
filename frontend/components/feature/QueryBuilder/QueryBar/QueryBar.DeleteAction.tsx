import { useQueryBarContext } from "./QueryBar.Context";
import { TrashIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/base/ui/popover";
import { Button } from "@/components/base/ui/button";
import { PopoverClose } from "@radix-ui/react-popover";
import { useQueryBuilderDictContext } from "../QueryBuilder.Context";

const QueryBarDeleteAction = () => {
  const { query } = useQueryBarContext();
  const dict = useQueryBuilderDictContext();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <TrashIcon size={16} className="hover:cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent side="left" className="w-[200px] space-y-3">
        <span className="text-sm">{dict.queryBar.deletePopover.title}</span>
        <div className="flex gap-1 justify-end">
          <PopoverClose asChild>
            <Button size="xs">{dict.queryBar.deletePopover.cancel}</Button>
          </PopoverClose>
          <PopoverClose asChild>
            <Button
              size="xs"
              variant="destructive"
              onClick={() => query.delete()}
            >
              {dict.queryBar.deletePopover.ok}
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default QueryBarDeleteAction;
