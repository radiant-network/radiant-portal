import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/base/alert-dialog";
import { SavedFilterInstance } from "@/components/model/query-builder-core";

const SavedFiltersDeleteDialog = ({
  savedFilter,
  ...props
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savedFilter: SavedFilterInstance;
}) => (
  <AlertDialog {...props}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Permanently delete this filter?</AlertDialogTitle>
        <AlertDialogDescription>
          You are about to permanently delete this filter and all of its
          queries.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          variant="destructive"
          onClick={() => savedFilter.delete()}
        >
          Delete filter
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default SavedFiltersDeleteDialog;
