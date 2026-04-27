import { useI18n } from '@/components/hooks/i18n';
import { replaceUnderscore, titleCase } from '@/components/lib/string-format';

import DetailSection, { DetailItem } from './detail-section';

export type ZygositySectionProps = {
  zygosity?: string;
  transmission?: string;
  parental_origin?: string;
};

export default function ZygositySection({ zygosity, transmission, parental_origin }: ZygositySectionProps) {
  const { t } = useI18n();

  const zygosityValue = zygosity ? zygosity : '-';
  const inheritance = transmission ? titleCase(replaceUnderscore(transmission)) : '-';
  const parentalOrigin = parental_origin ? titleCase(replaceUnderscore(parental_origin)) : '-';

  return (
    <DetailSection title={t('occurrence_expand.zygosity.title')}>
      <DetailItem title={t('occurrence_expand.zygosity.zygosity')} value={zygosityValue} />
      <DetailItem title={t('occurrence_expand.zygosity.inheritance')} value={inheritance} />
      <DetailItem title={t('occurrence_expand.zygosity.parental_origin')} value={parentalOrigin} />
    </DetailSection>
  );
}
