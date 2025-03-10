import { useQueryBarContext } from "./query-bar-context";
import { TrashIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/base/ui/popover";
import { Button } from "@/components/base/ui/button";
import { PopoverClose } from "@radix-ui/react-popover";
import { useQueryBuilderDictContext } from "../query-builder-context";
import { IconButton } from "@/components/base/Buttons";

function QueryBarDeleteAction() {
  const { query } = useQueryBarContext();
  const dict = useQueryBuilderDictContext();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <IconButton icon={TrashIcon} />
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
              color="destructive"
              onClick={() => query.delete()}
            >
              {dict.queryBar.deletePopover.ok}
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default QueryBarDeleteAction;
