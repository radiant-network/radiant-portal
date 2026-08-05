/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import MultiSelector from '@/components/base/data-entry/multi-selector/multi-selector';
import type { MultiSelectorOption } from '@/components/base/data-entry/multi-selector/multi-selector.types';

import { StoryLabel, StorySection } from '../story-section';

import { StoryErrorField } from './story-error-field';

const meta = {
  title: 'Components/Inputs/Multi Selector',
  component: MultiSelector,
  args: {
    value: [],
    onChange: () => {},
    placeholder: 'Placeholder',
  },
} satisfies Meta<typeof MultiSelector>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultOptions: MultiSelectorOption[] = [
  { label: 'Nextjs', value: 'Nextjs' },
  { label: 'Vite', value: 'vite' },
  { label: 'Nuxt', value: 'nuxt', disable: true },
  { label: 'Vue', value: 'vue, disable: true', disable: true },
  { label: 'Remix', value: 'remix' },
  { label: 'Svelte', value: 'svelte', disable: true },
  { label: 'Angular', value: 'angular', disable: true },
  { label: 'Ember', value: 'ember', disable: true },
  { label: 'React', value: 'react' },
  { label: 'Gatsby', value: 'gatsby', disable: true },
  { label: 'Astro', value: 'astro', disable: true },
];

export const Default: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>(['Nextjs']);

    return (
      <StorySection title="Default">
        <MultiSelector
          value={values}
          onChange={newValues => {
            setValues(newValues);
            action('onChange')(newValues);
          }}
          className="max-w-[300px]"
          placeholder="Placeholder"
          commandProps={{
            className: 'max-w-[300px]',
          }}
          defaultOptions={defaultOptions}
          hidePlaceholderWhenSelected
        />
      </StorySection>
    );
  },
};

export const WithMaxSelected: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>(['Nextjs', 'vite']);

    return (
      <StorySection title="Max selected = 3 — unselected items are disabled once the cap is reached; deselect one to re-enable them.">
        <MultiSelector
          value={values}
          onChange={newValues => {
            setValues(newValues);
            action('onChange')(newValues);
          }}
          openOnFocus
          onMaxSelected={limit => action('onMaxSelected')(limit)}
          maxSelected={3}
          className="max-w-[300px]"
          placeholder="Placeholder"
          commandProps={{
            className: 'max-w-[300px]',
          }}
          defaultOptions={defaultOptions}
          hidePlaceholderWhenSelected
        />
      </StorySection>
    );
  },
};

export const Multiline: Story = {
  render: () => {
    const preselected = ['Nextjs', 'vite', 'remix', 'react', 'angular', 'gatsby'];
    const [collapsedValues, setCollapsedValues] = useState<string[]>(preselected);
    const [multilineValues, setMultilineValues] = useState<string[]>(preselected);

    return (
      <StorySection title="Multiline">
        {/* Widths are set inline: Tailwind does not scan components/stories, so story-only arbitrary classes are never generated. */}
        <div className="flex flex-col gap-6" style={{ width: 320 }}>
          <div className="flex flex-col gap-3">
            <StoryLabel>Default — overflowing badges collapse into a “+N” on a single line</StoryLabel>
            <MultiSelector
              value={collapsedValues}
              onChange={newValues => {
                setCollapsedValues(newValues);
                action('onChange')(newValues);
              }}
              openOnFocus
              className="w-full"
              placeholder="Placeholder"
              commandProps={{ className: 'w-full' }}
              defaultOptions={defaultOptions}
            />
          </div>
          <div className="flex flex-col gap-3">
            <StoryLabel>multiline — every badge stays visible and the control grows in height</StoryLabel>
            <MultiSelector
              multiline
              value={multilineValues}
              onChange={newValues => {
                setMultilineValues(newValues);
                action('onChange')(newValues);
              }}
              openOnFocus
              className="w-full"
              placeholder="Placeholder"
              commandProps={{ className: 'w-full' }}
              defaultOptions={defaultOptions}
            />
          </div>
        </div>
      </StorySection>
    );
  },
};

export const AsyncSearch: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>(['Nextjs']);

    return (
      <StorySection title="Async search">
        <MultiSelector
          value={values}
          onChange={newValues => {
            setValues(newValues);
            action('onChange')(newValues);
          }}
          onSearch={async searchValue => {
            action('onSearch')(searchValue);

            return new Promise(resolve => {
              setTimeout(() => resolve(defaultOptions), 1000);
            });
          }}
          debounceDelay={300}
          className="max-w-[300px]"
          placeholder="Placeholder"
          commandProps={{
            className: 'max-w-[300px]',
          }}
        />
      </StorySection>
    );
  },
};

export const ErrorState: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>([]);

    return (
      <StorySection title="Error">
        <StoryErrorField label="Frameworks" invalid={values.length === 0}>
          <MultiSelector
            aria-invalid={values.length === 0}
            value={values}
            onChange={newValues => {
              setValues(newValues);
              action('onChange')(newValues);
            }}
            placeholder="Placeholder"
            defaultOptions={defaultOptions}
            hidePlaceholderWhenSelected
          />
        </StoryErrorField>
      </StorySection>
    );
  },
};
