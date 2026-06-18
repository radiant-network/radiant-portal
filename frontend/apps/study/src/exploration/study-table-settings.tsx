import { createColumnHelper } from '@tanstack/react-table';
import { type TFunction } from 'i18next';

import AnchorLinkCell from '@/components/base/data-table/cells/anchor-link-cell';
import BooleanCell from '@/components/base/data-table/cells/boolean-cell';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import { createColumnSettings, type TableColumnDef } from '@/components/base/data-table/data-table';
import { thousandNumberFormat } from '@/components/lib/number-format';

import { type Study } from './mocks/study-model';

const columnHelper = createColumnHelper<Study>();

/**
 * Sums a numeric field across the rows currently in the table.
 * TODO(back): grand totals should come from a dedicated stats endpoint once the back exists.
 */
function sumFooter(label: string, field: keyof Study) {
  return ({ table }: any) => {
    const total = table.getRowModel().rows.reduce((sum: number, row: any) => sum + (row.original[field] ?? 0), 0);
    return (
      <div className="flex flex-col">
        <span className="text-muted-foreground text-xs font-normal">{label}</span>
        <span className="text-foreground font-medium">{thousandNumberFormat(total)}</span>
      </div>
    );
  };
}

export function getStudyColumns(t: TFunction<string, undefined>) {
  return [
    columnHelper.accessor(row => row.study_code, {
      id: 'study_code',
      header: t('study.table.headers.study_code'),
      cell: info => info.getValue(),
      size: 110,
      minSize: 80,
    }),
    columnHelper.accessor(row => row.study_name, {
      id: 'study_name',
      header: t('study.table.headers.study_name'),
      cell: info => <span className="whitespace-normal">{info.getValue()}</span>,
      size: 360,
      minSize: 200,
    }),
    columnHelper.accessor(row => row.program, {
      id: 'program',
      header: t('study.table.headers.program'),
      cell: info => info.getValue(),
      size: 110,
      enableSorting: false,
    }),
    columnHelper.accessor(row => row.domain, {
      id: 'domain',
      header: t('study.table.headers.domain'),
      cell: info => info.getValue(),
      size: 150,
      enableSorting: false,
    }),
    columnHelper.accessor(row => row.dbgap, {
      id: 'dbgap',
      header: t('study.table.headers.dbgap'),
      cell: info =>
        info.getValue() ? (
          <AnchorLinkCell
            href={`https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=${info.getValue()}`}
            target="_blank"
          >
            {info.getValue()}
          </AnchorLinkCell>
        ) : (
          <EmptyCell />
        ),
      size: 110,
    }),
    columnHelper.accessor(row => row.participant_count, {
      id: 'participant_count',
      header: t('study.table.headers.participant_count'),
      // TODO add link to data explo participants tab
      cell: info => (info.getValue() != null ? thousandNumberFormat(info.getValue()!) : <EmptyCell />),
      footer: sumFooter(t('study.table.headers.participant_count'), 'participant_count'),
      size: 120,
    }),
    columnHelper.accessor(row => row.biospecimen_count, {
      id: 'biospecimen_count',
      header: t('study.table.headers.biospecimen_count'),
      // TODO add link to data explo biospecimen tab
      cell: info => (info.getValue() != null ? thousandNumberFormat(info.getValue()!) : <EmptyCell />),
      footer: sumFooter(t('study.table.headers.biospecimen_count'), 'biospecimen_count'),
      size: 120,
    }),
    columnHelper.accessor(row => row.family_count, {
      id: 'family_count',
      header: t('study.table.headers.family_count'),
      cell: info => (info.getValue() != null ? thousandNumberFormat(info.getValue()!) : <EmptyCell />),
      footer: sumFooter(t('study.table.headers.family_count'), 'family_count'),
      size: 100,
    }),
    columnHelper.accessor(row => row.file_count, {
      id: 'file_count',
      header: t('study.table.headers.file_count'),
      // TODO add link to files
      cell: info => (info.getValue() != null ? thousandNumberFormat(info.getValue()!) : <EmptyCell />),
      footer: sumFooter(t('study.table.headers.file_count'), 'file_count'),
      size: 110,
    }),
    // Last columns will be determine with data category, only boolean for the moment
    columnHelper.accessor(row => row.data_categories.includes('Genomics'), {
      id: 'genomics',
      header: t('study.table.headers.genomics'),
      cell: info => <BooleanCell value={info.getValue()} />,
      size: 110,
      enableSorting: false,
    }),
    columnHelper.accessor(row => row.data_categories.includes('Transcriptomics'), {
      id: 'transcriptomics',
      header: t('study.table.headers.transcriptomics'),
      cell: info => <BooleanCell value={info.getValue()} />,
      size: 130,
      enableSorting: false,
    }),
    columnHelper.accessor(row => row.data_categories.includes('Imaging'), {
      id: 'imaging',
      header: t('study.table.headers.imaging'),
      cell: info => <BooleanCell value={info.getValue()} />,
      size: 100,
      enableSorting: false,
    }),
    columnHelper.accessor(row => row.data_categories.includes('Proteomics'), {
      id: 'proteomics',
      header: t('study.table.headers.proteomics'),
      cell: info => <BooleanCell value={info.getValue()} />,
      size: 110,
      enableSorting: false,
    }),
  ] as TableColumnDef<Study, any>[];
}

export const defaultStudyColumnSettings = createColumnSettings([
  { id: 'study_code', label: 'study.table.headers.study_code', visible: true },
  { id: 'study_name', label: 'study.table.headers.study_name', visible: true },
  { id: 'program', label: 'study.table.headers.program', visible: true },
  { id: 'domain', label: 'study.table.headers.domain', visible: true },
  { id: 'dbgap', label: 'study.table.headers.dbgap', visible: true },
  { id: 'participant_count', label: 'study.table.headers.participant_count', visible: true },
  { id: 'biospecimen_count', label: 'study.table.headers.biospecimen_count', visible: true },
  { id: 'family_count', label: 'study.table.headers.family_count', visible: true },
  { id: 'file_count', label: 'study.table.headers.file_count', visible: true },
  { id: 'genomics', label: 'study.table.headers.genomics', visible: true },
  { id: 'transcriptomics', label: 'study.table.headers.transcriptomics', visible: true },
  { id: 'imaging', label: 'study.table.headers.imaging', visible: true },
  { id: 'proteomics', label: 'study.table.headers.proteomics', visible: true },
]);
