import type { Meta, StoryObj } from '@storybook/react-vite';

import { alertDialog } from '@/components/base/dialog/alert-dialog-store';
import { Button } from '@/components/base/shadcn/button';

import { StorySection } from '../story-section';

const meta = {
  title: 'Components/Alerts/Alert Dialog',
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  render: () => (
    <StorySection title="Info">
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
    </StorySection>
  ),
};

export const Warning: Story = {
  render: () => (
    <StorySection title="Warning">
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
    </StorySection>
  ),
};

export const Error: Story = {
  render: () => (
    <StorySection title="Error">
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
    </StorySection>
  ),
};

export const Success: Story = {
  render: () => (
    <StorySection title="Success">
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
    </StorySection>
  ),
};

export const Async: Story = {
  render: () => (
    <StorySection title="Async (pending action)">
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
    </StorySection>
  ),
};
