import { Switch } from "@/components/base/ui/switch";
import { useQueryBuilderContext } from "../QueryBuilder.Context";

const QueryToolbarLabelsAction = () => {
  const { queryBuilder, enableShowHideLabels, showLabels, toggleLabels } =
    useQueryBuilderContext();

  if (!queryBuilder.canCombine() && enableShowHideLabels) {
    return (
      <div className="flex items-center gap-1.5">
        <Switch size="xs" checked={showLabels} onCheckedChange={toggleLabels} />{" "}
        Labels
      </div>
    );
  }

  return null;
};

export default QueryToolbarLabelsAction;
