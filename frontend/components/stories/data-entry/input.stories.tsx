import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { action } from '@storybook/addon-actions';
import { Input } from '@/components/base/ui/input';
import { Car, ListFilter } from 'lucide-react';

const meta = {
  title: 'Data Entry/Inputs/Input',
  component: Input,
  args: {
    value: 'Input value',
    onChange: fn(),
    placeholder: 'Placeholder',
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <Input
        value={value}
        onChange={e => {
          setValue(e.target.value);
          action('onChange')(e);
        }}
        className="max-w-[300px]"
        placeholder="Placeholder"
        autoFocus
      />
    );
  },
};

export const WithIcon: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <Input
        value={value}
        startIcon={ListFilter}
        endIcon={Car}
        onChange={e => {
          setValue(e.target.value);
          action('onChange')(e);
        }}
        className="max-w-[300px]"
        placeholder="Placeholder"
        autoFocus
      />
    );
  },
};
