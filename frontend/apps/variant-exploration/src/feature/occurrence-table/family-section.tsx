import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';
import { ExpendedOccurrence } from '@/api/api';
import { Circle, Square } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';

type FamilySectionProps = {
  data: ExpendedOccurrence;
};

export default function FamilySection({ data }: FamilySectionProps) {
  const { t } = useI18n();

    const fatherTitle = (
      <Tooltip>
      <TooltipTrigger asChild>
      <span className='inline-flex gap-1 items-center'>{t('occurrenceExpend.family.fatherGenotype')} <Square className='w-[13px] h-[13px]' /></span>
      </TooltipTrigger>
      <TooltipContent>
        {data.father_calls && data.father_calls[0] > 0 ?
         t('occurrenceExpend.family.affectedTooltip') :
         t('occurrenceExpend.family.notAffectedTooltip')
        }
      </TooltipContent>
    </Tooltip>
    );

    const motherTitle = (
      <Tooltip>
      <TooltipTrigger asChild>
      <span className='inline-flex gap-1 items-center'>{t('occurrenceExpend.family.motherGenotype')} <Circle className='w-[13px] h-[13px]' /></span>
      </TooltipTrigger>
      <TooltipContent>
        {data.mother_calls && data.mother_calls[0] > 0 ?
         t('occurrenceExpend.family.affectedTooltip') :
         t('occurrenceExpend.family.notAffectedTooltip')
        }
      </TooltipContent>
    </Tooltip>
    );

  return (
    <DetailSection title={t('occurrenceExpend.family.title')}>
      <DetailItem title={fatherTitle} value={data.father_calls ? data.father_calls.map(call => call.toString()).join('/') : '-'} />
      <DetailItem title={motherTitle} value={data.mother_calls ? data.mother_calls.map(call => call.toString()).join('/') : '-'} />
    </DetailSection>
  );
}
