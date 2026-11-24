import type { TFunction } from 'i18next';

import type { CaseEntity, SomaticCNVOccurrence } from '@/api/api';
import GnomadCell from '@/components/base/data-table/cells/gnomad-cell';
import NumberCell from '@/components/base/data-table/cells/number-cell';
import NumberListCell from '@/components/base/data-table/cells/number-list-cell';
import TextCell from '@/components/base/data-table/cells/text-cell';
import { createAppColumnHelper } from '@/components/base/data-table/data-table';
import { createColumnSettings, type TableColumnDef } from '@/components/base/data-table/data-table';
import TooltipHeader from '@/components/base/data-table/headers/table-tooltip-header';
import { thousandNumberFormat, toKiloBases } from '@/components/lib/number-format';
import { occurrencesApi } from '@/utils/api';

import ClingenCell from '../../germline-occurrence/table/cells/clingen-cell';
import CNVNameCell from '../../germline-occurrence/table/cells/cnv-name-cell';
import type { FetchCNVGenesOverlap } from '../../modals/overlapping-gene-dialog';
import OccurrenceFlagCell from '../../table/cells/occurrence-flag-cell';
import OccurrenceNoteCell from '../../table/cells/occurrence-note-cell';
import OverlappingGeneLinkCell from '../../table/cells/overlapping-gene-link-cell';

import SomaticCNVFrequencyCell from './cells/somatic-cnv-frequency-cell';

const columnHelper = createAppColumnHelper<SomaticCNVOccurrence>();

const fetchSomaticCNVGenesOverlap: FetchCNVGenesOverlap = ({ tenant, caseId, seqId, taskId, cnvId }) =>
  occurrencesApi.listSomaticCNVGenesOverlap(tenant, caseId, seqId, taskId, cnvId).then(response => response.data);

type SomaticCNVOccurrenceTableSettingsProps = {
  caseEntity?: CaseEntity;
  t: TFunction<string, undefined>;
};

