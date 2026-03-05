import { useCallback, useState } from 'react';

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
  const isEmpty = stripHtml(value).length === 0;

  const handleSubmit = useCallback(() => {
    if (isEmpty) return;
    onSubmit(value);
    setValue('');
  }, [isEmpty, onSubmit, value]);

  return (
    <div className="space-y-2">
      <RichTextEditor autofocus value={initialValue} onChange={setValue} className="min-h-[60px] max-h-[120px]" />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button variant="outline" size="sm" onClick={onCancel}>
            {t('variant_comments.cancel')}
          </Button>
        )}
        <Button size="sm" onClick={handleSubmit} disabled={isEmpty}>
          {submitLabel || t('variant_comments.submit')}
        </Button>
      </div>
    </div>
  );
}

export default CommentEditor;
