import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';

export default function ZygositySection() {
  const { t } = useI18n();

  return (
    <DetailSection title={t('occurrenceDetailSections.zygosity.title')}>
      <DetailItem title={t('occurrenceDetailSections.zygosity.zygosity')} value="-" />
      <DetailItem title={t('occurrenceDetailSections.zygosity.compoundHet')} value="-" />
      <DetailItem title={t('occurrenceDetailSections.zygosity.potentialCompoundHet')} value="-" />
      <DetailItem title={t('occurrenceDetailSections.zygosity.inheritance')} value="-" />
      <DetailItem title={t('occurrenceDetailSections.zygosity.parentalOrigin')} value="-" />
    </DetailSection>
  );
}
