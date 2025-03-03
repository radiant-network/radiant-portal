import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogIcon,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { alertDialog, OpenAlertDialogProps } from "./alert-dialog-store";
import { Spinner } from "../spinner";

type AlertDialogProps = OpenAlertDialogProps & {
  isOpen: boolean;
};

interface AlertDialogContextType {
  open: (props: OpenAlertDialogProps) => void;
  close: () => void;
}

const AlertDialogContext = createContext<AlertDialogContextType | undefined>(
  undefined
);

export const AlertDialogProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [activeAlertDialog, setActiveAlertDialog] =
    useState<AlertDialogProps | null>();

  useEffect(
    () =>
      alertDialog.subscribe({
        open,
        close,
      }),
    []
  );

  const open = useCallback(
    (props: OpenAlertDialogProps) => {
      setActiveAlertDialog({ ...props, isOpen: true });
    },
    [setActiveAlertDialog]
  );

  const close = useCallback(() => {
    if (alertDialog) {
      setActiveAlertDialog((prev) => ({
        type: "info",
        ...prev!,
        isOpen: false,
      }));

      setTimeout(() => {
        setActiveAlertDialog(null);
      }, 350);
    }
  }, [activeAlertDialog, setActiveAlertDialog]);

  return (
    <AlertDialogContext.Provider value={{ open, close }}>
      {children}
      {activeAlertDialog && (
        <AlertDialog
          open={activeAlertDialog.isOpen}
          onOpenChange={(open) => {
            if (!open) {
              close();
            }
          }}
        >
          <AlertDialogContent>
            <div className="flex gap-3">
              <AlertDialogIcon type={activeAlertDialog.type || "info"} />
              <AlertDialogHeader className="flex">
                <AlertDialogTitle>{activeAlertDialog.title}</AlertDialogTitle>
                <AlertDialogDescription>
                  {activeAlertDialog.description}
                </AlertDialogDescription>
              </AlertDialogHeader>
            </div>
            <AlertDialogFooter>
              {activeAlertDialog.hideCancel ? null : (
                <AlertDialogCancel
                  {...activeAlertDialog.cancelProps}
                  children={activeAlertDialog.cancelProps?.children || "Cancel"}
                />
              )}
              <AlertDialogAction
                {...activeAlertDialog.actionProps}
                disabled={activeAlertDialog.actionProps.disabled || loading}
                children={
                  <>
                    {loading && <Spinner />}
                    {activeAlertDialog.actionProps.children}
                  </>
                }
                onClick={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  await activeAlertDialog?.actionProps?.onClick?.(e);
                  setLoading(false);
                  close();
                }}
              />
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </AlertDialogContext.Provider>
  );
};

export const useAlertDialog = () => {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error(
      "useAlertDialog must be used within a AlertDialogContext.Provider"
    );
  }
  return context;
};
