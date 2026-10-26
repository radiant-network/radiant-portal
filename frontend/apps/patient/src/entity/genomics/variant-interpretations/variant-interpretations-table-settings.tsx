import type { TFunction } from 'i18next';

import type { PatientInterpretation } from '@/api/api';
import CaseLinkCell from '@/components/base/data-table/cells/case-link-cell';
import ClassificationCell from '@/components/base/data-table/cells/classification-cell';
import {
  createAppColumnHelper,
  createColumnSettings,
  type TableColumnDef,
} from '@/components/base/data-table/data-table';

import AaChangeCell from './cells/aa-change-cell';
import AnalysisCodeCell from './cells/analysis-code-cell';
import GeneOmimLinkCell from './cells/gene-omim-link-cell';
import InterpretationDateCell from './cells/interpretation-date-cell';
import OriginCell from './cells/origin-cell';
import VariantLinkCell from './cells/variant-link-cell';

const columnHelper = createAppColumnHelper<PatientInterpretation>();

function getVariantInterpretationsColumns(t: TFunction<string, undefined>) {
  return [
    columnHelper.accessor(row => row.hgvsg, {
      id: 'variant',
      cell: info => <VariantLinkCell hgvsg={info.getValue()} locusId={info.row.original.locus_id} />,
      header: t('patient_entity.genomics.interpretations.headers.variant'),
      size: 200,
      minSize: 140,
    }),
    columnHelper.accessor(row => row.symbol, {
      id: 'gene',
      cell: info => <GeneOmimLinkCell symbol={info.getValue()} />,
      header: t('patient_entity.genomics.interpretations.headers.gene'),
      size: 112,
      minSize: 80,
    }),
    columnHelper.accessor(row => row.aa_change, {
      id: 'aa_change',
      cell: info => <AaChangeCell value={info.getValue()} />,
      header: t('patient_entity.genomics.interpretations.headers.aa'),
      size: 128,
      minSize: 96,
    }),
    columnHelper.accessor(row => row.classification, {
      id: 'classification',
      cell: info => <ClassificationCell codes={info.getValue() ? [info.getValue()!] : []} />,
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
    columnHelper.accessor(row => row.analysis_catalog_code, {
      id: 'analysis',
      cell: info => <AnalysisCodeCell code={info.getValue()} name={info.row.original.analysis_catalog_name} />,
      header: t('patient_entity.genomics.interpretations.headers.analysis'),
      size: 112,
      minSize: 80,
    }),
    columnHelper.accessor(row => row.updated_at, {
      id: 'updated_at',
      cell: info => <InterpretationDateCell date={info.getValue()} />,
      header: t('patient_entity.genomics.interpretations.headers.date'),
      size: 128,
      minSize: 96,
    }),
  ] as TableColumnDef<PatientInterpretation, any>[];
}

const defaultSettings = createColumnSettings([
  { id: 'variant', visible: true, label: 'patient_entity.genomics.interpretations.headers.variant' },
  { id: 'gene', visible: true, label: 'patient_entity.genomics.interpretations.headers.gene' },
  { id: 'aa_change', visible: true, label: 'patient_entity.genomics.interpretations.headers.aa' },
  {
    id: 'classification',
    visible: true,
    label: 'patient_entity.genomics.interpretations.headers.classification',
  },
  { id: 'origin', visible: true, label: 'patient_entity.genomics.interpretations.headers.origin' },
  { id: 'case_id', visible: true, label: 'patient_entity.genomics.interpretations.headers.case' },
  { id: 'analysis', visible: true, label: 'patient_entity.genomics.interpretations.headers.analysis' },
  { id: 'updated_at', visible: true, label: 'patient_entity.genomics.interpretations.headers.date' },
]);

export { getVariantInterpretationsColumns, defaultSettings };
