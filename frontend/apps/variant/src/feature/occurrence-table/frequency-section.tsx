import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';

export default function FrequencySection() {
  const { t } = useI18n();

  return (
    <DetailSection title={t('occurrenceExpend.frequencies.title')}>
      <DetailItem title={t('occurrenceExpend.frequencies.myOrganization')} value="-" />
      <DetailItem title={t('occurrenceExpend.frequencies.myOrganization')} value="-" />
      <DetailItem title={t('occurrenceExpend.frequencies.gnomad')} value="-" />
    </DetailSection>
  );
}
