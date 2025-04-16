import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';

export default function PredictionSection() {
  const { t } = useI18n();

  return (
    <DetailSection title={t('occurrenceExpend.predictions.title')}>
      <DetailItem title={t('occurrenceExpend.predictions.franklin')} value="-" />
      <DetailItem title={t('occurrenceExpend.predictions.exomiser')} value="-" />
    </DetailSection>
  );
}
