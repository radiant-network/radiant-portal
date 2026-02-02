import { createColumnHelper } from '@tanstack/react-table';
import { TFunction } from 'i18next';

import { ExternalFrequencies } from '@/api/api';
import CohortCell from '@/components/base/data-table/cells/cohort-cell';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import TextCell from '@/components/base/data-table/cells/text-cell';
import { createColumnSettings, TableColumnDef } from '@/components/base/data-table/data-table';
import TooltipHeader from '@/components/base/data-table/headers/table-tooltip-header';
import { toExponentialNotation } from '@/components/lib/number-format';

const publicCohortsColumnHelper = createColumnHelper<ExternalFrequencies>();

function getPublicCohortsColumns(t: TFunction<string, undefined>, locusId?: string) {
  return [
    // Cohort
    publicCohortsColumnHelper.accessor(row => row.cohort, {
      id: 'cohort',
      cell: info => <CohortCell cohort={info.getValue()} locusId={locusId} />,
      header: t('variant_entity.frequency.public_cohorts.cohort'),
    }),
    // ALT Alleles
    publicCohortsColumnHelper.accessor(row => row.ac, {
      id: 'ac',
      cell: info => <TextCell isNumber>{info.getValue()}</TextCell>,
      header: () => (
        <TooltipHeader tooltip={t('variant_entity.frequency.public_cohorts.ac_tooltip')}>
          {t('variant_entity.frequency.public_cohorts.ac')}
        </TooltipHeader>
      ),
    }),
    // Alleles ALT and REF
    publicCohortsColumnHelper.accessor(row => row.an, {
      id: 'an',
      cell: info => <TextCell isNumber>{info.getValue()}</TextCell>,
      header: () => (
        <TooltipHeader tooltip={t('variant_entity.frequency.public_cohorts.an_tooltip')}>
          {t('variant_entity.frequency.public_cohorts.an')}
        </TooltipHeader>
      ),
    }),
    // Homozgyotes
    publicCohortsColumnHelper.accessor(row => row.hom, {
      id: 'hom',
      cell: info => <TextCell isNumber>{info.getValue()}</TextCell>,
      header: () => (
        <TooltipHeader tooltip={t('variant_entity.frequency.public_cohorts.hom_tooltip')}>
          {t('variant_entity.frequency.public_cohorts.hom')}
        </TooltipHeader>
      ),
    }),
    // Frequency
    publicCohortsColumnHelper.accessor(row => row.af, {
      id: 'af',
      cell: info => (info.getValue() ? toExponentialNotation(info.getValue()) : <EmptyCell />),
      header: () => (
        <TooltipHeader tooltip={t('variant_entity.frequency.public_cohorts.af_tooltip')}>
          {t('variant_entity.frequency.public_cohorts.af')}
        </TooltipHeader>
      ),
    }),
  ] as TableColumnDef<ExternalFrequencies, any>[];
}

const publicCohortsDefaultSettings = createColumnSettings([
  {
    id: 'cohort',
    visible: true,
    label: 'variant_entity.frequency.public_cohorts.cohort',
  },
  {
    id: 'ac',
    visible: true,
    label: 'variant_entity.frequency.public_cohorts.ac',
  },
  {
    id: 'an',
    visible: true,
    label: 'variant_entity.frequency.public_cohorts.an',
  },
  {
    id: 'hom',
    visible: true,
    label: 'variant_entity.frequency.public_cohorts.hom',
  },
  {
    id: 'af',
    visible: true,
    label: 'variant_entity.frequency.public_cohorts.af',
  },
]);

export { getPublicCohortsColumns, publicCohortsDefaultSettings };
