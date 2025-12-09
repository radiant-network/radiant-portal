import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Car } from 'lucide-react';

import { Input } from '@/components/base/shadcn/input';

import { sizes } from './utils';

const meta = {
  title: 'Inputs/Input',
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
  render: () => (
    <div className="flex flex-col gap-2">
      {sizes.map(size => (
        <div key={size}>
          <span>{size}</span>
          <div className="flex gap-2">
            <Input size={size} className="max-w-[300px]" placeholder="Placeholder" autoFocus />
            <Input size={size} value="loremp ipsum" className="max-w-[300px]" placeholder="Placeholder" autoFocus />
            <Input endIcon={Car} size={size} className="max-w-[300px]" placeholder="Placeholder" autoFocus />
            <Input
              endIcon={Car}
              value="loremp ipsum"
              size={size}
              className="max-w-[300px]"
              placeholder="Placeholder"
              autoFocus
            />
          </div>
        </div>
      ))}
    </div>
  ),
};
