import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import CheckboxGroupField, { CheckboxGroupFieldItem } from '@/components/base/checkboxes/checkbox-group-field';
import { Badge } from '@/components/base/shadcn/badge';
import { Label } from '@/components/base/shadcn/label';
import { Separator } from '@/components/base/shadcn/separator';
import { Switch } from '@/components/base/shadcn/switch';

import { StoryLabel, StorySection, StoryShowcase } from '../story-section';

import { StoryErrorField } from './story-error-field';

const meta = {
  title: 'Components/Inputs/Checkbox Group',
  component: CheckboxGroupField,
  args: {},
} satisfies Meta<typeof CheckboxGroupField>;

export default meta;

type Story = StoryObj<typeof meta>;

const errorOptions: CheckboxGroupFieldItem[] = [
  { id: 'option1err', label: 'Horse' },
  { id: 'option2err', label: 'Red panda' },
  { id: 'option3err', label: 'Otter' },
];

// The nested switch needs a unique DOM id per example, so the options are built per example.
function makeErrorBoxOptions(exampleId: string): CheckboxGroupFieldItem[] {
  const switchId = `${exampleId}-extra-switch`;

  return [
    {
      id: 'option1box',
      label: 'Horse',
      description: 'This is a description.',
      extraContent: (
        <div className="flex flex-col gap-2">
          <Separator style={{ marginTop: '16px' }} />
          <span className="text-sm font-medium text-foreground">
            Extra content <span className="text-destructive">*</span>
          </span>
          <div className="flex items-center gap-2">
            <Switch id={switchId} />
            <Label htmlFor={switchId} className="text-sm font-normal">
              An option nested in the extra content
            </Label>
          </div>
        </div>
      ),
    },
    { id: 'option2box', label: 'Red panda', description: 'This is a description.' },
  ];
}

const errorBoxOptions = makeErrorBoxOptions('error-box');
const checkedErrorBoxOptions = makeErrorBoxOptions('error-checked-box');

const checkedErrorOptions: CheckboxGroupFieldItem[] = [
  { id: 'option1box', label: 'Horse', description: 'This is a description.' },
  { id: 'option2box', label: 'Red panda', description: 'This is a description.' },
];

function CheckboxGroupErrorDemo() {
  const [values, setValues] = useState<string[]>([]);
  const [boxValues, setBoxValues] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <StoryLabel>
          Empty — the error clears as soon as an option is picked, and comes back if all are cleared
        </StoryLabel>
        <div className="flex gap-20">
          <StoryErrorField
            label="What is your favorite animal?"
            error="Please pick at least one option"
            invalid={values.length === 0}
          >
            <CheckboxGroupField
              value={values}
              onValueChange={setValues}
              aria-invalid={values.length === 0}
              data={errorOptions}
              style={{ marginLeft: '16px' }}
            />
          </StoryErrorField>
          <StoryErrorField
            label="What is your favorite animal?"
            error="Please pick at least one option"
            invalid={boxValues.length === 0}
            width={420}
          >
            <CheckboxGroupField
              box
              value={boxValues}
              onValueChange={setBoxValues}
              aria-invalid={boxValues.length === 0}
              data={errorBoxOptions}
            />
          </StoryErrorField>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <StoryLabel>Checked while still in error</StoryLabel>
        <div className="flex gap-20">
          <StoryErrorField label="What is your favorite animal?" error="Please pick at least one option" width={420}>
            <CheckboxGroupField aria-invalid defaultValue={['option1box']} data={checkedErrorOptions} />
          </StoryErrorField>
          <StoryErrorField label="What is your favorite animal?" error="Please pick at least one option" width={420}>
            <CheckboxGroupField box aria-invalid defaultValue={['option1box']} data={checkedErrorBoxOptions} />
          </StoryErrorField>
        </div>
      </div>
    </div>
  );
}

const singleOption: CheckboxGroupFieldItem[] = [{ id: 'option1', label: 'Option 1' }];

const singleOptionWithDescription: CheckboxGroupFieldItem[] = [
  { id: 'option1', label: 'Option 1', description: 'This is option 1' },
];

