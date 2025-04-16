import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';

export default function MetricSection() {
  const { t } = useI18n();

  return (
    <DetailSection title={t('occurrenceExpend.metrics.title')}>
      <DetailItem title={t('occurrenceExpend.metrics.qualityDepth')} value="-" />
      <DetailItem title={t('occurrenceExpend.metrics.alleleDepthAlt')} value="-" />
      <DetailItem title={t('occurrenceExpend.metrics.totalDepthAltRef')} value="-" />
      <DetailItem title={t('occurrenceExpend.metrics.genotypeQuality')} value="-" />
      <DetailItem title={t('occurrenceExpend.metrics.filter')} value="-" />
    </DetailSection>
  );
}
