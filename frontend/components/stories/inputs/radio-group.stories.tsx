import type { Meta, StoryObj } from '@storybook/react';

import RadioGroupCustom from '@/components/base/radio-group/radio-group';
import { RadioGroup } from '@/components/base/shadcn/radio-group';

const meta = {
  title: 'Inputs/Radio Group',
  component: RadioGroup,
  args: {
    // value: 'Input value',
    // onChange: fn(),
    // placeholder: 'Placeholder',
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <span className="font-semibold">Basic</span>
        <div className="flex gap-2">
          <RadioGroupCustom data={[{ id: 'option1', label: 'Option 1' }]} />
          <RadioGroupCustom data={[{ id: 'option1', label: 'Option 1' }]} align="end" />
          <RadioGroupCustom data={[{ id: 'option1', label: 'Option 1' }]} defaultValue="option1" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <span className="font-semibold">Description</span>
        <div className="flex gap-2">
          <RadioGroupCustom data={[{ id: 'option1', label: 'Option 1', description: 'This is option 1' }]} />
          <RadioGroupCustom
            data={[{ id: 'option1', label: 'Option 1', description: 'This is option 1' }]}
            align="end"
          />
          <RadioGroupCustom
            data={[{ id: 'option1', label: 'Option 1', description: 'This is option 1' }]}
            defaultValue="option1"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <span className="font-semibold">Group</span>
        <div className="flex gap-2">
          <RadioGroupCustom
            data={[
              { id: 'option1', label: 'Option 1', description: 'This is option 1' },
              { id: 'option2', label: 'Option 2', description: 'This is option 2' },
              { id: 'option3', label: 'Option 3', description: 'This is option 3' },
            ]}
            defaultValue="option1"
          />
          <RadioGroupCustom
            data={[
              { id: 'option1', label: 'Option 1', description: 'This is option 1' },
              { id: 'option2', label: 'Option 2', description: 'This is option 2' },
              { id: 'option3', label: 'Option 3', description: 'This is option 3' },
            ]}
            defaultValue="option1"
            align="end"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <span className="font-semibold">Box group</span>
        <div className="flex gap-2">
          <RadioGroupCustom
            data={[
              { id: 'option1', label: 'Option 1', description: 'This is option 1' },
              { id: 'option2', label: 'Option 2', description: 'This is option 2' },
              { id: 'option3', label: 'Option 3', description: 'This is option 3' },
            ]}
            box
            defaultValue="option1"
          />
          <RadioGroupCustom
            data={[
              { id: 'option1', label: 'Option 1', description: 'This is option 1' },
              { id: 'option2', label: 'Option 2', description: 'This is option 2' },
              { id: 'option3', label: 'Option 3', description: 'This is option 3' },
            ]}
            box
            defaultValue="option1"
            align="end"
          />
        </div>
      </div>
    </div>
  ),
};
