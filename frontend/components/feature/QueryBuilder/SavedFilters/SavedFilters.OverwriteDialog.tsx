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
import { useQueryBuilderDictContext } from "../QueryBuilder.Context";

const SavedFiltersOvewriteDialog = (props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const dict = useQueryBuilderDictContext();

  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {dict.savedFilter.overwriteDialog.title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {dict.savedFilter.overwriteDialog.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {dict.savedFilter.overwriteDialog.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="primary"
            onClick={() => {
              // todo create new filter
            }}
          >
            {dict.savedFilter.overwriteDialog.ok}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SavedFiltersOvewriteDialog;
