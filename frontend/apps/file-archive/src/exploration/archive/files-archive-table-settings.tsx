import { createColumnHelper } from '@tanstack/react-table';
import { TFunction } from 'i18next';

import { DocumentResult } from '@/api/api';
import AnchorLinkCell from '@/components/base/data-table/cells/anchor-link-cell';
import BadgeCell from '@/components/base/data-table/cells/badge-cell';
import DateCell from '@/components/base/data-table/cells/date-cell';
import DocumentSizeCell from '@/components/base/data-table/cells/document-size-cell';
import DownloadFileCell from '@/components/base/data-table/cells/download-file-cell';
import NumberCell from '@/components/base/data-table/cells/number-cell';
import RelationshipToProbandCell from '@/components/base/data-table/cells/relationship-to-proband-cell';
import TextCell from '@/components/base/data-table/cells/text-cell';
import TextTooltipCell from '@/components/base/data-table/cells/text-tooltip-cell';
import { createColumnSettings, TableColumnDef } from '@/components/base/data-table/data-table';
import TooltipHeader from '@/components/base/data-table/headers/table-tooltip-header';
import { thousandNumberFormat } from '@/components/lib/number-format';

const columnHelper = createColumnHelper<DocumentResult>();

export function getFilesArchiveColumns(t: TFunction<string, undefined>) {
  return [
    // Name
    columnHelper.accessor(row => row.name, {
      id: 'name',
      cell: info => <TextCell>{info.getValue()}</TextCell>,
      header: t('file_entity.name'),
      size: 200,
      minSize: 40,
    }),
    // Format
    columnHelper.accessor(row => row.format_code, {
      id: 'format_code',
      cell: info => (
        <BadgeCell variant="outline" tooltip={t(`common.file_format.${info.getValue()}`)}>
          {info.getValue()}
        </BadgeCell>
      ),
      header: t('file_entity.format_code'),
      size: 124,
      minSize: 40,
      maxSize: 164,
    }),
    // Type
    columnHelper.accessor(row => row.data_type_code, {
      id: 'data_type_code',
      cell: info => (
        <BadgeCell variant="outline" tooltip={t(`common.data_type_code.${info.getValue()}`)}>
          {info.getValue()}
        </BadgeCell>
      ),
      header: t('file_entity.data_type_code'),
      size: 124,
      minSize: 40,
      maxSize: 164,
    }),
    // Size
    columnHelper.accessor(row => row.size, {
      id: 'size',
      cell: info => <DocumentSizeCell value={info.getValue()} />,
      header: t('file_entity.size'),
      size: 124,
      minSize: 40,
      maxSize: 164,
    }),
    // Case ID
    columnHelper.accessor(row => row.case_id, {
      id: 'case_id',
      cell: info => (
        <AnchorLinkCell href={`/case/entity/${info.row.original.case_id}`}>
          {thousandNumberFormat(info.getValue())}
        </AnchorLinkCell>
      ),
      header: t('file_entity.case_id'),
      size: 124,
      minSize: 40,
      maxSize: 164,
    }),
    // Diagnosis Lab.
    columnHelper.accessor(row => row.diagnosis_lab_code, {
      id: 'diagnosis_lab_code',
      cell: info => (
        <TextTooltipCell tooltipText={info.row.original.diagnosis_lab_name}>{info.getValue()}</TextTooltipCell>
      ),
      header: t('file_entity.diagnosis_lab'),
      minSize: 40,
      maxSize: 150,
      size: 120,
      enableSorting: false,
    }),
    // Relationship
    columnHelper.accessor(row => row.relationship_to_proband_code, {
      id: 'relationship_to_proband_code',
      cell: info => <RelationshipToProbandCell relationship={info.getValue()} />,
      header: t('file_entity.relationship_to_proband_code'),
      size: 150,
      minSize: 40,
    }),
    // Patient
    columnHelper.accessor(row => row.patient_id, {
      id: 'patient_id',
      cell: info => <NumberCell value={info.getValue()} fractionDigits={0} />,
      header: t('file_entity.patient_id'),
      size: 124,
      minSize: 40,
      maxSize: 164,
    }),
    // Sample
    columnHelper.accessor(row => row.submitter_sample_id, {
      id: 'submitter_sample_id',
      header: t('file_entity.submitter_sample_id'),
      size: 124,
      minSize: 40,
      maxSize: 164,
    }),
    // Task
    columnHelper.accessor(row => row.task_id, {
      id: 'task_id',
      cell: info => <NumberCell value={info.getValue()} fractionDigits={0} />,
      header: t('file_entity.task_id'),
      size: 124,
      minSize: 40,
      maxSize: 164,
    }),
    // Created on
    columnHelper.accessor(row => row.created_on, {
      id: 'created_on',
      cell: info => <DateCell date={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('common.table.headers.created_on_tooltip')}>
          {t('common.table.headers.created_on')}
        </TooltipHeader>
      ),
      size: 120,
      minSize: 40,
      maxSize: 150,
    }),
    // Sequenccing Experiment
    columnHelper.accessor(row => row.seq_id, {
      id: 'seq_id',
      cell: info => <TextCell>{info.getValue()}</TextCell>,
      header: t('file_entity.seq_id'),
      size: 124,
      minSize: 40,
    }),
    // Hash
    columnHelper.accessor(row => row.hash, {
      id: 'hash',
      cell: info => <TextCell>{info.getValue()}</TextCell>,
      header: t('file_entity.hash'),
      size: 124,
      minSize: 40,
    }),
    // Run
    columnHelper.accessor(row => row.run_alias, {
      id: 'run_alias',
      cell: info => <TextCell>{info.getValue()}</TextCell>,
      header: t('file_entity.run_alias'),
      size: 124,
      minSize: 40,
    }),
    // Actions Buttons
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => <DownloadFileCell documentId={row.original.document_id} />,
      size: 50,
      maxSize: 50,
      enableSorting: false,
      enableHiding: true,
    }),
  ] as TableColumnDef<DocumentResult, any>[];
}

