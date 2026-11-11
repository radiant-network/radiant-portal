import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import RadioGroupField from '@/components/base/radio-group/radio-group-field';

import { StoryLabel, StorySection, StoryShowcase } from '../story-section';

import { StoryErrorField } from './story-error-field';

const meta = {
  title: 'Components/Inputs/Radio Group',
  component: RadioGroupField,
  args: {},
} satisfies Meta<typeof RadioGroupField>;

export default meta;

type Story = StoryObj<typeof meta>;

const errorOptions = [
  { id: 'option1err', label: '18 and under' },
  { id: 'option2err', label: '19 - 60' },
  { id: 'option3err', label: '60 and over' },
];

const errorBoxOptions = [
  { id: 'option1box', label: '18 and under', description: 'Enjoy your young' },
  { id: 'option2box', label: '19 - 60', description: 'Be brave' },
  { id: 'option3box', label: '60 and over', description: 'Enjoy no work anymore' },
];

// RadioGroupField uses each item id as the DOM id, so ids must stay unique across the page.
const checkedErrorOptions = errorOptions.map(option => ({ ...option, id: `${option.id}-checked` }));
const checkedErrorBoxOptions = errorBoxOptions.map(option => ({ ...option, id: `${option.id}-checked` }));

function RadioGroupErrorDemo() {
  const [value, setValue] = useState<string>();
  const [boxValue, setBoxValue] = useState<string>();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <StoryLabel>
          Empty — the error clears as soon as an option is picked, and comes back if it is cleared
        </StoryLabel>
        <div className="flex gap-20">
          <StoryErrorField label="How old are you?" error="Please pick an option" invalid={!value}>
            <RadioGroupField
              value={value}
              onValueChange={setValue}
              aria-invalid={!value}
              data={errorOptions}
              style={{ marginLeft: '16px' }}
            />
          </StoryErrorField>
          <StoryErrorField label="How old are you?" error="Please pick an option" invalid={!boxValue}>
            <RadioGroupField
              box
              value={boxValue}
              onValueChange={setBoxValue}
              aria-invalid={!boxValue}
              data={errorBoxOptions}
            />
          </StoryErrorField>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <StoryLabel>
          Checked while still in error — the box turns red and gets a pale red fill; without a box, only the dot appears
        </StoryLabel>
        <div className="flex gap-20">
          <StoryErrorField label="How old are you?" error="Please pick an option">
            <RadioGroupField
              aria-invalid
              defaultValue={checkedErrorOptions[1].id}
              data={checkedErrorOptions}
              style={{ marginLeft: '16px' }}
            />
          </StoryErrorField>
          <StoryErrorField label="How old are you?" error="Please pick an option">
            <RadioGroupField
              box
              aria-invalid
              defaultValue={checkedErrorBoxOptions[1].id}
              data={checkedErrorBoxOptions}
            />
          </StoryErrorField>
        </div>
      </div>
    </div>
  );
}

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

      <StorySection
        title="Error"
        description="In error, the field label, the message, the option labels and the radio circles turn red, while the descriptions stay muted. An unchecked box keeps its neutral border; a checked one turns red with a pale red fill."
      >
        <RadioGroupErrorDemo />
      </StorySection>
    </StoryShowcase>
  ),
};
