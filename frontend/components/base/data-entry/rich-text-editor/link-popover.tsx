import { type FormEvent, useEffect, useState } from 'react';
import { PopoverClose } from '@radix-ui/react-popover';
import { Editor } from '@tiptap/react';
import { Link2Icon, Trash2Icon, XIcon } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { Input } from '@/components/base/shadcn/input';
import { Label } from '@/components/base/shadcn/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/base/shadcn/popover';
import { Toggle } from '@/components/base/shadcn/toggle';
import { useI18n } from '@/components/hooks/i18n';

function LinkPopover({ editor }: { editor: Editor }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');

  const isLinkActive = editor.isActive('link');

  useEffect(() => {
    if (open) {
      setUrl(editor.getAttributes('link').href ?? '');
    }
  }, [open, editor]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (trimmed === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: trimmed }).run();
    }
    setOpen(false);
  };

  const handleRemove = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setUrl('');
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Toggle size="xs" pressed={isLinkActive} aria-label={t('common.editor.toolbar.link.label')}>
          <Link2Icon />
        </Toggle>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" onCloseAutoFocus={e => e.preventDefault()}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <Label className="text-sm font-medium">{t('common.editor.link.popover.title')}</Label>
              <p className="text-xs text-muted-foreground">{t('common.editor.link.popover.subtitle')}</p>
            </div>
            <PopoverClose
              aria-label={t('common.editor.link.popover.close.ariaLabel')}
              className="text-muted-foreground hover:text-foreground"
            >
              <XIcon className="h-4 w-4" />
            </PopoverClose>
          </div>
          <Input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder={t('common.editor.link.popover.url.placeholder')}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            {isLinkActive && (
              <Button type="button" variant="ghost" size="sm" onClick={handleRemove}>
                <Trash2Icon className="mr-1 h-4 w-4" />
                {t('common.editor.link.popover.remove')}
              </Button>
            )}
            <Button type="submit" size="sm">
              {isLinkActive ? t('common.editor.link.popover.update') : t('common.editor.link.popover.confirm')}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

export default LinkPopover;
