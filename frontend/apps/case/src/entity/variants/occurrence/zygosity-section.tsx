import { ExpandedGermlineSNVOccurrence } from '@/api/api';
import { useI18n } from '@/components/hooks/i18n';
import { replaceUnderscore, titleCase } from '@/components/lib/string-format';

import DetailSection, { DetailItem } from './detail-section';

type ZygositySectionProps = {
  data: ExpandedGermlineSNVOccurrence;
};

export default function ZygositySection({ data }: ZygositySectionProps) {
  const { t } = useI18n();

  const zygosity = data.zygosity ? data.zygosity : '-';
  const inheritance = data.transmission ? titleCase(replaceUnderscore(data.transmission)) : '-';
  const parentalOrigin = data.parental_origin ? titleCase(replaceUnderscore(data.parental_origin)) : '-';

  return (
    <DetailSection title={t('occurrence_expand.zygosity.title')}>
      <DetailItem title={t('occurrence_expand.zygosity.zygosity')} value={zygosity} />
      <DetailItem title={t('occurrence_expand.zygosity.inheritance')} value={inheritance} />
      <DetailItem title={t('occurrence_expand.zygosity.parental_origin')} value={parentalOrigin} />
    </DetailSection>
  );
}
