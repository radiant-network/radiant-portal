import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';

export default function ZygositySection() {
  const { t } = useI18n();

  return (
    <DetailSection title={t('occurrenceExpend.zygosity.title')}>
      <DetailItem title={t('occurrenceExpend.zygosity.zygosity')} value="-" />
      <DetailItem title={t('occurrenceExpend.zygosity.compoundHet')} value="-" />
      <DetailItem title={t('occurrenceExpend.zygosity.potentialCompoundHet')} value="-" />
      <DetailItem title={t('occurrenceExpend.zygosity.inheritance')} value="-" />
      <DetailItem title={t('occurrenceExpend.zygosity.parentalOrigin')} value="-" />
    </DetailSection>
  );
}
