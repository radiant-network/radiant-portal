import { GroupingState, Table } from '@tanstack/react-table';
import { CombineIcon } from 'lucide-react';

import { useI18n } from '@/components/hooks/i18n';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

import { ColumnSettings, TableColumnDef } from './data-table';

type DataTableGroupByProps = {
  grouping: GroupingState;
  table: Table<any>;
  groupByColumns: TableColumnDef<any, any>[];
  defaultColumnSettings: ColumnSettings[];
};

/**
 *
 * @WARNING: There is a small workaround to make tooltip works with DropdownMenu.
 *           it must be set has a child of Button and edit his sideOffset manualy
 *
 * @DESCRIPTION: enable groupBy for a columns.
 *               Accessor must have an id.
 *               DropdownMenuItem label's is created with defaultColumnSettings
 * @EXAMPLE:
 *  [{
 *   columnHelper.accessor('status', {
 *     id: "status",
 *     header: 'Status',
 *     getGroupingValue: row => `Group By ${row.status}`,
 *     enableGrouping: true,
 *   }),
 *  }]*
 *
 */
function DataTableGroupBy({ table, grouping, groupByColumns, defaultColumnSettings }: DataTableGroupByProps) {
  const { t } = useI18n();

  const hasGroupedValue = grouping.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" iconOnly={!hasGroupedValue}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <CombineIcon />
                {hasGroupedValue && <Badge className="capitalize">{grouping[0]}</Badge>}
              </div>
            </TooltipTrigger>
            <TooltipContent sideOffset={12}>{t('common.table.group_by')}</TooltipContent>
          </Tooltip>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[180px]">
        <DropdownMenuLabel>
          <div className="flex gap-2 items-center">
            <span className="flex-1">{t('common.table.group_by')}</span>
            {grouping.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="px-0 hover:bg-transparent"
                onClick={() => table.resetGrouping()}
              >
                {t('common.actions.clear')}
              </Button>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {groupByColumns.map(column => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={grouping.includes(column.id)}
            onClick={() => {
              table.getFlatHeaders().forEach(header => {
                if (header.id === column.id) {
                  table.resetGrouping();
                  if (!grouping.includes(header.id)) {
                    table.setGrouping([header.id]);
                  }
                }
              });
            }}
          >
            <div className="flex w-full items-center justify-between">
              <div>{defaultColumnSettings.find(setting => setting.id === column.id)?.label}</div>
            </div>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default DataTableGroupBy;
