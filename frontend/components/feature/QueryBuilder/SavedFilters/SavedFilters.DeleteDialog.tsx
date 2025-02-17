import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/base/ui/alert-dialog";
import { SavedFilterInstance } from "@/components/model/query-builder-core";
import { useQueryBuilderDictContext } from "../QueryBuilder.Context";

const SavedFiltersDeleteDialog = ({
  savedFilter,
  ...props
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savedFilter: SavedFilterInstance;
}) => {
  const dict = useQueryBuilderDictContext();

  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {dict.savedFilter.deleteDialog.title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {dict.savedFilter.deleteDialog.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {dict.savedFilter.deleteDialog.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => savedFilter.delete()}
          >
            {dict.savedFilter.deleteDialog.ok}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SavedFiltersDeleteDialog;
