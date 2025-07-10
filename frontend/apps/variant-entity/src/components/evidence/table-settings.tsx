import { createColumnHelper } from '@tanstack/react-table';
import { TableColumnDef, createColumnSettings } from '@/components/base/data-table/data-table';
import TooltipsHeader from '@/components/base/data-table/headers/table-tooltips-header';
import { TFunction } from 'i18next';
import { formatDate } from 'date-fns';
import ClinVarBadge from '@/components/feature/variant/clinvar-badge';
import NumberBadge from '@/components/base/number-badge';
import Rating from '@/components/base/rating';
import { Badge } from '@/components/base/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import AnchorLink from '@/components/base/navigation/anchor-link';

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
      minSize: 60,
      maxSize: 150,
      size: 100,
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
      minSize: 85,
      maxSize: 150,
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
      minSize: 75,
      maxSize: 150,
      size: 120,
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
      minSize: 60,
      maxSize: 150,
      size: 120,
    }),
    pathogenicEvidenceColumnHelper.accessor(row => row.origin, {
      id: 'origin',
      cell: info => <Badge variant="outline">{info.getValue()}</Badge>,
      header: t('variantEntity.evidence.clinVar.table.headers.origin'),
      minSize: 60,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    pathogenicEvidenceColumnHelper.accessor(row => row.action, {
      id: 'action',
      cell: info => (
        <div className="flex justify-end">
          <AnchorLink href="" size="sm" external>
            {info.getValue()}
          </AnchorLink>
        </div>
      ),
      header: '',
      minSize: 75,
      maxSize: 150,
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
      minSize: 100,
      maxSize: 200,
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
      minSize: 100,
      maxSize: 200,
      size: 120,
      enableSorting: false,
    }),
    conditionPhenotypeColumnHelper.accessor(row => row.action, {
      id: 'action',
      header: '',
      cell: info => (
        <div className="flex justify-end">
          <AnchorLink href="" size="sm" external>
            {info.getValue()}
          </AnchorLink>
        </div>
      ),
      maxSize: 200,
      minSize: 120,
      enableSorting: false,
    }),
  ] as TableColumnDef<any, any>[]; // todo replace with correct type when api is updated
}

const pathogenicEvidenceDefaultSettings = createColumnSettings([
  {
    id: 'evaluated',
    visible: true,
    label: 'variant.headers.evaluated',
  },
  {
    id: 'condition',
    visible: true,
    label: 'variant.headers.condition',
  },
  {
    id: 'classification',
    visible: true,
    label: 'variant.headers.classification',
  },
  {
    id: 'status',
    visible: true,
    label: 'variant.headers.status',
  },
  {
    id: 'origin',
    visible: true,
    label: 'variant.headers.origin',
  },
  {
    id: 'action',
    visible: true,
    label: 'variant.headers.action',
  },
]);

const conditionPhenotypeDefaultSettings = createColumnSettings([
  {
    id: 'condition',
    visible: true,
    label: 'variant.headers.condition',
  },
  {
    id: 'inheritence',
    visible: true,
    label: 'variant.headers.inheritence',
  },
  {
    id: 'action',
    visible: true,
    label: 'variant.headers.action',
  },
]);

export {
  getPathogenicEvidenceColumns,
  getConditionPhenotypeColumns,
  pathogenicEvidenceDefaultSettings,
  conditionPhenotypeDefaultSettings,
};
