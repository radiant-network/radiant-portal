import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { BooleanOperators } from '@/components/cores/sqon';

import { useQueryBuilderContext, useQueryBuilderDictContext } from '../query-builder-context';

function QueryToolbarAddAction() {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder } = useQueryBuilderContext();

  if (queryBuilder.canCombine()) {
    return null;
  }

  return (
    <Button
      size="xs"
      disabled={queryBuilder.hasEmptyQuery()}
      onClick={() =>
        queryBuilder.createQuery({
          op: BooleanOperators.And,
          content: [],
        })
      }
    >
      <PlusIcon />
      {dict.toolbar.newQuery}
    </Button>
  );
}

export default QueryToolbarAddAction;
