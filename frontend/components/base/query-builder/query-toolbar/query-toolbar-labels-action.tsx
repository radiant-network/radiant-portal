import { Switch } from '@/components/base/shadcn/switch';

import { useQueryBuilderContext, useQueryBuilderDictContext } from '../query-builder-context';

function QueryToolbarLabelsAction() {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder, enableShowHideLabels, showLabels, toggleLabels } = useQueryBuilderContext();

  if (!queryBuilder.canCombine() && enableShowHideLabels) {
    return (
      <div className="flex items-center gap-1.5">
        <Switch size="xs" checked={showLabels} onCheckedChange={toggleLabels} /> {dict.toolbar.labels}
      </div>
    );
  }

  return null;
}

export default QueryToolbarLabelsAction;
