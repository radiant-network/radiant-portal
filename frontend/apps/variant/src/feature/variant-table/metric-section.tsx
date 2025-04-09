import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';

export default function MetricSection() {
  const { t } = useI18n();

  return (
    <DetailSection title={t('occurrenceDetailSections.metrics.title')}>
      <DetailItem title={t('occurrenceDetailSections.metrics.qualityDepth')} value="-" />
      <DetailItem title={t('occurrenceDetailSections.metrics.alleleDepthAlt')} value="-" />
      <DetailItem title={t('occurrenceDetailSections.metrics.totalDepthAltRef')} value="-" />
      <DetailItem title={t('occurrenceDetailSections.metrics.genotypeQuality')} value="-" />
      <DetailItem title={t('occurrenceDetailSections.metrics.filter')} value="-" />
    </DetailSection>
  );
}
