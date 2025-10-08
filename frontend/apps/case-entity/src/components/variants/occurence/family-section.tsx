import { ExpandedGermlineSNVOccurrence } from '@/api/api';
import PedigreeFemaleNotAffectedIcon from '@/components/base/icons/pedigree-female-not-affected-icon';
import PedigreeMaleNotAffectedIcon from '@/components/base/icons/pedigree-male-not-affected-icon';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import { useI18n } from '@/components/hooks/i18n';

import DetailSection, { DetailItem } from './detail-section';

type FamilySectionProps = {
  data: ExpandedGermlineSNVOccurrence;
};

export default function FamilySection({ data }: FamilySectionProps) {
  const { t } = useI18n();

  const fatherTitle = (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex gap-1 items-center">
          {t('occurrence_expand.family.father_genotype')} <PedigreeMaleNotAffectedIcon size={13} />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {data.father_calls && data.father_calls[0] > 0
          ? t('occurrence_expand.family.affected_tooltip')
          : t('occurrence_expand.family.not_affected_tooltip')}
      </TooltipContent>
    </Tooltip>
  );

  const motherTitle = (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex gap-1 items-center">
          {t('occurrence_expand.family.mother_genotype')} <PedigreeFemaleNotAffectedIcon size={13} />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {data.mother_calls && data.mother_calls[0] > 0
          ? t('occurrence_expand.family.affected_tooltip')
          : t('occurrence_expand.family.not_affected_tooltip')}
      </TooltipContent>
    </Tooltip>
  );

  return (
    <DetailSection title={t('occurrence_expand.family.title')}>
      <DetailItem
        title={fatherTitle}
        value={data.father_calls ? data.father_calls.map(call => call.toString()).join('/') : '-'}
      />
      <DetailItem
        title={motherTitle}
        value={data.mother_calls ? data.mother_calls.map(call => call.toString()).join('/') : '-'}
      />
    </DetailSection>
  );
}
