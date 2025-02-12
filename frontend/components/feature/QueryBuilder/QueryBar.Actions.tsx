import { cva } from "class-variance-authority";
import { useQueryBarContext } from "./QueryBar.Context";
import { CopyIcon, TrashIcon } from "lucide-react";

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
      <CopyIcon size={16} className="hover:cursor-pointer" />
      <TrashIcon size={16} className="hover:cursor-pointer" />
    </div>
  );
};

export default QueryBarActions;
