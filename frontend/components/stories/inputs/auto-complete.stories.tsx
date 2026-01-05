/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { AutoComplete, Option } from '@/components/base/data-entry/auto-complete';

const FRAMEWORKS: Option[] = [
  {
    value: 'next.js',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
  {
    value: 'wordpress',
    label: 'WordPress',
  },
  {
    value: 'express.js',
    label: 'Express.js',
  },
  {
    value: 'nest.js',
    label: 'Nest.js',
  },
];

const meta = {
  title: 'Inputs/Auto Complete',
  component: AutoComplete,
  args: {
    value: '',
    options: FRAMEWORKS,
    onChange: () => {},
    placeholder: 'Placeholder',
  },
} satisfies Meta<typeof AutoComplete>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>('nest.js');

    return (
      <AutoComplete
        value={value}
        onChange={value => {
          setValue(value);
          action('onChange')(value);
        }}
        className="max-w-[300px]"
        placeholder="Placeholder"
        options={FRAMEWORKS}
      />
    );
  },
};

export const Async: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>('');
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<Option[]>([]);

    const handleSearch = async (searchValue: string) => {
      setLoading(true);
      action('onSearch')(searchValue);

      return new Promise<Option[]>(resolve => {
        setTimeout(() => resolve(FRAMEWORKS), 1000);
      })
        .then(results => setOptions(results))
        .finally(() => setLoading(false));
    };

    return (
      <AutoComplete
        value={value}
        onChange={value => {
          setValue(value);
          action('onChange')(value);
        }}
        options={options}
        loading={loading}
        onSearch={handleSearch}
        debounceDelay={300}
        className="max-w-[300px]"
        placeholder="Placeholder"
      />
    );
  },
};
