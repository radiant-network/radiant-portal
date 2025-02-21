import QueryToolbarClearAction from "./QueryToolbar.ClearAction";
import QueryToolbarCombineAction from "./QueryToolbar.CombineAction";
import QueryToolbarAddAction from "./QueryToolbar.AddAction";
import QueryToolbarLabelsAction from "./QueryToolbar.LabelsAction";

const QueriesToolbar = () => (
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

export default QueriesToolbar;
