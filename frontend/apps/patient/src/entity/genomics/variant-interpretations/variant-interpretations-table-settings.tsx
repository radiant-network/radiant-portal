import type { TFunction } from 'i18next';

import CaseLinkCell from '@/components/base/data-table/cells/case-link-cell';
import ClassificationCell from '@/components/base/data-table/cells/classification-cell';
import ExperimentalStrategyCell from '@/components/base/data-table/cells/experimental-strategy-code-cell';
import {
  createAppColumnHelper,
  createColumnSettings,
  type TableColumnDef,
} from '@/components/base/data-table/data-table';

import type { VariantInterpretation } from '../../../api/patient-genomics';

import OriginCell from './cells/origin-cell';
import VariantGeneLinkCell from './cells/variant-gene-link-cell';

const columnHelper = createAppColumnHelper<VariantInterpretation>();

function getVariantInterpretationsColumns(t: TFunction<string, undefined>) {
  return [
    columnHelper.accessor(row => row.gene, {
      id: 'gene',
      cell: info => <VariantGeneLinkCell gene={info.getValue()} locusId={info.row.original.locus_id} />,
      header: t('patient_entity.genomics.interpretations.headers.gene'),
      size: 112,
      minSize: 80,
    }),
    columnHelper.accessor(row => row.variant, {
      id: 'variant',
      cell: info => <span className="font-mono text-xs">{info.getValue()}</span>,
      header: t('patient_entity.genomics.interpretations.headers.variant'),
      size: 160,
      minSize: 100,
    }),
    columnHelper.accessor(row => row.classification, {
      id: 'classification',
      cell: info => <ClassificationCell codes={[info.getValue()]} />,
      header: t('patient_entity.genomics.interpretations.headers.classification'),
      size: 144,
      minSize: 100,
    }),
    columnHelper.accessor(row => row.origin, {
      id: 'origin',
      cell: info => <OriginCell value={info.getValue()} />,
      header: t('patient_entity.genomics.interpretations.headers.origin'),
      size: 112,
      minSize: 80,
    }),
    columnHelper.accessor(row => row.case_id, {
      id: 'case_id',
      cell: info => (
        <CaseLinkCell caseId={info.getValue()}>
          <span className="font-mono text-xs">{info.getValue()}</span>
        </CaseLinkCell>
      ),
      header: t('patient_entity.genomics.interpretations.headers.case'),
      size: 144,
      minSize: 100,
    }),
    columnHelper.accessor(row => row.assay, {
      id: 'assay',
      cell: info => <ExperimentalStrategyCell code={info.getValue()} />,
      header: t('patient_entity.genomics.interpretations.headers.assay'),
      size: 96,
      minSize: 72,
    }),
    columnHelper.accessor(row => row.reported_day, {
      id: 'reported_day',
      cell: info => (
        <span className="text-muted-foreground font-mono text-xs">
          {t('patient_entity.genomics.day', { day: info.getValue() })}
        </span>
      ),
      header: t('patient_entity.genomics.interpretations.headers.reported'),
      size: 112,
      minSize: 80,
    }),
  ] as TableColumnDef<VariantInterpretation, any>[];
}

const defaultSettings = createColumnSettings([
  { id: 'gene', visible: true, label: 'patient_entity.genomics.interpretations.headers.gene' },
  { id: 'variant', visible: true, label: 'patient_entity.genomics.interpretations.headers.variant' },
  {
    id: 'classification',
    visible: true,
    label: 'patient_entity.genomics.interpretations.headers.classification',
  },
  { id: 'origin', visible: true, label: 'patient_entity.genomics.interpretations.headers.origin' },
  { id: 'case_id', visible: true, label: 'patient_entity.genomics.interpretations.headers.case' },
  { id: 'assay', visible: true, label: 'patient_entity.genomics.interpretations.headers.assay' },
  { id: 'reported_day', visible: true, label: 'patient_entity.genomics.interpretations.headers.reported' },
]);

export { getVariantInterpretationsColumns, defaultSettings };
