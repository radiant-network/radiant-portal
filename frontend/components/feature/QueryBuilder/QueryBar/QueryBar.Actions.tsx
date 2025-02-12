import { cva } from "class-variance-authority";
import { useQueryBarContext } from "./QueryBar.Context";
import { CopyIcon, InfoIcon, TrashIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/base/popover";
import { Button } from "@/components/base/Buttons";
import { PopoverClose } from "@radix-ui/react-popover";

const actions = cva(
  "flex gap-4 items-center py-2 px-4 border-r border-t border-b",
  {
    variants: {
      selected: {
        true: ["border-[--gold-6] bg-[--gold-2]"],
        false: ["border-[--gray-5] bg-[--gray-2]"],
      },
    },
    defaultVariants: {
      selected: false,
    },
  }
);

const QueryBarActions = () => {
  const { query } = useQueryBarContext();

  return (
    <div className={actions({ selected: query.isActive() })}>
      <CopyIcon
        size={16}
        className="hover:cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          query.duplicate();
        }}
      />
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
              <Button
                size="xs"
                variant="primary"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  query.delete();
                }}
              >
                Delete
              </Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default QueryBarActions;
