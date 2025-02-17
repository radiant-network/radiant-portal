import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/base/ui/alert-dialog";
import { Button } from "@/components/base/ui/button";
import {
  useQueryBuilderContext,
  useQueryBuilderDictContext,
} from "../QueryBuilder.Context";

const QueryToolbarClearAction = () => {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder } = useQueryBuilderContext();

  if (queryBuilder.getQueries().length > 1) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="link"
            size="xs"
            className="no-underline enabled:hover:no-underline"
          >
            {dict.toolbar.clearAll}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dict.toolbar.clearAllDialog.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dict.toolbar.clearAllDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {dict.toolbar.clearAllDialog.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => queryBuilder.clearQueries()}
            >
              {dict.toolbar.clearAllDialog.ok}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return null;
};

export default QueryToolbarClearAction;
