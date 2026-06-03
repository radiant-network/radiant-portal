import type { Meta, StoryObj } from '@storybook/react-vite';
import { Car } from 'lucide-react';

import { Field, FieldDescription, FieldError, FieldLabel, FieldTitle } from '@/components/base/shadcn/field';
import { Input } from '@/components/base/shadcn/input';

import { StoryLabel, StorySection } from '../story-section';

import { sizes } from './utils';

const meta = {
  title: 'Components/Inputs/Input',
  component: Input,
  args: {
    value: 'Input value',
    onChange: () => {},
    placeholder: 'Placeholder',
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: () => (
    <StorySection title="Sizes">
      {sizes.map(size => (
        <div key={size} className="flex flex-col gap-2">
          <StoryLabel>{size}</StoryLabel>
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
    </StorySection>
  ),
};

export const WithFieldVariant: Story = {
  render: () => (
    <StorySection title="Field variants">
      <div className="flex max-w-[400px] flex-col gap-6">
        {/* Basic Field with Label */}
        <Field>
          <FieldLabel>Basic Input with Label</FieldLabel>
          <Input size="sm" placeholder="Placeholder" />
        </Field>

        {/* Field with Label and Description */}
        <Field>
          <FieldLabel>Input with Description</FieldLabel>
          <FieldDescription>This is a helpful description to guide the user</FieldDescription>
          <Input size="sm" placeholder="Enter your text here" />
        </Field>

        {/* Field with Title (alternative to Label) */}
        <Field>
          <FieldTitle>Input with Title</FieldTitle>
          <FieldDescription>Titles can be used as an alternative to labels</FieldDescription>
          <Input size="sm" placeholder="Placeholder" />
        </Field>

        {/* Field with Label, Description and Error */}
        <Field>
          <FieldLabel>Input with Error State</FieldLabel>
          <FieldDescription>This field shows an error message below</FieldDescription>
          <Input size="sm" placeholder="Placeholder" className="border-destructive" />
          <FieldError>This field is required</FieldError>
        </Field>

        {/* Field with multiple errors */}
        <Field>
          <FieldLabel>Input with Multiple Errors</FieldLabel>
          <Input size="sm" placeholder="Placeholder" className="border-destructive" />
          <FieldError errors={[{ message: 'This field is required' }, { message: 'Must be at least 3 characters' }]} />
        </Field>

        {/* Complete Field with all elements */}
        <Field>
          <FieldLabel>Complete Field Example</FieldLabel>
          <FieldDescription>
            This field demonstrates all available components: Label, Description, Input, and helper text.
          </FieldDescription>
          <Input size="sm" placeholder="Enter complete information" endIcon={Car} />
          <FieldDescription className="text-xs">Additional helper text can go here</FieldDescription>
        </Field>
      </div>
    </StorySection>
  ),
};
