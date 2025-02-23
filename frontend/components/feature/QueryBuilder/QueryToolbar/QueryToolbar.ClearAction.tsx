import { Button } from "@/components/base/ui/button";
import {
  useQueryBuilderContext,
  useQueryBuilderDictContext,
} from "../QueryBuilder.Context";
import { useAlertDialog } from "@/components/base/Dialog/AlertDialogProvider";
import { useCallback } from "react";

function QueryToolbarClearAction() {
  const alertDialog = useAlertDialog();
  const dict = useQueryBuilderDictContext();
  const { queryBuilder } = useQueryBuilderContext();

  const openAlertDialog = useCallback(
    function () {
      alertDialog.open({
        type: "warning",
        title: dict.toolbar.clearAllDialog.title,
        description: dict.toolbar.clearAllDialog.description,
        cancelProps: {
          children: dict.toolbar.clearAllDialog.cancel,
        },
        actionProps: {
          variant: "destructive",
          onClick: () => queryBuilder.clearQueries(),
          children: dict.toolbar.clearAllDialog.ok,
        },
      });
    },
    [queryBuilder, dict]
  );

  if (queryBuilder.getQueries().length > 1) {
    return (
      <Button
        variant="link"
        size="xs"
        className="no-underline enabled:hover:no-underline"
        onClick={openAlertDialog}
      >
        {dict.toolbar.clearAll}
      </Button>
    );
  }

  return null;
}

export default QueryToolbarClearAction;