function getSomaticCNVOccurrenceColumns({ t, caseEntity }: SomaticCNVOccurrenceTableSettingsProps) {
  return [
    columnHelper.accessor(row => row, {
      id: 'row-info',
      cell: info => (
        <div className="flex items-center gap-1">
          <OccurrenceNoteCell
            taskId={info.row.original.task_id}
            occurrenceId={info.row.original.cnv_id}
            seqId={info.row.original.seq_id}
            hasNote={info.row.original.has_note}
          />
          <OccurrenceFlagCell
            caseId={caseEntity?.case_id}
            taskId={info.row.original.task_id}
            seqId={info.row.original.seq_id}
            occurrenceId={info.row.original.cnv_id}
            flag={info.row.original.flag_type}
          />
        </div>
      ),
      header: () => null,
      size: 64,
      enablePinning: false,
      enableResizing: false,
      enableSorting: false,
    }),
    // Genes
    columnHelper.accessor(row => row.symbol, {
      id: 'symbol',
      cell: info => (
        <OverlappingGeneLinkCell occurrence={info.row.original} fetchGenesOverlap={fetchSomaticCNVGenesOverlap}>
          {info.getValue()?.length ? <>{info.getValue()?.join(', ')}</> : undefined}
        </OverlappingGeneLinkCell>
      ),
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.symbol_tooltip')}>{t('variant.headers.symbols')}</TooltipHeader>
      ),
      size: 124,
      minSize: 40,
      enableSorting: false,
    }),
    // Cytoband
    columnHelper.accessor(row => row.cytoband, {
      id: 'cytoband',
      cell: info => (
        <OverlappingGeneLinkCell occurrence={info.row.original} fetchGenesOverlap={fetchSomaticCNVGenesOverlap}>
          {info.getValue()?.length ? <>{info.getValue()?.join(', ')}</> : undefined}
        </OverlappingGeneLinkCell>
      ),
      header: t('variant.headers.cytoband'),
      size: 124,
      minSize: 40,
      enableSorting: false,
    }),
    // # SNVs
    columnHelper.accessor(row => row.nb_snv, {
      id: 'nb_snv',
      cell: info => <NumberCell value={info.getValue()} fractionDigits={0} />,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.nb_snv_tooltip')}>{t('variant.headers.nb_snv')}</TooltipHeader>
      ),
      size: 96,
      minSize: 40,
      enableSorting: true,
    }),
    // Variant
    columnHelper.accessor(row => row, {
      id: 'name',
      cell: info => <CNVNameCell occurrence={info.getValue()} />,
      header: t('variant.headers.name'),
      size: 148,
      minSize: 40,
      enableSorting: false,
    }),
    // ClinGen
    columnHelper.accessor(row => row, {
      id: 'clingen',
      cell: info => <ClingenCell occurrence={info.getValue()} />,
      header: t('variant.headers.clingen'),
      size: 124,
      minSize: 40,
      enableSorting: false,
    }),
    // Chr
    columnHelper.accessor(row => row.chromosome, {
      id: 'chromosome',
      cell: info => <TextCell>{info.getValue()}</TextCell>,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.chromosome_tooltip')}>
          {t('variant.headers.chromosome')}
        </TooltipHeader>
      ),
      size: 96,
      minSize: 40,
      enableSorting: false,
    }),
    // Start
    columnHelper.accessor(row => row.start, {
      id: 'start',
      cell: info => <NumberCell value={info.getValue()} fractionDigits={0} />,
      header: t('variant.headers.start'),
      size: 124,
      minSize: 40,
      enableSorting: true,
    }),
    // End
    columnHelper.accessor(row => row.end, {
      id: 'end',
      cell: info => <NumberCell value={info.getValue()} fractionDigits={0} />,
      header: t('variant.headers.end'),
      size: 124,
      minSize: 40,
      enableSorting: true,
    }),
    // Type
    columnHelper.accessor(row => row.type, {
      id: 'type',
      cell: info => <TextCell>{info.getValue()}</TextCell>,
      header: t('variant.headers.type'),
      size: 124,
      minSize: 40,
      enableSorting: true,
    }),
    // Length
    columnHelper.accessor(row => row.length, {
      id: 'length',
      cell: info => toKiloBases(info.getValue()),
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.length_tooltip')}>{t('variant.headers.length')}</TooltipHeader>
      ),
      size: 124,
      minSize: 40,
      enableSorting: true,
    }),
    // CN
    columnHelper.accessor(row => row.cn, {
      id: 'cn',
      cell: info => <NumberCell value={info.getValue()} fractionDigits={0} />,
      header: () => <TooltipHeader tooltip={t('variant.headers.cn_tooltip')}>{t('variant.headers.cn')}</TooltipHeader>,
      size: 96,
      minSize: 40,
      enableSorting: true,
    }),
    // CNF
    columnHelper.accessor(row => row.cnf, {
      id: 'cnf',
      cell: info => <NumberCell value={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.cnf_tooltip')}>{t('variant.headers.cnf')}</TooltipHeader>
      ),
      size: 96,
      minSize: 40,
      enableSorting: true,
    }),
    // CNQ
    columnHelper.accessor(row => row.cnq, {
      id: 'cnq',
      cell: info => <NumberCell value={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.cnq_tooltip')}>{t('variant.headers.cnq')}</TooltipHeader>
      ),
      size: 96,
      minSize: 40,
      enableSorting: true,
    }),
    // MCN
    columnHelper.accessor(row => row.mcn, {
      id: 'mcn',
      cell: info => <NumberCell value={info.getValue()} fractionDigits={0} />,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.mcn_tooltip')}>{t('variant.headers.mcn')}</TooltipHeader>
      ),
      size: 96,
      minSize: 40,
      enableSorting: true,
    }),
    // MCNF
    columnHelper.accessor(row => row.mcnf, {
      id: 'mcnf',
      cell: info => <NumberCell value={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.mcnf_tooltip')}>{t('variant.headers.mcnf')}</TooltipHeader>
      ),
      size: 96,
      minSize: 40,
      enableSorting: true,
    }),
    // MCNQ
    columnHelper.accessor(row => row.mcnq, {
      id: 'mcnq',
      cell: info => <NumberCell value={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.mcnq_tooltip')}>{t('variant.headers.mcnq')}</TooltipHeader>
      ),
      size: 96,
      minSize: 40,
      enableSorting: true,
    }),
    // MAF
    columnHelper.accessor(row => row.maf, {
      id: 'maf',
      cell: info => <NumberCell value={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.maf_tooltip')}>{t('variant.headers.maf')}</TooltipHeader>
      ),
      size: 96,
      minSize: 40,
      enableSorting: true,
    }),
    // SD
    columnHelper.accessor(row => row.sd, {
      id: 'sd',
      cell: info => <NumberCell value={info.getValue()} />,
      header: () => <TooltipHeader tooltip={t('variant.headers.sd_tooltip')}>{t('variant.headers.sd')}</TooltipHeader>,
      size: 96,
      minSize: 40,
      enableSorting: true,
    }),
    // ASCN
    columnHelper.accessor(row => row.ascn_as, {
      id: 'ascn_as',
      cell: info => <NumberCell value={info.getValue()} fractionDigits={0} />,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.ascn_as_tooltip')}>{t('variant.headers.ascn_as')}</TooltipHeader>
      ),
      size: 96,
      minSize: 40,
      enableSorting: true,
    }),
    // Freq. TO
    columnHelper.accessor(row => row, {
      id: 'somatic_pf_to_wgs',
      cell: info => (
        <SomaticCNVFrequencyCell pc={info.row.original.somatic_pc_to_wgs} pf={info.row.original.somatic_pf_to_wgs} />
      ),
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.cnv_freq_to_tooltip')}>{t('variant.headers.freq_to')}</TooltipHeader>
      ),
      size: 124,
      minSize: 40,
      enableSorting: false,
    }),
    // gnomAD
    columnHelper.accessor(row => row.gnomad_sf, {
      id: 'gnomad_sf',
      cell: info => <GnomadCell value={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.gnomad_sf_tooltip')}>{t('variant.headers.gnomad_sf')}</TooltipHeader>
      ),
      size: 124,
      minSize: 40,
      enableSorting: true,
    }),
    columnHelper.accessor(row => row.gnomad_af, {
      id: 'gnomad_af',
      cell: info => <GnomadCell value={info.getValue()} />,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.gnomad_sv_af_tooltip')}>
          {t('variant.headers.gnomad_sv_af')}
        </TooltipHeader>
      ),
      size: 124,
      minSize: 40,
      enableSorting: true,
    }),
    columnHelper.accessor(row => row.gnomad_ac, {
      id: 'gnomad_ac',
      cell: info => <NumberCell value={info.getValue()} fractionDigits={0} />,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.gnomad_sv_ac_tooltip')}>
          {t('variant.headers.gnomad_sv_ac')}
        </TooltipHeader>
      ),
      size: 124,
      minSize: 40,
      enableSorting: true,
    }),
    columnHelper.accessor(row => row.gnomad_sc, {
      id: 'gnomad_sc',
      cell: info => <NumberCell value={info.getValue()} fractionDigits={0} />,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.gnomad_sv_sc_tooltip')}>
          {t('variant.headers.gnomad_sv_sc')}
        </TooltipHeader>
      ),
      size: 124,
      minSize: 40,
      enableSorting: true,
    }),
    // # Genes
    columnHelper.accessor(row => row.nb_genes, {
      id: 'nb_genes',
      cell: info => (
        <OverlappingGeneLinkCell occurrence={info.row.original} fetchGenesOverlap={fetchSomaticCNVGenesOverlap}>
          {info.getValue() ? <>{thousandNumberFormat(info.getValue())}</> : undefined}
        </OverlappingGeneLinkCell>
      ),
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.nb_genes_tooltip')}>{t('variant.headers.nb_genes')}</TooltipHeader>
      ),
      size: 124,
      minSize: 40,
      enableSorting: true,
    }),
    // GT
    columnHelper.accessor(row => row.calls, {
      id: 'calls',
      cell: info => <NumberListCell values={info.getValue()} fractionDigits={0} />,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.calls_tooltip')}>{t('variant.headers.calls')}</TooltipHeader>
      ),
      size: 124,
      minSize: 40,
      enableSorting: false,
    }),
    // Filter
    columnHelper.accessor(row => row.filter, {
      id: 'filter',
      cell: info => <TextCell>{info.getValue()}</TextCell>,
      header: t('variant.headers.filter'),
      size: 124,
      minSize: 40,
      enableSorting: false,
    }),
    // Qual.
    columnHelper.accessor(row => row.quality, {
      id: 'quality',
      cell: info => <NumberCell value={info.getValue()} fractionDigits={0} />,
      header: () => (
        <TooltipHeader tooltip={t('variant.headers.quality_tooltip')}>{t('variant.headers.quality')}</TooltipHeader>
      ),
      size: 124,
      minSize: 40,
      enableSorting: false,
    }),
    // BC
    columnHelper.accessor(row => row.bc, {
      id: 'bc',
      cell: info => <NumberCell value={info.getValue()} fractionDigits={0} />,
      header: () => <TooltipHeader tooltip={t('variant.headers.bc_tooltip')}>{t('variant.headers.bc')}</TooltipHeader>,
      size: 124,
      minSize: 40,
      enableSorting: true,
    }),
    // PE
    columnHelper.accessor(row => row.pe, {
      id: 'pe',
      cell: info => <NumberListCell values={info.getValue()} fractionDigits={0} />,
      header: () => <TooltipHeader tooltip={t('variant.headers.pe_tooltip')}>{t('variant.headers.pe')}</TooltipHeader>,
      size: 124,
      minSize: 40,
      enableSorting: false,
    }),
  ] as TableColumnDef<SomaticCNVOccurrence, any>[];
}

