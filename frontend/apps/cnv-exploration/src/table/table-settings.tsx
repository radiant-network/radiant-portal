import { createColumnHelper } from '@tanstack/react-table';
import { TFunction } from 'i18next';

import { GermlineSNVOccurrence } from '@/api/api';
import { createColumnSettings, TableColumnDef } from '@/components/base/data-table/data-table';

const columnHelper = createColumnHelper<GermlineSNVOccurrence>();

function getCNVVariantColumns(t: TFunction<string, undefined>) {
  return [
    // TODO: Just a test
    columnHelper.accessor(row => row.symbol, {
      id: 'test',
      header: 'Test',
      size: 124,
      minSize: 40,
      enableSorting: false,
    }),
  ] as TableColumnDef<GermlineSNVOccurrence, any>[];
}

const defaultSettings = createColumnSettings([
  {
    id: 'test',
    visible: true,
    label: 'Test',
  },
]);

export { getCNVVariantColumns, defaultSettings };
