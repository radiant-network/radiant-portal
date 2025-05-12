import { createColumnHelper } from '@tanstack/react-table';
import { TableColumnDef, createColumnSettings } from '@/components/base/data-table/data-table';
import RowExpandCell from '@/components/base/data-table/cells/row-expand-cell';
import TooltipsHeader from '@/components/base/data-table/headers/table-tooltips-header';
import { TFunction } from 'i18next';

const interpretedCasesColumnHelper = createColumnHelper<any>(); // todo replace with correct type when api is updated
const otherCasesColumnHelper = createColumnHelper<any>(); // todo replace with correct type when api is updated

function getInterpretedCasesColumns(t: TFunction<string, undefined>) {
  return [
    {
      id: 'rowExpand',
      cell: RowExpandCell,
      size: 40,
      enableResizing: false,
      enablePinning: false,
    },
    interpretedCasesColumnHelper.accessor(row => row, {
      id: 'case',
      cell: info => info.getValue(),
      header: t('variantEntity.cases.interpreted-table.headers.case'),
      size: 120,
      enableSorting: false,
    }),
    interpretedCasesColumnHelper.accessor(row => row, {
      id: 'date',
      cell: info => info.getValue(),
      header: () => (
        <TooltipsHeader tooltips={t('variantEntity.cases.interpreted-table.headers.date.tooltip')} iconOnly>
          {t('variantEntity.cases.interpreted-table.headers.date')}
        </TooltipsHeader>
      ),
      size: 120,
    }),
    interpretedCasesColumnHelper.accessor(row => row.ad_ratio, {
      id: 'mondo',
      cell: info => info.getValue(),
      header: t('variantEntity.cases.interpreted-table.headers.mondo'),
      minSize: 120,
      enableSorting: false,
    }),
    interpretedCasesColumnHelper.accessor(row => row, {
      id: 'classification',
      cell: info => info.getValue(),
      header: t('variantEntity.cases.interpreted-table.headers.classification'),
      size: 120,
    }),
    interpretedCasesColumnHelper.accessor(row => row, {
      id: 'zygosity',
      cell: info => info.getValue(),
      header: t('variantEntity.cases.interpreted-table.headers.zygosity'),
      size: 120,
      enableSorting: false,
    }),
    interpretedCasesColumnHelper.accessor(row => row, {
      id: 'inheritance',
      cell: info => info.getValue(),
      header: t('variantEntity.cases.interpreted-table.headers.inheritance'),
      size: 120,
      enableSorting: false,
    }),
    interpretedCasesColumnHelper.accessor(row => row, {
      id: 'institution',
      cell: info => info.getValue(),
      header: t('variantEntity.cases.interpreted-table.headers.institution'),
      size: 120,
      enableSorting: false,
    }),
    interpretedCasesColumnHelper.accessor(row => row, {
      id: 'test',
      cell: info => info.getValue(),
      header: t('variantEntity.cases.interpreted-table.headers.test'),
      size: 120,
      enableSorting: false,
    }),
    interpretedCasesColumnHelper.accessor(row => row, {
      id: 'status',
      cell: info => info.getValue(),
      header: t('variantEntity.cases.interpreted-table.headers.status'),
      size: 120,
    }),
  ] as TableColumnDef<any, any>[]; // todo replace with correct type when api is updated
}

function getOtherCasesColumns(t: TFunction<string, undefined>) {
  return [
    otherCasesColumnHelper.accessor(row => row, {
      id: 'case',
      cell: info => info.getValue(),
      header: t('variantEntity.cases.other-table.headers.case'),
      size: 120,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row, {
      id: 'date',
      cell: info => info.getValue(),
      header: () => (
        <TooltipsHeader tooltips={t('variantEntity.cases.other-table.headers.date.tooltip')} iconOnly>
          {t('variantEntity.cases.other-table.headers.date')}
        </TooltipsHeader>
      ),
      size: 120,
    }),
    otherCasesColumnHelper.accessor(row => row.ad_ratio, {
      id: 'hpo',
      cell: info => info.getValue(),
      header: t('variantEntity.cases.other-table.headers.phenotypesHpo'),
      minSize: 120,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row, {
      id: 'zygosity',
      cell: info => info.getValue(),
      header: t('variantEntity.cases.other-table.headers.zygosity'),
      size: 120,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row, {
      id: 'inheritance',
      cell: info => info.getValue(),
      header: t('variantEntity.cases.other-table.headers.inheritance'),
      size: 120,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row, {
      id: 'institution',
      cell: info => info.getValue(),
      header: t('variantEntity.cases.other-table.headers.institution'),
      size: 120,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row, {
      id: 'test',
      cell: info => info.getValue(),
      header: t('variantEntity.cases.other-table.headers.test'),
      size: 120,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row, {
      id: 'status',
      cell: info => info.getValue(),
      header: t('variantEntity.cases.other-table.headers.status'),
      size: 120,
    }),
  ] as TableColumnDef<any, any>[]; // todo replace with correct type when api is updated
}

const interpretedCasesDefaultSettings = createColumnSettings([
  {
    id: 'case',
    visible: true,
  },
  {
    id: 'date',
    visible: true,
  },
  {
    id: 'hpo',
    visible: true,
  },
  {
    id: 'zygosity',
    visible: true,
  },
  {
    id: 'inheritance',
    visible: true,
  },
  {
    id: 'institution',
    visible: true,
  },
  {
    id: 'test',
    visible: true,
  },
  {
    id: 'status',
    visible: true,
  },
]);

const otherCasesDefaultSettings = createColumnSettings([
  {
    id: 'rowExpand',
    visible: true,
    fixed: true,
    pinningPosition: 'left',
  },
  {
    id: 'case',
    visible: true,
  },
  {
    id: 'date',
    visible: true,
  },
  {
    id: 'mondo',
    visible: true,
  },
  {
    id: 'classification',
    visible: true,
  },
  {
    id: 'zygosity',
    visible: true,
  },
  {
    id: 'inheritance',
    visible: true,
  },
  {
    id: 'institution',
    visible: true,
  },
  {
    id: 'test',
    visible: true,
  },
  {
    id: 'status',
    visible: true,
  },
]);

export { getInterpretedCasesColumns, getOtherCasesColumns, interpretedCasesDefaultSettings, otherCasesDefaultSettings };
