import { useMemo, useState } from 'react';

import RichTextEditor from '@/components/base/data-entry/rich-text-editor/rich-text-editor';
import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';

function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

type CommentEditorProps = {
  initialValue?: string;
  onSubmit: (body: string) => void;
  onCancel?: () => void;
  submitLabel?: string;
};

function CommentEditor({ initialValue = '', onSubmit, onCancel, submitLabel }: CommentEditorProps) {
  const { t } = useI18n();
  const [value, setValue] = useState(initialValue);
  const [resetKey, setResetKey] = useState(0);
  const isEmpty = useMemo(() => stripHtml(value).length === 0, [value]);

  const handleSubmit = () => {
    if (isEmpty) return;
    onSubmit(value);
    setValue('');
    setResetKey(k => k + 1);
  };

  return (
    <RichTextEditor
      key={resetKey}
      autofocus
      value={initialValue}
      onChange={setValue}
      className="min-h-[60px] max-h-[200px] resize-none"
    >
      <div className="flex justify-end gap-1.5 px-2 py-2">
        {onCancel && (
          <Button variant="outline" size="xxs" onClick={onCancel}>
            {t('variant_comments.cancel')}
          </Button>
        )}
        <Button size="xxs" onClick={handleSubmit} disabled={isEmpty}>
          {submitLabel || t('variant_comments.submit')}
        </Button>
      </div>
    </RichTextEditor>
  );
}

export default CommentEditor;
