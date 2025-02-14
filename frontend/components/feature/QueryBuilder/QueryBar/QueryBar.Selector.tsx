import { useQueryBarContext } from "./QueryBar.Context";
import { Checkbox } from "@/components/base/ui/checkbox";

const QueryBarSelector = () => {
  const { query } = useQueryBarContext();

  return (
    <div
      className="
    flex gap-2 items-center py-2 px-4 border-l border-t border-b 
    border-[--gray-5] bg-[--gray-2]
    group-data-[query-active=true]/query:border-[--gold-6]
    group-data-[query-active=true]/query:bg-[--gold-2]
    "
    >
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
