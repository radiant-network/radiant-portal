import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { action } from '@storybook/addon-actions';

import InputSearch from '@/components/base/data-entry/input-search';

const meta = {
  title: 'Data Entry/Inputs/Input Search',
  component: InputSearch,
  args: {
    value: 'Search value',
    onSearch: fn(),
    onChange: fn(),
    placeholder: 'Placeholder',
    searchButtonProps: {},
  },
} satisfies Meta<typeof InputSearch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <InputSearch
        onChange={e => action('onChange')(e)}
        onSearch={value => {
          action('onSearch')(value);
        }}
        className="max-w-[300px]"
        placeholder="Placeholder"
        autoFocus
        searchButtonProps={{
          color: 'primary',
          variant: 'filled',
        }}
      />
    );
  },
};

export const Async: Story = {
  render: () => {
    return (
      <InputSearch
        onChange={e => action('onChange')(e)}
        onSearch={value => {
          action('onSearch')(value);
          return new Promise(resolve => setTimeout(() => resolve(), 1000));
        }}
        className="max-w-[300px]"
        placeholder="Placeholder"
        autoFocus
        searchButtonProps={{
          color: 'primary',
          variant: 'filled',
        }}
      />
    );
  },
};
