/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import MultiSelector from '@/components/base/data-entry/multi-selector/multi-selector';
import { MultiSelectorOption } from '@/components/base/data-entry/multi-selector/multi-selector.types';

import { StorySection } from '../story-section';

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
