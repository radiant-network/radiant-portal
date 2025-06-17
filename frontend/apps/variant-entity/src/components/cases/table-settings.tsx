import { createColumnHelper } from '@tanstack/react-table';
import { TableColumnDef, createColumnSettings } from '@/components/base/data-table/data-table';
import RowExpandCell from '@/components/base/data-table/cells/row-expand-cell';
import TooltipsHeader from '@/components/base/data-table/headers/table-tooltips-header';
import { TFunction } from 'i18next';
import ClinVarBadge from '@/components/feature/variant/clinvar-badge';
import { Badge } from '@/components/base/ui/badge';
import { formatDate } from 'date-fns';
import { EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/base/ui/button';

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
    interpretedCasesColumnHelper.accessor(row => row.case, {
      id: 'case',
      cell: info => <div className="text-muted-foreground">{info.getValue()}</div>,
      header: t('variantEntity.cases.interpreted-table.headers.case'),
      size: 120,
      minSize: 80,
      maxSize: 150,
      enableSorting: false,
    }),
    interpretedCasesColumnHelper.accessor(row => row.date, {
      id: 'date',
      cell: info => <div className="text-muted-foreground">{formatDate(info.getValue(), 'yyyy-MM-dd')}</div>,
      header: () => (
        <TooltipsHeader tooltips={t('variantEntity.cases.interpreted-table.headers.date.tooltip')}>
          {t('variantEntity.cases.interpreted-table.headers.date')}
        </TooltipsHeader>
      ),
      size: 120,
      minSize: 80,
      maxSize: 150,
    }),
    interpretedCasesColumnHelper.accessor(row => row.mondo, {
      id: 'mondo',
      cell: info => <div className="font-medium">{info.getValue()}</div>,
      header: t('variantEntity.cases.interpreted-table.headers.mondo'),
      minSize: 120,
      maxSize: 350,
      enableSorting: false,
    }),
    interpretedCasesColumnHelper.accessor(row => row.classification, {
      id: 'classification',
      cell: info => <ClinVarBadge value={info.getValue()} />,
      header: t('variantEntity.cases.interpreted-table.headers.classification'),
      minSize: 150,
      maxSize: 250,
    }),
    interpretedCasesColumnHelper.accessor(row => row.zygosity, {
      id: 'zygosity',
      cell: info => <Badge variant="outline">{info.getValue()}</Badge>,
      header: t('variantEntity.cases.interpreted-table.headers.zygosity'),
      size: 120,
      minSize: 80,
      maxSize: 150,
      enableSorting: false,
    }),
    interpretedCasesColumnHelper.accessor(row => row.inheritance, {
      id: 'inheritance',
      cell: info => <div className="text-muted-foreground">{info.getValue()}</div>,
      header: t('variantEntity.cases.interpreted-table.headers.inheritance'),
      size: 130,
      minSize: 130,
      maxSize: 250,
      enableSorting: false,
    }),
    interpretedCasesColumnHelper.accessor(row => row.institution, {
      id: 'institution',
      cell: info => <div className="text-muted-foreground">{info.getValue()}</div>,
      header: t('variantEntity.cases.interpreted-table.headers.institution'),
      minSize: 100,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    interpretedCasesColumnHelper.accessor(row => row.test, {
      id: 'test',
      cell: info => <div className="text-muted-foreground">{info.getValue()}</div>,
      header: t('variantEntity.cases.interpreted-table.headers.test'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    interpretedCasesColumnHelper.accessor(row => row.status, {
      id: 'status',
      cell: info => {
        const status = info.getValue();
        return <Badge variant={status === 'Active' ? 'slate' : 'default'}>{status}</Badge>;
      },
      header: t('variantEntity.cases.interpreted-table.headers.status'),
      minSize: 100,
      maxSize: 150,
      size: 120,
    }),
    interpretedCasesColumnHelper.accessor(row => row, {
      id: 'action',
      cell: info => {
        return (
          <Button iconOnly variant="ghost" className="size-7">
            <EllipsisVertical />
          </Button>
        );
      },
      header: '',
      size: 50,
      enableSorting: false,
      enablePinning: false,
      enableResizing: false,
    }),
  ] as TableColumnDef<any, any>[]; // todo replace with correct type when api is updated
}

function getOtherCasesColumns(t: TFunction<string, undefined>) {
  return [
    otherCasesColumnHelper.accessor(row => row.case, {
      id: 'case',
      cell: info => <div className="text-muted-foreground">{info.getValue()}</div>,
      header: t('variantEntity.cases.other-table.headers.case'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row.date, {
      id: 'date',
      cell: info => <div className="text-muted-foreground">{formatDate(info.getValue(), 'yyyy-MM-dd')}</div>,
      header: () => (
        <TooltipsHeader tooltips={t('variantEntity.cases.other-table.headers.date.tooltip')}>
          {t('variantEntity.cases.other-table.headers.date')}
        </TooltipsHeader>
      ),
      size: 120,
      minSize: 80,
      maxSize: 150,
    }),
    otherCasesColumnHelper.accessor(row => row.hpo, {
      id: 'hpo',
      cell: info => <div className="font-medium">{info.getValue()}</div>,
      header: t('variantEntity.cases.other-table.headers.phenotypesHpo'),
      minSize: 120,
      maxSize: 350,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row.zygosity, {
      id: 'zygosity',
      cell: info => <div className="text-muted-foreground">{info.getValue()}</div>,
      header: t('variantEntity.cases.other-table.headers.zygosity'),
      size: 120,
      minSize: 80,
      maxSize: 150,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row.inheritance, {
      id: 'inheritance',
      cell: info => <div className="text-muted-foreground">{info.getValue()}</div>,
      header: t('variantEntity.cases.other-table.headers.inheritance'),
      size: 130,
      minSize: 130,
      maxSize: 250,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row.institution, {
      id: 'institution',
      cell: info => <div className="text-muted-foreground">{info.getValue()}</div>,
      header: t('variantEntity.cases.other-table.headers.institution'),
      minSize: 100,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row.test, {
      id: 'test',
      cell: info => <div className="text-muted-foreground">{info.getValue()}</div>,
      header: t('variantEntity.cases.other-table.headers.test'),
      minSize: 80,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    otherCasesColumnHelper.accessor(row => row.status, {
      id: 'status',
      cell: info => {
        const status = info.getValue();
        return <Badge variant={status === 'Active' ? 'slate' : 'default'}>{status}</Badge>;
      },
      header: t('variantEntity.cases.other-table.headers.status'),
      minSize: 100,
      maxSize: 150,
      size: 120,
    }),
  ] as TableColumnDef<any, any>[]; // todo replace with correct type when api is updated
}

const interpretedCasesDefaultSettings = createColumnSettings([
  {
    id: 'rowExpand',
    visible: true,
    fixed: true,
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
    label: 'variant.headers.mondo'
  },
  {
    id: 'classification',
    visible: true,
    label: 'variant.headers.classification'
  },
  {
    id: 'zygosity',
    visible: true,
    label: 'variant.headers.zygosity'
  },
  {
    id: 'inheritance',
    visible: true,
    label: 'variant.headers.inheritance'
  },
  {
    id: 'institution',
    visible: true,
    label: 'variant.headers.institution'
  },
  {
    id: 'test',
    visible: true,
    label: 'variant.headers.test'
  },
  {
    id: 'status',
    visible: true,
    label: 'variant.headers.status'
  },
]);

const otherCasesDefaultSettings = createColumnSettings([
  {
    id: 'case',
    visible: true,
    label: 'variant.headers.case'
  },
  {
    id: 'date',
    visible: true,
    label: 'variant.headers.date'
  },
  {
    id: 'hpo',
    visible: true,
    label: 'variant.headers.hpo'
  },
  {
    id: 'zygosity',
    visible: true,
    label: 'variant.headers.zygosity'
  },
  {
    id: 'inheritance',
    visible: true,
    label: 'variant.headers.inheritance'
  },
  {
    id: 'institution',
    visible: true,
    label: 'variant.headers.institution'
  },
  {
    id: 'test',
    visible: true,
    label: 'variant.headers.test'
  },
  {
    id: 'status',
    visible: true,
    label: 'variant.headers.status'
  },
]);

export { getInterpretedCasesColumns, getOtherCasesColumns, interpretedCasesDefaultSettings, otherCasesDefaultSettings };
