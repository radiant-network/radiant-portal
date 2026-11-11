import { useState } from 'react';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import type { ColumnPinningPosition, ColumnSort, Header, RowData, SortDirection } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import { ArrowDown, ArrowDownUp, ArrowUp, Pin, PinIcon, PinOff } from 'lucide-react';

import { Button } from '@/components/base/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
} from '@/components/base/shadcn/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

import type { AppFeatures } from './data-table';

const PIN_COLUMN_ACTIONS: {
  key: string;
  position: ColumnPinningPosition;
  icon: React.ReactNode;
}[] = [
  {
    key: 'common.table.pin.left',
    position: 'start',
    icon: <PinIcon className="rotate-90" />,
  },
  {
    key: 'common.table.pin.right',
    position: 'end',
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

function getSortingAriaLabel(t: TFunction<string, undefined>, sortingOrder: SortDirection | boolean): string {
  if (sortingOrder === 'asc') {
    return t('a11y.data_table.sorted_asc');
  }

  if (sortingOrder === 'desc') {
    return t('a11y.data_table.sorted_desc');
  }

  return t('a11y.data_table.sort');
}

/**
 * TableHeaderActions
 * Display a list of actions a header can do
 * - Pin (left, right, false)
 * - Sort (asc, desc)
 */
type TableHeaderActionsProps<TData extends RowData> = {
  header: Header<AppFeatures, TData, unknown>;
  defaultSort?: ColumnSort;
};

const VISIBLE_ACTION = 'size-6 ml-0.5';
// Not display:none, so the button stays reachable with Tab and shows on keyboard focus
const HIDDEN_UNTIL_HOVER_OR_FOCUS =
  'h-6 w-0 opacity-0 overflow-hidden group-hover/header:w-6 group-hover/header:ml-0.5 group-hover/header:opacity-100 group-has-[:focus-visible]/header:w-6 group-has-[:focus-visible]/header:ml-0.5 group-has-[:focus-visible]/header:opacity-100';

function TableHeaderActions<TData extends RowData>({ header, defaultSort }: TableHeaderActionsProps<TData>) {
  const { t } = useI18n();

  // Header group contains subgroup, they shouldn't have actions
  const isHeaderGroup = header.subHeaders.length > 0;

  // use to keep DropdownMenuTrigger visible when used
  const [isPinningDropdownActive, setIsPinningDropdownActive] = useState<boolean>(false);

  const hasActions = header.column.getCanPin() || header.column.getCanSort();
  const defaultDirection = defaultSort && (defaultSort.desc ? 'desc' : 'asc');
  const isSorted = header.column.getIsSorted() || defaultDirection || false;

  if (!hasActions || isHeaderGroup) return null;

  /**
   * If you add a tooltip, dropdown or any menu, you need to add data-[state=closed]:animate-none! to the content
   * to prevent the content from animating when the menu is closed and causing a flicker.
   *
   * This is required because the action items needs to be hidden when the header is not hovered so the title can have more space..
   */
  return (
    <div className="flex items-center">
      {/* Pin/Unpin column */}
      {header.column.getCanPin() && (
        <DropdownMenu onOpenChange={open => setIsPinningDropdownActive(open)}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              iconOnly
              aria-label={t('a11y.data_table.pin_column')}
              className={isPinningDropdownActive ? VISIBLE_ACTION : HIDDEN_UNTIL_HOVER_OR_FOCUS}
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
              aria-label={getSortingAriaLabel(t, isSorted)}
              className={isSorted || isPinningDropdownActive ? VISIBLE_ACTION : HIDDEN_UNTIL_HOVER_OR_FOCUS}
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