const defaultSomaticCNVSettings = createColumnSettings([
  {
    id: 'row-info',
    visible: true,
    fixed: true,
    pinningPosition: 'start',
  },
  {
    id: 'symbol',
    visible: true,
    label: 'variant.headers.symbol',
  },
  {
    id: 'cytoband',
    visible: true,
    label: 'variant.headers.cytoband',
  },
  {
    id: 'nb_snv',
    visible: true,
    label: 'variant.headers.nb_snv',
  },
  {
    id: 'name',
    visible: true,
    label: 'variant.headers.name',
  },
  {
    id: 'clingen',
    visible: true,
    label: 'variant.headers.clingen',
  },
  {
    id: 'chromosome',
    visible: true,
    label: 'variant.headers.chromosome',
  },
  {
    id: 'start',
    visible: true,
    label: 'variant.headers.start',
  },
  {
    id: 'end',
    visible: true,
    label: 'variant.headers.end',
  },
  {
    id: 'type',
    visible: true,
    label: 'variant.headers.type',
  },
  {
    id: 'length',
    visible: true,
    label: 'variant.headers.length',
  },
  {
    id: 'cn',
    visible: true,
    label: 'variant.headers.cn',
    additionalFields: ['cn'],
  },
  {
    id: 'cnf',
    visible: true,
    label: 'variant.headers.cnf',
    additionalFields: ['cnf'],
  },
  {
    id: 'cnq',
    visible: false,
    label: 'variant.headers.cnq',
    additionalFields: ['cnq'],
  },
  {
    id: 'mcn',
    visible: false,
    label: 'variant.headers.mcn',
    additionalFields: ['mcn'],
  },
  {
    id: 'mcnf',
    visible: false,
    label: 'variant.headers.mcnf',
    additionalFields: ['mcnf'],
  },
  {
    id: 'mcnq',
    visible: false,
    label: 'variant.headers.mcnq',
    additionalFields: ['mcnq'],
  },
  {
    id: 'maf',
    visible: true,
    label: 'variant.headers.maf',
    additionalFields: ['maf'],
  },
  {
    id: 'sd',
    visible: false,
    label: 'variant.headers.sd',
    additionalFields: ['sd'],
  },
  {
    id: 'ascn_as',
    visible: false,
    label: 'variant.headers.ascn_as',
    additionalFields: ['ascn_as'],
  },
  {
    id: 'somatic_pf_to_wgs',
    visible: true,
    label: 'variant.headers.freq_to',
    additionalFields: ['somatic_pc_to_wgs', 'somatic_pf_to_wgs'],
  },
  {
    id: 'gnomad_sf',
    visible: true,
    label: 'variant.headers.gnomad_sf',
  },
  {
    id: 'gnomad_af',
    visible: false,
    label: 'variant.headers.gnomad_sv_af',
    additionalFields: ['gnomad_af'],
  },
  {
    id: 'gnomad_ac',
    visible: false,
    label: 'variant.headers.gnomad_sv_ac',
    additionalFields: ['gnomad_ac'],
  },
  {
    id: 'gnomad_sc',
    visible: false,
    label: 'variant.headers.gnomad_sv_sc',
    additionalFields: ['gnomad_sc'],
  },
  {
    id: 'nb_genes',
    visible: true,
    label: 'variant.headers.nb_genes',
  },
  {
    id: 'calls',
    visible: false,
    label: 'variant.headers.calls',
    additionalFields: ['calls'],
  },
  {
    id: 'filter',
    visible: false,
    label: 'variant.headers.filter',
    additionalFields: ['filter'],
  },
  {
    id: 'quality',
    visible: false,
    label: 'variant.headers.quality',
    additionalFields: ['quality'],
  },
  {
    id: 'bc',
    visible: false,
    label: 'variant.headers.bc',
    additionalFields: ['bc'],
  },
  {
    id: 'pe',
    visible: false,
    label: 'variant.headers.pe',
    additionalFields: ['pe'],
  },
]);

export { getSomaticCNVOccurrenceColumns, defaultSomaticCNVSettings };