const options: CheckboxGroupFieldItem[] = [
  { id: 'option1', label: 'Option 1', description: 'This is option 1' },
  { id: 'option2', label: 'Option 2', description: 'This is option 2' },
  { id: 'option3', label: 'Option 3', description: 'This is option 3' },
];

const disabledOptions: CheckboxGroupFieldItem[] = [
  { id: 'option1', label: 'Option 1', description: 'This is option 1', disabled: true },
  { id: 'option2', label: 'Option 2', description: 'This is option 2', disabled: true },
];

const disabledOptionsWithExtraContent: CheckboxGroupFieldItem[] = [
  {
    id: 'option1',
    label: 'Option 1',
    description: 'This is option 1',
    disabled: true,
    extraContent: (
      <div className="flex flex-col gap-2">
        <Separator style={{ marginTop: '16px' }} />
        <span className="text-sm font-medium text-foreground">
          Extra content <span className="text-destructive">*</span>
        </span>
        <div className="flex items-center gap-2">
          <Switch id="option1-disabled-extra-switch" disabled />
          <Label htmlFor="option1-disabled-extra-switch" className="text-sm font-normal">
            An option nested in the extra content
          </Label>
        </div>
      </div>
    ),
  },
  { id: 'option2', label: 'Option 2', description: 'This is option 2', disabled: true },
];

const optionsWithExtraTitle: CheckboxGroupFieldItem[] = [
  {
    id: 'option1',
    label: 'Option 1',
    description: 'This is option 1',
    extraTitle: (
      <div className="flex flex-wrap items-center justify-end gap-1.5">
        <Badge variant="green">Recommended</Badge>
        <Badge variant="blue">SNV</Badge>
        <Badge variant="violet">WGS</Badge>
      </div>
    ),
  },
  {
    id: 'option2',
    label: 'Option 2',
    description: 'This is option 2',
    extraTitle: (
      <div className="flex flex-wrap items-center justify-end gap-1.5">
        <Badge variant="amber">Beta</Badge>
        <Badge variant="cyan">CNV</Badge>
      </div>
    ),
  },
];

const optionsWithManyExtraTitleBadges: CheckboxGroupFieldItem[] = [
  {
    id: 'option1',
    label: 'Option 1',
    description: 'This is option 1',
    extraTitle: (
      <div className="flex flex-wrap items-center justify-end gap-1.5" style={{ width: 160 }}>
        <Badge variant="green">Recommended</Badge>
        <Badge variant="blue">SNV</Badge>
        <Badge variant="violet">WGS</Badge>
        <Badge variant="cyan">CNV</Badge>
        <Badge variant="amber">Beta</Badge>
        <Badge variant="neutral">Deprecated</Badge>
      </div>
    ),
  },
];

const optionsWithExtraContent: CheckboxGroupFieldItem[] = [
  {
    id: 'option1',
    label: 'Option 1',
    description: (
      <>
        This is option 1.{' '}
        <a href="#" className="text-primary underline underline-offset-4">
          View permissions
        </a>
      </>
    ),
    extraTitle: (
      <div className="flex flex-wrap items-center justify-end gap-1.5">
        <Badge variant="green">Recommended</Badge>
        <Badge variant="blue">SNV</Badge>
      </div>
    ),
    extraContent: (
      <div className="flex flex-col gap-2">
        <Separator style={{ marginTop: '16px' }} />
        <span className="text-sm font-medium text-foreground">
          Extra content <span className="text-destructive">*</span>
        </span>
        <div className="flex items-center gap-2">
          <Switch id="option1-extra-switch" />
          <Label htmlFor="option1-extra-switch" className="text-sm font-normal">
            An option nested in the extra content
          </Label>
        </div>
      </div>
    ),
  },
  {
    id: 'option2',
    label: 'Option 2',
    description: (
      <>
        This is option 2.{' '}
        <a href="#" className="text-primary underline underline-offset-4">
          View permissions
        </a>
      </>
    ),
  },
];

