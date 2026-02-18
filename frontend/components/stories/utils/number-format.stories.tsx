import type { Meta, StoryObj } from '@storybook/react-vite';

import TextCell from '@/components/base/data-table/cells/text-cell';
import { toKiloBases } from '@/components/lib/number-format';

const meta = {
  title: 'Utils/Number-Format',
  component: TextCell,
  args: {},
  decorators: [Story => <Story />],
} satisfies Meta<typeof TextCell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const KiloBases: Story = {
  render: () => (
    <>
      <span>ToKiloBases</span>
      <div className="flex flex-col gap-2">
        <div>{toKiloBases(10)}</div>
        <div>{toKiloBases(100)}</div>
        <div>{toKiloBases(1000)}</div>
        <div>{toKiloBases(10000)}</div>
        <div>{toKiloBases(100000)}</div>
        <div>{toKiloBases(1000000)}</div>
        <div>{toKiloBases(10000000)}</div>
      </div>
      <div className="flex flex-col gap-2">
        <div>{toKiloBases(10.1)}</div>
        <div>{toKiloBases(100.1)}</div>
        <div>{toKiloBases(1000.1)}</div>
        <div>{toKiloBases(10000.1)}</div>
        <div>{toKiloBases(100000.1)}</div>
        <div>{toKiloBases(1000000.1)}</div>
        <div>{toKiloBases(10000000.1)}</div>
      </div>
    </>
  ),
};
