import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';
import { ExpandedOccurrence } from '@/api/api';

type PredictionSectionProps = {
  data: ExpandedOccurrence;
};

export default function PredictionSection({ data }: PredictionSectionProps) {
  const { t } = useI18n();

  return (
    <DetailSection title={t('occurrenceExpand.predictions.title')}>
      <DetailItem title={t('occurrenceExpand.predictions.exomiser')} value="-" />
    </DetailSection>
  );
}
