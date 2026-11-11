import { forwardRef, type ReactNode } from 'react';
import { GripVerticalIcon, XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '../shadcn/button';
import { Card, CardContent, CardHeader } from '../shadcn/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

export type CardLayoutItem = {
  id: string;
  isStatic: boolean;
  isDraggable: boolean;
  isResizable: boolean;
};

type CloseProps = {
  id: string;
  onClose: (id: string) => void;
  closeText?: string;
};

export type GridCardProps = {
  title: ReactNode;
  content: ReactNode;
  children?: ReactNode;
} & CardLayoutItem &
  CloseProps;

function GridCardCloseButton({ id, onClose, closeText }: CloseProps) {
  const { t } = useI18n();
  if (closeText) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="2xs"
              iconOnly
              aria-label={closeText}
              onClick={e => {
                e.preventDefault();
                onClose(id);
              }}
            >
              <XIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{closeText}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="2xs"
      iconOnly
      aria-label={t('common.close')}
      onClick={e => {
        e.preventDefault();
        onClose(id);
      }}
    >
      <XIcon />
    </Button>
  );
}

/**
 * forwardRef is needed for react-grid-layout
 * children: used by react-grid-layout to add resize handle
 */
const GridCard = forwardRef<HTMLDivElement, GridCardProps>(function GridCard(
  { title, content, onClose, closeText, children, id, isStatic, isDraggable, ...rest },
  ref,
) {
  const withHandle = !isStatic && isDraggable;
  const closable = !isStatic;

  return (
    <div ref={ref} className="h-full w-full" {...rest}>
      <Card size="sm" className="h-full w-full overflow-hidden">
        <CardHeader
          size="sm"
          className={cn('flex flex-row items-center gap-2 py-1', {
            'rgl-drag-zone cursor-move': withHandle,
          })}
        >
          {withHandle && <GripVerticalIcon size={16} />}
          <span className="flex-1 truncate text-sm font-semibold">{title}</span>
          {closable && <GridCardCloseButton id={id} onClose={onClose} closeText={closeText} />}
        </CardHeader>
        <CardContent className="flex-1 min-h-0 p-2 overflow-hidden **:data-[slot=chart]:aspect-auto! **:data-[slot=chart]:h-full **:data-[slot=chart]:w-full">
          {content}
        </CardContent>
      </Card>
      {children}
    </div>
  );
});

export default GridCard;
