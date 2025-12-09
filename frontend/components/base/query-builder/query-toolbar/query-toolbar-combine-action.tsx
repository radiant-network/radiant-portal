import capitalize from 'lodash/capitalize';

import { ActionButton } from '@/components/base/buttons';
import { BooleanOperators } from '@/components/cores/sqon';

import { useQueryBuilderContext, useQueryBuilderDictContext } from '../query-builder-context';

function QueryToolbarCombineAction() {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder, enableCombine } = useQueryBuilderContext();

  if (queryBuilder.canCombine() && enableCombine) {
    return (
      <ActionButton
        actions={[
          {
            label: capitalize(dict.queryPill.operator.and),
            onClick: () => queryBuilder.combineSelectedQueries(BooleanOperators.And),
          },
          {
            label: capitalize(dict.queryPill.operator.or),
            onClick: () => queryBuilder.combineSelectedQueries(BooleanOperators.Or),
          },
        ]}
        onDefaultAction={() => queryBuilder.combineSelectedQueries(BooleanOperators.And)}
        size="xs"
        color="primary"
      >
        {dict.toolbar.combine}
      </ActionButton>
    );
  }

  return null;
}

export default QueryToolbarCombineAction;
