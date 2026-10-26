import React, { useState } from 'react';
import { type LucideProps, PencilLineIcon } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { Input } from '@/components/base/shadcn/input';
import { useI18n } from '@/components/hooks/i18n';

export type EditableTextProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  icon?: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>;
  children: string;
  onChangeText?: (text: string) => void;
};

const EditableText = ({ children, icon = PencilLineIcon, onChangeText, ...props }: EditableTextProps) => {
  const { t } = useI18n();
  const [edit, setEdit] = useState(false);
  const Icon = icon;

  return (
    <div {...props}>
      {edit ? (
        <Input
          defaultValue={children}
          // eslint-disable-next-line jsx-a11y/no-autofocus -- focus moves into the field the user just switched to edit mode
          autoFocus
          onBlur={e => {
            setEdit(false);
            onChangeText?.(e.currentTarget.value);
          }}
          className="max-w-96 w-full"
          onKeyUp={e => {
            if (e.key === 'Enter') {
              setEdit(false);
              onChangeText?.(e.currentTarget.value);
            }
          }}
        />
      ) : (
        <div className="flex items-center gap-2">
          <span>{children}</span>
          <Button iconOnly variant="ghost" aria-label={t('a11y.editable_text.edit')} onClick={() => setEdit(true)}>
            <Icon />
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditableText;
