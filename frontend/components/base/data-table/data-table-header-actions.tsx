import { useState } from 'react';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { ColumnPinningPosition, Header, SortDirection } from '@tanstack/react-table';
import { TFunction } from 'i18next';
import { ArrowDown, ArrowDownUp, ArrowUp, Pin, PinIcon, PinOff } from 'lucide-react';

import { Button } from '@/components/base/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
} from '@/components/base/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/lib/utils';

const PIN_COLUMN_ACTIONS: {
  key: string;
  position: ColumnPinningPosition;
  icon: React.ReactNode;
}[] = [
    {
      key: 'common.table.pin.left',
      position: 'left',
      icon: <PinIcon className="rotate-90" />,
    },
    {
      key: 'common.table.pin.right',
      position: 'right',
      icon: <PinIcon className="ransform -rotate-90" />,
    },
    {
      key: 'common.table.pin.unpin',
      position: false,
      icon: <PinOff />,
    },
  ];

/**
 * Use header.column.getNextSortingOrder() to display the next action on sort
 *
 * @param t TFunction<string, undefined>,
 * @param sortingOrder 'asc' | 'desc' | false
 * @returns String
 */
function getSortingHeaderTitle(t: TFunction<string, undefined>, sortingOrder: SortDirection | boolean): string {
  if (sortingOrder === 'asc') {
    return t('common.table.sort.ascending');
  }

  if (sortingOrder === 'desc') {
    return t('common.table.sort.descending');
  }

  return t('common.table.sort.clear');
}

/**
 * TableHeaderActions
 * Display a list of actions a header can do
 * - Pin (left, right, false)
 * - Sort (asc, desc)
 */
type TableHeaderActionsProps<TData> = {
  header: Header<TData, unknown>;
};

function TableHeaderActions({ header }: TableHeaderActionsProps<any>) {
  const { t } = useI18n();

  // Header group contains subgroup, they shouldn't have actions
  const isHeaderGroup = header.subHeaders.length > 0;

  // use to keep DropdownMenuTrigger visible when used
  const [isPinningDropdownActive, setIsPinningDropdownActive] = useState<boolean>(false);

  const hasActions = header.column.getCanPin() || header.column.getCanSort();
  const isSorted = header.column.getIsSorted();

  if (!hasActions || isHeaderGroup) return null;

  /**
   * If you add a tooltip, dropdown or any menu, you need to add data-[state=closed]:animate-none! to the content
   * to prevent the content from animating when the menu is closed and causing a flicker.
   *
   * This is required because the action items needs to be hidden when the header is not hovered so the title can have more space..
   */
  return (
    <div className="flex items-center gap-0.5">
      {/* Pin/Unpin column */}
      {header.column.getCanPin() && (
        <DropdownMenu onOpenChange={open => setIsPinningDropdownActive(open)}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              iconOnly
              className={cn('size-6 hidden group-hover/header:flex', {
                flex: isPinningDropdownActive,
              })}
            >
              <Pin />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent className="data-[state=closed]:animate-none!">
              {PIN_COLUMN_ACTIONS.map(pinAction => (
                <DropdownMenuItem
                  key={`${header.column.id}-${pinAction.key}`}
                  onClick={() => {
                    header.column.pin(pinAction.position);
                  }}
                  disabled={header.column.getIsPinned() === pinAction.position}
                >
                  {pinAction.icon}
                  {t(pinAction.key)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      )}

      {/* Sorted Icons */}
      {header.column.getCanSort() && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              iconOnly
              className={cn('size-6 hidden group-hover/header:flex', {
                flex: isSorted || isPinningDropdownActive,
              })}
              onClick={header.column.getToggleSortingHandler()}
            >
              {{
                asc: <ArrowUp size={16} />,
                desc: <ArrowDown size={16} />,
              }[isSorted as string] ?? <ArrowDownUp />}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="data-[state=closed]:animate-none!">
            {header.column.getCanSort() ? getSortingHeaderTitle(t, isSorted) : undefined}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

export default TableHeaderActions;
