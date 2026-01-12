import { TFunction } from 'i18next';

import { Badge, BadgeProps } from '@/components/base/shadcn/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';

import { MultiSelectorOption } from '../data-entry/multi-selector/multi-selector.types';

interface TransmissionModeBadgeProps extends BadgeProps {
  value: string;
}

type TransmissionModeValue = MultiSelectorOption & {
  color?: string;
  abbreviation: string;
};

export function getTransmissionModeList(t: TFunction): TransmissionModeValue[] {
  return [
    {
      label: t('common.filters.values.transmission_mode.autosomal_dominant_de_novo'),
      value: 'autosomal_dominant_de_novo',
      abbreviation: t('common.filters.values.transmission_mode.autosomal_dominant_de_novo_abbrev'),
      title: '',
    },
    {
      label: t('common.filters.values.transmission_mode.autosomal_dominant'),
      value: 'autosomal_dominant',
      abbreviation: t('common.filters.values.transmission_mode.autosomal_dominant_abbrev'),
      title: '',
    },
    {
      label: t('common.filters.values.transmission_mode.autosomal_recessive'),
      value: 'autosomal_recessive',
      abbreviation: t('common.filters.values.transmission_mode.autosomal_recessive_abbrev'),
      title: '',
    },
    {
      label: t('common.filters.values.transmission_mode.x_linked_dominant_de_novo'),
      value: 'x_linked_dominant_de_novo',
      abbreviation: t('common.filters.values.transmission_mode.x_linked_dominant_de_novo_abbrev'),
      title: '',
    },
    {
      label: t('common.filters.values.transmission_mode.x_linked_recessive_de_novo'),
      value: 'x_linked_recessive_de_novo',
      abbreviation: t('common.filters.values.transmission_mode.x_linked_recessive_de_novo_abbrev'),
      title: '',
    },
    {
      label: t('common.filters.values.transmission_mode.x_linked_dominant'),
      value: 'x_linked_dominant',
      abbreviation: t('common.filters.values.transmission_mode.x_linked_dominant_abbrev'),
      title: '',
    },
    {
      label: t('common.filters.values.transmission_mode.x_linked_recessive'),
      value: 'x_linked_recessive',
      abbreviation: t('common.filters.values.transmission_mode.x_linked_recessive_abbrev'),
      title: '',
    },
    {
      label: t('common.filters.values.transmission_mode.non_carrier_proband'),
      value: 'non_carrier_proband',
      abbreviation: t('common.filters.values.transmission_mode.non_carrier_proband_abbrev'),
      title: '',
    },
    {
      label: t('common.filters.values.transmission_mode.unknown_parents_genotype'),
      value: 'unknown_parents_genotype',
      abbreviation: t('common.filters.values.transmission_mode.unknown_parents_genotype_abbrev'),
      title: '',
    },
    {
      label: t('common.filters.values.transmission_mode.unknown_father_genotype'),
      value: 'unknown_father_genotype',
      abbreviation: t('common.filters.values.transmission_mode.unknown_father_genotype_abbrev'),
      title: '',
    },
    {
      label: t('common.filters.values.transmission_mode.unknown_mother_genotype'),
      value: 'unknown_mother_genotype',
      abbreviation: t('common.filters.values.transmission_mode.unknown_mother_genotype_abbrev'),
      title: '',
    },
    {
      label: t('common.filters.values.transmission_mode.unknown_proband_genotype'),
      value: 'unknown_proband_genotype',
      abbreviation: t('common.filters.values.transmission_mode.unknown_proband_genotype_abbrev'),
      title: '',
    },
  ];
}

function TransmissionModeBadge({ value, ...props }: TransmissionModeBadgeProps) {
  const { t } = useI18n();
  const list = getTransmissionModeList(t);

  const result = list.find(transmissionMode => transmissionMode.value === value);

  return (
    <Tooltip>
      <TooltipTrigger className="flex">
        <Badge variant="neutral" {...props}>
          {result?.abbreviation}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{result?.label}</TooltipContent>
    </Tooltip>
  );
}

export default TransmissionModeBadge;
