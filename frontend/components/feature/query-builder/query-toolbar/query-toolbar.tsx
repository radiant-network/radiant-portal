import QueryToolbarClearAction from "./query-toolbar-clear-action";
import QueryToolbarCombineAction from "./query-toolbar-combine-action";
import QueryToolbarAddAction from "./query-toolbar-add-action";
import QueryToolbarLabelsAction from "./query-toolbar-labels-action";

function QueriesToolbar() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <QueryToolbarAddAction />
        <QueryToolbarCombineAction />
        <QueryToolbarLabelsAction />
      </div>
      <div>
        <QueryToolbarClearAction />
      </div>
    </div>
  );
}

export default QueriesToolbar;
