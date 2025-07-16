import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';
import { ExpandedOccurrence } from '@/api/api';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import PedigreeMaleNotAffectedIcon from '@/components/base/icons/pedigree-male-not-affected-icon';
import PedigreeFemaleNotAffectedIcon from '@/components/base/icons/pedigree-female-not-affected-icon';

type FamilySectionProps = {
  data: ExpandedOccurrence;
};

export default function FamilySection({ data }: FamilySectionProps) {
  const { t } = useI18n();

  const fatherTitle = (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex gap-1 items-center">
          {t('occurrenceExpand.family.fatherGenotype')} <PedigreeMaleNotAffectedIcon size={13} />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {data.father_calls && data.father_calls[0] > 0
          ? t('occurrenceExpand.family.affectedTooltip')
          : t('occurrenceExpand.family.notAffectedTooltip')}
      </TooltipContent>
    </Tooltip>
  );

  const motherTitle = (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex gap-1 items-center">
          {t('occurrenceExpand.family.motherGenotype')} <PedigreeFemaleNotAffectedIcon size={13} />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {data.mother_calls && data.mother_calls[0] > 0
          ? t('occurrenceExpand.family.affectedTooltip')
          : t('occurrenceExpand.family.notAffectedTooltip')}
      </TooltipContent>
    </Tooltip>
  );

  return (
    <DetailSection title={t('occurrenceExpand.family.title')}>
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