export const AllVariants: Story = {
  args: {
    data: singleOption,
  },
  render: () => (
    <StoryShowcase>
      <StorySection title="Basic">
        <div className="flex gap-20">
          <CheckboxGroupField data={singleOption} />
          <CheckboxGroupField data={singleOption} align="end" />
          <CheckboxGroupField data={singleOption} defaultValue={['option1']} />
        </div>
      </StorySection>

      <StorySection title="Description">
        <div className="flex gap-20">
          <CheckboxGroupField data={singleOptionWithDescription} />
          <CheckboxGroupField data={singleOptionWithDescription} align="end" />
          <CheckboxGroupField data={singleOptionWithDescription} defaultValue={['option1']} />
        </div>
      </StorySection>

      <StorySection title="Box">
        <div className="flex gap-20">
          <div style={{ width: 280 }}>
            <CheckboxGroupField data={singleOptionWithDescription} box />
          </div>
          <div style={{ width: 280 }}>
            <CheckboxGroupField data={singleOptionWithDescription} box align="end" />
          </div>
          <div style={{ width: 280 }}>
            <CheckboxGroupField data={singleOptionWithDescription} box defaultValue={['option1']} />
          </div>
        </div>
      </StorySection>

      <StorySection title="Group">
        <div className="flex gap-20">
          <div style={{ width: 280 }}>
            <CheckboxGroupField data={options} defaultValue={['option1']} />
          </div>
          <div style={{ width: 280 }}>
            <CheckboxGroupField data={options} defaultValue={['option1']} align="end" />
          </div>
        </div>
      </StorySection>

      <StorySection title="Box group">
        <div className="flex gap-20">
          <div style={{ width: 280 }}>
            <CheckboxGroupField data={options} box defaultValue={['option1']} />
          </div>
          <div style={{ width: 280 }}>
            <CheckboxGroupField data={options} box defaultValue={['option1', 'option3']} align="end" />
          </div>
        </div>
      </StorySection>

      <StorySection
        title="Disabled"
        description="Default and box types, unselected and selected — the whole item stops being a click target."
      >
        <div className="flex gap-20">
          <div style={{ width: 280 }}>
            <CheckboxGroupField data={disabledOptions} defaultValue={['option1']} />
          </div>
          <div style={{ width: 280 }}>
            <CheckboxGroupField data={disabledOptions} box defaultValue={['option1']} />
          </div>
          <div style={{ width: 420 }}>
            <CheckboxGroupField data={disabledOptionsWithExtraContent} box defaultValue={['option1']} />
          </div>
        </div>
      </StorySection>

      <StorySection
        title="Extra title"
        description={
          'Extra title is a generic slot at the right of the label and description — the content brings its own ' +
          'layout and its own width. With align="end" it stays between the text and the checkbox.'
        }
      >
        <div className="flex gap-20">
          <div style={{ width: 420 }}>
            <CheckboxGroupField data={optionsWithExtraTitle} box defaultValue={['option1']} />
          </div>
          <div style={{ width: 420 }}>
            <CheckboxGroupField data={optionsWithExtraTitle} box defaultValue={['option1']} align="end" />
          </div>
        </div>
        <div style={{ width: 420, marginTop: '20px' }}>
          <CheckboxGroupField data={optionsWithManyExtraTitleBadges} box defaultValue={['option1']} />
        </div>
      </StorySection>

      <StorySection
        title="Extra content"
        description={
          'Extra content is a generic slot revealed under the label, description and extra title once the item ' +
          'is selected, and spans the same width — the content brings its own layout.'
        }
      >
        <div className="flex gap-20">
          <div style={{ width: 420 }}>
            <CheckboxGroupField data={optionsWithExtraContent} box defaultValue={['option1']} />
          </div>
          <div style={{ width: 420 }}>
            <CheckboxGroupField data={optionsWithExtraContent} box defaultValue={['option1']} align="end" />
          </div>
        </div>
      </StorySection>

      <StorySection
        title="Error"
        description="In error, the field label, the message, the option labels and the checkboxes turn red, while the descriptions stay muted. An unchecked box keeps its neutral border; a checked one turns red with a pale red fill."
      >
        <CheckboxGroupErrorDemo />
      </StorySection>
    </StoryShowcase>
  ),
};
