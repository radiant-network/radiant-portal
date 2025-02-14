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

const SavedFiltersOvewriteDialog = (props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => (
  <AlertDialog {...props}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Unsaved changes</AlertDialogTitle>
        <AlertDialogDescription>
          You are about to create a new filter; all modifications will be lost.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          variant="primary"
          onClick={() => {
            // todo create new filter
          }}
        >
          Create
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default SavedFiltersOvewriteDialog;
