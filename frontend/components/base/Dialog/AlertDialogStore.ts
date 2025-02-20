import {
  AlertDialogActionProps,
  AlertDialogCancelProps,
  AlertDialogType,
} from "../ui/alert-dialog";

interface OpenAlertDialogBaseProps {
  title: string;
  description: string;
  type?: AlertDialogType;
  actionProps: AlertDialogActionProps;
  className?: string;
}

interface OpenAlertDialogWithCancelProps extends OpenAlertDialogBaseProps {
  hideCancel?: never;
  cancelProps: AlertDialogCancelProps;
}

interface OpenAlertDialogWithoutCancelProps extends OpenAlertDialogBaseProps {
  hideCancel: true;
  cancelProps?: never;
}

export type OpenAlertDialogProps =
  | OpenAlertDialogWithCancelProps
  | OpenAlertDialogWithoutCancelProps;

export type AlertDialogSubscriber = {
  open: (props: OpenAlertDialogProps) => void;
  close: () => void;
};

class AlertDialogObserver {
  subscribers: Array<AlertDialogSubscriber>;

  constructor() {
    this.subscribers = [];
  }

  subscribe = (subscriber: AlertDialogSubscriber) => {
    this.subscribers.push(subscriber);

    return () => {
      const index = this.subscribers.indexOf(subscriber);
      this.subscribers.splice(index, 1);
    };
  };

  open = (props: OpenAlertDialogProps) => {
    this.subscribers.forEach((subscriber) =>
      subscriber.open({ type: "info", ...props })
    );
  };

  close = () => {
    this.subscribers.forEach((subscriber) => subscriber.close());
  };
}

const AlertDialogStore = new AlertDialogObserver();

export const alertDialog = {
  subscribe: AlertDialogStore.subscribe,
  open: AlertDialogStore.open,
  close: AlertDialogStore.close,
};
