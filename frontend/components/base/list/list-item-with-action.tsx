import React, { type ReactNode } from 'react';
import { Edit2Icon, Share2Icon, TrashIcon } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

import ConditionalWrapper from '../conditional-wrapper';

export type ListItemActionProps = Omit<React.LiHTMLAttributes<HTMLLIElement>, 'onClick'> & {
  title: ReactNode;
  description: ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  onClick?: () => void;
};

const ListItemAction = ({
  title,
  description,
  onEdit,
  onDelete,
  onShare,
  onClick,
  className,
  ...props
}: ListItemActionProps) => {
  const { t } = useI18n();

  return (
    <li className={cn('flex border-b last:border-b-0 relative px-3 py-2 group', className)} {...props}>
      <div className="flex-1 gap-1 overflow-hidden">
        <ConditionalWrapper
          condition={!!onClick}
          wrapper={children => (
            <button
              type="button"
              onClick={onClick}
              className="block w-full text-left underline hover:no-underline hover:cursor-pointer"
            >
              {children}
            </button>
          )}
        >
          <span className="block text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">{title}</span>
        </ConditionalWrapper>
        <div className="text-xs">{description}</div>
      </div>
      <div className="flex items-start gap-1.5 w-0 opacity-0 overflow-hidden group-hover:w-auto group-hover:ml-2 group-hover:opacity-100 group-hover:overflow-visible group-has-[:focus-visible]:w-auto group-has-[:focus-visible]:ml-2 group-has-[:focus-visible]:opacity-100 group-has-[:focus-visible]:overflow-visible">
        {onShare && (
          <Button
            iconOnly
            variant="ghost"
            size="xs"
            aria-label={t('a11y.list_item.share')}
            onClick={onShare}
            className="[&_svg]:size-3.5 size-5"
          >
            <Share2Icon />
          </Button>
        )}
        {onEdit && (
          <Button
            iconOnly
            variant="ghost"
            size="xs"
            aria-label={t('a11y.list_item.edit')}
            onClick={onEdit}
            className="[&_svg]:size-3.5 size-5"
          >
            <Edit2Icon />
          </Button>
        )}
        {onDelete && (
          <Button
            iconOnly
            variant="ghost"
            size="xs"
            aria-label={t('a11y.list_item.delete')}
            onClick={onDelete}
            className="[&_svg]:size-3.5 size-5"
          >
            <TrashIcon />
          </Button>
        )}
      </div>
    </li>
  );
};

export default ListItemAction;
