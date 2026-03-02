import { useCallback, useState } from 'react';

import RichTextEditor from '@/components/base/data-entry/rich-text-editor/rich-text-editor';
import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

const MAX_CHARS = 280;

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
  const plainText = stripHtml(value);
  const charCount = plainText.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isEmpty = charCount === 0;

  const handleSubmit = useCallback(() => {
    if (isEmpty || isOverLimit) return;
    onSubmit(value);
    setValue('');
  }, [isEmpty, isOverLimit, onSubmit, value]);

  return (
    <div className="space-y-2">
      <RichTextEditor value={initialValue} onChange={setValue} className="min-h-[60px] max-h-[120px]" />
      <div className="flex items-center justify-between">
        <span className={cn('text-xs', isOverLimit ? 'text-destructive' : 'text-muted-foreground')}>
          {t('variant_comments.char_limit', { count: charCount, max: MAX_CHARS })}
        </span>
        <div className="flex gap-2">
          {onCancel && (
            <Button variant="outline" size="sm" onClick={onCancel}>
              {t('variant_comments.cancel')}
            </Button>
          )}
          <Button size="sm" onClick={handleSubmit} disabled={isEmpty || isOverLimit}>
            {submitLabel || t('variant_comments.submit')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CommentEditor;
