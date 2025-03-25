import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { action } from '@storybook/addon-actions';

import { AutoComplete, Option } from '@/components/base/data-entry/auto-complete';
import { Input } from '@/components/base/ui/input';

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
  title: 'Base/Data Entry/Inputs/Auto Complete',
  component: AutoComplete,
  args: {
    value: '',
    defaultOptions: FRAMEWORKS,
    onChange: fn(),
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
        defaultOptions={FRAMEWORKS}
      />
    );
  },
};

export const Async: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>('');

    return (
      <>
        <AutoComplete
          value={value}
          onChange={value => {
            setValue(value);
            action('onChange')(value);
          }}
          onSearch={async searchValue => {
            action('onSearch')(searchValue);

            return new Promise(resolve => {
              setTimeout(() => resolve(FRAMEWORKS), 1000);
            }) as Promise<Option[]>;
          }}
          debounceDelay={300}
          className="max-w-[300px]"
          placeholder="Placeholder"
        />
        <Input placeholder="Placeholder" />
      </>
    );
  },
};
