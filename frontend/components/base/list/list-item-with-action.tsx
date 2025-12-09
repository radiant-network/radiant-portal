import React, { ReactNode } from 'react';
import { Edit2Icon, Share2Icon, TrashIcon } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
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
}: ListItemActionProps) => (
  <li className={cn('flex border-b last:border-b-0 relative px-3 py-2 group', className)} {...props}>
    <div className="flex-1 gap-1 overflow-hidden">
      <ConditionalWrapper
        condition={!!onClick}
        wrapper={children => (
          <div onClick={onClick} className="underline hover:no-underline hover:cursor-pointer">
            {children}
          </div>
        )}
      >
        <div className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">{title}</div>
      </ConditionalWrapper>
      <div className="text-xs">{description}</div>
    </div>
    <div className="hidden items-start group-hover:flex gap-1.5 ml-2">
      {onShare && (
        <Button iconOnly variant="ghost" size="xs" onClick={onShare} className="[&_svg]:size-3.5 size-5">
          <Share2Icon />
        </Button>
      )}
      {onEdit && (
        <Button iconOnly variant="ghost" size="xs" onClick={onEdit} className="[&_svg]:size-3.5 size-5">
          <Edit2Icon />
        </Button>
      )}
      {onDelete && (
        <Button iconOnly variant="ghost" size="xs" onClick={onDelete} className="[&_svg]:size-3.5 size-5">
          <TrashIcon />
        </Button>
      )}
    </div>
  </li>
);

export default ListItemAction;
