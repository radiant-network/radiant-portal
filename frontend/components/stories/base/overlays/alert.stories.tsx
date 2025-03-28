import { Button } from '@/components/base/ui/button';
import { alertDialog } from '@/components/base/dialog/alert-dialog-store';
import { useI18n } from '@/components/hooks/i18n';
import type { Meta, StoryObj } from '@storybook/react';
import { AlertDialogProvider } from '@/components/base/dialog/alert-dialog-provider';

const meta = {
  title: 'Base/Overlays/Alert',
  component: Button,
  decorators: [
    (Story) => (
      <AlertDialogProvider>
        <Story />
      </AlertDialogProvider>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  render: () => {
    const { t } = useI18n();
    return (
      <Button
        onClick={() => {
          alertDialog.open({
            type: "info",
            title: t('common.alert.title'),
            description: t('common.alert.description'),
            actionProps: {
              children: t('common.actions.ok'),
            },
          });
        }}
        color="primary"
      >
        {t('common.actions.openAlertDialog')}
      </Button>
    );
  },
};

export const Warning: Story = {
  render: () => {
    const { t } = useI18n();
    return (
      <Button
        onClick={() => {
          alertDialog.open({
            type: "warning",
            title: t('common.alert.title'),
            description: t('common.alert.description'),
            actionProps: {
              children: t('common.actions.ok'),
            },
          });
        }}
        color="primary"
      >
        {t('common.actions.openAlertDialog')}
      </Button>
    );
  },
};

export const Error: Story = {
  render: () => {
    const { t } = useI18n();
    return (
      <Button
        onClick={() => {
          alertDialog.open({
            type: "error",
            title: t('common.alert.title'),
            description: t('common.alert.description'),
            actionProps: {
              children: t('common.actions.ok'),
            },
          });
        }}
        color="primary"
      >
        {t('common.actions.openAlertDialog')}
      </Button>
    );
  },
};

export const Success: Story = {
  render: () => {
    const { t } = useI18n();
    return (
      <Button
        onClick={() => {
          alertDialog.open({
            type: "success",
            title: t('common.alert.title'),
            description: t('common.alert.description'),
            actionProps: {
              children: t('common.actions.ok'),
            },
          });
        }}
        color="primary"
      >
        {t('common.actions.openAlertDialog')}
      </Button>
    );
  },
};

export const Async: Story = {
  render: () => {
    const { t } = useI18n();
    return (
      <Button
        onClick={() => {
          alertDialog.open({
            type: "success",
            title: t('common.alert.async.title'),
            description: t('common.alert.async.description'),
            actionProps: {
              children: t('common.actions.save'),
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
        {t('common.actions.openAlertDialog')}
      </Button>
    );
  },
};
