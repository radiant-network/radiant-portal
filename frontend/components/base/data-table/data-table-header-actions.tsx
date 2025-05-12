import { ArrowDownAZ, ArrowDownUp, ArrowUpZA, Pin, PinIcon, PinOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/components/hooks/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
} from '@/components/base/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { Tooltip } from '@radix-ui/react-tooltip';
import { Button } from '@/components/base/ui/button';
import { TFunction } from 'i18next';
import { ColumnPinningPosition, Header, SortDirection } from '@tanstack/react-table';
import { boolean } from 'zod';
import { useState } from 'react';

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
function getNextSortingOrderHeaderTitle(
  t: TFunction<string, undefined>,
  sortingOrder: SortDirection | boolean,
): string {
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

  // use to keep DropdownMenuTrigger visible when used
  const [isPinningDropdownActive, setIsPinningDropdownActive] = useState<boolean>(false);

  return (
    <>
      {/* Pin/Unpin column */}
      {header.column.getCanPin() && (
        <DropdownMenu onOpenChange={open => setIsPinningDropdownActive(open)}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              iconOnly
              className={cn('size-5', {
                'opacity-0 group-hover:opacity-100': !isPinningDropdownActive,
              })}
            >
              <Pin />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent>
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
              className={cn('size-5', {
                'opacity-0 group-hover:opacity-100': !header.column.getIsSorted(),
              })}
              onClick={header.column.getToggleSortingHandler()}
            >
              {{
                asc: <ArrowDownAZ size={16} />,
                desc: <ArrowUpZA size={16} />,
              }[header.column.getIsSorted() as string] ?? <ArrowDownUp />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {header.column.getCanSort()
              ? getNextSortingOrderHeaderTitle(t, header.column.getNextSortingOrder())
              : undefined}
          </TooltipContent>
        </Tooltip>
      )}
    </>
  );
}

export default TableHeaderActions;
