import type { Meta, StoryObj } from '@storybook/react-vite';

import RadioGroupField from '@/components/base/radio-group/radio-group-field';

import { StorySection, StoryShowcase } from '../story-section';

const meta = {
  title: 'Components/Inputs/Radio Group',
  component: RadioGroupField,
  args: {},
} satisfies Meta<typeof RadioGroupField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  args: {
    data: [{ id: 'option1', label: 'Option 1' }],
  },
  render: () => (
    <StoryShowcase>
      <StorySection title="Basic">
        <div className="flex gap-20">
          <RadioGroupField data={[{ id: 'option1a', label: 'Option 1' }]} />
          <RadioGroupField data={[{ id: 'option1b', label: 'Option 1' }]} align="end" />
          <RadioGroupField data={[{ id: 'option1c', label: 'Option 1' }]} defaultValue="option1c" />
        </div>
      </StorySection>

      <StorySection title="Description">
        <div className="flex gap-20">
          <RadioGroupField data={[{ id: 'option1aa', label: 'Option 1', description: 'This is option 1' }]} />
          <RadioGroupField
            data={[{ id: 'option1bb', label: 'Option 1', description: 'This is option 1' }]}
            align="end"
          />
          <RadioGroupField
            data={[{ id: 'option1cc', label: 'Option 1', description: 'This is option 1' }]}
            defaultValue="option1cc"
          />
        </div>
      </StorySection>

      <StorySection title="Group">
        <div className="flex gap-20">
          <RadioGroupField
            data={[
              { id: 'option1aaa', label: 'Option 1', description: 'This is option 1' },
              { id: 'option2bbb', label: 'Option 2', description: 'This is option 2' },
              { id: 'option3ccc', label: 'Option 3', description: 'This is option 3' },
            ]}
            defaultValue="option1aaa"
          />
          <RadioGroupField
            data={[
              { id: 'option1aaaa', label: 'Option 1', description: 'This is option 1' },
              { id: 'option2bbbb', label: 'Option 2', description: 'This is option 2' },
              { id: 'option3cccc', label: 'Option 3', description: 'This is option 3' },
            ]}
            defaultValue="option1aaaa"
            align="end"
          />
        </div>
      </StorySection>

      <StorySection title="Box group">
        <div className="flex gap-20">
          <RadioGroupField
            data={[
              { id: 'option1d', label: 'Option 1', description: 'This is option 1' },
              { id: 'option2e', label: 'Option 2', description: 'This is option 2' },
              { id: 'option3f', label: 'Option 3', description: 'This is option 3' },
            ]}
            box
            defaultValue="option1d"
          />
          <RadioGroupField
            data={[
              { id: 'option1g', label: 'Option 1', description: 'This is option 1' },
              { id: 'option2h', label: 'Option 2', description: 'This is option 2' },
              { id: 'option3i', label: 'Option 3', description: 'This is option 3' },
            ]}
            box
            defaultValue="option1g"
            align="end"
          />
        </div>
      </StorySection>
    </StoryShowcase>
  ),
};
