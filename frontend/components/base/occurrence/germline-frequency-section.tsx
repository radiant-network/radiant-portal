import { Diamond } from 'lucide-react';

import ShapeDiamondIcon from '@/components/base/icons/shape-diamond-icon';
import AnchorLink from '@/components/base/navigation/anchor-link';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';
import { useI18n } from '@/components/hooks/i18n';
import { toExponentialNotation } from '@/components/lib/number-format';

import DetailSection, { DetailItem } from './detail-section';

export type GermlineFrequencySectionProps = {
  germline_pc_wgs_affected?: number;
  germline_pn_wgs_affected?: number;
  germline_pf_wgs_affected?: number;
  germline_pc_wgs_not_affected?: number;
  germline_pn_wgs_not_affected?: number;
  germline_pf_wgs_not_affected?: number;
  gnomad_v3_af?: number;
  locus?: string;
};

export default function GermlineFrequencySection({
  germline_pc_wgs_affected,
  germline_pn_wgs_affected,
  germline_pf_wgs_affected,
  germline_pc_wgs_not_affected,
  germline_pn_wgs_not_affected,
  germline_pf_wgs_not_affected,
  gnomad_v3_af,
  locus,
}: GermlineFrequencySectionProps) {
  const { t } = useI18n();
  const affectedValue =
    germline_pc_wgs_affected && germline_pn_wgs_affected && germline_pf_wgs_affected?.toExponential(2)
      ? `${germline_pc_wgs_affected} / ${germline_pn_wgs_affected} (${germline_pf_wgs_affected?.toExponential(2)})`
      : '-';
  const affectedTitle = (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex gap-1 items-center">
          {t('occurrence_expand.frequencies.affected')}
          <ShapeDiamondIcon className="w-[13px] h-[13px] text-red-500" />
        </span>
      </TooltipTrigger>
      <TooltipContent>{t('occurrence_expand.frequencies.affected_tooltip')}</TooltipContent>
    </Tooltip>
  );

  const nonAffectedValue =
    germline_pc_wgs_not_affected && germline_pn_wgs_not_affected && germline_pf_wgs_not_affected?.toExponential(2)
      ? `${germline_pc_wgs_not_affected} / ${germline_pn_wgs_not_affected} (${germline_pf_wgs_not_affected?.toExponential(2)})`
      : '-';
  const nonAffectedTitle = (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex gap-1 items-center">
          {t('occurrence_expand.frequencies.non_affected')}
          <Diamond className="w-[13px] h-[13px] text-green-500" />
        </span>
      </TooltipTrigger>
      <TooltipContent>{t('occurrence_expand.frequencies.non_affected_tooltip')}</TooltipContent>
    </Tooltip>
  );

  return (
    <DetailSection title={t('occurrence_expand.frequencies.title')}>
      <DetailItem title={affectedTitle} value={affectedValue} />
      <DetailItem title={nonAffectedTitle} value={nonAffectedValue} />
      <DetailItem
        title={t('occurrence_expand.frequencies.gnomad')}
        value={
          gnomad_v3_af ? (
            <AnchorLink
              size="sm"
              href={`https://gnomad.broadinstitute.org/variant/${locus}?dataset=gnomad_r3`}
              target="_blank"
            >
              {toExponentialNotation(gnomad_v3_af)}
            </AnchorLink>
          ) : (
            '-'
          )
        }
      />
    </DetailSection>
  );
}
