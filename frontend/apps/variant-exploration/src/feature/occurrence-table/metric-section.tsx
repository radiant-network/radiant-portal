import { useI18n } from '@/components/hooks/i18n';
import DetailSection, { DetailItem } from './detail-section';
import { ExpendedOccurrence } from '@/api/api';

type MetricSectionProps = {
  data: ExpendedOccurrence;
};

export default function MetricSection({ data }: MetricSectionProps) {
  const { t } = useI18n();

  return (
    <DetailSection title={t('occurrenceExpend.metrics.title')}>
      <DetailItem title={t('occurrenceExpend.metrics.qualityDepth')} value="-" />
      <DetailItem title={t('occurrenceExpend.metrics.alleleDepthAlt')} value={data?.ad_alt ? data.ad_alt : '-'} />
      <DetailItem title={t('occurrenceExpend.metrics.totalDepthAltRef')} value={data?.ad_total || '-'} />
      <DetailItem title={t('occurrenceExpend.metrics.genotypeQuality')} value={data?.genotype_quality ? data?.genotype_quality : '-'} />
      <DetailItem title={t('occurrenceExpend.metrics.filter')} value={data?.filter ? data?.filter : '-'} />
    </DetailSection>
  );
}
