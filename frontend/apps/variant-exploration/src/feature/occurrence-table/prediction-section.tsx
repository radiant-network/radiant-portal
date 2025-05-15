import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';
import { ExpendedOccurrence } from '@/api/api';

type PredictionSectionProps = {
  data: ExpendedOccurrence;
};

export default function PredictionSection({ data }: PredictionSectionProps) {
  const { t } = useI18n();

  return (
    <DetailSection title={t('occurrenceExpend.predictions.title')}>
      <DetailItem title={t('occurrenceExpend.predictions.franklin')} value="-" />
      <DetailItem title={t('occurrenceExpend.predictions.exomiser')} value="-" />
    </DetailSection>
  );
}
