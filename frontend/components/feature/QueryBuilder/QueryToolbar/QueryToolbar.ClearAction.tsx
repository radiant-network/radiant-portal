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
import { useQueryBuilderContext } from "../QueryBuilder.Context";

const QueryToolbarClearAction = () => {
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
            Clear all
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete all queries?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete all your queries. They will be lost
              forever.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => queryBuilder.clearQueries()}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return null;
};

export default QueryToolbarClearAction;
