import { useCallback } from 'react';

import { alertDialog } from '@/components/base/dialog/alert-dialog-store';
import { Button } from '@/components/base/shadcn/button';

import { useQueryBuilderContext, useQueryBuilderDictContext } from '../query-builder-context';

function QueryToolbarClearAction() {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder } = useQueryBuilderContext();

  const openAlertDialog = useCallback(() => {
    alertDialog.open({
      type: 'warning',
      title: dict.toolbar.clearAllDialog.title,
      description: dict.toolbar.clearAllDialog.description,
      cancelProps: {
        children: dict.toolbar.clearAllDialog.cancel,
      },
      actionProps: {
        variant: 'destructive',
        onClick: () => queryBuilder.clearQueries(),
        children: dict.toolbar.clearAllDialog.ok,
      },
    });
  }, [queryBuilder, dict]);

  if (queryBuilder.getQueries().length > 1) {
    return (
      <Button variant="ghost" size="sm" className="no-underline enabled:hover:no-underline" onClick={openAlertDialog}>
        {dict.toolbar.clearAll}
      </Button>
    );
  }

  return null;
}

export default QueryToolbarClearAction;
