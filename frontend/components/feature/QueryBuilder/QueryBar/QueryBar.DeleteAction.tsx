import { useQueryBarContext } from "./QueryBar.Context";
import { InfoIcon, TrashIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/base/popover";
import { Button } from "@/components/base/Buttons";
import { PopoverClose } from "@radix-ui/react-popover";

const QueryBarDeleteAction = () => {
  const { query } = useQueryBarContext();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <TrashIcon size={16} className="hover:cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent side="left" className="w-[200px] space-y-3">
        <div className="flex items-center gap-2">
          <InfoIcon size={16} className="shrink-0" />
          <span className="text-sm">Delete this query?</span>
        </div>
        <div className="flex gap-1 justify-end">
          <PopoverClose asChild>
            <Button size="xs">Cancel</Button>
          </PopoverClose>
          <PopoverClose asChild>
            <Button size="xs" variant="primary" onClick={() => query.delete()}>
              Delete
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default QueryBarDeleteAction;
