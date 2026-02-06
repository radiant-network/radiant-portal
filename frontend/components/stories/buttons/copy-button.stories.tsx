import type { Meta, StoryObj } from '@storybook/react-vite';

import { CopyButton } from '@/components/base/buttons/copy-button';

const meta = {
  title: 'Buttons/Copy Button',
  component: CopyButton,
  parameters: {
    docs: {
      description: {
        component:
          'A reusable button component that copies text to clipboard with tooltip feedback and success confirmation.',
      },
    },
  },
  args: {
    value: 'Hello, World!',
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'The text value to copy to clipboard',
    },
  },
} satisfies Meta<typeof CopyButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 'Default copy button',
  },
};

export const UsageExamples: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold">Usage Examples</h3>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Patient ID:</span>
            <span>PAT123456</span>
            <CopyButton value="PAT123456" />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">MRN:</span>
            <span>MRN789012</span>
            <CopyButton value="MRN789012" variant="outline" />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Email:</span>
            <span>patient@example.com</span>
            <CopyButton value="patient@example.com" variant="secondary" size="default" iconSize={16} />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Quick copy:</span>
            <span>Fast success (1s)</span>
            <CopyButton value="Quick copy test" successDuration={1000} />
          </div>
        </div>
      </div>
    );
  },
};
