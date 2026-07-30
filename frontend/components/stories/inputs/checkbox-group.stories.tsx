import type { Meta, StoryObj } from '@storybook/react-vite';

import CheckboxGroupField, { CheckboxGroupFieldItem } from '@/components/base/checkboxes/checkbox-group-field';
import { Badge } from '@/components/base/shadcn/badge';
import { Label } from '@/components/base/shadcn/label';
import { Separator } from '@/components/base/shadcn/separator';
import { Switch } from '@/components/base/shadcn/switch';

import { StorySection, StoryShowcase } from '../story-section';

const meta = {
  title: 'Components/Inputs/Checkbox Group',
  component: CheckboxGroupField,
  args: {},
} satisfies Meta<typeof CheckboxGroupField>;

export default meta;

type Story = StoryObj<typeof meta>;

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
    </StoryShowcase>
  ),
};
