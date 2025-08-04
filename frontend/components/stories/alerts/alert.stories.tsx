import { Button } from '@/components/base/ui/button';
import { alertDialog } from '@/components/base/dialog/alert-dialog-store';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Alerts/Alert',
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  render: () => {
    return (
      <Button
        onClick={() => {
          alertDialog.open({
            type: 'info',
            title: 'Title',
            description: 'Description',
            actionProps: {
              children: 'Ok',
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
            type: 'warning',
            title: 'Title',
            description: 'Description',
            actionProps: {
              children: 'Ok',
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
            type: 'error',
            title: 'Title',
            description: 'Description',
            actionProps: {
              children: 'Ok',
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
            type: 'success',
            title: 'Title',
            description: 'Description',
            actionProps: {
              children: 'Ok',
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
            type: 'success',
            title: 'Title',
            description: 'Description',
            actionProps: {
              children: 'Save',
              onClick: e => {
                e.preventDefault();
                return new Promise(resolve => {
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
