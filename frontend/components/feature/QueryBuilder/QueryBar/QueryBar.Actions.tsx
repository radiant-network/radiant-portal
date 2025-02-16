import QueryBarDuplicateAction from "./QueryBar.DuplicateAction";
import QueryBarDeleteAction from "./QueryBar.DeleteAction";

const QueryBarActions = () => (
  <div
    className="
flex gap-4 items-center py-2 px-4 border-r border-t border-b 
border-[--gray-5] bg-[--gray-2]
group-data-[query-active=true]/query:border-[--gold-5]
group-data-[query-active=true]/query:bg-[--gold-2]
"
    onClick={(e) => e.stopPropagation()}
  >
    <QueryBarDuplicateAction />
    <QueryBarDeleteAction />
  </div>
);

export default QueryBarActions;
