import { useQueryBarContext } from "./QueryBar.Context";
import { tv } from "tailwind-variants";
import QueryBarDuplicateAction from "./QueryBar.DuplicateAction";
import QueryBarDeleteAction from "./QueryBar.DeleteAction";

const actions = tv({
  base: "flex gap-4 items-center py-2 px-4 border-r border-t border-b",
  variants: {
    selected: {
      true: ["border-[--gold-6] bg-[--gold-2]"],
      false: ["border-[--gray-5] bg-[--gray-2]"],
    },
  },
  defaultVariants: {
    selected: false,
  },
});

const QueryBarActions = () => {
  const { query } = useQueryBarContext();

  return (
    <div
      className={actions({ selected: query.isActive() })}
      onClick={(e) => e.stopPropagation()}
    >
      <QueryBarDuplicateAction />
      <QueryBarDeleteAction />
    </div>
  );
};

export default QueryBarActions;
