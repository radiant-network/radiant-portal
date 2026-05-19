import AnchorLink from '@/components/base/navigation/anchor-link';
import { VariantEntityTabs } from '@/components/cores/types/variant-tabs';
import { useI18n } from '@/components/hooks/i18n';

import EmptyField from '../information/empty-field';

import DetailSection, { DetailItem } from './detail-section';

export type SomaticFrequencySectionProps = {
  somatic_pc_tn_wgs?: number;
  somatic_pn_tn_wgs?: number;
  somatic_pf_tn_wgs?: number;
  locusId?: string;
};

export default function SomaticFrequencySection({
  somatic_pc_tn_wgs,
  somatic_pn_tn_wgs,
  somatic_pf_tn_wgs,
  locusId,
}: SomaticFrequencySectionProps) {
  const { t } = useI18n();

  return (
    <DetailSection title={t('occurrence_expand.frequencies.title')}>
      <DetailItem
        title={
          <span className="inline-flex gap-1 items-center">
            {t('preview_sheet.variant_details.sections.frequencies.tn')}
          </span>
        }
        value={
          somatic_pc_tn_wgs && somatic_pn_tn_wgs && somatic_pf_tn_wgs?.toExponential(2) ? (
            <AnchorLink
              size="sm"
              href={`/variants/entity/${locusId}?tab=${VariantEntityTabs.Cases}&cases=OtherCases`}
              target="_blank"
            >
              {`${somatic_pc_tn_wgs} / ${somatic_pn_tn_wgs} (${somatic_pf_tn_wgs?.toExponential(2)})`}
            </AnchorLink>
          ) : (
            <EmptyField />
          )
        }
      />
    </DetailSection>
  );
}
