import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';

export default function ClassificationSection() {
  const { t } = useI18n();

  return (
    <DetailSection title={t('occurrenceDetailSections.classifications.title')}>
      <DetailItem title={t('occurrenceDetailSections.classifications.clinvar')} value="-" />
    </DetailSection>
  );
}
