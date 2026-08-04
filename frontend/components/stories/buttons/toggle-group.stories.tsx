import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bold, Italic, Underline } from 'lucide-react';
import { type VariantProps } from 'tailwind-variants';

import { type toggleVariants } from '@/components/base/shadcn/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/base/shadcn/toggle-group';

import { StoryErrorField } from '../inputs/story-error-field';
import { StoryLabel, StorySection, StoryShowcase } from '../story-section';

const sizes: NonNullable<VariantProps<typeof toggleVariants>['size']>[] = ['sm', 'default', 'lg'];

const meta = {
  title: 'Components/Buttons/Toggle Group',
  component: ToggleGroup,
  args: { type: 'single' as const },
} satisfies Meta<typeof ToggleGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

const classifications = [
  {
    value: 'pathogenic',
    label: 'Pathogenic',
    className:
      'data-[state=on]:bg-red/20 data-[state=on]:text-red-foreground border data-[state=on]:border-red-foreground data-[state=on]:hover:text-red-foreground',
  },
  {
    value: 'likely-pathogenic',
    label: 'Likely pathogenic',
    className:
      'data-[state=on]:bg-orange/20 data-[state=on]:text-orange-foreground border data-[state=on]:border-orange-foreground data-[state=on]:hover:text-orange-foreground',
  },
  {
    value: 'vus',
    label: 'VUS',
    className:
      'data-[state=on]:bg-yellow/20 data-[state=on]:text-yellow-foreground border data-[state=on]:border-yellow-foreground data-[state=on]:hover:text-yellow-foreground',
  },
  {
    value: 'likely-benign',
    label: 'Likely benign',
    className:
      'data-[state=on]:bg-lime/20 data-[state=on]:text-lime-foreground border data-[state=on]:border-lime-foreground data-[state=on]:hover:text-lime-foreground',
  },
  {
    value: 'benign',
    label: 'Benign',
    className:
      'data-[state=on]:bg-green/20 data-[state=on]:text-green-foreground border data-[state=on]:border-green-foreground data-[state=on]:hover:text-green-foreground',
  },
];

function ClassificationToggleGroup({
  value,
  onValueChange,
  defaultValue,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
}) {
  return (
    <ToggleGroup
      type="single"
      size="default"
      variant="outline"
      spacing={1}
      className="flex-wrap justify-start"
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      aria-invalid
    >
      {classifications.map(classification => (
        <ToggleGroupItem key={classification.value} value={classification.value} className={classification.className}>
          {classification.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

function ToggleGroupErrorDemo() {
  const [value, setValue] = useState('');

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <StoryLabel>Empty — the error clears as soon as a classification is picked</StoryLabel>
        <StoryErrorField label="Classification" error="Please pick a classification" invalid={!value} width={560}>
          <ClassificationToggleGroup value={value} onValueChange={setValue} />
        </StoryErrorField>
      </div>

      <div className="flex flex-col gap-3">
        <StoryLabel>
          Picked while still in error — the selected option keeps its own colour, so it stays readable as a
          classification rather than as an error
        </StoryLabel>
        <StoryErrorField label="Classification" error="Please pick a classification" width={560}>
          <ClassificationToggleGroup defaultValue="vus" />
        </StoryErrorField>
      </div>
    </div>
  );
}

export const AllVariants: Story = {
  render: () => (
    <StoryShowcase direction="row">
      {sizes.map(size => (
        <StorySection key={size} title={`Size ${size}`} align="center">
          <StoryLabel>Single type</StoryLabel>
          <ToggleGroup type="single" size={size} variant="outline" spacing={2} defaultValue="bold">
            <ToggleGroupItem value="bold" aria-label="Bold">
              <Bold />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <Italic />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline">
              <Underline />
            </ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup type="single" size={size} variant="default" spacing={2} defaultValue="bold">
            <ToggleGroupItem value="bold" aria-label="Bold">
              <Bold />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <Italic />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline">
              <Underline />
            </ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup type="single" size={size} variant="outline" spacing={0} defaultValue="bold">
            <ToggleGroupItem value="bold" aria-label="Bold">
              <Bold />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <Italic />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline">
              <Underline />
            </ToggleGroupItem>
          </ToggleGroup>
          <div className="w-[240px]">
            <ToggleGroup type="single" size={size} variant="outline" spacing={0} defaultValue="all" equalWidth>
              <ToggleGroupItem value="all">All</ToggleGroupItem>
              <ToggleGroupItem value="missed">Missed</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="w-[240px]">
            <ToggleGroup type="single" size={size} variant="default" spacing={0} defaultValue="all" equalWidth>
              <ToggleGroupItem value="all">All</ToggleGroupItem>
              <ToggleGroupItem value="missed">Missed</ToggleGroupItem>
            </ToggleGroup>
          </div>

          <StoryLabel>Multiple type</StoryLabel>
          <ToggleGroup type="multiple" size={size} variant="outline" spacing={2} defaultValue={['bold', 'italic']}>
            <ToggleGroupItem value="bold" aria-label="Bold">
              <Bold />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <Italic />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline">
              <Underline />
            </ToggleGroupItem>
          </ToggleGroup>
        </StorySection>
      ))}
    </StoryShowcase>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <StorySection title="Error" description="Only the label and the message turn red.">
      <ToggleGroupErrorDemo />
    </StorySection>
  ),
};
