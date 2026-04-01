/* eslint-disable */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { action } from 'storybook/actions';
import { useI18n } from '@/components/hooks/i18n';

import RichTextEditor from '@/components/base/data-entry/rich-text-editor/rich-text-editor';
import RichTextViewer from '@/components/base/data-entry/rich-text-editor/rich-text-viewer';
import { useState } from 'react';
import { Button } from '@/components/base/shadcn/button';

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

export const WithActions: Story = {
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
        actions={[
          <Button key="cancel" variant="outline" size="2xs">
            {t('common.cancel')}
          </Button>,
          <Button key="save" size="2xs">
            {t('common.save')}
          </Button>,
        ]}
      />
    );
  },
};

export const Viewer: Story = {
  args: {
    value:
      '<p dir="auto" style="text-align: left"><strong>Rich Text Editor</strong></p><p dir="auto" style="text-align: left">A modern WYSIWYG rich text editor based on <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://github.com/scrumpy/tiptap">tiptap</a> and <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn</a> for Reactjs</p><p dir="auto"></p><p dir="auto"><strong>Features</strong></p><ul dir="auto"><li dir="auto"><p dir="auto">Use React, tailwindcss, <a target="_blank" rel="noopener noreferrer nofollow" class="link" href="https://ui.shadcn.com/">shadcn</a> components</p></li><li dir="auto"><p dir="auto">I18n support (vi, en, zh, pt, ...)</p></li><li dir="auto"><p dir="auto">Slash Commands (type <code>/</code> to show menu list)</p></li><li dir="auto"><p dir="auto">Multi Column</p></li><li dir="auto"><p dir="auto">Support emoji <span dir="auto" data-name="100" data-type="emoji">💯</span> (type <code>:</code> to show emoji list)</p></li><li dir="auto"><p dir="auto">Support iframe</p></li><li dir="auto"><p dir="auto">Support mermaid</p></li><li dir="auto"><p dir="auto">Support mention <span class="mention" data-type="mention" dir="auto" data-id="0" data-label="hunghg255" data-mention-suggestion-char="@">@hunghg255</span> (type <code>@</code> to show list)</p></li><li dir="auto"><p dir="auto">Suport katex math (<span class="katex" dir="auto" text="c%20%3D%20%5Cpm%5Csqrt%7Ba%5E2%20%2B%20b%5E2%7D" macros=""></span>)</p></li></ul><p dir="auto"></p>',
  },
  render: args => {
    const [value, setValue] = useState<string>(args.value ?? '');
    return (
      <div className="flex w-full gap-6">
        <RichTextEditor className="w-[800px]" value={value} onChange={value => setValue(value)} />
        <RichTextViewer value={value} wrapperClassName="max-w-[800px]" autoFocus />
      </div>
    );
  },
};
