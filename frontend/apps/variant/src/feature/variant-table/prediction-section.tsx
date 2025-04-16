import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';

export default function PredictionSection() {
  const { t } = useI18n();

  return (
    <DetailSection title={t('occurrenceDetailSections.predictions.title')}>
      <DetailItem title={t('occurrenceDetailSections.predictions.franklin')} value="-" />
      <DetailItem title={t('occurrenceDetailSections.predictions.exomiser')} value="-" />
    </DetailSection>
  );
}
