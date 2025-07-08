import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';
import { ExpendedOccurrence } from '@/api/api';
import { Diamond } from 'lucide-react';
import ShapeDiamondIcon from '@/components/base/icons/shape-diamond-icon';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { toExponentialNotationAtThreshold } from '@/components/lib/number-format';

type FrequencySectionProps = {
  data: ExpendedOccurrence;
};

export default function FrequencySection({ data }: FrequencySectionProps) {
  const { t } = useI18n();
  const affected = (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className='inline-flex gap-1 items-center'>
          {t('occurrenceExpend.frequencies.myOrganization')}
          <ShapeDiamondIcon className='w-[13px] h-[13px] text-red-500' />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {t('occurrenceExpend.frequencies.myOrganizationAffectedTooltip')}
      </TooltipContent>
    </Tooltip>
  );

  const nonAffected = (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className='inline-flex gap-1 items-center'>
          {t('occurrenceExpend.frequencies.myOrganization')}
          <Diamond className='w-[13px] h-[13px] text-green-500' />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {t('occurrenceExpend.frequencies.myOrganizationNonAffectedTooltip')}
      </TooltipContent>
    </Tooltip>
  );

  return (
    <DetailSection title={t('occurrenceExpend.frequencies.title')}>
      <DetailItem title={affected} value="-" />
      <DetailItem title={nonAffected} value="-" />
      <DetailItem title={t('occurrenceExpend.frequencies.gnomad')} value={
        data.gnomad_v3_af ?
          <AnchorLink size="sm" href={`https://gnomad.broadinstitute.org/variant/${data.locus}?dataset=gnomad_r3`} target="_blank">
            {toExponentialNotationAtThreshold(data.gnomad_v3_af)}
          </AnchorLink>
          : "-"
      } />
    </DetailSection>
  );
}
