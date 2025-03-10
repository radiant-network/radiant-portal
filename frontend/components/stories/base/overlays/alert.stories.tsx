import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/components/base/ui/button";
import { AlertDialogProvider } from "@/components/base/dialog/alert-dialog-provider";
import { alertDialog } from "@/components/base/dialog/alert-dialog-store";

const meta = {
  title: "Base/Overlays/Alert Dialog Provider",
  decorators: [
    (Story) => (
      <AlertDialogProvider>
        <Story />
      </AlertDialogProvider>
    ),
  ],
} satisfies Meta<any>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  render: () => {
    return (
      <Button
        onClick={() => {
          alertDialog.open({
            type: "info",
            title: "Alert dialog title",
            description: "Alert dialog description",
            actionProps: {
              children: "Ok",
            },
          });
        }}
        color="primary"
      >
        Open Alert Dialog
      </Button>
    );
  },
};

export const Warning: Story = {
  render: () => {
    return (
      <Button
        onClick={() => {
          alertDialog.open({
            type: "warning",
            title: "Alert dialog title",
            description: "Alert dialog description",
            actionProps: {
              children: "Ok",
            },
          });
        }}
        color="primary"
      >
        Open Alert Dialog
      </Button>
    );
  },
};

export const Error: Story = {
  render: () => {
    return (
      <Button
        onClick={() => {
          alertDialog.open({
            type: "error",
            title: "Alert dialog title",
            description: "Alert dialog description",
            actionProps: {
              children: "Ok",
            },
          });
        }}
        color="primary"
      >
        Open Alert Dialog
      </Button>
    );
  },
};

export const Success: Story = {
  render: () => {
    return (
      <Button
        onClick={() => {
          alertDialog.open({
            type: "success",
            title: "Alert dialog title",
            description: "Alert dialog description",
            actionProps: {
              children: "Ok",
            },
          });
        }}
        color="primary"
      >
        Open Alert Dialog
      </Button>
    );
  },
};

export const Async: Story = {
  render: () => {
    return (
      <Button
        onClick={() => {
          alertDialog.open({
            type: "success",
            title: "Async alert dialog title",
            description:
              "Click save to close and dialog will close after 3 seconds.",
            actionProps: {
              children: "Save",
              onClick: (e) => {
                e.preventDefault();
                return new Promise((resolve) => {
                  setTimeout(() => resolve(true), 3000);
                });
              },
            },
          });
        }}
        color="primary"
      >
        Open Alert Dialog
      </Button>
    );
  },
};