export const defaultSettings = createColumnSettings([
  {
    id: 'name',
    visible: true,
    label: 'file_entity.name',
  },
  {
    id: 'format_code',
    visible: true,
    label: 'file_entity.format_code',
  },
  {
    id: 'data_type_code',
    visible: true,
    label: 'file_entity.data_type_code',
  },
  {
    id: 'size',
    visible: true,
    label: 'file_entity.size',
  },
  {
    id: 'case_id',
    visible: true,
    label: 'file_entity.case_id',
  },
  {
    id: 'diagnosis_lab_code',
    visible: true,
    label: 'file_entity.diagnosis_lab',
  },
  {
    id: 'relationship_to_proband_code',
    visible: true,
    label: 'file_entity.relationship_to_proband_code',
  },
  {
    id: 'patient_id',
    visible: true,
    label: 'file_entity.patient_id',
  },
  {
    id: 'submitter_sample_id',
    visible: true,
    label: 'file_entity.submitter_sample_id',
  },
  {
    id: 'task_id',
    visible: true,
    label: 'file_entity.task_id',
  },
  {
    id: 'created_on',
    visible: true,
    label: 'common.table.headers.created_on',
  },
  {
    id: 'seq_id',
    visible: false,
    label: 'file_entity.seq_id',
    additionalFields: ['seq_id'],
  },
  {
    id: 'hash',
    visible: false,
    label: 'file_entity.hash',
    additionalFields: ['hash'],
  },
  {
    id: 'run_alias',
    visible: false,
    label: 'file_entity.run_alias',
    additionalFields: ['run_alias'],
  },
  {
    id: 'actions',
    visible: true,
    fixed: true,
    pinningPosition: 'right',
  },
]);
