import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { action } from 'storybook/actions';
import { useI18n } from '@/components/hooks/i18n';

import RichTextEditor from '@/components/base/data-entry/rich-text-editor/rich-text-editor';

const meta = {
  title: 'Inputs/RichText Editor',
  component: RichTextEditor,
  args: {
    value: '<h3>Hello</h3>',
    onChange: fn(),
    placeholder: 'Placeholder',
  },
} satisfies Meta<typeof RichTextEditor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => {
    const { t } = useI18n();
    return (
      <RichTextEditor
        value={args.value}
        onChange={action('onChange')}
        onBlur={action('onBlur')}
        placeholder={t('common.editor.placeholder')}
        wrapperClassName="max-w-[500px]"
        autoFocus
      />
    );
  },
};
