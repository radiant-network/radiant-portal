import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';

export default function FrequencySection() {
  const { t } = useI18n();

  return (
    <DetailSection title={t('occurrenceDetailSections.frequencies.title')}>
      <DetailItem title={t('occurrenceDetailSections.frequencies.rqdm')} value="-" />
      <DetailItem title={t('occurrenceDetailSections.frequencies.rqdm')} value="-" />
      <DetailItem title={t('occurrenceDetailSections.frequencies.gnomad')} value="-" />
    </DetailSection>
  );
}
