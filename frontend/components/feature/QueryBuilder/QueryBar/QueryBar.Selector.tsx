import { useQueryBarContext } from "./QueryBar.Context";
import { Checkbox } from "@/components/base/checkbox";
import { tv } from "tailwind-variants";

const selector = tv({
  base: "flex gap-2 items-center py-2 px-4 border-l border-t border-b",
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

const QueryBarSelector = () => {
  const { query } = useQueryBarContext();

  return (
    <div className={selector({ selected: query.isActive() })}>
      <Checkbox
        size="sm"
        checked={query.isSelected()}
        onClick={(e) => {
          e.stopPropagation();

          if (query.isSelected()) {
            query.unselect();
          } else {
            query.select();
          }
        }}
      />
      <span className="text-xs font-medium">Q{query.index() + 1}</span>
    </div>
  );
};

export default QueryBarSelector;
