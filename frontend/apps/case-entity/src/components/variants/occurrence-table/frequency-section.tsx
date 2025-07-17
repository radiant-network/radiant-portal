import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';
import { ExpandedOccurrence } from '@/api/api';
import { Diamond } from 'lucide-react';
import ShapeDiamondIcon from '@/components/base/icons/shape-diamond-icon';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/ui/tooltip';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { toExponentialNotationAtThreshold } from '@/components/lib/number-format';

type FrequencySectionProps = {
  data: ExpandedOccurrence;
};

export default function FrequencySection({ data }: FrequencySectionProps) {
  const { t } = useI18n();
  const affected = (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className='inline-flex gap-1 items-center'>
          {t('occurrenceExpand.frequencies.affected')}
          <ShapeDiamondIcon className='w-[13px] h-[13px] text-red-500' />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {t('occurrenceExpand.frequencies.affectedTooltip')}
      </TooltipContent>
    </Tooltip>
  );

  const nonAffected = (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className='inline-flex gap-1 items-center'>
          {t('occurrenceExpand.frequencies.nonAffected')}
          <Diamond className='w-[13px] h-[13px] text-green-500' />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {t('occurrenceExpand.frequencies.nonAffectedTooltip')}
      </TooltipContent>
    </Tooltip>
  );

  return (
    <DetailSection title={t('occurrenceExpand.frequencies.title')}>
      <DetailItem title={affected} value={`${data.pc_wgs_affected} / ${data.pn_wgs_affected} (${data.pf_wgs_affected?.toExponential(2)})`} />
      <DetailItem title={nonAffected} value={`${data.pc_wgs_not_affected} / ${data.pn_wgs_not_affected} (${data.pf_wgs_not_affected?.toExponential(2)})`} />
      <DetailItem title={t('occurrenceExpand.frequencies.gnomad')} value={
        data.gnomad_v3_af ?
          <AnchorLink size="sm" href={`https://gnomad.broadinstitute.org/variant/${data.locus}?dataset=gnomad_r3`} target="_blank">
            {toExponentialNotationAtThreshold(data.gnomad_v3_af)}
          </AnchorLink>
          : "-"
      } />
    </DetailSection>
  );
}
