import { createColumnHelper } from '@tanstack/react-table';
import { TableColumnDef, createColumnSettings } from '@/components/base/data-table/data-table';
import TooltipsHeader from '@/components/base/data-table/headers/table-tooltips-header';
import { TFunction } from 'i18next';
import { formatDate } from 'date-fns';
import ClinVarBadge from '@/components/feature/variant/clinvar-badge';
import NumberBadge from '@/components/base/number-badge';
import Rating from '@/components/base/rating';
import { Badge } from '@/components/base/ui/badge';
import { Button } from '@/components/base/ui/button';
import { ExternalLink } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';

const pathogenicEvidenceColumnHelper = createColumnHelper<any>(); // todo replace with correct type when api is updated
const conditionPhenotypeColumnHelper = createColumnHelper<any>(); // todo replace with correct type when api is updated

function getPathogenicEvidenceColumns(t: TFunction<string, undefined>) {
  return [
    pathogenicEvidenceColumnHelper.accessor(row => row.evaluated, {
      id: 'evaluated',
      cell: info => <div className="text-muted-foreground">{formatDate(info.getValue(), 'yyyy-MM-dd')}</div>,
      header: () => (
        <TooltipsHeader tooltips={t('variantEntity.evidence.clinVar.table.headers.evaluated.tooltip')}>
          {t('variantEntity.evidence.clinVar.table.headers.evaluated')}
        </TooltipsHeader>
      ),
      size: 120,
      enableSorting: false,
    }),
    pathogenicEvidenceColumnHelper.accessor(row => row.condition, {
      id: 'condition',
      cell: info => (
        <a href="#" className="hover:underline">
          {info.getValue()}
        </a>
      ),
      header: t('variantEntity.evidence.clinVar.table.headers.condition'),
      size: 120,
    }),
    pathogenicEvidenceColumnHelper.accessor(row => row.classification, {
      id: 'classification',
      cell: info => (
        <div className="flex">
          <NumberBadge count={3} variant="destructive">
            <ClinVarBadge value={info.getValue()} />
          </NumberBadge>
        </div>
      ),
      header: t('variantEntity.evidence.clinVar.table.headers.classification'),
      minSize: 120,
      enableSorting: false,
    }),
    pathogenicEvidenceColumnHelper.accessor(row => row.status, {
      id: 'status',
      cell: info => <Rating rating={3} />,
      header: () => (
        <TooltipsHeader tooltips={t('variantEntity.evidence.clinVar.table.headers.status.tooltip')}>
          {t('variantEntity.evidence.clinVar.table.headers.status')}
        </TooltipsHeader>
      ),
      size: 120,
    }),
    pathogenicEvidenceColumnHelper.accessor(row => row.origin, {
      id: 'origin',
      cell: info => <Badge variant="outline">{info.getValue()}</Badge>,
      header: t('variantEntity.evidence.clinVar.table.headers.origin'),
      size: 120,
      enableSorting: false,
    }),
    pathogenicEvidenceColumnHelper.accessor(row => row.action, {
      id: 'action',
      cell: info => (
        <div className="flex justify-end">
          <Button variant="link" className="p-0 h-auto">
            {info.getValue()} <ExternalLink />
          </Button>
        </div>
      ),
      header: '',
      size: 120,
      enableSorting: false,
      enablePinning: false,
    }),
  ] as TableColumnDef<any, any>[]; // todo replace with correct type when api is updated
}

function getConditionPhenotypeColumns(t: TFunction<string, undefined>) {
  return [
    conditionPhenotypeColumnHelper.accessor(row => row.condition, {
      id: 'condition',
      cell: info => (
        <a href="#" className="hover:underline">
          {info.getValue()}
        </a>
      ),
      header: t('variantEntity.evidence.gene.table.headers.condition'),
      size: 120,
      enableSorting: true,
    }),
    conditionPhenotypeColumnHelper.accessor(row => row.inheritence, {
      id: 'inheritence',
      cell: info => {
        const codes = info.getValue() || [];

        if (codes.length === 0) {
          return <div className="text-muted-foreground">{t('common.unspecified')}</div>;
        }

        return codes.map((code: any, index: number) => (
          <Tooltip key={`${code}-${index}`}>
            <TooltipTrigger>
              <Badge key={code} variant="outline">
                {code}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>Todo</TooltipContent>
          </Tooltip>
        ));
      },
      header: t('variantEntity.evidence.gene.table.headers.inheritence'),
      size: 120,
      enableSorting: false,
    }),
    conditionPhenotypeColumnHelper.accessor(row => row.action, {
      id: 'action',
      header: '',
      cell: info => (
        <div className="flex justify-end">
          <Button variant="link" className="p-0 h-auto">
            {info.getValue()} <ExternalLink />
          </Button>
        </div>
      ),
      minSize: 120,
      enableSorting: false,
    }),
  ] as TableColumnDef<any, any>[]; // todo replace with correct type when api is updated
}

const pathogenicEvidenceDefaultSettings = createColumnSettings([
  {
    id: 'evaluated',
    visible: true,
  },
  {
    id: 'condition',
    visible: true,
  },
  {
    id: 'classification',
    visible: true,
  },
  {
    id: 'status',
    visible: true,
  },
  {
    id: 'origin',
    visible: true,
  },
  {
    id: 'action',
    visible: true,
  },
]);

const conditionPhenotypeDefaultSettings = createColumnSettings([
  {
    id: 'condition',
    visible: true,
  },
  {
    id: 'inheritence',
    visible: true,
  },
  {
    id: 'action',
    visible: true,
  },
]);

export {
  getPathogenicEvidenceColumns,
  getConditionPhenotypeColumns,
  pathogenicEvidenceDefaultSettings,
  conditionPhenotypeDefaultSettings,
};
