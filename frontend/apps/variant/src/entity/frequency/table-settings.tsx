import { createColumnHelper } from '@tanstack/react-table';
import { TFunction } from 'i18next';

import {
  ExternalFrequencies,
  GetGermlineVariantInternalFrequenciesSplitEnum,
  InternalFrequenciesSplitBy,
} from '@/api/api';
import CohortCell from '@/components/base/data-table/cells/cohort-cell';
import EmptyCell from '@/components/base/data-table/cells/empty-cell';
import NumberCell from '@/components/base/data-table/cells/number-cell';
import { TableColumnDef } from '@/components/base/data-table/data-table';
import TooltipHeader from '@/components/base/data-table/headers/table-tooltip-header';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { toExponentialNotation } from '@/components/lib/number-format';

import FrequencyCell from './frequency-cell';

const publicCohortsColumnHelper = createColumnHelper<ExternalFrequencies>();
const myNetworkColumnHelper = createColumnHelper<InternalFrequenciesSplitBy>();

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
      cell: info => <NumberCell value={info.getValue()} fractionDigits={0} />,
      header: () => (
        <TooltipHeader tooltip={t('variant_entity.frequency.public_cohorts.ac_tooltip')}>
          {t('variant_entity.frequency.public_cohorts.ac')}
        </TooltipHeader>
      ),
    }),
    // Alleles ALT and REF
    publicCohortsColumnHelper.accessor(row => row.an, {
      id: 'an',
      cell: info => <NumberCell value={info.getValue()} fractionDigits={0} />,
      header: () => (
        <TooltipHeader tooltip={t('variant_entity.frequency.public_cohorts.an_tooltip')}>
          {t('variant_entity.frequency.public_cohorts.an')}
        </TooltipHeader>
      ),
    }),
    // Homozgyotes
    publicCohortsColumnHelper.accessor(row => row.hom, {
      id: 'hom',
      cell: info => <NumberCell value={info.getValue()} fractionDigits={0} />,
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

function getMyNetworkColumns(t: TFunction<string, undefined>, activeTab: string) {
  return [
    myNetworkColumnHelper.group({
      id: 'split_name',
      columns: [
        // Split
        myNetworkColumnHelper.accessor(row => row.split_value_code, {
          id: 'split_value_code',
          cell: info => {
            if (activeTab === GetGermlineVariantInternalFrequenciesSplitEnum.PrimaryCondition) {
              return info.getValue();
            }
            return (
              <Tooltip>
                <TooltipTrigger>{info.getValue()}</TooltipTrigger>
                <TooltipContent>{info.row.original.split_value_name}</TooltipContent>
              </Tooltip>
            );
          },
          header: t(`variant_entity.frequency.my_network.${activeTab}`),
        }),
      ],
    }),
    myNetworkColumnHelper.group({
      id: 'all_patients',
      header: t('variant_entity.frequency.my_network.all_patients'),
      columns: [
        // Frequency
        myNetworkColumnHelper.accessor(row => row.frequencies.pc_all, {
          id: 'frequencies.pc_all',
          cell: info => (
            <FrequencyCell
              pc={info.getValue()}
              pn={info.row.original.frequencies.pn_all}
              pf={info.row.original.frequencies.pf_all}
            />
          ),
          header: t(`variant_entity.frequency.my_network.frequency`),
        }),
        // Homozgyotes
        myNetworkColumnHelper.accessor(row => row.frequencies.hom_all, {
          id: 'frequencies.hom_all',
          cell: info => (info.getValue() != null ? info.getValue() : <EmptyCell />),
          header: t(`variant_entity.frequency.my_network.homozygotes`),
        }),
      ],
    }),
    myNetworkColumnHelper.group({
      id: 'affected_patients',
      header: t('variant_entity.frequency.my_network.affected_patients'),
      columns: [
        // Frequency
        myNetworkColumnHelper.accessor(row => row.frequencies.pc_affected, {
          id: 'frequencies.pc_affected',
          cell: info => (
            <FrequencyCell
              pc={info.getValue()}
              pn={info.row.original.frequencies.pn_affected}
              pf={info.row.original.frequencies.pf_affected}
            />
          ),
          header: t(`variant_entity.frequency.my_network.frequency`),
        }),
        // Homozgyotes
        myNetworkColumnHelper.accessor(row => row.frequencies.hom_affected, {
          id: 'frequencies.hom_affected',
          cell: info => (info.getValue() != null ? info.getValue() : <EmptyCell />),
          header: t(`variant_entity.frequency.my_network.homozygotes`),
        }),
      ],
    }),
    myNetworkColumnHelper.group({
      id: 'non_affected_patients',
      header: t('variant_entity.frequency.my_network.non_affected_patients'),
      columns: [
        // Frequency
        myNetworkColumnHelper.accessor(row => row.frequencies.pc_non_affected, {
          id: 'frequencies.pc_non_affected',
          cell: info => (
            <FrequencyCell
              pc={info.getValue()}
              pn={info.row.original.frequencies.pn_non_affected}
              pf={info.row.original.frequencies.pf_non_affected}
            />
          ),
          header: t(`variant_entity.frequency.my_network.frequency`),
        }),
        // Homozgyotes
        myNetworkColumnHelper.accessor(row => row.frequencies.hom_non_affected, {
          id: 'frequencies.hom_non_affected',
          cell: info => (info.getValue() != null ? info.getValue() : <EmptyCell />),
          header: t(`variant_entity.frequency.my_network.homozygotes`),
        }),
      ],
    }),
  ] as TableColumnDef<InternalFrequenciesSplitBy, any>[];
}

export { getPublicCohortsColumns, getMyNetworkColumns };
